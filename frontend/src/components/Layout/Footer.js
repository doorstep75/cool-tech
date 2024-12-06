// src/components/Layout/Footer.js
import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => (
  // Footer component with a dark background and centred text
  <footer className="bg-dark text-light py-3 mt-auto">
    <Container>
      {/* Display copyright information dynamically */}
      <p className="mb-0 text-center">
        &copy; {new Date().getFullYear()} CoolTech
      </p>
    </Container>
  </footer>
);

export default Footer;