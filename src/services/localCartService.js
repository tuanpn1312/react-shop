const LOCAL_CART_KEY = 'react_shop_cart';

const localCartService = {
  // Lấy giỏ hàng từ localStorage
  getLocalCart: () => {
    try {
      const cart = localStorage.getItem(LOCAL_CART_KEY);
      return cart ? JSON.parse(cart) : { items: [], totalAmount: 0 };
    } catch (error) {
      console.error('Error getting local cart:', error);
      return { items: [], totalAmount: 0 };
    }
  },

  // Lưu giỏ hàng vào localStorage
  saveLocalCart: (cart) => {
    try {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving local cart:', error);
    }
  },

  // Thêm sản phẩm vào giỏ hàng local
  addToLocalCart: (product, quantity = 1) => {
    try {
      const cart = localCartService.getLocalCart();
      const existingItemIndex = cart.items.findIndex(item => item.product.id === product.id);

      if (existingItemIndex >= 0) {
        // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Nếu sản phẩm chưa có, thêm mới
        cart.items.push({
          id: Date.now(), // Tạo ID tạm thời
          product: product,
          quantity: quantity
        });
      }

      // Tính lại tổng tiền
      cart.totalAmount = cart.items.reduce((total, item) => {
        const price = item.product.priceProduct || item.product.price || 0;
        return total + (price * item.quantity);
      }, 0);

      localCartService.saveLocalCart(cart);
      return cart;
    } catch (error) {
      console.error('Error adding to local cart:', error);
      throw new Error('Không thể thêm sản phẩm vào giỏ hàng.');
    }
  },

  // Xóa sản phẩm khỏi giỏ hàng local
  removeFromLocalCart: (itemId) => {
    try {
      const cart = localCartService.getLocalCart();
      cart.items = cart.items.filter(item => item.id !== itemId);

      // Tính lại tổng tiền
      cart.totalAmount = cart.items.reduce((total, item) => {
        const price = item.product.priceProduct || item.product.price || 0;
        return total + (price * item.quantity);
      }, 0);

      localCartService.saveLocalCart(cart);
      return cart;
    } catch (error) {
      console.error('Error removing from local cart:', error);
      throw new Error('Không thể xóa sản phẩm khỏi giỏ hàng.');
    }
  },

  // Cập nhật số lượng sản phẩm trong giỏ hàng local
  updateLocalCartItem: (itemId, quantity) => {
    try {
      const cart = localCartService.getLocalCart();
      const itemIndex = cart.items.findIndex(item => item.id === itemId);

      if (itemIndex >= 0) {
        if (quantity <= 0) {
          // Nếu số lượng <= 0, xóa sản phẩm
          cart.items.splice(itemIndex, 1);
        } else {
          cart.items[itemIndex].quantity = quantity;
        }

        // Tính lại tổng tiền
        cart.totalAmount = cart.items.reduce((total, item) => {
          const price = item.product.priceProduct || item.product.price || 0;
          return total + (price * item.quantity);
        }, 0);

        localCartService.saveLocalCart(cart);
      }

      return cart;
    } catch (error) {
      console.error('Error updating local cart item:', error);
      throw new Error('Không thể cập nhật giỏ hàng.');
    }
  },

  // Xóa toàn bộ giỏ hàng local
  clearLocalCart: () => {
    try {
      localStorage.removeItem(LOCAL_CART_KEY);
      return { items: [], totalAmount: 0 };
    } catch (error) {
      console.error('Error clearing local cart:', error);
      throw new Error('Không thể xóa giỏ hàng.');
    }
  },

  // Đồng bộ giỏ hàng local với server khi user đăng nhập
  syncCartWithServer: async (cartService) => {
    try {
      const localCart = localCartService.getLocalCart();
      
      if (localCart.items.length > 0) {
        // Thêm từng sản phẩm trong giỏ hàng local vào server
        for (const item of localCart.items) {
          await cartService.addToCart(item.product.id, item.quantity);
        }
        
        // Xóa giỏ hàng local sau khi đồng bộ
        localCartService.clearLocalCart();
      }
    } catch (error) {
      console.error('Error syncing cart with server:', error);
      throw new Error('Không thể đồng bộ giỏ hàng. Vui lòng thử lại.');
    }
  },

  // Lấy số lượng sản phẩm trong giỏ hàng
  getCartItemCount: () => {
    const cart = localCartService.getLocalCart();
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }
};

export default localCartService;