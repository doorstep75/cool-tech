// Import necessary React and Bootstrap components.
import React from 'react';
import { Container } from 'react-bootstrap';

// Import the CredentialList component to display credentials.
import CredentialList from '../Credentials/CredentialList';

/**
 * ManagementUserDashboard component.
 * This component renders the dashboard view for management users.
 *
 * @returns {JSX.Element} The rendered dashboard for management users.
 */
const ManagementUserDashboard = () => {
  return (
    <Container className="mt-5">
      {/* Dashboard Header */}
      <h2>Welcome to the management dashboard</h2>
      
      {/* Render the list of credentials accessible to the management user */}
      <CredentialList />
    </Container>
  );
};

export default ManagementUserDashboard;