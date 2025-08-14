import React from 'react';
import { Container } from 'react-bootstrap';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <Container className="flex-grow-1 py-3">
        {children}
      </Container>
      <Footer />
    </div>
  );
};

export default Layout;