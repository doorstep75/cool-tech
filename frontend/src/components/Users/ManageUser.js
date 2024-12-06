// src/components/Users/ManageUser.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, ListGroup, Toast } from 'react-bootstrap';
import axios from '../../services/api';

const ManageUser = ({ match }) => {
  const [user, setUser] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [availableDivisions, setAvailableDivisions] = useState([]);
  const [ous, setOUs] = useState([]);
  const [availableOUs, setAvailableOUs] = useState([]);
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchUserAndAssignments = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Ensure the token exists
        if (!token) {
          throw new Error('Authentication token is missing');
        }

        // Fetch user, divisions, and OUs concurrently
        const [userRes, divisionsRes, allOUsRes] = await Promise.all([
          axios.get(`/admin/users/${match.params.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/admin/divisions', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/admin/ous', { // Now this returns all OUs as an array
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Validate the response structure
        if (!userRes?.data || !divisionsRes?.data || !allOUsRes?.data) {
          throw new Error('Unexpected response structure from the server');
        }

        console.log('Fetched OUs from API:', allOUsRes.data);
        console.log('User Assigned OUs:', userRes.data.user.ous);

        setUser(userRes.data.user); // Set the user data
        setRole(userRes.data.user.role); // Set the user role

        // Handle divisions (unchanged)
        setDivisions(userRes.data.user.divisions || []);
        setAvailableDivisions(divisionsRes.data.divisions || []);

        // Safely process OUs
        const fetchedOUs = allOUsRes.data || [];
        const userAssignedOUIds = (userRes.data.user.ous || []).map((id) => id.toString());

        const userAssignedOUs = fetchedOUs.filter((ou) =>
          userAssignedOUIds.includes(ou._id.toString())
        );
        const unassignedOUs = fetchedOUs.filter((ou) =>
          !userAssignedOUIds.includes(ou._id.toString())
        );

        console.log('Assigned OUs:', userAssignedOUs);
        console.log('Unassigned OUs:', unassignedOUs);

        setOUs(userAssignedOUs);
        setAvailableOUs(unassignedOUs);
      } catch (err) {
        console.error('Error fetching user and assignments:', err);
        setError(err.message || 'Error fetching data');
      }
    };

    fetchUserAndAssignments();
  }, [match.params.id]);

  const handleRoleChange = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/admin/change-role',
        { userId: user._id, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      setToastMessage('Division unassigned successfully');
      setShowToast(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unassign division');
    }
  };

  const handleAssignOU = async (ouId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/admin/assign',
        { userId: user._id, ouId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const assignedOU = availableOUs.find((ou) => ou._id === ouId);
      setOUs([...ous, assignedOU]);
      setToastMessage('Organisational Unit assigned successfully');
      setShowToast(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign Organisational Unit');
    }
  };

  const handleUnassignOU = async (ouId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/admin/unassign',
        { userId: user._id, ouId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOUs(ous.filter((ou) => ou._id !== ouId));
      setToastMessage('Organisational Unit unassigned successfully');
      setShowToast(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unassign Organisational Unit');
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

      <h3 className="mt-5">Assigned Organisational Units</h3>
      <ListGroup>
        {ous.map((ou) => (
          <ListGroup.Item key={ou._id}>
            {ou.name}
            <Button
              variant="danger"
              size="sm"
              className="float-end"
              onClick={() => handleUnassignOU(ou._id)}
            >
              Unassign
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <h3 className="mt-5">Assign New Organisational Unit</h3>
      <ListGroup>
        {availableOUs
          .filter((ou) => !ous.some((assigned) => assigned._id === ou._id))
          .map((ou) => (
            <ListGroup.Item key={ou._id}>
              {ou.name}
              <Button
                variant="success"
                size="sm"
                className="float-end"
                onClick={() => handleAssignOU(ou._id)}
              >
                Assign
              </Button>
            </ListGroup.Item>
          ))}
      </ListGroup>

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