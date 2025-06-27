import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import { Clock, BookOpen, CheckCircle, Circle, Play, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const CourseDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourseData = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = user ? `/courses/${slug}/progress` : `/courses/${slug}`;
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
      setError('Error fetching course data');
    } finally {
      setLoading(false);
    }
  }, [slug, user]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

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

  const totalLessons = course.lessons.length;
  const isEnrolled = true; // Placeholder

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Course Header */}
        <div className="p-8">
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
                    {course.estimatedDuration} min
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <BookOpen className="h-4 w-4 mr-1" />
                   {totalLessons} lessons
                  </div>
                  {course.featured && (
                    <div className="flex items-center text-sm text-yellow-500">
                      <Star className="h-4 w-4 mr-1" />
                      Featured
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                {isEnrolled ? (
                  <Link to={`/courses/${course.slug}/lessons/${course.lessons[0]?.slug}`} className="btn-primary">Continue Learning</Link>
                ) : (
                  <button className="btn-primary">Enroll Now</button>
                )}
              </div>
            </div>
        </div>

        {/* Course Content */}
        <div className="p-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Content</h2>
          <div className="space-y-4">
            {course.lessons.map((lesson, index) => {
              const status = getLessonStatus(lesson);
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
      </div>
    </div>
  );
};

export default CourseDetail; 