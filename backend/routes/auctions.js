import express from "express";
import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get all auctions
router.get("/", async (req, res) => {
  try {
    const auctions = await Auction.find({ status: "active" })
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });
    res.status(200).json(auctions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get single auction with bids
router.get("/:id", async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate("createdBy", "username email");
    
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    const bids = await Bid.find({ auction: auction._id })
      .populate("bidder", "username")
      .sort({ amount: -1 });

    res.status(200).json({ auction, bids });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create auction
router.post("/", protect, async (req, res) => {
  const { title, description, startingPrice, endTime } = req.body;
  try {
    if (!title || !description || !startingPrice || !endTime) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const endDate = new Date(endTime);
    if (endDate <= new Date()) {
      return res.status(400).json({ message: "End time must be in the future" });
    }

    if (startingPrice <= 0) {
      return res.status(400).json({ message: "Starting price must be greater than 0" });
    }

    const auction = await Auction.create({
      title,
      description,
      startingPrice,
      currentPrice: startingPrice,
      endTime: endDate,
      createdBy: req.user._id,
    });

    const populatedAuction = await Auction.findById(auction._id)
      .populate("createdBy", "username");

    res.status(201).json(populatedAuction);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Place a bid
router.post("/:id/bid", protect, async (req, res) => {
  const { amount } = req.body;
  try {
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Bid amount must be greater than 0" });
    }

    const auction = await Auction.findById(req.params.id);
    
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    if (auction.status === "ended") {
      return res.status(400).json({ message: "Auction has ended" });
    }

    if (new Date(auction.endTime) <= new Date()) {
      auction.status = "ended";
      await auction.save();
      return res.status(400).json({ message: "Auction has ended" });
    }

    if (auction.createdBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot bid on your own auction" });
    }

    if (amount <= auction.currentPrice) {
      return res.status(400).json({ 
        message: `Bid must be higher than current price ($${auction.currentPrice})` 
      });
    }

    const bid = await Bid.create({
      auction: auction._id,
      bidder: req.user._id,
      amount,
    });

    auction.currentPrice = amount;
    await auction.save();

    const populatedBid = await Bid.findById(bid._id)
      .populate("bidder", "username");

    res.status(201).json(populatedBid);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

