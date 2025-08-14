import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { ROUTES } from '../../utils/constants';

const AdminDashboard = () => {
  return (
    <Layout>
      <Container>
        <h1 className="mb-4">Admin Dashboard</h1>
        <p className="lead mb-4">Quản lý hệ thống React Shop</p>
        
        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100 admin-card">
              <Card.Body className="text-center">
                <div className="admin-icon mb-3">
                  <i className="fas fa-users fa-3x text-primary"></i>
                </div>
                <Card.Title>Quản lý Users</Card.Title>
                <Card.Text>
                  Xem, thêm, sửa, xóa người dùng và admin
                </Card.Text>
                <Button as={Link} to={ROUTES.USERS} variant="primary">
                  Quản lý Users
                </Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card className="h-100 admin-card">
              <Card.Body className="text-center">
                <div className="admin-icon mb-3">
                  <i className="fas fa-box fa-3x text-success"></i>
                </div>
                <Card.Title>Quản lý Sản phẩm</Card.Title>
                <Card.Text>
                  Thêm, sửa, xóa sản phẩm và quản lý kho
                </Card.Text>
                <Button as={Link} to="/admin/products" variant="success">
                  Quản lý Sản phẩm
                </Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card className="h-100 admin-card">
              <Card.Body className="text-center">
                <div className="admin-icon mb-3">
                  <i className="fas fa-tags fa-3x text-warning"></i>
                </div>
                <Card.Title>Quản lý Categories</Card.Title>
                <Card.Text>
                  Thêm, sửa, xóa danh mục sản phẩm
                </Card.Text>
                <Button as={Link} to="/admin/categories" variant="warning">
                  Quản lý Categories
                </Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card className="h-100 admin-card">
              <Card.Body className="text-center">
                <div className="admin-icon mb-3">
                  <i className="fas fa-shopping-cart fa-3x text-info"></i>
                </div>
                <Card.Title>Quản lý Orders</Card.Title>
                <Card.Text>
                  Xem và quản lý đơn hàng của khách hàng
                </Card.Text>
                <Button as={Link} to={ROUTES.ORDERS} variant="info">
                  Quản lý Orders
                </Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card className="h-100 admin-card">
              <Card.Body className="text-center">
                <div className="admin-icon mb-3">
                  <i className="fas fa-user-plus fa-3x text-danger"></i>
                </div>
                <Card.Title>Thêm Admin</Card.Title>
                <Card.Text>
                  Tạo tài khoản admin mới cho hệ thống
                </Card.Text>
                <Button as={Link} to={ROUTES.REGISTER_ADMIN} variant="danger">
                  Thêm Admin
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default AdminDashboard;