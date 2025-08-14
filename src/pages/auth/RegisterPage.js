import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import Layout from '../../components/layout/Layout';
import userService from '../../services/userService';
import { ROUTES } from '../../utils/constants';

const RegisterPage = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      throw new Error('All fields are required');
    }
    
    if (formData.password !== formData.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    if (formData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      throw new Error('Please enter a valid email address');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      validateForm();
      
      const registrationData = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };
      
      if (isAdmin) {
        await userService.registerAdmin(registrationData);
      } else {
        await userService.register(registrationData);
      }
      
      // Redirect on success
      navigate(ROUTES.LOGIN, { 
        state: { 
          message: 'Registration successful! Please log in.' 
        } 
      });
    } catch (err) {
      setError(err.message);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }

    try {
      // Validate form
      validateForm();

      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };

      if (isAdmin) {
        await userService.registerAdmin(userData);
        navigate('/admin/users', { 
          state: { message: 'Tạo tài khoản thành công!' }
        });
      } else {
        await userService.register(userData);
        navigate(ROUTES.LOGIN, { 
          state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' }
        });
      }
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="d-flex justify-content-center">
        <Card className="shadow" style={{ maxWidth: '500px', width: '100%' }}>
          <Card.Header className="bg-primary text-white">
            <h4 className="mb-0">{isAdmin ? 'Register Admin' : 'Register'}</h4>
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
                  placeholder="Choose a username"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                />
                <Form.Text className="text-muted">
                  Password must be at least 6 characters long.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button 
                  variant={isAdmin ? 'danger' : 'primary'} 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register'}
                </Button>
              </div>
            </Form>
            
            {!isAdmin && (
              <div className="mt-3 text-center">
                <p className="mb-0">
                  Already have an account? <Link to={ROUTES.LOGIN}>Login</Link>
                </p>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </Layout>
  );
};

export default RegisterPage;