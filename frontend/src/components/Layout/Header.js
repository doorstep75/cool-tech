// src/components/Layout/Header.js
import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          CoolTech
        </Navbar.Brand>
        {user && (
          <>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dashboard">
                Dashboard
              </Nav.Link>
            </Nav>
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
