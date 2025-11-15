import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Auctions = ({ user }) => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await axios.get("/api/auctions");
        setAuctions(res.data);
      } catch (err) {
        setError("Failed to load auctions");
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const isEnded = (endTime) => {
    return new Date(endTime) <= new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading auctions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Active Auctions</h1>
          {user && (
            <Link
              to="/auctions/create"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 font-medium"
            >
              Create Auction
            </Link>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {auctions.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600 text-lg">No active auctions available</p>
            {user && (
              <Link
                to="/auctions/create"
                className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 font-medium"
              >
                Create First Auction
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <Link
                key={auction._id}
                to={`/auctions/${auction._id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {auction.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {auction.description}
                </p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 text-sm">Current Price</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${auction.currentPrice}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 text-sm">Created by</span>
                  <span className="text-gray-700 font-medium">
                    {auction.createdBy?.username || "Unknown"}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    {isEnded(auction.endTime) ? (
                      <span className="text-red-600 font-semibold">Ended</span>
                    ) : (
                      <span>
                        Ends: {formatDate(auction.endTime)}
                      </span>
                    )}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Auctions;

