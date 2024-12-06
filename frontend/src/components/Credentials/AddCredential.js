// src/components/Credentials/AddCredential.js

import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import axios from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import { useHistory } from 'react-router-dom';

const AddCredential = () => {
  const { user } = useContext(AuthContext); // Get user information from context
  const history = useHistory(); // Navigate programmatically

  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [divisionId, setDivisionId] = useState('');

  // Divisions and error states
  const [divisions, setDivisions] = useState([]);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(true); // Loading divisions
  const [submitLoading, setSubmitLoading] = useState(false); // Form submission state

  // Fetch available divisions based on user role
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const endpoint =
          user.role === 'admin' ? '/admin/divisions' : '/user/divisions';
        const res = await axios.get(endpoint);

        // Determine the response structure for divisions
        const divisionsData = Array.isArray(res.data)
          ? res.data
          : res.data.divisions || [];

        setDivisions(divisionsData); // Set divisions state
      } catch (err) {
        console.error('Error fetching divisions:', err);
        setError('Failed to load divisions. Please try again later.');
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };
    fetchDivisions();
  }, [user.role]);

  // Handle password input and validate its length
  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    if (pwd.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
    } else {
      setPasswordError('');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setSubmitLoading(true); // Show submission spinner
      await axios.post(
        '/credentials',
        {
          username,
          password,
          description,
          division: divisionId,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      // Clear form fields after successful submission
      setUsername('');
      setPassword('');
      setDescription('');
      setDivisionId('');

      // Navigate back to the previous page
      history.go(-1);
    } catch (err) {
      console.error('Error adding credential:', err);
      const errorMessage = err.response?.data?.message || '';
      if (errorMessage.includes('Password must be at least 6 characters long')) {
        setPasswordError('Password must be at least 6 characters long.');
      } else if (errorMessage.includes('Access denied')) {
        setError('You do not have permission to add credentials to this division.');
      } else {
        setError(errorMessage || 'Failed to add credential.');
      }
    } finally {
      setSubmitLoading(false); // Hide submission spinner
    }
  };

  return (
    <Container className="mt-5">
      <h2>Add Credential</h2>
      <p>Note: new users will need an admin to assign them to a division in order to add new credentials.</p>
      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        // Show spinner while loading divisions
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading divisions...</span>
          </Spinner>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          {/* Division Selection */}
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

          {/* Username Input */}
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

          {/* Password Input */}
          <Form.Group controlId="password" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              required
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter password"
              isInvalid={passwordError !== ''}
            />
            <Form.Control.Feedback type="invalid">
              {passwordError}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Description Input */}
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

          {/* Submit Button */}
          <Button variant="primary" type="submit" className="mt-4" disabled={submitLoading}>
            {submitLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Adding...
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