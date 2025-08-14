import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import userService from '../../services/userService';
import { ROUTES } from '../../utils/constants';

const UserDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await userService.getUserById(id);
        setUser(data);
      } catch (err) {
        setError('Failed to load user. Please try again.');
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <Layout><Loading /></Layout>;
  if (error) return <Layout><ErrorMessage message={error} /></Layout>;
  if (!user) return <Layout><ErrorMessage message="User not found" /></Layout>;

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>User Details</h1>
        <Button as={Link} to={ROUTES.USERS} variant="outline-primary">
          Back to Users
        </Button>
      </div>

      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">User #{user.id}</h5>
            <Badge bg={user.role === 'ROLE_ADMIN' ? 'danger' : 'primary'}>
              {user.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
            </Badge>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default UserDetailPage;