import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Code, 
  BookOpen, 
  Users, 
  Trophy, 
  Play, 
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Target,
  Brain,
  Globe,
  Clock,
  Award,
  Shield,
  Sparkles
} from 'lucide-react';

const Landing = () => {
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
  };

  const features = [
    {
      icon: <Code className="h-8 w-8" />,
      title: "Bite-Sized Learning",
      description: "Learn programming concepts in 5-15 minute micro-lessons designed for busy developers."
    },
    {
      icon: <Play className="h-8 w-8" />,
      title: "Interactive Practice",
      description: "Code directly in your browser with real-time feedback and instant results."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Peer Reviews",
      description: "Get feedback from fellow developers and learn from code reviews."
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Gamified Progress",
      description: "Earn badges, track streaks, and compete with friends on your learning journey."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Personalized Paths",
      description: "AI-powered recommendations based on your skill level and goals."
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Spaced Repetition",
      description: "Smart review system that helps you retain knowledge long-term."
    }
  ];

  const popularTopics = [
    "JavaScript Fundamentals",
    "React Hooks",
    "Node.js Backend",
    "Python Data Science",
    "System Design",
    "Algorithms & DSA",
    "DevOps Practices",
    "Database Design"
  ];

  const stats = [
    { number: "10K+", label: "Active Learners" },
    { number: "500+", label: "Micro Lessons" },
    { number: "50+", label: "Programming Languages" },
    { number: "95%", label: "Completion Rate" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Frontend Developer",
      company: "TechCorp",
      content: "CodeCraft helped me master React Hooks in just 2 weeks. The micro-lessons fit perfectly into my busy schedule!",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Full Stack Developer",
      company: "StartupXYZ",
      content: "The interactive coding practice is game-changing. I learned more in a month here than in 6 months of traditional courses.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Junior Developer",
      company: "Digital Solutions",
      content: "Perfect for beginners! The peer review system helped me understand best practices from experienced developers.",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "5 lessons per month",
        "Basic coding practice",
        "Community access",
        "Progress tracking"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      features: [
        "Unlimited lessons",
        "Advanced coding challenges",
        "Peer review system",
        "Personalized learning paths",
        "Priority support",
        "Certificate of completion"
      ],
      cta: "Start Pro Trial",
      popular: true
    },
    {
      name: "Team",
      price: "$49",
      period: "per month",
      features: [
        "Everything in Pro",
        "Team analytics",
        "Custom learning paths",
        "Admin dashboard",
        "API access",
        "Dedicated support"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta Tags - These would be in the HTML head in a real app */}
      <title>CodeCraft - Master Programming with Micro-Learning | Learn to Code Faster</title>
      <meta name="description" content="Learn programming with bite-sized lessons, interactive coding practice, and peer reviews. Perfect for busy developers who want to level up their skills efficiently." />
      <meta name="keywords" content="programming, coding, micro-learning, JavaScript, React, Python, web development, software engineering" />
      
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <Code className="h-8 w-8 text-primary-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">CodeCraft</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">Features</a>
              <a href="#pricing" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">Pricing</a>
              <a href="#testimonials" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">Reviews</a>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-50 to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Join 10,000+ developers learning smarter
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Master Programming
              <span className="text-primary-600"> One Bite at a Time</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Stop wasting time on long courses. Learn programming through micro-lessons, interactive coding practice, 
              and peer reviews. Perfect for busy professionals who want to level up their skills efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  Start Learning Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              )}
              <button className="inline-flex items-center px-8 py-4 border border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-blue-500 mr-2" />
                5-minute lessons
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-purple-500 mr-2" />
                Industry experts
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 opacity-10">
          <Code className="h-16 w-16 text-primary-600" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-10">
          <BookOpen className="h-16 w-16 text-primary-600" />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Developers Choose CodeCraft?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform is designed specifically for developers who want to learn efficiently 
              without sacrificing their busy schedules.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-primary-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Topics */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Learning Paths
            </h2>
            <p className="text-xl text-gray-600">
              Start with trending topics or explore our comprehensive curriculum
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularTopics.map((topic, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg hover:bg-primary-50 hover:border-primary-200 border border-transparent transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{topic}</span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div id="testimonials" className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Developers Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our community has to say about their learning experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role} at {testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Learning Plan
            </h2>
            <p className="text-xl text-gray-600">
              Start free and upgrade as you grow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative bg-white p-8 rounded-xl shadow-sm border-2 ${plan.popular ? 'border-primary-500' : 'border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/register"
                    className={`w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md ${
                      plan.popular 
                        ? 'text-white bg-primary-600 hover:bg-primary-700' 
                        : 'text-primary-600 bg-primary-50 hover:bg-primary-100'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Coding Skills?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already learning smarter, not harder. 
            Start your free account today and access our entire library of micro-lessons.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-primary-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 border border-white text-lg font-medium rounded-lg text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Code className="h-8 w-8 text-primary-400" />
                <span className="ml-2 text-xl font-bold">CodeCraft</span>
              </div>
              <p className="text-gray-400">
                Empowering developers to learn efficiently through micro-learning and interactive practice.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Learning</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Courses</a></li>
                <li><a href="#" className="hover:text-white">Practice</a></li>
                <li><a href="#" className="hover:text-white">Challenges</a></li>
                <li><a href="#" className="hover:text-white">Paths</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Forums</a></li>
                <li><a href="#" className="hover:text-white">Discord</a></li>
                <li><a href="#" className="hover:text-white">Events</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CodeCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 