import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const AuctionDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [bidding, setBidding] = useState(false);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await axios.get(`/api/auctions/${id}`);
        setAuction(res.data.auction);
        setBids(res.data.bids);
      } catch (err) {
        setError("Failed to load auction");
      } finally {
        setLoading(false);
      }
    };
    fetchAuction();
    
    // Refresh every 5 seconds to get latest bids
    const interval = setInterval(fetchAuction, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const handleBid = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    setError("");
    setBidding(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `/api/auctions/${id}/bid`,
        { amount: parseFloat(bidAmount) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Update auction and bids
      setAuction({ ...auction, currentPrice: res.data.amount });
      setBids([res.data, ...bids]);
      setBidAmount("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place bid");
    } finally {
      setBidding(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const isEnded = (endTime) => {
    return new Date(endTime) <= new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading auction...</div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Auction not found</p>
          <Link
            to="/auctions"
            className="text-blue-500 hover:underline"
          >
            Back to Auctions
          </Link>
        </div>
      </div>
    );
  }

  const ended = isEnded(auction.endTime);
  const isOwner = user && auction.createdBy._id === user._id;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <Link
          to="/auctions"
          className="text-blue-500 hover:underline mb-4 inline-block"
        >
          ← Back to Auctions
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{auction.title}</h1>
            {ended && (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                Ended
              </span>
            )}
            {!ended && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                Active
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-6">{auction.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-500 text-sm">Starting Price</p>
              <p className="text-xl font-semibold text-gray-700">
                ${auction.startingPrice}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Current Price</p>
              <p className="text-3xl font-bold text-blue-600">
                ${auction.currentPrice}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-gray-500 text-sm mb-1">Created by</p>
            <p className="text-gray-700 font-medium">
              {auction.createdBy?.username || "Unknown"}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {ended ? (
                <span className="text-red-600">Ended: {formatDate(auction.endTime)}</span>
              ) : (
                <span>Ends: {formatDate(auction.endTime)}</span>
              )}
            </p>
          </div>
        </div>

        {!ended && !isOwner && user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Place a Bid</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleBid}>
              <div className="mb-4">
                <label className="block text-gray-600 text-sm font-medium mb-1">
                  Bid Amount ($)
                </label>
                <input
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 outline-none focus:border-blue-400"
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Minimum: $${auction.currentPrice + 0.01}`}
                  min={auction.currentPrice + 0.01}
                  step="0.01"
                  required
                />
                <p className="text-gray-500 text-xs mt-1">
                  Must be higher than current price: ${auction.currentPrice}
                </p>
              </div>
              <button
                type="submit"
                disabled={bidding}
                className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 font-medium cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {bidding ? "Placing Bid..." : "Place Bid"}
              </button>
            </form>
          </div>
        )}

        {!ended && !user && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            <p>
              Please{" "}
              <Link to="/login" className="underline font-semibold">
                login
              </Link>{" "}
              to place a bid
            </p>
          </div>
        )}

        {isOwner && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
            <p>You cannot bid on your own auction</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Bidding History ({bids.length})
          </h2>
          {bids.length === 0 ? (
            <p className="text-gray-500">No bids yet</p>
          ) : (
            <div className="space-y-3">
              {bids.map((bid, index) => (
                <div
                  key={bid._id}
                  className={`flex justify-between items-center p-3 rounded ${
                    index === 0 ? "bg-green-50 border border-green-200" : "bg-gray-50"
                  }`}
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {bid.bidder?.username || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(bid.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${index === 0 ? "text-green-600" : "text-gray-700"}`}>
                      ${bid.amount}
                    </p>
                    {index === 0 && (
                      <p className="text-xs text-green-600 font-semibold">Highest Bid</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;

