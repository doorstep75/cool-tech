// src/components/Credentials/CredentialList.js
import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Container, Alert } from 'react-bootstrap';
import axios from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const ROLE_NORMAL = 'normal';

const CredentialList = () => {
  const { user } = useContext(AuthContext);
  const [credentials, setCredentials] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  console.log('CredentialList Component Rendered'); // console log

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        let res;
        if (user.role === 'admin') {
          console.log('Admin fetching all credentials...'); // console log
          // Admin users fetch all credentials
          res = await axios.get('/credentials');
        } else {
          console.log('Non-admin fetching user credentials...'); // console log
          // Normal and management users fetch their accessible credentials
          res = await axios.get('/credentials/user');
        }
        console.log('Fetched Credentials Response:', res.data.result); // Debug response
        setCredentials(res.data.result);
      } catch (err) {
        console.error('Error fetching credentials:', err);
        setError('Failed to fetch credentials. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCredentials();
  }, [user.role]);


  console.log('Credentials State:', credentials); // Debug current credentials state

  if (loading) {
    return (
      <Container className="mt-4">
        <h3>Credentials</h3>
        <p>Loading credentials...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h3>Credentials</h3>
      {error && <Alert variant="danger">{error}</Alert>}
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