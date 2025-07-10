import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

const mockLearningPlan = [
  {
    id: 1,
    title: "Introduction to Data Science",
    description: "Learn the basics of data science, including key concepts and tools.",
    targetDate: "2024-07-10",
    status: "In Progress",
  },
  {
    id: 2,
    title: "Python for Data Analysis",
    description: "Master Python libraries like pandas and numpy for data analysis.",
    targetDate: "2024-07-17",
    status: "Not Started",
  },
  {
    id: 3,
    title: "Machine Learning Fundamentals",
    description: "Understand core ML algorithms and their applications.",
    targetDate: "2024-07-24",
    status: "Not Started",
  },
];

const statusColors = {
  "In Progress": "bg-blue-500 text-white",
  "Not Started": "bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  Completed: "bg-green-500 text-white",
};

export default function Dashboard() {
  const { user, token } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/learning-plans/current", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlan(res.data.learningPlan);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load learning plan. Showing mock data."
        );
        setPlan(null);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchPlan();
  }, [token]);

  // Fallback to mock data if error
  const planToShow = plan?.structure?.modules
    ? plan.structure.modules.map((mod, idx) => ({
        id: idx + 1,
        title: mod.title,
        description: mod.description,
        targetDate: mod.targetDate || "TBD",
        status: mod.status || "Not Started",
      }))
    : mockLearningPlan;

  const userName = user?.firstName || "Learner";

  return (
    <div className="min-h-screen py-10 px-4 md:px-10 transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white"
      >
        Welcome back, {userName}!
      </motion.h1>
      {loading ? (
        <div className="animate-pulse h-32 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4" />
      ) : error ? (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-4">{error}</div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
          }}
          className="space-y-6"
        >
          {planToShow.map((item) => (
            <motion.div
              key={item.id}
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              className="rounded-xl shadow-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-2">{item.description}</p>
                <span className="text-sm text-gray-500 dark:text-gray-400">Target date: {item.targetDate}</span>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[item.status]}`}>{item.status}</span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
} 