
import React from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/AuthForm';
import TaskBoard from '../components/TaskBoard';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? <TaskBoard /> : <AuthForm />;
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
