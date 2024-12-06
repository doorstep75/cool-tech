// src/components/Layout/Header.js
import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext); // Access user and logout from context
  const history = useHistory(); // For navigation control

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        {/* Button to navigate to the previous page */}
        <Button 
          variant="outline-light" 
          onClick={() => history.goBack()} 
          className="me-3"
        >
          Back
        </Button>

        {/* Button to go to the home page */}
        <Button 
          variant="outline-light" 
          as={Link} 
          to="/" // Navigate to the home page
        >
          Home
        </Button>

        {user && (
          <>
            {/* Link to the dashboard */}
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dashboard">
                Dashboard
              </Nav.Link>
            </Nav>

            {/* Display user information and logout button */}
            <Nav>
              <Navbar.Text className="me-3">
                Signed in as: {user.username}
              </Navbar.Text>
              <Button variant="outline-light" onClick={logout}>
                Logout
              </Button>
            </Nav>
          </>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;