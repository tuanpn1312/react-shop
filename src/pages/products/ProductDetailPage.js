import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Badge, Button } from 'react-bootstrap';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import OrderForm from '../../components/orders/OrderForm';
import AddToCartButton from '../../components/cart/AddToCartButton';
import productService from '../../services/productService';
import authService from '../../services/authService';
import { ROUTES } from '../../utils/constants';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Không thể tải thông tin sản phẩm. Vui lòng thử lại.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleOrderPlaced = () => {
    // Refresh product data to update stock quantity
    const fetchUpdatedProduct = async () => {
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Error refreshing product data:', err);
        setError(err.message || 'Không thể cập nhật thông tin sản phẩm.');
      }
    };

    fetchUpdatedProduct();
  };

  const handleLoginRedirect = () => {
    navigate(ROUTES.LOGIN, { state: { from: `/products/${id}` } });
  };

  if (loading) return <Layout><Loading /></Layout>;
  if (error) return <Layout><ErrorMessage message={error} /></Layout>;
  if (!product) return <Layout><ErrorMessage message="Product not found" /></Layout>;

  return (
    <Layout>
      <div className="mb-4">
        <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-4">
          <i className="bi bi-arrow-left"></i> Back to Products
        </Button>
      </div>
      
      <Row>
        <Col md={8}>
          <Card className="product-detail-card mb-4">
            <Card.Body className="p-4">
              <span className="product-category">{product.category?.name || 'Uncategorized'}</span>
              <h1 className="mb-2">{product.nameProduct}</h1>
              <h5 className="text-muted mb-4">{product.brand}</h5>
              
              <div className="d-flex align-items-center mb-4">
                <h3 className="product-price me-3">${product.priceProduct}</h3>
                <Badge bg={product.quantity > 0 ? 'success' : 'danger'} className="stock-badge me-2">
                  {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </Badge>
                {product.quantity > 0 && (
                  <span className="text-muted">{product.quantity} available</span>
                )}
              </div>
              
              <div className="mb-4">
                <h5 className="detail-section-title">Description</h5>
                <p className="detail-text">{product.descriptionProduct || 'No description available.'}</p>
              </div>

              <div className="mb-4">
                <AddToCartButton 
                  product={product} 
                  quantity={1} 
                  variant="primary" 
                  size="lg" 
                  className="me-3"
                />
              </div>
              
          
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          {isAuthenticated && (
            <div className="order-form-container">
              <OrderForm product={product} onOrderPlaced={handleOrderPlaced} />
            </div>
          )}
        </Col>
      </Row>
    </Layout>
  );
};

export default ProductDetailPage;