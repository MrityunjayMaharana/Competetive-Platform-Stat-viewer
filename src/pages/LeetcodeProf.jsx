import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import Loader from "../components/Loader";

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend );

function LeetcodeProf() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchData = async () => {
      await delay(2000);
      try {
        const [
          profileResponse,
          solvedResponse,
          badgesResponse,
          contestResponse,
          submissionResponse,
          calendarResponse,
        ] = await Promise.all([
          axios.get(`https://alfa-leetcode-api.onrender.com/${username}`),
          axios.get(
            `https://alfa-leetcode-api.onrender.com/${username}/solved`
          ),
          axios.get(
            `https://alfa-leetcode-api.onrender.com/${username}/badges`
          ),
          axios.get(
            `https://alfa-leetcode-api.onrender.com/${username}/contest`
          ),
          axios.get(
            `https://alfa-leetcode-api.onrender.com/${username}/submission`
          ),
          axios.get(
            `https://alfa-leetcode-api.onrender.com/${username}/calendar`
          ),
        ]);

        setData({
          profile: profileResponse.data,
          solved: solvedResponse.data,
          badges: badgesResponse.data,
          contest: contestResponse.data,
          submission: submissionResponse.data,
          calendar: JSON.parse(calendarResponse.data.submissionCalendar),
        });
      } catch (error) {
        setError("Error fetching data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  const recentSubmissions = useMemo(() => {
    if (!data) return [];
    const uniqueSubmissions = {};
    data.submission.submission.forEach((sub) => {
      const { title, timestamp } = sub;
      if (
        !uniqueSubmissions[title] ||
        timestamp > uniqueSubmissions[title].timestamp
      ) {
        uniqueSubmissions[title] = sub;
      }
    });
    return Object.values(uniqueSubmissions)
      .sort((a, b) => b.timestamp - a.timestamp)
      
  }, [data]);

  const calendarData = useMemo(() => {
    if (!data) return { labels: [], dataPoints: [] };
    const currentDate = new Date();
    const thirtyDaysAgo = Math.floor(
      currentDate.setDate(currentDate.getDate() - 30) / 1000
    );
    const filteredData = Object.entries(data.calendar).filter(
      ([timestamp]) => timestamp >= thirtyDaysAgo
    );

    return {
      labels: filteredData.map(([timestamp]) =>
        new Date(timestamp * 1000).toLocaleDateString()
      ),
      dataPoints: filteredData.map(([, count]) => count),
    };
  }, [data]);

  if (loading)
    return (
      <div className="text-center text-gray-200">
        <Loader />
      </div>
    );
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const { profile, solved, badges, contest } = data;

  const ratingChartData = {
    labels: contest.contestParticipation
      .slice(-5)
      .map((contest) => contest.contest.title),
    datasets: [
      {
        label: "Recent 5 Contest Ratings",
        data: contest.contestParticipation
          .slice(-5)
          .map((contest) => Math.ceil(contest.rating)),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.0,
      },
    ],
  };
  

  const submissionChartData = {
    labels: calendarData.labels,
    datasets: [
      {
        label: "Submissions Over Last 30 Days",
        data: calendarData.dataPoints,
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56, 189, 248, 0.2)",
        tension: 0.0,
      },
    ],
  };

  return (
    <div className="w-full mt-2 lg:w-3/5 bg-gray-900 text-white p-6 rounded-lg shadow-lg mx-auto">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between border-b border-gray-700 pb-4 mb-6"
      >
        <div>
          <h2 className="text-2xl mb-4 font-bold">{username}</h2>
          <div className=" flex justify-between items-center gap-2">
            <div className="flex justify-center items-center mb-4">
              <div className="w-28 h-28 rounded-full border-[2px] border-white p-1 flex items-center justify-center">
                <img
                  src={profile.avatar}
                  alt="avatar"
                  className="w-24 h-24 rounded-full shadow-lg"
                />
              </div>
            </div>

            <div>
              <p>{profile.name}</p>
              <p className="mb-2">{profile.ranking}</p>

              {profile.skillTags.map((val, key) => {
                return (
                  <span
                    key={key}
                    className=" bg-slate-800 p-1 rounded-md border-[1px] mr-1 border-gray-500"
                  >
                    {val}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap w-[30%] overflow-y-scroll max-h-20 scrollbar-thin">
          {badges.badges.map((badge) => (
            <motion.div 
              key={badge.id} 
              className="mb-2"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={badge.icon}
                alt={badge.displayName}
                className="w-20 h-20"
              />
            </motion.div>
          ))}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Overall Stats</h3>
          <p>
            <span className="inline-block w-3 h-3 bg-green-400 rounded-full mr-2"></span>
            Easy Problems Solved: {solved.easySolved}
          </p>
          <p>
            <span className="inline-block w-3 h-3 bg-orange-400 rounded-full mr-2"></span>
            Medium Problems Solved: {solved.mediumSolved}
          </p>
          <p>
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            Hard Problems Solved: {solved.hardSolved}
          </p>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row items-start justify-between border-b border-gray-700 pb-6 mb-6">
        <motion.div 
          initial={{ x: -100, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/2 mb-6"
        >
          <h3 className="text-xl font-semibold mb-2">Contest Status</h3>
          <p>Contest Attended: {contest.contestAttend}</p>
          <p>Contest Rating: {Math.ceil(contest.contestRating)}</p>
          <p>Contest Global Ranking: {contest.contestGlobalRanking}</p>
          <p>Top Percentage: {contest.contestTopPercentage}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/2"
        >
          <div className="h-40">
            <Line data={ratingChartData} />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/2 mb-6 lg:mb-0"
        >
          <div className="h-40">
            <Line data={submissionChartData} />
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row justify-between mb-6"
      >
        <div className="w-full overflow-y-auto max-h-40 p-4 bg-gray-800 rounded-lg scrollbar-thin">
          <h3 className="text-xl font-semibold mb-4">
            Recently Solved Problems
          </h3>
          {recentSubmissions.map((item, index) => (
            <div
              key={index}
              className="border-b border-gray-700 pb-2 mb-2 flex justify-between items-center"
            >
              <p className="font-medium">{item.title}</p>
              <div className="flex gap-4 text-sm text-gray-400">
                <p>{new Date(item.timestamp * 1000).toLocaleDateString()}</p>
                <p>{item.lang}</p>
                <p
                  className={
                    item.statusDisplay === "Accepted"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {item.statusDisplay}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default LeetcodeProf;
