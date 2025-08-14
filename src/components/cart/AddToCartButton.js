import React, { useState } from 'react';
import { Button, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { useCart } from '../../contexts/CartContext';

const AddToCartButton = ({ product, quantity = 1, variant = "primary", size = "md", className = "" }) => {
  const { addToCart, loading } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity);
      setToastMessage('Đã thêm sản phẩm vào giỏ hàng!');
      setToastVariant('success');
      setShowToast(true);
    } catch (error) {
      setToastMessage(error.message || 'Không thể thêm sản phẩm vào giỏ hàng');
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  const isOutOfStock = () => {
    const stock = product.quantity || product.stock || 0;
    return stock <= 0;
  };

  return (
    <>
      <Button
        variant={isOutOfStock() ? "secondary" : variant}
        size={size}
        className={className}
        onClick={handleAddToCart}
        disabled={loading || isOutOfStock()}
      >
        {loading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
            Đang thêm...
          </>
        ) : isOutOfStock() ? (
          'Hết hàng'
        ) : (
          'Thêm vào giỏ hàng'
        )}
      </Button>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === 'success' ? 'Thành công' : 'Lỗi'}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default AddToCartButton;