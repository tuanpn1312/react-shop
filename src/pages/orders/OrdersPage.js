import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import OrderList from '../../components/orders/OrderList';
import orderService from '../../services/orderService';
import authService from '../../services/authService';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isAdmin = authService.isAdmin();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getAllOrders();
        setOrders(data);
      } catch (err) {
        setError('Failed to load orders. Please try again.');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <Layout><Loading /></Layout>;
  if (error) return <Layout><ErrorMessage message={error} /></Layout>;

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{isAdmin ? 'All Orders' : 'My Orders'}</h1>
      </div>
      
      <OrderList orders={orders} />
    </Layout>
  );
};

export default OrdersPage;