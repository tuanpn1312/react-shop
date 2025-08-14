import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import UserList from '../../components/users/UserList';
import userService from '../../services/userService';
import { ROUTES } from '../../utils/constants';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getAllUsers();
        setUsers(data);
      } catch (err) {
        setError('Failed to load users. Please try again.');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <Layout><Loading /></Layout>;
  if (error) return <Layout><ErrorMessage message={error} /></Layout>;

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>User Management</h1>
        <div>
          <Button as={Link} to={ROUTES.REGISTER} variant="outline-primary" className="me-2">
            Add User
          </Button>
          <Button as={Link} to={ROUTES.REGISTER_ADMIN} variant="outline-danger">
            Add Admin
          </Button>
        </div>
      </div>
      
      <UserList users={users} />
    </Layout>
  );
};

export default UsersPage;