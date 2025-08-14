import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const OrderList = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return <p className="text-center my-4">No orders found.</p>;
  }

  return (
    <div className="table-responsive">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customerName}</td>
              <td>{order.product?.nameProduct || 'N/A'}</td>
              <td>{order.quantity}</td>
              <td>
                {order.orderDate ? (
                  format(new Date(order.orderDate), 'MMM dd, yyyy')
                ) : (
                  'N/A'
                )}
              </td>
              <td>
                <Button
                  as={Link}
                  to={`/orders/${order.id}`}
                  variant="info"
                  size="sm"
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderList;