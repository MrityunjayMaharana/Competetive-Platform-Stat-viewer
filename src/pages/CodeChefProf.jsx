import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion"; // Import framer-motion
import Loader from "../components/Loader";

function CodeChefProf() {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchData = async () => {
      try {
        await delay(2000); // Simulating loading delay
        const response = await axios.get(
          `https://codechef-api.vercel.app/handle/${username}`
        );
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchData();
  }, [username]);

  if (!profileData) {
    return <div className="text-center text-gray-400">
      <Loader />
    </div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold mb-4 text-center text-white"
        >
          CodeChef Profile
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between border-b border-gray-700 pb-4 mb-6"
        >
          <div className="text-center">
            <img
              src={profileData.profile}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h2 className="text-lg mb-6 text-white">
              <span className=" text-blue-400">{profileData.name}'s</span> CodeChef Stats
            </h2>
          </div>
          <div className="text-sm text-gray-300">
            <p>
              <strong>Country:</strong> {profileData.countryName}{" "}
              <img
                src={profileData.countryFlag}
                alt={profileData.countryName}
                className="inline-block w-8 h-8 ml-2"
              />
            </p>
            <p>
              <strong>Global Rank:</strong> {profileData.globalRank}{" "}
              <span className="text-gray-500">...</span>
            </p>
            <p>
              <strong>Country Rank:</strong> {profileData.countryRank}{" "}
              <span className="text-gray-500">...</span>
            </p>
            <p>
              <strong>Stars:</strong> {profileData.stars}{" "}
              <span className="text-gray-500">...</span>
            </p>
            <p>
              <strong>Current Rating:</strong> {profileData.currentRating}{" "}
              <span className="text-gray-500">...</span>
            </p>
            <p>
              <strong>Highest Rating:</strong> {profileData.highestRating}{" "}
              <span className="text-gray-500">...</span>
            </p>
          </div>
        </motion.div>

        {/* Rating History - Scrollable if more than 2 ratings */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <h3 className="text-xl font-semibold text-white-500 mb-2">
            Rating History
          </h3>
          <div className="max-h-24 overflow-y-auto scrollbar-thin">
            {profileData.ratingData.map((rating, index) => (
              <div key={index} className="border-b border-gray-700 pb-2 mb-2">
                <p>
                  <strong className="text-blue-400">
                    {rating.name} ({rating.getmonth}/{rating.getyear}):
                  </strong>{" "}
                  Rating: {rating.rating} | Rank: {rating.rank}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Heat Map - Scrollable if more than 2 entries */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            Heat Map
          </h3>
          <div className="max-h-24 overflow-y-auto scrollbar-thin">
            <ul>
              {profileData.heatMap.map((item, index) => (
                <li key={index} className="border-b border-gray-700 pb-2 mb-2">
                  <p>
                    <strong className="text-blue-400">Date:</strong>{" "}
                    {item.date} |{" "}
                    <strong className="text-gray-300">Value:</strong>{" "}
                    {item.value}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Hover Animation for Stars */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="text-lg font-semibold text-blue-400">Stars:</p>
          <div className="flex justify-center gap-2 mt-2">
            {(() => {
              const stars = [];
              for (let i = 0; i < profileData.stars[0]; i++) {
                stars.push(
                  <span key={i} className="text-yellow-400 text-2xl">
                    &#9733;
                  </span>
                );
              }
              return stars;
            })()}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default CodeChefProf;
