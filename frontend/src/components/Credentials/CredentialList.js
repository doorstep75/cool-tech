// src/components/Credentials/CredentialList.js
import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Container, Alert } from 'react-bootstrap';
import axios from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const ROLE_NORMAL = 'normal'; // Role constant for normal users

const CredentialList = () => {
  const { user } = useContext(AuthContext); // Get current user info from context
  const [credentials, setCredentials] = useState([]); // Tracks fetched credentials
  const [error, setError] = useState(''); // Tracks error messages
  const [loading, setLoading] = useState(true); // Tracks loading state

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        let res;
        // Fetch credentials based on user role
        if (user.role === 'admin') {
          res = await axios.get('/credentials'); // Admin fetches all credentials
        } else {
          res = await axios.get('/credentials/user'); // Others fetch their accessible credentials
        }
        setCredentials(res.data.result); // Update credentials state
      } catch (err) {
        console.error('Error fetching credentials:', err);
        setError('Failed to fetch credentials. Please try again later.');
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchCredentials();
  }, [user.role]); // Dependency: re-fetch if user role changes

  // Loading state
  if (loading) {
    return (
      <Container className="mt-4">
        <h3>Credentials</h3>
        <p>Loading credentials...</p>
      </Container>
    );
  }

  // Main render
  return (
    <Container className="mt-4">
      <h3>Credentials</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {/* Add Credential button */}
      <Button as={Link} to="/add-credential" variant="success" className="mb-3">
        Add Credential
      </Button>
      {credentials.length === 0 ? (
        <p>No credentials found.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Username</th>
              <th>Description</th>
              <th>Division</th>
              {/* Show Actions column only for non-normal users */}
              {user.role !== ROLE_NORMAL && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {credentials.map((cred) => (
              <tr key={cred._id}>
                <td>{cred.username}</td>
                <td>{cred.description}</td>
                <td>{cred.division?.name || cred.division}</td>
                {user.role !== ROLE_NORMAL && (
                  <td>
                    <Button
                      as={Link}
                      to={`/update-credential/${cred._id}`}
                      variant="warning"
                      size="sm"
                    >
                      Edit
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default CredentialList;