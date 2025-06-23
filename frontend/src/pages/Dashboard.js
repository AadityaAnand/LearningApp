import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Trophy, Clock, TrendingUp, Calendar, Target } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

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
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Ready to continue your learning journey? Let's pick up where you left off.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Today's goal</p>
            <p className="text-2xl font-bold text-primary-600">1 lesson</p>
          </div>
        </div>
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
  );
};

export default Dashboard; 