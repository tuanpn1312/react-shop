import React, { createContext, useContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';
import localCartService from '../services/localCartService';
import authService from '../services/authService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isAuthenticated = authService.isAuthenticated();

  // Load cart khi component mount
  useEffect(() => {
    loadCart();
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError('');

      if (isAuthenticated) {
        // Nếu đã đăng nhập, lấy giỏ hàng từ server
        const serverCart = await cartService.getCart();
        setCart(serverCart);
      } else {
        // Nếu chưa đăng nhập, lấy giỏ hàng từ localStorage
        const localCart = localCartService.getLocalCart();
        setCart(localCart);
      }
    } catch (err) {
      console.error('Error loading cart:', err);
      if (err.message.includes('Giỏ hàng trống')) {
        setCart({ items: [], totalAmount: 0 });
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);
      setError('');

      if (isAuthenticated) {
        // Thêm vào giỏ hàng server
        await cartService.addToCart(product, quantity);
        await loadCart(); // Reload cart từ server
      } else {
        // Thêm vào giỏ hàng local
        const updatedCart = localCartService.addToLocalCart(product, quantity);
        setCart(updatedCart);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      setError('');

      if (isAuthenticated) {
        // Xóa từ giỏ hàng server
        await cartService.removeFromCart(itemId);
        await loadCart(); // Reload cart từ server
      } else {
        // Xóa từ giỏ hàng local
        const updatedCart = localCartService.removeFromLocalCart(itemId);
        setCart(updatedCart);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      setLoading(true);
      setError('');

      if (isAuthenticated) {
        // Cập nhật giỏ hàng server
        await cartService.updateCartItem(itemId, quantity);
        await loadCart(); // Reload cart từ server
      } else {
        // Cập nhật giỏ hàng local
        const updatedCart = localCartService.updateLocalCartItem(itemId, quantity);
        setCart(updatedCart);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError('');

      if (isAuthenticated) {
        // Xóa giỏ hàng server
        await cartService.clearCart();
      } else {
        // Xóa giỏ hàng local
        localCartService.clearLocalCart();
      }
      
      setCart({ items: [], totalAmount: 0 });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const syncCartOnLogin = async () => {
    try {
      setLoading(true);
      setError('');

      // Đồng bộ giỏ hàng local với server
      await localCartService.syncCartWithServer(cartService);
      
      // Load lại giỏ hàng từ server
      await loadCart();
    } catch (err) {
      setError(err.message);
      console.error('Error syncing cart on login:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCartItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    loadCart,
    syncCartOnLogin,
    getCartItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;