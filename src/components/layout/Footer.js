import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer py-5 mt-5">
      <Container>
        <Row className="mb-4">
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="footer-heading">React Shop</h5>
            <p className="footer-text">Your one-stop shop for quality products at competitive prices.</p>
          </Col>
          <Col md={3} className="mb-4 mb-md-0">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/register">Register</a></li>
            </ul>
          </Col>
          <Col md={3} className="mb-4 mb-md-0">
            <h5 className="footer-heading">Contact Us</h5>
            <ul className="footer-links">
              <li>Email: info@reactshop.com</li>
              <li>Phone: +1 (123) 456-7890</li>
              <li>Address: 123 React St, Web City</li>
            </ul>
          </Col>
          <Col md={2}>
            <h5 className="footer-heading">Follow Us</h5>
            <div className="footer-social">
              <a href="https://facebook.com" className="social-link">Facebook</a>
              <a href="https://twitter.com" className="social-link">Twitter</a>
              <a href="https://instagram.com" className="social-link">Instagram</a>
            </div>
          </Col>
        </Row>
        <hr className="footer-divider" />
        <div className="text-center footer-copyright">
          <p className="mb-0">&copy; {new Date().getFullYear()} React Shop. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;