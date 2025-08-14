import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import categoryService from '../../services/categoryService';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories. Please try again.');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || '',
        description: category.description || ''
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: ''
      });
    }
    setFormError('');
    setFormSuccess('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
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
      if (editingCategory) {
        // Update category
        await categoryService.updateCategory(editingCategory.id, formData);
        setFormSuccess('Category đã được cập nhật thành công!');
      } else {
        // Create new category
        await categoryService.createCategory(formData);
        setFormSuccess('Category đã được tạo thành công!');
      }

      setTimeout(() => {
        handleCloseModal();
        fetchCategories();
      }, 1500);
    } catch (err) {
      setFormError('Có lỗi xảy ra. Vui lòng thử lại.');
      console.error('Error saving category:', err);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa category này?')) {
      try {
        await categoryService.deleteCategory(categoryId);
        setError('');
        fetchCategories();
      } catch (err) {
        setError('Không thể xóa category. Vui lòng thử lại.');
        console.error('Error deleting category:', err);
      }
    }
  };

  if (loading) return <Layout><Loading /></Layout>;

  return (
    <Layout>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Quản lý Categories</h1>
          <div>
            <Button as={Link} to="/admin" variant="outline-secondary" className="me-2">
              Quay lại Dashboard
            </Button>
            <Button variant="primary" onClick={() => handleShowModal()}>
              Thêm Category
            </Button>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Category</th>
                <th>Mô tả</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>{category.description || 'Không có mô tả'}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(category)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Modal for Add/Edit Category */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingCategory ? 'Sửa Category' : 'Thêm Category'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formError && <Alert variant="danger">{formError}</Alert>}
            {formSuccess && <Alert variant="success">{formSuccess}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Tên Category</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Ví dụ: Áo, Quần, Giày..."
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Mô tả về category này..."
                />
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={handleCloseModal}>
                  Hủy
                </Button>
                <Button variant="primary" type="submit">
                  {editingCategory ? 'Cập nhật' : 'Tạo'}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </Layout>
  );
};

export default AdminCategories;