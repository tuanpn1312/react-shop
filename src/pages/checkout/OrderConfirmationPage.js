import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button, Table, Badge } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import orderService from '../../services/orderService';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const orderData = await orderService.getOrderById(orderId);
      
      // Nếu backend không trả về đầy đủ thông tin, lấy từ localStorage
      const additionalInfo = localStorage.getItem('lastOrderInfo');
      if (additionalInfo) {
        const parsedInfo = JSON.parse(additionalInfo);
        // Merge thông tin từ backend và localStorage
        const mergedOrder = {
          ...orderData,
          email: orderData.email || parsedInfo.email,
          phone: orderData.phone || parsedInfo.phone,
          notes: orderData.notes || parsedInfo.notes,
          totalAmount: orderData.totalAmount || parsedInfo.totalAmount,
          orderItems: orderData.orderItems && orderData.orderItems.length > 0 
            ? orderData.orderItems 
            : parsedInfo.orderItems
        };
        setOrder(mergedOrder);
        // Xóa thông tin tạm thời sau khi sử dụng
        localStorage.removeItem('lastOrderInfo');
      } else {
        setOrder(orderData);
      }
    } catch (err) {
      setError('Không thể tải thông tin đơn hàng');
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'PENDING': { variant: 'warning', text: 'Chờ xử lý' },
      'CONFIRMED': { variant: 'info', text: 'Đã xác nhận' },
      'SHIPPING': { variant: 'primary', text: 'Đang giao' },
      'DELIVERED': { variant: 'success', text: 'Đã giao' },
      'CANCELLED': { variant: 'danger', text: 'Đã hủy' }
    };
    
    const statusInfo = statusMap[status] || { variant: 'secondary', text: status };
    return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  if (loading) return <Layout><Loading /></Layout>;

  if (error) {
    return (
      <Layout>
        <Container>
          <Alert variant="danger" className="text-center">
            <h4>Có lỗi xảy ra</h4>
            <p>{error}</p>
            <Button variant="primary" onClick={() => navigate('/products')}>
              Tiếp tục mua sắm
            </Button>
          </Alert>
        </Container>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <Container>
          <Alert variant="warning" className="text-center">
            <h4>Không tìm thấy đơn hàng</h4>
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
      <div className="order-confirmation">
        <Container>
        <div className="text-center mb-4">
          <div className="mb-3">
            <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
          </div>
          <h1 className="text-success">Đặt hàng thành công!</h1>
          <p className="text-muted">Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất có thể.</p>
        </div>

        <Row>
          <Col lg={8} className="mx-auto">
            <Card className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Thông tin đơn hàng</h5>
                {getStatusBadge(order.status)}
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <p><strong>Mã đơn hàng:</strong> #{order.id}</p>
                    <p><strong>Ngày đặt:</strong> {formatDate(order.orderDate)}</p>
                    <p><strong>Tổng tiền:</strong> <span className="text-primary fw-bold">{formatPrice(order.totalAmount)}</span></p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Tên khách hàng:</strong> {order.customerName}</p>
                    <p><strong>Email:</strong> {order.email}</p>
                    <p><strong>Số điện thoại:</strong> {order.phone}</p>
                  </Col>
                </Row>
                
                <hr />
                
                <div>
                  <strong>Địa chỉ giao hàng:</strong>
                  <p className="mb-2">{order.shippingAddress}</p>
                </div>
                
                {order.notes && (
                  <div>
                    <strong>Ghi chú:</strong>
                    <p className="mb-0">{order.notes}</p>
                  </div>
                )}
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Chi tiết sản phẩm</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
                      <th>Tổng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems && order.orderItems.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            {item.product && (
                              <>
                                <img
                                  src={item.product.image || item.product.imageUrl || '/placeholder-image.jpg'}
                                  alt={item.product.nameProduct || item.product.name}
                                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                  className="me-3 rounded"
                                />
                                <div>
                                  <h6 className="mb-1">{item.product.nameProduct || item.product.name}</h6>
                                  <small className="text-muted">{item.product.brand}</small>
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="align-middle">{formatPrice(item.price)}</td>
                        <td className="align-middle">{item.quantity}</td>
                        <td className="align-middle">
                          <strong>{formatPrice(item.price * item.quantity)}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end"><strong>Tổng cộng:</strong></td>
                      <td><strong className="text-primary">{formatPrice(order.totalAmount)}</strong></td>
                    </tr>
                  </tfoot>
                </Table>
              </Card.Body>
            </Card>

            <div className="text-center">
              <Button 
                variant="primary" 
                className="me-3"
                onClick={() => navigate('/products')}
              >
                Tiếp tục mua sắm
              </Button>
              <Button 
                variant="outline-primary"
                onClick={() => window.print()}
              >
                In đơn hàng
              </Button>
            </div>
          </Col>
          </Row>
        </Container>
      </div>
    </Layout>
  );
};

export default OrderConfirmationPage;