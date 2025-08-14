import React from 'react';
import { Nav, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const CartIcon = () => {
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();

  return (
    <Nav.Link as={Link} to="/cart" className="position-relative">
      <i className="bi bi-cart3"></i>
      <span className="ms-1">Giỏ hàng</span>
      {itemCount > 0 && (
        <Badge 
          bg="danger" 
          pill 
          className="position-absolute top-0 start-100 translate-middle"
          style={{ fontSize: '0.7rem' }}
        >
          {itemCount > 99 ? '99+' : itemCount}
        </Badge>
      )}
    </Nav.Link>
  );
};

export default CartIcon;