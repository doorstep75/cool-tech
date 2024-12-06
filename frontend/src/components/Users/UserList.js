import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Alert } from 'react-bootstrap';
import axios from '../../services/api';
import { Link } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]); // Holds the list of users
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [error, setError] = useState(''); // Tracks errors

  // Fetch users on component load
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/admin/users'); // Fetch user data
        console.log('Fetched Users:', res.data.result); // Log the response
        setUsers(res.data.result || []); // Update users state
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users. Please try again later.');
      } finally {
        setLoading(false); // Clear loading state
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Container className="mt-5">
        <h2>Manage Users</h2>
        <p>Loading users...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2>Manage Users</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Divisions</th>
            <th>Organisational Units</th> {/* Column for OUs */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  {user.divisions.map((div) => div.name).join(', ') || 'None'}
                </td>
                <td>
                  {user.ous?.length > 0
                    ? user.ous.map((ou) => ou.name).join(', ') // List OUs
                    : 'None'}
                </td>
                <td>
                  <Button
                    as={Link}
                    to={`/manage-user/${user._id}`}
                    variant="primary"
                  >
                    Manage
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default UserList;