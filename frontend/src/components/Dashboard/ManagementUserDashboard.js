// src/components/Dashboard/ManagementUserDashboard.js
import React from 'react';
import { Container } from 'react-bootstrap';
import CredentialList from '../Credentials/CredentialList';

const ManagementUserDashboard = () => {
  return (
    <Container className="mt-5">
      <h2>Welcome, Management User</h2>
      <CredentialList />
    </Container>
  );
};

export default ManagementUserDashboard;
