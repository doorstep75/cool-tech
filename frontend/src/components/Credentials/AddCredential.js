// src/components/Credentials/AddCredential.js

import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import axios from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import { useHistory } from 'react-router-dom';

const AddCredential = () => {
  const { user } = useContext(AuthContext); // Context for user information
  const history = useHistory();

  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [divisionId, setDivisionId] = useState('');

  // Divisions and errors
  const [divisions, setDivisions] = useState([]); // Divisions list
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(true); // To show loading state for divisions
  const [submitLoading, setSubmitLoading] = useState(false); // To show loading state on form submission

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const endpoint =
          user.role === 'admin' ? '/admin/divisions' : '/user/divisions';

        const res = await axios.get(endpoint);
        console.log('Fetched Divisions Response:', res.data); // Log the entire response

        // Handle different response structures
        let divisionsData;
        if (Array.isArray(res.data)) {
          divisionsData = res.data;
        } else if (Array.isArray(res.data.divisions)) {
          divisionsData = res.data.divisions;
        } else {
          divisionsData = [];
        }

        setDivisions(divisionsData);
        console.log('Divisions Data Set:', divisionsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching divisions:', err);
        setError('Failed to load divisions. Please try again later.');
        setLoading(false);
      }
    };
    fetchDivisions();
  }, [user.role]);

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    if (pwd.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset errors
    setError('');
    setPasswordError('');
  
    // Frontend validation
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }
  
    if (!divisionId) {
      setError('Please select a division.');
      return;
    }
  
    try {
      setSubmitLoading(true); // Start loading
      await axios.post(
        '/credentials', // Correct endpoint
        {
          username,
          password,
          description,
          division: divisionId, // Pass divisionId in the request body
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      // Reset form fields
      setUsername('');
      setPassword('');
      setDescription('');
      setDivisionId('');
      // Navigate back to the previous page
      history.go(-1); // Use the browser's history to go back to the last page
    } catch (err) {
      console.error('Error adding credential:', err);
  
      // Safely access error message and prevent runtime errors
      const errorMessage = err.response?.data?.message || '';
      if (errorMessage.includes('Password must be at least 6 characters long')) {
        setPasswordError('Password must be at least 6 characters long.');
      } else if (errorMessage.includes('Access denied')) {
        setError('You do not have permission to add credentials to this division.');
      } else {
        setError(errorMessage || 'Failed to add credential.');
      }
    } finally {
      setSubmitLoading(false); // End loading
    }
  };
  
  return (
    <Container className="mt-5">
      <h2>Add Credential</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? ( // Show loading state while divisions are being fetched
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading divisions...</span>
          </Spinner>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="divisionId">
            <Form.Label>Division</Form.Label>
            <Form.Control
              as="select"
              required
              value={divisionId}
              onChange={(e) => setDivisionId(e.target.value)}
            >
              <option value="">Select Division</option>
              {divisions.map((div) => (
                <option key={div._id} value={div._id}>
                  {div.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="username" className="mt-3">
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
              onChange={handlePasswordChange}
              placeholder="Enter password"
              isInvalid={passwordError !== ''}
              minLength={6}
            />
            <Form.Control.Feedback type="invalid">
              {passwordError}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="description" className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-4" disabled={submitLoading}>
            {submitLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{' '}
                Adding...
              </>
            ) : (
              'Add Credential'
            )}
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default AddCredential;