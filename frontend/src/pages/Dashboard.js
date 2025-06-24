import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../api/axios';
import { BookOpen, Trophy, Clock, TrendingUp, Calendar, Target } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [learningPlan, setLearningPlan] = useState(null);
  const [recentProgress, setRecentProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [planResponse, progressResponse] = await Promise.all([
          axios.get('/api/learning-plans/current'),
          axios.get('/api/progress/recent')
        ]);
        
        setLearningPlan(planResponse.data);
        setRecentProgress(progressResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Mock data for demonstration
  const stats = [
    {
      name: 'Lessons Completed',
      value: user?.learningProgress?.completedLessons?.length || 0,
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      name: 'Current Streak',
      value: user?.learningProgress?.currentStreak || 0,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      name: 'Total Points',
      value: user?.learningProgress?.totalPoints || 0,
      icon: Trophy,
      color: 'bg-yellow-500',
    },
    {
      name: 'Hours Learned',
      value: '12.5',
      icon: Clock,
      color: 'bg-purple-500',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'lesson_completed',
      title: 'React Hooks Basics',
      description: 'Completed lesson with 95% score',
      time: '2 hours ago',
      score: 95,
    },
    {
      id: 2,
      type: 'lesson_started',
      title: 'JavaScript Promises',
      description: 'Started new lesson',
      time: '1 day ago',
    },
    {
      id: 3,
      type: 'achievement',
      title: 'First Week Streak',
      description: 'Completed 7 days in a row',
      time: '3 days ago',
    },
  ];

  const upcomingLessons = [
    {
      id: 1,
      title: 'Node.js Fundamentals',
      duration: '15 min',
      difficulty: 'Beginner',
      category: 'Backend',
    },
    {
      id: 2,
      title: 'TypeScript Basics',
      duration: '20 min',
      difficulty: 'Intermediate',
      category: 'Frontend',
    },
    {
      id: 3,
      title: 'Database Design',
      duration: '25 min',
      difficulty: 'Intermediate',
      category: 'Database',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Let's continue your learning journey
          </p>
        </div>

        {/* Learning Plan Overview */}
        {learningPlan && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Your Learning Plan
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {learningPlan.totalLessons}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Total Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {learningPlan.completedLessons}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round((learningPlan.completedLessons / learningPlan.totalLessons) * 100)}%
                </div>
                <div className="text-gray-600 dark:text-gray-300">Progress</div>
              </div>
            </div>
            <div className="mt-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(learningPlan.completedLessons / learningPlan.totalLessons) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/courses"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="text-blue-600 dark:text-blue-400 text-2xl mb-2">📚</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Browse Courses</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Explore new learning opportunities</p>
          </Link>
          
          <Link
            to="/profile"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="text-green-600 dark:text-green-400 text-2xl mb-2">👤</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Update Profile</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Manage your account settings</p>
          </Link>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-purple-600 dark:text-purple-400 text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">View Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Track your learning progress</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-orange-600 dark:text-orange-400 text-2xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Set Goals</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Define your career objectives</p>
          </div>
        </div>

        {/* Recent Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          {recentProgress.length > 0 ? (
            <div className="space-y-4">
              {recentProgress.map((progress) => (
                <div key={progress._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {progress.lesson.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Completed on {new Date(progress.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-green-600 dark:text-green-400 font-semibold">
                    ✓ Completed
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📖</div>
              <p className="text-gray-600 dark:text-gray-300">
                No recent activity. Start your first lesson!
              </p>
              <Link
                to="/courses"
                className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Browse Courses
              </Link>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {activity.type === 'lesson_completed' && (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-green-600" />
                        </div>
                      )}
                      {activity.type === 'lesson_started' && (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                      {activity.type === 'achievement' && (
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Trophy className="h-4 w-4 text-yellow-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                    {activity.score && (
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {activity.score}%
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Lessons */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recommended Lessons</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingLessons.map((lesson) => (
                  <div key={lesson.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{lesson.title}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500">{lesson.duration}</span>
                          <span className="text-xs text-gray-500">{lesson.category}</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            lesson.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                            lesson.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {lesson.difficulty}
                          </span>
                        </div>
                      </div>
                      <button className="ml-4 text-primary-600 hover:text-primary-700">
                        <BookOpen className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button className="w-full btn btn-primary">
                  View All Lessons
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Goals */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Learning Goals</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Edit Goals
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Weekly Goal</h4>
              <p className="text-2xl font-bold text-primary-600">5 lessons</p>
              <p className="text-sm text-gray-500 mt-1">3 of 5 completed</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Streak Goal</h4>
              <p className="text-2xl font-bold text-green-600">7 days</p>
              <p className="text-sm text-gray-500 mt-1">Current: 3 days</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Monthly Goal</h4>
              <p className="text-2xl font-bold text-purple-600">20 lessons</p>
              <p className="text-sm text-gray-500 mt-1">12 of 20 completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 