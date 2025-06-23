import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, XCircle, Mail } from 'lucide-react';

const VerifyEmail = () => {
  const { verifyEmail } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  const handleVerification = useCallback(async () => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      return;
    }
    const { success } = await verifyEmail(token);
    if (success) {
      setStatus('success');
      setTimeout(() => navigate('/dashboard'), 3000);
    } else {
      setStatus('error');
    }
  }, [verifyEmail, searchParams, navigate]);

  useEffect(() => {
    handleVerification();
  }, [handleVerification]);

  const renderStatus = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  Verifying your email...
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Please wait while we verify your email address.
                </p>
                <div className="mt-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'success':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  Email verified successfully!
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Your email address has been verified. You will be redirected to the login page in a few seconds.
                </p>
                <div className="mt-6">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    Go to login now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      case 'error':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  Verification failed
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {status}
                </p>
                <div className="mt-6 space-y-4">
                  <Link
                    to="/login"
                    className="block w-full text-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Go to login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Create new account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return renderStatus();
};

export default VerifyEmail; 