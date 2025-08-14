import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import orderService from '../../services/orderService';

const OrderForm = ({ product, onOrderPlaced }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    shippingAddress: '',
    quantity: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseInt(value, 10) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate form
      if (!formData.customerName || !formData.shippingAddress || formData.quantity < 1) {
        throw new Error('Please fill in all fields with valid values');
      }

      // Check if quantity is available
      if (formData.quantity > product.quantity) {
        throw new Error(`Sorry, only ${product.quantity} items available in stock`);
      }

      // Create order object
      const orderData = {
        customerName: formData.customerName,
        shippingAddress: formData.shippingAddress,
        quantity: formData.quantity,
        productId: product.id,  // Đổi product.id thành productId
        totalPrice: product.priceProduct * formData.quantity  // Thêm totalPrice
      };

      console.log('Sending order data:', orderData);  // Log data trước khi gửi
      
      // Submit order
      const response = await orderService.createOrder(orderData);
      console.log('Order response:', response);  // Log response
      
      setSuccess(true);
      setFormData({
        customerName: '',
        shippingAddress: '',
        quantity: 1
      });
      
      if (onOrderPlaced) {
        onOrderPlaced(response);
      }
    } catch (err) {
      console.error('Order error:', err);  // Log error chi tiết
      if (err.response) {
        // Log response error từ server
        console.error('Server error:', err.response.data);
        setError(err.response.data || 'Failed to place order. Please try again.');
      } else if (err.request) {
        // Log network error
        console.error('Network error:', err.request);
        setError('Network error. Please check your connection.');
      } else {
        // Log các lỗi khác
        console.error('Error:', err.message);
        setError(err.message || 'Failed to place order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="mb-4 text-center">Place Your Order</h4>
      
      {error && <Alert variant="danger" className="border-0 rounded-3">{error}</Alert>}
      {success && <Alert variant="success" className="border-0 rounded-3">Order placed successfully!</Alert>}
      
      <Form onSubmit={handleSubmit} className="order-form">
        <Form.Group className="mb-3">
          <Form.Label>Your Name</Form.Label>
          <Form.Control
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="form-control-lg"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Shipping Address</Form.Label>
          <Form.Control
            as="textarea"
            name="shippingAddress"
            value={formData.shippingAddress}
            onChange={handleChange}
            placeholder="Enter your shipping address"
            rows={3}
            className="form-control-lg"
            required
          />
        </Form.Group>

        <div className="row mb-3">
          <div className="col-md-6">
            <Form.Group>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                max={product.quantity}
                className="form-control-lg"
                required
              />
              <Form.Text className="text-muted">
                {product.quantity} available in stock
              </Form.Text>
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group>
              <Form.Label>Total Price</Form.Label>
              <Form.Control
                type="text"
                value={`$${(product.priceProduct * formData.quantity).toFixed(2)}`}
                className="form-control-lg fw-bold text-primary"
                readOnly
              />
            </Form.Group>
          </div>
        </div>

        <div className="d-grid gap-2 mt-4">
          <Button 
            variant="primary" 
            type="submit" 
            size="lg"
            className="order-button"
            disabled={loading || product.quantity < 1}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default OrderForm;