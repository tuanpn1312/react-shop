import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import { useCart } from '../../contexts/CartContext';
import authService from '../../services/authService';
import orderService from '../../services/orderService';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: currentUser?.username || '',
    email: currentUser?.email || '',
    phone: '',
    shippingAddress: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Chuẩn bị dữ liệu đơn hàng theo cấu trúc OrderDTO backend
      const orderData = {
        customerName: formData.customerName,
        shippingAddress: formData.shippingAddress,
        // Lưu thông tin bổ sung trong localStorage để sử dụng sau
        orderItems: cart.items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      };

      // Lưu thông tin bổ sung vào localStorage để hiển thị trong trang xác nhận
      const additionalInfo = {
        email: formData.email,
        phone: formData.phone,
        notes: formData.notes,
        totalAmount: cart.totalAmount,
        orderItems: cart.items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.priceProduct || item.product.price,
          product: item.product
        }))
      };
      localStorage.setItem('lastOrderInfo', JSON.stringify(additionalInfo));

      // Nếu người dùng đã đăng nhập, thêm userId
      if (isAuthenticated && currentUser) {
        orderData.userId = currentUser.id;
      }

      // Tạo đơn hàng
      const order = await orderService.createOrder(orderData);
      
      // Xóa giỏ hàng sau khi đặt hàng thành công
      await clearCart();
      
      toast.success('Đặt hàng thành công!');
      
      // Chuyển đến trang xác nhận đơn hàng
      navigate(`/order-confirmation/${order.id}`);
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi đặt hàng');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <Layout>
        <Container>
          <Alert variant="warning" className="text-center">
            <h4>Giỏ hàng trống</h4>
            <p>Bạn cần thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
            <Button variant="primary" onClick={() => navigate('/products')}>
              Tiếp tục mua sắm
            </Button>
          </Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="checkout-page">
        <Container>
          <h1 className="mb-4">Thanh toán</h1>
        
        <Row>
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Thông tin giao hàng</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Họ và tên *</Form.Label>
                        <Form.Control
                          type="text"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleInputChange}
                          required
                          placeholder="Nhập họ và tên"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="Nhập email"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Số điện thoại *</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập số điện thoại"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Địa chỉ giao hàng *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập địa chỉ giao hàng đầy đủ"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Ghi chú</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)"
                    />
                  </Form.Group>

                  {!isAuthenticated && (
                    <Alert variant="info">
                      <strong>Lưu ý:</strong> Bạn đang đặt hàng với tư cách khách. 
                      Để theo dõi đơn hàng dễ dàng hơn, bạn có thể 
                      <Button variant="link" className="p-0 ms-1" onClick={() => navigate('/login')}>
                        đăng nhập
                      </Button> hoặc 
                      <Button variant="link" className="p-0 ms-1" onClick={() => navigate('/register')}>
                        đăng ký tài khoản
                      </Button>.
                    </Alert>
                  )}

                  <div className="d-flex justify-content-between">
                    <Button variant="outline-secondary" onClick={() => navigate('/cart')}>
                      Quay lại giỏ hàng
                    </Button>
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={loading}
                      className="px-4"
                    >
                      {loading ? <Loading size="sm" /> : 'Đặt hàng'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Đơn hàng của bạn</h5>
              </Card.Header>
              <Card.Body>
                <Table size="sm" className="mb-3">
                  <tbody>
                    {cart.items.map((item) => {
                      const product = item.product;
                      const price = product.priceProduct || product.price || 0;
                      const productName = product.nameProduct || product.name || 'Sản phẩm';

                      return (
                        <tr key={item.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={product.image || product.imageUrl || '/placeholder-image.jpg'}
                                alt={productName}
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                className="me-2 rounded"
                              />
                              <div>
                                <small className="fw-bold">{productName}</small>
                                <br />
                                <small className="text-muted">x{item.quantity}</small>
                              </div>
                            </div>
                          </td>
                          <td className="text-end align-middle">
                            <small>{formatPrice(price * item.quantity)}</small>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>

                <hr />
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(cart.totalAmount)}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Phí vận chuyển:</span>
                  <span className="text-success">Miễn phí</span>
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between">
                  <strong>Tổng cộng:</strong>
                  <strong className="text-primary">{formatPrice(cart.totalAmount)}</strong>
                </div>
              </Card.Body>
            </Card>
          </Col>
          </Row>
        </Container>
      </div>
    </Layout>
  );
};

export default CheckoutPage;