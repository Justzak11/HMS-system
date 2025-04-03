import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MainLayout from './components/layout/MainLayout';
import NotFound from './pages/NotFound';

// Placeholder for authentication check - will be replaced with actual auth logic
const isAuthenticated = () => {
  const authState = localStorage.getItem('isAuthenticated');
  console.log('Auth state:', authState); // Debug log
  return authState === 'true';
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = isAuthenticated();
  console.log('Protected route check:', auth); // Debug log
  
  if (!auth) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes wrapped in MainLayout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          {/* Add more routes here as we build them */}
        </Route>
        
        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ConfigProvider>
  );
};

export default App;
