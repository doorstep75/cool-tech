import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, ListGroup, Toast } from 'react-bootstrap';
import axios from '../../services/api';

const ManageUser = ({ match, history }) => {
  const [user, setUser] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [availableDivisions, setAvailableDivisions] = useState([]);
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchUserAndDivisions = async () => {
      try {
        const token = localStorage.getItem('token');
        const [userRes, divisionsRes] = await Promise.all([
          axios.get(`/admin/users/${match.params.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/admin/divisions', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUser(userRes.data.user);
        setRole(userRes.data.user.role);
        setDivisions(userRes.data.user.divisions); // Store full division objects
        setAvailableDivisions(divisionsRes.data.divisions);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching data');
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
      // Show success toast for role change
      setToastMessage('User role updated successfully');
      setShowToast(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change role');
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
      const assignedDivision = availableDivisions.find((div) => div._id === divisionId);
      setDivisions([...divisions, assignedDivision]);
      // Show success toast for division assignment
      setToastMessage('Division assigned successfully');
      setShowToast(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign division');
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
      setDivisions(divisions.filter((div) => div._id !== divisionId));
      // Step 5: Show success toast for division unassignment
      setToastMessage('Division unassigned successfully');
      setShowToast(true);  
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unassign division');
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
        {divisions.map((div) => (
          <ListGroup.Item key={div._id}>
            {div.name}
            <Button
              variant="danger"
              size="sm"
              className="float-end"
              onClick={() => handleUnassignDivision(div._id)}
            >
              Unassign
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <h3 className="mt-5">Assign New Division</h3>
      <ListGroup>
        {availableDivisions
          .filter((div) => !divisions.some((assigned) => assigned._id === div._id))
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

      {/* Toast component */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        className="position-fixed top-0 end-0 m-3"
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>      
    </Container>
  );
};

export default ManageUser;