import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../api/axios';
import { ChevronLeft, BookOpen, Clock } from 'lucide-react';

const ModuleDetail = () => {
  const { moduleIndex } = useParams();
  const { user } = useAuth();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const res = await axios.get('/learning-plans/current');
        const modules = res.data.learningPlan.structure.modules;
        const idx = parseInt(moduleIndex, 10);
        if (!modules || isNaN(idx) || idx < 0 || idx >= modules.length) {
          setError('Module not found');
        } else {
          setModule(modules[idx]);
        }
      } catch (err) {
        setError('Failed to load module');
      } finally {
        setLoading(false);
      }
    };
    fetchModule();
  }, [moduleIndex]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading module...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }
  if (!module) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center">
            <ChevronLeft className="h-5 w-5 mr-1" /> Back
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{module.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{module.description}</p>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lessons</h2>
          <div className="space-y-4">
            {module.lessons && module.lessons.length > 0 ? (
              module.lessons.map((lesson, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{lesson.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{lesson.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {lesson.duration} min</span>
                      <span className="capitalize">{lesson.difficulty}</span>
                    </div>
                  </div>
                  {/* Optionally, add navigation to lesson viewer here */}
                  {/* <Link to={`/courses/${courseId}/lessons/${lessonId}`} className="ml-4 p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"> */}
                  {/*   <BookOpen className="h-5 w-5" /> */}
                  {/* </Link> */}
                </div>
              ))
            ) : (
              <div className="text-gray-500 dark:text-gray-400">No lessons found in this module.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail; 