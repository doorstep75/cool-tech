// Import necessary dependencies
import React, { createContext, useState, useEffect } from 'react';
import axios from '../services/api';
import { useHistory } from 'react-router-dom';

// Create the AuthContext
export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Tracks logged-in user
  const [token, setToken] = useState(null); // Tracks the token
  const history = useHistory(); // For navigation

  // Check for stored token and fetch user details on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      axios
        .get('/auth/me')
        .then((res) => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
        });
    }
  }, []);

  // Handle login
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setToken(token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    history.push('/dashboard');
  };

  // Handle logout
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
    history.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;