// src/components/Credentials/UpdateCredential.js
import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';

const UpdateCredential = ({ match, history }) => {
  const { user } = useContext(AuthContext);
  const [credential, setCredential] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCredential = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/credentials/${match.params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCredential(res.data);
        setUsername(res.data.username);
        setPassword(res.data.password);
        setDescription(res.data.description);
      } catch (err) {
        setError(err.response.data.message || 'Error fetching credential');
      }
    };
    fetchCredential();
  }, [match.params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/credentials/${match.params.id}`,
        { username, password, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      history.push('/dashboard');
    } catch (err) {
      setError(err.response.data.message || 'Failed to update credential');
    }
  };

  if (!credential) {
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
            type="text"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
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
