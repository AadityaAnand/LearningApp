import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Play, BookOpen, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import CodeEditor from '../components/CodeEditor';

const LessonViewer = () => {
  const { courseSlug, lessonSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [navigation, setNavigation] = useState(null);
  const [courseLessons, setCourseLessons] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [error, setError] = useState(null);
  const [editorLanguage, setEditorLanguage] = useState('javascript');
  const [editorCode, setEditorCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const fetchLessonData = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = user ? `/lessons/${lessonSlug}/progress` : `/lessons/${lessonSlug}`;
      const response = await axios.get(endpoint);
      
      if (user) {
        setLesson(response.data.lesson);
        setCourse(response.data.lesson.course);
        setNavigation(response.data.navigation);
        setCourseLessons(response.data.courseLessons);
        setUserProgress(response.data.userProgress);
      } else {
        setLesson(response.data.lesson);
        setCourse(response.data.lesson.course);
        setNavigation(response.data.navigation);
      }
    } catch (error) {
      toast.error('Failed to fetch lesson data');
      console.error('Error fetching lesson:', error);
      setError('Failed to load lesson');
    } finally {
      setLoading(false);
    }
  }, [courseSlug, lessonSlug, user]);

  const setInitialProgress = useCallback(async (lessonId) => {
    if (!user) return;
    try {
      await axios.post('/progress/update', {
        lessonId,
        status: 'in_progress',
      });
    } catch (err) {
      // It's okay if this fails silently, e.g., if progress already exists.
      console.error("Error setting initial progress:", err);
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      await fetchLessonData();
    };
    loadData();
  }, [fetchLessonData]);

  useEffect(() => {
    if (lesson) {
      setInitialProgress(lesson._id);
    }
  }, [lesson, setInitialProgress]);

  useEffect(() => {
    if (timeSpent > 0 && user) {
      updateProgress(lesson._id, 'in_progress');
    }
  }, [timeSpent]);

  const updateProgress = useCallback(async (lessonId, status) => {
    if (!user) return;
    try {
      await axios.put(`/courses/${courseSlug}/lessons/${lessonSlug}/progress`, {
        timeSpent: 1,
        status: status
      });
      toast.success(`Lesson marked as ${status}!`);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }, [courseSlug, lessonSlug, user]);

  const handleMarkAsComplete = async () => {
    if (lesson) {
    try {
        await axios.post('/progress/update', {
          lessonId: lesson._id,
          status: 'completed',
        });
        toast.success(`Lesson marked as complete!`);
      } catch (err) {
        toast.error('Failed to update progress.');
        console.error("Error updating progress:", err);
      }
    }
  };

  const getLessonStatus = (lesson) => {
    if (!user || !courseLessons) return 'not_started';
    
    const lessonWithProgress = courseLessons.find(l => l._id === lesson._id);
    return lessonWithProgress?.progress?.status || 'not_started';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Play className="h-4 w-4 text-blue-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-300" />;
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Handler for running code (to be wired to backend/Judge0)
  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('');
    try {
      // TODO: Replace with backend call to Judge0 proxy
      const response = await axios.post('/code/execute', {
        language: editorLanguage,
        code: editorCode,
        lessonId: lesson._id,
      });
      setOutput(response.data.output || response.data.stderr || '');
    } catch (err) {
      setOutput('Error running code.');
    } finally {
      setIsRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-lg shadow p-8">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson not found</h1>
          <Link to="/courses" className="text-blue-600 hover:text-blue-800">
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link
                to={`/courses/${courseSlug}`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{lesson.title}</h1>
                <p className="text-sm text-gray-600">{course?.title}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {lesson.duration > 0 && (
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDuration(lesson.duration)}
                </div>
              )}
              
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                <BookOpen className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {/* Lesson Content */}
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  rehypePlugins={[rehypeHighlight]}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code className={className} {...props}>{children}</code>
                      );
                    }
                  }}
                >
                  {lesson.content}
                </ReactMarkdown>
              </div>
              {/* Interactive Code Editor Section */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold mb-2">Try it Yourself</h2>
                <div className="mb-2 flex items-center gap-2">
                  <label htmlFor="editor-language" className="font-medium">Language:</label>
                  <select
                    id="editor-language"
                    value={editorLanguage}
                    onChange={e => setEditorLanguage(e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                    <option value="csharp">C#</option>
                    <option value="php">PHP</option>
                    <option value="ruby">Ruby</option>
                    <option value="go">Go</option>
                    <option value="swift">Swift</option>
                    <option value="kotlin">Kotlin</option>
                    <option value="typescript">TypeScript</option>
                    <option value="rust">Rust</option>
                  </select>
                </div>
                <CodeEditor
                  lessonId={lesson._id}
                  language={editorLanguage}
                  code={editorCode}
                  setCode={setEditorCode}
                />
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium mb-4"
                >
                  {isRunning ? 'Running...' : 'Run Code'}
                </button>
                <div className="bg-black text-green-400 font-mono rounded p-4 min-h-[60px]">
                  <pre className="whitespace-pre-wrap">{output}</pre>
                </div>
              </div>

              {/* Lesson Actions */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {navigation?.prev && (
                      <Link
                        to={`/courses/${courseSlug}/lessons/${navigation.prev.slug}`}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous: {navigation.prev.title}
                      </Link>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    {user && (
                      <button
                        onClick={handleMarkAsComplete}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Complete
                      </button>
                    )}

                    {navigation?.next && (
                      <Link
                        to={`/courses/${courseSlug}/lessons/${navigation.next.slug}`}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Next: {navigation.next.title}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className={`lg:block ${sidebarOpen ? 'block' : 'hidden'} w-80 flex-shrink-0`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Progress</h3>
              
              {navigation && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Lesson {navigation.currentIndex} of {navigation.totalLessons}</span>
                    <span>{Math.round((navigation.currentIndex / navigation.totalLessons) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(navigation.currentIndex / navigation.totalLessons) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {courseLessons.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Lessons</h4>
                  <div className="space-y-2">
                    {courseLessons.map((courseLesson, index) => {
                      const status = getLessonStatus(courseLesson);
                      const isCurrentLesson = courseLesson.slug === lessonSlug;
                      
                      return (
                        <Link
                          key={courseLesson._id}
                          to={`/courses/${courseSlug}/lessons/${courseLesson.slug}`}
                          className={`flex items-center p-2 rounded-md text-sm transition-colors ${
                            isCurrentLesson
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 mr-3 text-xs font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate">{courseLesson.title}</p>
                          </div>
                          {getStatusIcon(status)}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer; 