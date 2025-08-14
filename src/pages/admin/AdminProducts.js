import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Alert, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import { useProduct } from '../../contexts/ProductContext';

const AdminProducts = () => {
  const { refreshData: refreshGlobalData } = useProduct();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nameProduct: '',
    descriptionProduct: '',
    priceProduct: '',
    brand: '',
    quantity: '',
    imageUrl: '',
    categoryId: ''
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Không thể tải dữ liệu. Vui lòng thử lại.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nameProduct: product.nameProduct || '',
        descriptionProduct: product.descriptionProduct || '',
        priceProduct: product.priceProduct || '',
        quantity: product.quantity || '',
        brand: product.brand || '',
        categoryId: product.category?.id || '',
        imageUrl: product.imageUrl || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nameProduct: '',
        descriptionProduct: '',
        priceProduct: '',
        quantity: '',
        brand: '',
        categoryId: '',
        imageUrl: ''
      });
    }
    setFormError('');
    setFormSuccess('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormError('');
    setFormSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      const productData = {
        nameProduct: formData.nameProduct,
        descriptionProduct: formData.descriptionProduct,
        priceProduct: parseFloat(formData.priceProduct),
        quantity: parseInt(formData.quantity),
        brand: formData.brand,
        imageUrl: formData.imageUrl,
        category: formData.categoryId ? {
          id: parseInt(formData.categoryId)
        } : null
      };

      let updatedProduct;
      if (editingProduct) {
        // Update product
        updatedProduct = await productService.updateProduct(editingProduct.id, productData);
        setFormSuccess('Sản phẩm đã được cập nhật thành công!');
      } else {
        // Create new product
        updatedProduct = await productService.createProduct(productData);
        setFormSuccess('Sản phẩm đã được tạo thành công!');
      }

      setTimeout(async () => {
        handleCloseModal();
        await Promise.all([
          fetchData(),
          refreshGlobalData()
        ]);
      }, 1500);
    } catch (err) {
      setFormError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      console.error('Error saving product:', err);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        // Tìm category chứa sản phẩm này
        const product = products.find(p => p.id === productId);
        if (product && product.category) {
          const category = categories.find(c => c.id === product.category.id);
          if (category) {
            // Xóa productId khỏi category
            const updatedCategory = {
              ...category,
              productIds: (category.productIds || []).filter(id => id !== productId)
            };
            await categoryService.updateCategory(category.id, updatedCategory);
          }
        }

        // Xóa sản phẩm
        await productService.deleteProduct(productId);
        setError('');
        await Promise.all([
          fetchData(),
          refreshGlobalData()
        ]);
      } catch (err) {
        setError(err.message || 'Không thể xóa sản phẩm. Vui lòng thử lại.');
        console.error('Error deleting product:', err);
      }
    }
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
          <h1>Quản lý Sản phẩm</h1>
          <div>
            <Button as={Link} to="/admin" variant="outline-secondary" className="me-2">
              Quay lại Dashboard
            </Button>
            <Button variant="primary" onClick={() => handleShowModal()}>
              Thêm Sản phẩm
            </Button>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th>Kho</th>
                <th>Category</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.nameProduct}</td>
                  <td>{formatPrice(product.priceProduct)}</td>
                  <td>
                    <Badge bg={product.quantity > 0 ? 'success' : 'danger'}>
                      {product.quantity}
                    </Badge>
                  </td>
                  <td>{product.category?.name || 'N/A'}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(product)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Modal for Add/Edit Product */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {editingProduct ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formError && <Alert variant="danger">{formError}</Alert>}
            {formSuccess && <Alert variant="success">{formSuccess}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Tên sản phẩm</Form.Label>
                <Form.Control
                  type="text"
                  name="nameProduct"
                  value={formData.nameProduct}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="descriptionProduct"
                  value={formData.descriptionProduct}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Thương hiệu</Form.Label>
                <Form.Control
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Giá</Form.Label>
                <Form.Control
                  type="number"
                  name="priceProduct"
                  value={formData.priceProduct}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Số lượng kho</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Chọn category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>URL hình ảnh</Form.Label>
                <Form.Control
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={handleCloseModal}>
                  Hủy
                </Button>
                <Button variant="primary" type="submit">
                  {editingProduct ? 'Cập nhật' : 'Tạo'}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </Layout>
  );
};

export default AdminProducts;