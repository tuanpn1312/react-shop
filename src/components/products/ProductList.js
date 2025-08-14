import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';

const ProductList = ({ products }) => {
  if (!products || products.length === 0) {
    return <p className="text-center my-4">No products found.</p>;
  }

  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {products.map((product) => (
        <Col key={product.id}>
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  );
};

export default ProductList;