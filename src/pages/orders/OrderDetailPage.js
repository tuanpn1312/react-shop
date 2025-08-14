import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { format } from 'date-fns';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import orderService from '../../services/orderService';
import { ROUTES } from '../../utils/constants';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await orderService.getOrderById(id);
        setOrder(data);
      } catch (err) {
        setError('Failed to load order. Please try again.');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <Layout><Loading /></Layout>;
  if (error) return <Layout><ErrorMessage message={error} /></Layout>;
  if (!order) return <Layout><ErrorMessage message="Order not found" /></Layout>;

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Order Details</h1>
        <Button as={Link} to={ROUTES.ORDERS} variant="outline-primary">
          Back to Orders
        </Button>
      </div>

      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Order #{order.id}</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h6>Customer Information</h6>
              <p><strong>Name:</strong> {order.customerName}</p>
              <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
            </Col>
            <Col md={6}>
              <h6>Order Information</h6>
              <p>
                <strong>Date:</strong> {order.orderDate ? (
                  format(new Date(order.orderDate), 'MMMM dd, yyyy')
                ) : (
                  'N/A'
                )}
              </p>
              <p><strong>Quantity:</strong> {order.quantity}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {order.product && (
        <Card>
          <Card.Header>
            <h5 className="mb-0">Product Information</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={8}>
                <h4>{order.product.nameProduct}</h4>
                <h6 className="text-muted">{order.product.brand}</h6>
                <p>{order.product.descriptionProduct}</p>
              </Col>
              <Col md={4} className="text-end">
                <h5 className="text-primary">${order.product.priceProduct}</h5>
                <p><strong>Total:</strong> ${(order.product.priceProduct * order.quantity).toFixed(2)}</p>
                <Button 
                  as={Link} 
                  to={`/products/${order.product.id}`} 
                  variant="outline-secondary"
                  size="sm"
                >
                  View Product
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Layout>
  );
};

export default OrderDetailPage;