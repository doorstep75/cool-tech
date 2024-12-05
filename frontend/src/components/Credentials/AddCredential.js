// src/components/Credentials/AddCredential.js
import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import { useHistory } from 'react-router-dom';

const AddCredential = () => {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [divisionId, setDivisionId] = useState('');
  const [divisions, setDivisions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch user's assigned divisions
    const fetchDivisions = async () => {
      try {
        const res = await axios.get('/user/divisions');
        setDivisions(res.data.divisions);
      } catch (err) {
        console.error('Error fetching divisions:', err);
      }
    };
    fetchDivisions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/credentials', {
        username,
        password,
        description,
        division: divisionId,
      });
      history.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add credential');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Add Credential</h2>
      {error && <Alert variant="danger">{error}</Alert>}
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
          Add Credential
        </Button>
      </Form>
    </Container>
  );
};

export default AddCredential;