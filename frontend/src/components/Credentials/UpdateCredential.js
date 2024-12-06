// src/components/Credentials/UpdateCredential.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import axios from '../../services/api';

const UpdateCredential = () => {
  const { id } = useParams(); // Get the credential ID from the URL
  const history = useHistory(); // For navigation
  const [credential, setCredential] = useState(null); // Stores fetched credential details
  const [username, setUsername] = useState(''); // Tracks username input
  const [password, setPassword] = useState(''); // Tracks password input
  const [description, setDescription] = useState(''); // Tracks description input
  const [error, setError] = useState(''); // Tracks error messages
  const [loading, setLoading] = useState(true); // Tracks loading state

  // Fetch the credential details on component load
  useEffect(() => {
    const fetchCredential = async () => {
      try {
        const res = await axios.get(`/credentials/${id}`); // Get credential data
        const { username, description } = res.data.result; // Extract relevant fields
        setCredential(res.data.result); // Set credential state
        setUsername(username); // Pre-fill username field
        setDescription(description); // Pre-fill description field
      } catch (err) {
        console.error('Error fetching credential:', err);
        setError(err.response?.data?.message || 'Failed to fetch credential.');
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchCredential();
  }, [id]); // Dependency array ensures this runs when ID changes

  // Handle form submission for updating the credential
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { username, description }; // Build payload with updated fields
      if (password) payload.password = password; // Include password only if provided

      await axios.put(`/credentials/${id}`, payload); // Send update request
      history.goBack(); // Navigate to the previous page
    } catch (err) {
      console.error('Error updating credential:', err);
      setError(err.response?.data?.message || 'Failed to update credential.');
    }
  };

  // Render loading state
  if (loading) {
    return <Container className="mt-5">Loading...</Container>;
  }

  // Main render
  return (
    <Container className="mt-5">
      <h2>Update Credential</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        {/* Username field */}
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

        {/* Password field */}
        <Form.Group controlId="password" className="mt-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password (leave blank to retain current password)"
          />
          <Form.Text className="text-muted">
            Leave the password blank if you don't want to change it.
          </Form.Text>
        </Form.Group>

        {/* Description field */}
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

        {/* Submit button */}
        <Button variant="primary" type="submit" className="mt-4">
          Update Credential
        </Button>
      </Form>
    </Container>
  );
};

export default UpdateCredential;