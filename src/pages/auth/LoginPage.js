import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import Layout from '../../components/layout/Layout';
import authService from '../../services/authService';
import { useCart } from '../../contexts/CartContext';
import { ROUTES } from '../../utils/constants';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { syncCartOnLogin } = useCart();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get the redirect path from location state or default to home
  const from = location.state?.from || ROUTES.HOME;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!formData.username || !formData.password) {
        throw new Error('Please enter both username and password');
      }

      // Attempt login
      await authService.login(formData);
      
      // Sync local cart with server cart after successful login
      await syncCartOnLogin();
      
      // Redirect to the page they were trying to access or home
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="d-flex justify-content-center">
        <Card className="shadow" style={{ maxWidth: '500px', width: '100%' }}>
          <Card.Header className="bg-primary text-white">
            <h4 className="mb-0">Login</h4>
          </Card.Header>
          <Card.Body className="p-4">
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </Form>
            
            <div className="mt-3 text-center">
              <p className="mb-0">
                Don't have an account? <Link to={ROUTES.REGISTER}>Register</Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Layout>
  );
};

export default LoginPage;