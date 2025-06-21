import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, BookOpen, CheckCircle, Circle, Play, Star } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const CourseDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [slug]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const endpoint = user ? `/api/courses/${slug}/progress` : `/api/courses/${slug}`;
      const response = await axios.get(endpoint);
      
      if (user) {
        setCourse(response.data.course);
        setLessons(response.data.lessons);
        setProgress(response.data.progress);
      } else {
        setCourse(response.data);
        setLessons(response.data.lessons || []);
      }
    } catch (error) {
      toast.error('Failed to fetch course data');
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getLessonStatus = (lesson) => {
    if (!user || !progress) return 'not_started';
    
    const lessonProgress = progress.find(p => p.lesson._id === lesson._id);
    return lessonProgress ? lessonProgress.status : 'not_started';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Play className="h-5 w-5 text-blue-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Not Started';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
          <Link to="/courses" className="text-blue-600 hover:text-blue-800">
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDuration(course.estimatedDuration)}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {lessons.length} lessons
                </div>
                {course.featured && (
                  <div className="flex items-center text-sm text-yellow-600">
                    <Star className="h-4 w-4 mr-1" />
                    Featured
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {user && progress && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Course Progress</span>
                    <span>{progress.percentage}% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Course Content</h2>
            {user && progress && (
              <p className="text-sm text-gray-600 mt-1">
                {progress.completedCount} of {progress.totalLessons} lessons completed
              </p>
            )}
          </div>

          <div className="divide-y divide-gray-200">
            {lessons.map((lesson, index) => {
              const status = getLessonStatus(lesson);
              const isFirstLesson = index === 0;
              const isCompleted = status === 'completed';
              const isInProgress = status === 'in_progress';
              
              return (
                <div
                  key={lesson._id}
                  className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${
                    isInProgress ? 'bg-blue-50' : ''
                  }`}
                >
                  <Link
                    to={`/courses/${course.slug}/lessons/${lesson.slug}`}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center flex-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 mr-4">
                        <span className="text-sm font-medium text-gray-600">
                          {index + 1}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {lesson.title}
                          </h3>
                          {getStatusIcon(status)}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{getStatusText(status)}</span>
                          {lesson.duration > 0 && (
                            <span>{formatDuration(lesson.duration)}</span>
                          )}
                          <span className="capitalize">{lesson.lessonType}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      {isCompleted && (
                        <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                      )}
                      {isInProgress && (
                        <Play className="h-5 w-5 text-blue-500 ml-2" />
                      )}
                      {!isCompleted && !isInProgress && (
                        <Circle className="h-5 w-5 text-gray-300 ml-2" />
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Start Learning Button */}
        {lessons.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              to={`/courses/${course.slug}/lessons/${lessons[0].slug}`}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Play className="h-5 w-5 mr-2" />
              {user ? 'Continue Learning' : 'Start Learning'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail; 