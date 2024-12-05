// src/components/Dashboard/AdminDashboard.js
import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <Container className="mt-5">
      <h2>Welcome, Admin User</h2>
      <div className="mt-4">
        <Button as={Link} to="/manage-users" variant="primary" className="me-3">
          Manage Users
        </Button>
        <Button as={Link} to="/credentials" variant="secondary">
          View Credentials
        </Button>
      </div>
    </Container>
  );
};

export default AdminDashboard;
