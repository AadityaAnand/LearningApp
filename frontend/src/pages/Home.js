import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Landing from './Landing';

const Home = () => {
  const { user } = useAuth();

  // Always show landing page for all users
  return <Landing />;
};

export default Home; 