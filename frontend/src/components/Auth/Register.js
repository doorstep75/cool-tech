import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom'; // For navigation
import axios from '../../services/api';

const Register = () => {
  // State for form inputs, success, and error messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const history = useHistory(); // Navigation hook

  // Handles form submission for registration
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behaviour
    setError(''); // Clear previous errors
    setSuccess(''); // Clear success messages

    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      // Send registration request to the backend
      const response = await axios.post('/auth/register', { username, password });
      setSuccess('Registration successful! Redirecting to login...');
      setUsername(''); // Reset form fields
      setPassword('');
      setConfirmPassword('');

      // Redirect to login page after a short delay
      setTimeout(() => {
        history.push('/'); // Redirect to login
      }, 2000); // 2 seconds delay
    } catch (err) {
      // Handle errors and display appropriate messages
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Register</h2>
      {/* Display error or success messages */}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Registration form */}
      <Form onSubmit={handleSubmit}>
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

        <Form.Group controlId="confirmPassword" className="mt-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-4">
          Register
        </Button>
      </Form>
    </Container>
  );
};

export default Register;