// Import necessary React and Bootstrap components.
import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Import the CredentialList component (not directly used in this file but possibly for future inclusion).
import CredentialList from '../Credentials/CredentialList';

/**
 * AdminDashboard component.
 * Renders the dashboard for admin users, providing navigation to manage users and view credentials.
 *
 * @returns {JSX.Element} The rendered admin dashboard.
 */
const AdminDashboard = () => {
  return (
    <Container className="mt-5">
      {/* Dashboard Header */}
      <h2>Welcome to the admin dashboard.</h2>

      {/* Navigation Buttons */}
      <div className="mt-4">
        {/* Button to navigate to Manage Users page */}
        <Button as={Link} to="/manage-users" variant="primary" className="me-3">
          Manage Users
        </Button>
        
        {/* Button to navigate to View Credentials page */}
        <Button as={Link} to="/credentials" variant="secondary">
          View Credentials
        </Button>
      </div>
    </Container>
  );
};

export default AdminDashboard;