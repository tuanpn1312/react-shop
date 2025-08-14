import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import authService from '../services/authService';

const CartDebug = () => {
  const { addToCart, cart, loading, error } = useCart();
  const [debugInfo, setDebugInfo] = useState('');

  const testProduct = {
    id: 1,
    nameProduct: "Test Product",
    priceProduct: 100000,
    imageUrl: "https://via.placeholder.com/150"
  };

  const handleTestAddToCart = async () => {
    try {
      setDebugInfo('Bắt đầu test thêm vào giỏ hàng...\n');
      
      // Kiểm tra authentication
      const isAuth = authService.isAuthenticated();
      const user = authService.getCurrentUser();
      const token = localStorage.getItem('token');
      
      setDebugInfo(prev => prev + `Authentication: ${isAuth}\n`);
      setDebugInfo(prev => prev + `User: ${JSON.stringify(user)}\n`);
      setDebugInfo(prev => prev + `Token exists: ${!!token}\n`);
      setDebugInfo(prev => prev + `Token: ${token ? token.substring(0, 20) + '...' : 'null'}\n`);
      
      // Test thêm vào giỏ hàng
      await addToCart(testProduct, 1);
      setDebugInfo(prev => prev + 'Thêm vào giỏ hàng thành công!\n');
      
    } catch (err) {
      setDebugInfo(prev => prev + `Lỗi: ${err.message}\n`);
      console.error('Cart debug error:', err);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Cart Debug Tool</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Current Cart:</strong>
        <pre>{JSON.stringify(cart, null, 2)}</pre>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Error:</strong> {error || 'None'}
      </div>
      
      <button onClick={handleTestAddToCart} disabled={loading}>
        Test Add to Cart
      </button>
      
      <div style={{ marginTop: '10px' }}>
        <strong>Debug Info:</strong>
        <pre style={{ background: '#f5f5f5', padding: '10px', whiteSpace: 'pre-wrap' }}>
          {debugInfo}
        </pre>
      </div>
    </div>
  );
};

export default CartDebug;