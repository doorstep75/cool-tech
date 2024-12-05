// src/components/Dashboard/NormalUserDashboard.js
import React from 'react';
import { Container } from 'react-bootstrap';
import CredentialList from '../Credentials/CredentialList';

const NormalUserDashboard = () => {
  return (
    <Container className="mt-5">
      <h2>Welcome, Normal User</h2>
      <CredentialList />
    </Container>
  );
};

export default NormalUserDashboard;
