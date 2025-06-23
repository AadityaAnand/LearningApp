import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, Target, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const { register: signup, loading } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [resumeFile, setResumeFile] = useState(null);

  const onSubmit = async (data) => {
    if (!resumeFile) {
      toast.error('Please upload your resume.');
      return;
    }
    
    // Here you would typically use FormData to send the file and other data
    // to the backend. For now, we'll simulate the data structure.
    const registrationData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      careerGoal: data.careerGoal,
      // In a real implementation, you'd handle the resume upload and
      // maybe send back a file ID or URL.
      resume: resumeFile.name 
    };

    const { success } = await signup(registrationData);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
    } else {
      toast.error("Please upload a PDF file.");
      setResumeFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your personalized learning plan
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Tell us your goals, and we'll generate a custom micro-learning schedule for you.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    {...register('firstName', { required: 'First name is required' })}
                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                {errors.firstName && <p className="mt-2 text-sm text-red-600">{errors.firstName.message}</p>}
              </div>
              <div className="w-1/2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    {...register('lastName', { required: 'Last name is required' })}
                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                {errors.lastName && <p className="mt-2 text-sm text-red-600">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' }
                  })}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                Upload Resume (PDF)
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <label htmlFor="resume" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <Upload className="h-5 w-5 inline-block mr-2" />
                  <span>Choose File</span>
                  <input id="resume" name="resume" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" />
                </label>
                {resumeFile && <span className="text-sm text-gray-500">{resumeFile.name}</span>}
              </div>
            </div>

            <div>
              <label htmlFor="careerGoal" className="block text-sm font-medium text-gray-700">
                What is your career goal?
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                  <Target className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="careerGoal"
                  name="careerGoal"
                  rows={4}
                  {...register('careerGoal', { required: 'Please tell us your career goal.' })}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="e.g., 'I am a junior frontend developer with experience in React, and I want to become a full-stack engineer specializing in the MERN stack within the next 6 months.'"
                />
              </div>
              {errors.careerGoal && <p className="mt-2 text-sm text-red-600">{errors.careerGoal.message}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300"
              >
                {loading ? 'Generating your plan...' : 'Create My Learning Plan'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 