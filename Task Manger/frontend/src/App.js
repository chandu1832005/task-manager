import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import KanbanBoard from './pages/KanbanBoard';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }

  return children;
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout, token } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setTasks(response.data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading your tasks...</p>
      </div>
    );
  }

  return (
    <KanbanBoard 
      tasks={tasks} 
      setTasks={setTasks} 
      onLogout={handleLogout} 
    />
  );
};

const AuthRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const path = window.location.pathname;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated && (path === '/login' || path === '/register')) {
    window.location.href = '/dashboard';
    return null;
  }

  if (path === '/register') {
    return <Register />;
  }

  return <Login />;
};

function AppContent() {
  const path = window.location.pathname;

  if (path === '/login' || path === '/register' || path === '/') {
    return <AuthRoute />;
  }

  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
