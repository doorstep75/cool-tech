// src/components/Users/ManageUser.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, ListGroup } from 'react-bootstrap';
import axios from '../../services/api';

const ManageUser = ({ match, history }) => {
  const [user, setUser] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [availableDivisions, setAvailableDivisions] = useState([]);
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserAndDivisions = async () => {
      try {
        const token = localStorage.getItem('token');
        const [userRes, divisionsRes] = await Promise.all([
          axios.get(`/admin/users/${match.params.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/divisions', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUser(userRes.data);
        setRole(userRes.data.role);
        setDivisions(userRes.data.divisions);
        setAvailableDivisions(divisionsRes.data);
      } catch (err) {
        setError(err.response.data.message || 'Error fetching data');
      }
    };
    fetchUserAndDivisions();
  }, [match.params.id]);

  const handleRoleChange = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/admin/change-role',
        { userId: user._id, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      history.push('/manage-users');
    } catch (err) {
      setError(err.response.data.message || 'Failed to change role');
    }
  };

  const handleAssignDivision = async (divisionId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/admin/assign',
        { userId: user._id, divisionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDivisions([...divisions, divisionId]);
    } catch (err) {
      setError(err.response.data.message || 'Failed to assign division');
    }
  };

  const handleUnassignDivision = async (divisionId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/admin/unassign',
        { userId: user._id, divisionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDivisions(divisions.filter((id) => id !== divisionId));
    } catch (err) {
      setError(err.response.data.message || 'Failed to unassign division');
    }
  };

  if (!user) {
    return <Container className="mt-5">Loading...</Container>;
  }

  return (
    <Container className="mt-5">
      <h2>Manage User: {user.username}</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form className="mt-4">
        <Form.Group controlId="role">
          <Form.Label>Role</Form.Label>
          <Form.Control
            as="select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="management">Management</option>
            <option value="admin">Admin</option>
          </Form.Control>
        </Form.Group>
        <Button variant="primary" onClick={handleRoleChange} className="mt-3">
          Change Role
        </Button>
      </Form>

      <h3 className="mt-5">Assigned Divisions</h3>
      <ListGroup>
        {divisions.map((divId) => {
          const division = availableDivisions.find((d) => d._id === divId);
          return (
            <ListGroup.Item key={divId}>
              {division ? division.name : divId}
              <Button
                variant="danger"
                size="sm"
                className="float-end"
                onClick={() => handleUnassignDivision(divId)}
              >
                Unassign
              </Button>
            </ListGroup.Item>
          );
        })}
      </ListGroup>

      <h3 className="mt-5">Assign New Division</h3>
      <ListGroup>
        {availableDivisions
          .filter((div) => !divisions.includes(div._id))
          .map((div) => (
            <ListGroup.Item key={div._id}>
              {div.name}
              <Button
                variant="success"
                size="sm"
                className="float-end"
                onClick={() => handleAssignDivision(div._id)}
              >
                Assign
              </Button>
            </ListGroup.Item>
          ))}
      </ListGroup>
    </Container>
  );
};

export default ManageUser;
