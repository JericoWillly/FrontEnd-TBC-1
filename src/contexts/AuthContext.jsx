import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already logged in (token exists)
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchUserProfile() {
    try {
      const response = await api.get('/users/me/profile');
      setCurrentUser(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      localStorage.removeItem('token');
      setCurrentUser(null);
      setLoading(false);
    }
  }

  async function login(email, password, isAdmin = false) {
    try {
      setError('');
      // Use specific admin login endpoint if isAdmin is true
      const endpoint = isAdmin ? '/auth/login/admin' : '/auth/login';
      const response = await api.post(endpoint, { email, password });
      localStorage.setItem('token', response.data.token);
      await fetchUserProfile();
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Failed to login');
      return false;
    }
  }

  async function register(userData, isAdmin = false) {
    try {
      setError('');
      // Use specific admin register endpoint if isAdmin is true
      const endpoint = isAdmin ? '/auth/register/admin' : '/auth/register';
      const response = await api.post(endpoint, userData);
      
      // If registering a new user as admin (not creating a new admin)
      if (!isAdmin) {
        localStorage.setItem('token', response.data.token);
        await fetchUserProfile();
      }
      
      return true;
    } catch (err) {
      console.error('Register error:', err);
      setError(err.response?.data?.message || 'Failed to register');
      return false;
    }
  }

  function logout() {
    localStorage.removeItem('token');
    setCurrentUser(null);
  }

  const value = {
    currentUser,
    login,
    register,
    logout,
    error,
    isAdmin: currentUser?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}