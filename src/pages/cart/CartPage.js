import React from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import { useCart } from '../../contexts/CartContext';
import authService from '../../services/authService';
import { ROUTES } from '../../utils/constants';

const CartPage = () => {
  const { cart, loading, error, removeFromCart, updateCartItem, clearCart } = useCart();
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
    } else {
      await updateCartItem(itemId, newQuantity);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      await removeFromCart(itemId);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    // Cho phép checkout cho cả người dùng đã đăng nhập và chưa đăng nhập
    navigate('/checkout');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) return <Layout><Loading /></Layout>;

  return (
    <Layout>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Giỏ hàng</h1>
          <Button as={Link} to="/products" variant="outline-primary">
            Tiếp tục mua sắm
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {cart.items.length === 0 ? (
          <Card className="text-center p-5">
            <Card.Body>
              <h3>Giỏ hàng trống</h3>
              <p className="text-muted mb-4">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
              <Button as={Link} to="/products" variant="primary">
                Bắt đầu mua sắm
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            <Col lg={8}>
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Sản phẩm trong giỏ hàng</h5>
                  <Button variant="outline-danger" size="sm" onClick={handleClearCart}>
                    Xóa tất cả
                  </Button>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table responsive className="mb-0">
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Tổng</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.items.map((item) => {
                        const product = item.product;
                        const price = product.priceProduct || product.price || 0;
                        const productName = product.nameProduct || product.name || 'Sản phẩm';
                        const productImage = product.image || product.imageUrl || '/placeholder-image.jpg';

                        return (
                          <tr key={item.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={productImage}
                                  alt={productName}
                                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                  className="me-3 rounded"
                                />
                                <div>
                                  <h6 className="mb-1">{productName}</h6>
                                  <small className="text-muted">{product.brand}</small>
                                </div>
                              </div>
                            </td>
                            <td className="align-middle">
                              {formatPrice(price)}
                            </td>
                            <td className="align-middle">
                              <div className="d-flex align-items-center">
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                >
                                  -
                                </Button>
                                <span className="mx-3">{item.quantity}</span>
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                >
                                  +
                                </Button>
                              </div>
                            </td>
                            <td className="align-middle">
                              <strong>{formatPrice(price * item.quantity)}</strong>
                            </td>
                            <td className="align-middle">
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                Xóa
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Tóm tắt đơn hàng</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Số lượng sản phẩm:</span>
                    <Badge bg="primary">{cart.items.reduce((total, item) => total + item.quantity, 0)}</Badge>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(cart.totalAmount)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Phí vận chuyển:</span>
                    <span className="text-success">Miễn phí</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-4">
                    <strong>Tổng cộng:</strong>
                    <strong className="text-primary">{formatPrice(cart.totalAmount)}</strong>
                  </div>

                  {!isAuthenticated && (
                    <Alert variant="info" className="mb-3">
                      <small>
                        Bạn có thể đặt hàng mà không cần đăng nhập. 
                        Tuy nhiên, việc đăng nhập sẽ giúp bạn theo dõi đơn hàng dễ dàng hơn.
                      </small>
                    </Alert>
                  )}

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-100"
                    onClick={handleCheckout}
                  >
                    Tiến hành thanh toán
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </Layout>
  );
};

export default CartPage;