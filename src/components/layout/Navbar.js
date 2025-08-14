import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { ROUTES } from '../../utils/constants';
import authService from '../../services/authService';
import CartIcon from '../cart/CartIcon';

const AppNavbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate(ROUTES.HOME);
  };

  return (
    <Navbar expand="lg" className="main-navbar mb-4">
      <Container>
        <Navbar.Brand as={Link} to={ROUTES.HOME} className="brand-logo">
          <span className="brand-text">React Shop</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={ROUTES.HOME} className="nav-item">Home</Nav.Link>
            <Nav.Link as={Link} to={ROUTES.PRODUCTS} className="nav-item">Products</Nav.Link>
            {isAuthenticated && (
              <Nav.Link as={Link} to={ROUTES.ORDERS} className="nav-item">Orders</Nav.Link>
            )}
            {isAdmin && (
              <>
                <Nav.Link as={Link} to={ROUTES.USERS} className="nav-item">Users</Nav.Link>
                <Nav.Link as={Link} to={ROUTES.ADMIN_DASHBOARD} className="nav-item">Admin</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            <CartIcon />
            {isAuthenticated ? (
              <>
                <Navbar.Text className="me-3 user-greeting">
                  <span className="greeting-text">Hello,</span> {currentUser?.username}
                </Navbar.Text>
                <Button variant="outline-primary" className="logout-btn" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to={ROUTES.LOGIN} className="auth-link">Login</Nav.Link>
                <Nav.Link as={Link} to={ROUTES.REGISTER} className="auth-link register-link">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;