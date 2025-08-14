import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AddToCartButton from '../cart/AddToCartButton';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Xử lý cả hai định dạng dữ liệu (API thật và mock data)
  const productName = product.nameProduct || product.name;
  const productPrice = product.price || product.priceProduct;
  const productDescription = product.description || product.descriptionProduct;
  const productStock = product.stock || product.quantity;
  const productImage = product.imageUrl || product.image;

  return (
    <Card className="h-100 product-card">
      {productImage && (
        <Card.Img 
          variant="top" 
          src={productImage} 
          alt={productName}
          style={{ height: '200px', objectFit: 'cover' }}
        />
      )}
      <div className="product-category-badge">
        {product.category?.name || 'Uncategorized'}
      </div>
      <Card.Body>
        <Card.Title>{productName}</Card.Title>
        <Card.Text>
          {productDescription && productDescription.length > 100
            ? `${productDescription.substring(0, 100)}...`
            : productDescription}
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <h5 className="product-price mb-0">{formatPrice(productPrice)}</h5>
          <Badge bg={productStock > 0 ? 'success' : 'danger'} className="stock-badge">
            {productStock > 0 ? `Còn ${productStock}` : 'Hết hàng'}
          </Badge>
        </div>
      </Card.Body>
      <Card.Footer className="bg-white border-top-0">
        <div className="d-grid gap-2">
          <AddToCartButton 
            product={product} 
            quantity={1} 
            variant="primary" 
            size="sm" 
            className="mb-2"
          />
          <Button
            as={Link}
            to={`/products/${product.id}`}
            variant="outline-primary"
            className="product-btn"
          >
            Xem chi tiết
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default ProductCard;