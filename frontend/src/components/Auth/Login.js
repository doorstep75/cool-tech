import React, { useState, useContext } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';

const Login = () => {
  // State for form inputs and error message
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory(); // Navigation hook
  const { setUser } = useContext(AuthContext); // Context for user authentication

  // Handles login form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behaviour
    setError(''); // Clear any previous errors
    try {
      // Send login request to the backend
      const res = await axios.post('/auth/login', { username, password });
      if (res.data.token && res.data.result) {
        setUser(res.data.result); // Update context with logged-in user info
        localStorage.setItem('token', res.data.token); // Store token
        localStorage.setItem('user', JSON.stringify(res.data.result)); // Store user details
        history.push('/dashboard'); // Redirect to dashboard
      } else {
        throw new Error('Invalid login response: no token or user'); // Handle invalid responses
      }
    } catch (err) {
      setError('Login failed. Please try again.'); // Set error message
      setPassword(''); // Clear password field for security
    }
  };

  return (
    <Container className="mt-5">
      <h2>Login</h2>
      {/* Display error message if any */}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        {/* Username input */}
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </Form.Group>

        {/* Password input */}
        <Form.Group controlId="password" className="mt-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </Form.Group>

        {/* Submit button */}
        <Button variant="primary" type="submit" className="mt-4">
          Login
        </Button>
      </Form>

      {/* Link to register page */}
      <p className="mt-3">
        Don't have an account?{' '}
        <Button variant="link" onClick={() => history.push('/register')}>
          Register here
        </Button>
      </p>
    </Container>
  );
};

export default Login;