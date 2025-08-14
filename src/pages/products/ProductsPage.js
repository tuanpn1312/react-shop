import React, { useState, useEffect } from 'react';
import { Row, Col, Form, InputGroup } from 'react-bootstrap';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import ProductList from '../../components/products/ProductList';
import CategoryList from '../../components/products/CategoryList';
import { useProduct } from '../../contexts/ProductContext';

const ProductsPage = () => {
  const { categories, products, loading, error, getProductsByCategory } = useProduct();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load initial products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        const initialProducts = await getProductsByCategory(null);
        setFilteredProducts(initialProducts);
      } catch (err) {
        console.error('Error loading initial products:', err);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, [getProductsByCategory]);

  // Filter products by search term
  useEffect(() => {
    const applySearch = () => {
      const filtered = products.filter(product => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase().trim();
        return (
          product.nameProduct?.toLowerCase().includes(term) ||
          product.brand?.toLowerCase().includes(term) ||
          product.descriptionProduct?.toLowerCase().includes(term)
        );
      });
      setFilteredProducts(filtered);
    };
    applySearch();
  }, [searchTerm, products]);

  const handleCategorySelect = async (categoryId) => {
    try {
      setSelectedCategory(categoryId);
      setLoadingProducts(true);
      const products = await getProductsByCategory(categoryId);
      setFilteredProducts(products);
    } catch (err) {
      console.error('Error selecting category:', err);
      setFilteredProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) return <Layout><Loading /></Layout>;
  if (error) return <Layout><ErrorMessage message={error} /></Layout>;

  return (
    <Layout>
      <h1 className="mb-4">Products</h1>
      
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>
        </Col>
      </Row>

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
              ? `${categories.find(c => c.id === selectedCategory)?.name || 'Category'}` 
              : 'All Products'}
            {searchTerm && ` - Search: "${searchTerm}"`}
          </h2>
          {loadingProducts ? <Loading /> : <ProductList products={filteredProducts} />}
        </Col>
      </Row>
    </Layout>
  );
};

export default ProductsPage;