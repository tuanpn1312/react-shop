import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import ProductList from '../../components/products/ProductList';
import CategoryList from '../../components/products/CategoryList';
import { useProduct } from '../../contexts/ProductContext';

const HomePage = () => {
  const { categories, loading, error, getProductsByCategory } = useProduct();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Load initial products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        const products = await getProductsByCategory(null);
        setFilteredProducts(products);
      } catch (err) {
        console.error('Error loading initial products:', err);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, [getProductsByCategory]);

  const handleCategorySelect = async (categoryId) => {
    try {
      setSelectedCategory(categoryId);
      setLoadingProducts(true);
      const products = await getProductsByCategory(categoryId);
      setFilteredProducts(products);
    } catch (err) {
      console.error('Error selecting category:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  if (loading) return <Layout><Loading /></Layout>;
  if (error) return <Layout><ErrorMessage message={error} /></Layout>;

  return (
    <Layout>
      <div className="hero-section mb-5">
        <h1>Welcome to React Shop</h1>
        <p className="lead">Discover quality products at competitive prices</p>
        <Link to="/products" className="btn btn-light btn-lg">Browse All Products</Link>
      </div>

      <Row>
        <Col md={3}>
          <CategoryList 
            categories={categories} 
            activeCategory={selectedCategory} 
            onSelectCategory={handleCategorySelect} 
          />
        </Col>
        <Col md={9}>
          <h2 className="mb-4">
            {selectedCategory 
              ? `Products in ${categories.find(c => c.id === selectedCategory)?.name || 'Category'}` 
              : 'All Products'}
          </h2>
          <ProductList products={filteredProducts} />
        </Col>
      </Row>
    </Layout>
  );
};

export default HomePage;