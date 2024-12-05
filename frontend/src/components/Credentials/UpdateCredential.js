// src/components/Credentials/UpdateCredential.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import axios from '../../services/api';

const UpdateCredential = () => {
  const { id } = useParams();
  const history = useHistory();
  const [credential, setCredential] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch the credential details on load
  useEffect(() => {
    const fetchCredential = async () => {
      try {
        const res = await axios.get(`/credentials/${id}`);
        const { username, description } = res.data.result;
        setCredential(res.data.result);
        setUsername(username);
        setDescription(description);
      } catch (err) {
        console.error('Error fetching credential:', err);
        setError(err.response?.data?.message || 'Failed to fetch credential.');
      } finally {
        setLoading(false);
      }
    };
    fetchCredential();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update the credential
      const payload = { username, description };
      if (password) payload.password = password; // Include password only if updated

      await axios.put(`/credentials/${id}`, payload);
      history.goBack(); // Redirect to the previous page
    } catch (err) {
      console.error('Error updating credential:', err);
      setError(err.response?.data?.message || 'Failed to update credential.');
    }
  };

  if (loading) {
    return <Container className="mt-5">Loading...</Container>;
  }

  return (
    <Container className="mt-5">
      <h2>Update Credential</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password (leave blank to retain current password)"
          />
          <Form.Text className="text-muted">
            Leave the password blank if you don't want to change it.
          </Form.Text>
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

        <Button variant="primary" type="submit" className="mt-4">
          Update Credential
        </Button>
      </Form>
    </Container>
  );
};

export default UpdateCredential;