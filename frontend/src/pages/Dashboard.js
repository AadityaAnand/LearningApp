import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [learningPlan, setLearningPlan] = useState(null);

  // Use real user info from context
  const firstName = user?.firstName || 'Learner';
  const careerGoal = user?.careerGoal || 'Your Career Goal';

  useEffect(() => {
    const fetchLearningPlan = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with real auth token logic
        const token = localStorage.getItem('token');
        const res = await axios.get('/learning-plans/current');
        setLearningPlan(res.data.learningPlan);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load learning plan.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchLearningPlan();
  }, []);

  return (
    <div
      className={`min-h-screen py-8 px-4 md:px-12 transition-colors duration-300 ${
        isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Welcome, {firstName}!</h1>
        <p className="mb-6 text-lg">
          Your goal: <span className="font-semibold">{careerGoal}</span>
        </p>
        {loading ? (
          <div className="animate-pulse h-32 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4" />
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
        ) : learningPlan ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-2">{learningPlan.structure.title}</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">{learningPlan.structure.summary}</p>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-medium">
                  {learningPlan.progress || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${learningPlan.progress || 0}%` }}
                ></div>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Estimated Duration:</h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {learningPlan.structure.estimatedDuration || 'N/A'}
              </span>
            </div>
            {learningPlan.structure.prerequisites && (
              <div className="mb-4">
                <h3 className="font-semibold mb-1">Prerequisites:</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                  {learningPlan.structure.prerequisites.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
            {learningPlan.structure.learningOutcomes && (
              <div className="mb-4">
                <h3 className="font-semibold mb-1">Learning Outcomes:</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                  {learningPlan.structure.learningOutcomes.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h3 className="font-semibold mb-2">Modules</h3>
              <div className="space-y-4">
                {learningPlan.structure.modules?.map((mod, idx) => (
                  <div
                    key={idx}
                    className="border-l-4 pl-4 py-2 bg-gray-50 dark:bg-gray-900 rounded shadow-sm"
                  >
                    <h4 className="text-lg font-bold mb-1">{mod.title}</h4>
                    <p className="mb-2 text-gray-700 dark:text-gray-300">{mod.description}</p>
                    <ul className="list-decimal list-inside ml-2">
                      {mod.lessons?.map((lesson, lidx) => (
                        <li key={lidx} className="mb-1">
                          <span className="font-medium">{lesson.title}:</span>{' '}
                          <span className="text-sm text-gray-600 dark:text-gray-400">{lesson.description}</span>
                          <span className="ml-2 text-xs text-blue-500">{lesson.duration} min</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-4">
            No learning plan found. Please complete your registration.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 