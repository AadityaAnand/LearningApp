import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../api/axios';
import { BookOpen, Trophy, Clock, TrendingUp, Calendar, Target, Brain, CheckCircle, Play, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [learningPlan, setLearningPlan] = useState(null);
  const [recentProgress, setRecentProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [planResponse, progressResponse] = await Promise.all([
          axios.get('/learning-plans/current'),
          axios.get('/progress/recent')
        ]);
        
        setLearningPlan(planResponse.data.learningPlan);
        setRecentProgress(progressResponse.data.progress);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (error.response?.status === 404) {
          toast.error('No learning plan found. Please complete your registration.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleRegeneratePlan = async () => {
    setRegenerating(true);
    try {
      const response = await axios.post('/learning-plans/regenerate', {
        careerGoal: user.careerGoal
      });
      setLearningPlan(response.data.learningPlan);
      toast.success('Learning plan regenerated successfully!');
    } catch (error) {
      console.error('Error regenerating plan:', error);
      toast.error('Failed to regenerate learning plan');
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your personalized learning journey...</p>
        </div>
      </div>
    );
  }

  // Mock data for demonstration
  const stats = [
    {
      name: 'Lessons Completed',
      value: learningPlan?.completedLessons || 0,
      icon: BookOpen,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      name: 'Current Streak',
      value: 3,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      name: 'Total Points',
      value: 1250,
      icon: Trophy,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      name: 'Hours Learned',
      value: '12.5',
      icon: Clock,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
  ];

  const upcomingLessons = [
    {
      id: 1,
      title: 'React Hooks Deep Dive',
      duration: '15 min',
      difficulty: 'Intermediate',
      category: 'Frontend',
      description: 'Master useState, useEffect, and custom hooks'
    },
    {
      id: 2,
      title: 'Node.js API Design',
      duration: '20 min',
      difficulty: 'Intermediate',
      category: 'Backend',
      description: 'Build RESTful APIs with Express.js'
    },
    {
      id: 3,
      title: 'Database Optimization',
      duration: '25 min',
      difficulty: 'Advanced',
      category: 'Database',
      description: 'Learn indexing and query optimization'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Resume Upload Prompt */}
        {user && !user.resumeUrl && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-yellow-800 dark:text-yellow-200 font-semibold">Boost your learning plan!</span>
              <span className="ml-2 text-yellow-700 dark:text-yellow-100">Upload your resume to get a more personalized AI-powered roadmap.</span>
            </div>
            <Link
              to="/profile"
              className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Upload Resume
            </Link>
          </div>
        )}
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Ready to continue your journey to becoming a {user?.careerGoal}?
              </p>
            </div>
            <button
              onClick={handleRegeneratePlan}
              disabled={regenerating}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {regenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Brain className="h-4 w-4" />
              )}
              <span>{regenerating ? 'Regenerating...' : 'Regenerate Plan'}</span>
            </button>
          </div>
        </div>

        {/* AI Learning Plan Overview */}
        {learningPlan && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl shadow-lg p-6 mb-8 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Your AI-Generated Learning Plan
                </h2>
              </div>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                {learningPlan.status}
              </span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {learningPlan.structure.title}
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {learningPlan.totalLessons}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Total Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {learningPlan.completedLessons}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {learningPlan.progressPercentage}%
                </div>
                <div className="text-gray-600 dark:text-gray-300">Progress</div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                <span>Progress</span>
                <span>{learningPlan.progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${learningPlan.progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Learning Modules */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Learning Modules</h3>
              <div className="space-y-3">
                {learningPlan.structure.modules?.map((module, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{module.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {module.lessons?.length || 0} lessons
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                          Module {index + 1}
                        </span>
                        <button className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                          <Play className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/courses"
            className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
          >
            <div className="text-blue-600 dark:text-blue-400 text-2xl mb-3 group-hover:scale-110 transition-transform">📚</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Browse Courses</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Explore new learning opportunities</p>
          </Link>
          
          <Link
            to="/profile"
            className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
          >
            <div className="text-green-600 dark:text-green-400 text-2xl mb-3 group-hover:scale-110 transition-transform">👤</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Update Profile</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Manage your account settings</p>
          </Link>
          
          <div className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-purple-600 dark:text-purple-400 text-2xl mb-3 group-hover:scale-110 transition-transform">📊</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">View Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Track your learning progress</p>
          </div>
          
          <div className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-orange-600 dark:text-orange-400 text-2xl mb-3 group-hover:scale-110 transition-transform">🎯</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Set Goals</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Define your career objectives</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className={`${stat.bgColor} rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700`}>
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
            </div>
            <div className="p-6">
              {recentProgress.length > 0 ? (
                <div className="space-y-4">
                  {recentProgress.map((progress) => (
                    <div key={progress._id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{progress.lesson.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Completed {new Date(progress.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                          {progress.score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📖</div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    No recent activity. Start your first lesson!
                  </p>
                  <Link
                    to="/courses"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Lessons */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recommended for You</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingLessons.map((lesson) => (
                  <div key={lesson.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          {lesson.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{lesson.duration}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{lesson.category}</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            lesson.difficulty === 'Beginner' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                            lesson.difficulty === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                            'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                          }`}>
                            {lesson.difficulty}
                          </span>
                        </div>
                      </div>
                      <button className="ml-4 p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 group-hover:scale-110 transition-transform">
                        <Play className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  to="/courses"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-center block"
                >
                  View All Lessons
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Goals */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Learning Goals</h3>
            <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
              Edit Goals
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Weekly Goal</h4>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">5 lessons</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">3 of 5 completed</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Streak Goal</h4>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">7 days</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Current: 3 days</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Monthly Goal</h4>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">20 lessons</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">12 of 20 completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 