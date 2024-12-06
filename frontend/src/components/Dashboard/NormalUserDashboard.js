// Import necessary React and Bootstrap components.
import React from 'react';
import { Container } from 'react-bootstrap';

// Import the CredentialList component to display user credentials.
import CredentialList from '../Credentials/CredentialList';

/**
 * NormalUserDashboard component.
 * This component renders the dashboard view for normal users.
 *
 * @returns {JSX.Element} The rendered dashboard for normal users.
 */
const NormalUserDashboard = () => {
  return (
    <Container className="mt-5">
      {/* Dashboard Header */}
      <h2>Welcome to your dashboard</h2>
      
      {/* Render the list of credentials accessible to the user */}
      <CredentialList />
    </Container>
  );
};

export default NormalUserDashboard;