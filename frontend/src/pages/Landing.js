import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Target,
  BookOpen, 
  Zap,
  Award,
  Users,
  BarChart,
  Code,
  Globe,
  BrainCircuit,
  Star
} from 'lucide-react';
import ThemeSwitcher from '../components/ThemeSwitcher';

const Landing = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection scrollYProgress={scrollYProgress} />
        <TechStackSection />
        <TestimonialSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 flex items-center justify-between backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
      <Link to="/" className="flex items-center space-x-2">
        <BrainCircuit className="h-8 w-8 text-primary-500" />
        <span className="text-xl font-bold text-gray-800 dark:text-white">CareerCraft AI</span>
      </Link>
      <div className="flex items-center space-x-4">
        <ThemeSwitcher />
              {user ? (
          <Link to="/dashboard" className="btn-primary">
            Go to Dashboard
                  </Link>
              ) : (
                <>
            <Link to="/login" className="font-semibold text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors">
              Log In
                  </Link>
            <Link to="/register" className="btn-primary">
                    Get Started
                  </Link>
                </>
              )}
            </div>
    </header>
  );
};

const HeroSection = () => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Redirect to registration with the role pre-filled
    window.location.href = `/register?role=${encodeURIComponent(role)}`;
  };

  return (
    <section className="min-h-screen flex items-center justify-center text-center px-4 bg-white dark:bg-gray-900">
      <div className="relative z-10 w-full max-w-xl mx-auto">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <Award className="h-10 w-10 text-yellow-400" />
        </motion.div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-gray-800 dark:text-white leading-tight mb-4">
          Build Your Future, <br /> One Skill at a Time.
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
          CareerCraft AI creates a personalized learning path from your resume and career goals, guiding you to success with AI-powered micro-lessons. All for free, forever.
        </p>
        <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg p-6 flex flex-col gap-4 items-center mb-6">
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="role" className="font-semibold text-gray-700 dark:text-gray-200 text-left">Desired Role</label>
            <input
              type="text"
              id="role"
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="e.g. Product Manager, Data Scientist"
              className="input input-bordered w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary text-lg px-8 py-3 mt-2 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? 'Redirecting...' : 'Get My Roadmap'}
          </button>
        </form>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Link to="/register" className="btn-primary text-lg px-8 py-4">
            Start Your Journey Free
                </Link>
        </motion.div>
      </div>
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20">
        {/* Background decorative elements */}
      </div>
    </section>
  );
};

const FeaturesSection = ({ scrollYProgress }) => {
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0.8, 1, 1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5]);

  return (
    <motion.section
      style={{ scale, rotate }}
      className="py-20 px-4 bg-gray-50 dark:bg-gray-800 rounded-3xl mx-4"
    >
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-2 text-gray-800 dark:text-white">How It Works</h2>
        <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-16 max-w-2xl mx-auto">
          A simple, powerful, and personalized process to accelerate your career growth.
            </p>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Users className="w-12 h-12 text-primary-500" />}
            title="Upload Your Resume"
            description="Provide your resume and tell us your career aspiration. We'll analyze your skills and experience."
          />
          <FeatureCard
            icon={<Target className="w-12 h-12 text-primary-500" />}
            title="AI-Powered Plan"
            description="Our AI generates a custom learning schedule with bite-sized lessons to bridge your skill gaps."
          />
          <FeatureCard
            icon={<BookOpen className="w-12 h-12 text-primary-500" />}
            title="Learn & Grow"
            description="Engage with interactive lessons, track your progress, and achieve your professional goals faster."
          />
        </div>
      </div>
    </motion.section>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
    <div className="mb-6">{icon}</div>
    <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
          </div>
);

const TechStackSection = () => (
  <section className="py-20 px-4 bg-white dark:bg-gray-900">
    <div className="container mx-auto text-center">
      <h2 className="text-3xl font-bold mb-12 text-gray-800 dark:text-white">Powered by Modern Technology</h2>
      <div className="flex justify-center items-center flex-wrap gap-x-12 gap-y-8">
        <TechIcon icon={<Code className="w-10 h-10" />} name="Micro-lessons" />
        <TechIcon icon={<BrainCircuit className="w-10 h-10" />} name="Generative AI" />
        <TechIcon icon={<Zap className="w-10 h-10" />} name="Interactive Learning" />
        <TechIcon icon={<BarChart className="w-10 h-10" />} name="Progress Tracking" />
        <TechIcon icon={<Globe className="w-10 h-10" />} name="Web-Based" />
      </div>
          </div>
  </section>
);

const TechIcon = ({ icon, name }) => (
  <div className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-300">
    {icon}
    <span className="text-sm font-medium">{name}</span>
                </div>
);

const TestimonialSection = () => (
  <section className="py-24 px-4 bg-gray-50 dark:bg-gray-800">
    <div className="container mx-auto">
      <h2 className="text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white">Loved by Ambitious Professionals</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <TestimonialCard
          quote="CareerCraft AI demystified the path to becoming a Senior Developer. The personalized plan was a game-changer."
          name="Alex Johnson"
          role="Software Engineer"
        />
        <TestimonialCard
          quote="I finally landed my dream product manager role. The targeted lessons were exactly what I needed."
          name="Samantha Lee"
          role="Aspiring Product Manager"
        />
        <TestimonialCard
          quote="The best part is that it's completely free. High-quality, personalized education should be accessible to everyone."
          name="David Chen"
          role="Data Analyst"
        />
      </div>
          </div>
  </section>
);

const TestimonialCard = ({ quote, name, role }) => (
  <div className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg space-y-4">
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
                  </div>
    <p className="text-gray-700 dark:text-gray-300 italic">"{quote}"</p>
    <div>
      <p className="font-bold text-gray-800 dark:text-white">{name}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
                </div>
              </div>
);

const CTASection = () => (
  <section className="py-20 px-4 bg-primary-600 dark:bg-primary-700">
    <div className="container mx-auto text-center">
      <h2 className="text-4xl font-bold text-white mb-6">Ready to Craft Your Career?</h2>
      <p className="text-primary-200 text-lg mb-8 max-w-2xl mx-auto">
        Stop wondering what to learn next. Get your free, AI-powered learning plan and start building the skills for the job you want.
      </p>
      <Link to="/register" className="btn-light text-lg px-8 py-4">
        Get Started - It's Free
            </Link>
          </div>
  </section>
);

const Footer = () => (
  <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
    <div className="container mx-auto py-8 px-4 text-center text-gray-600 dark:text-gray-400">
      <p>&copy; {new Date().getFullYear()} CareerCraft AI. All rights reserved.</p>
    </div>
  </footer>
  );

export default Landing; 