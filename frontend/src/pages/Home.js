import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Landing from './Landing';
import Dashboard from './Dashboard';

function Home() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <Landing />;
}

export default Home; 