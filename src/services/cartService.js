import api from './api';
import localCartService from './localCartService';
import authService from './authService';

// Khởi tạo cart service với cấu trúc giống local storage
const cartService = {
  // Lấy giỏ hàng
  getCart: async () => {
    const isAuthenticated = authService.isAuthenticated();
    
    if (isAuthenticated) {
      try {
        const response = await api.get('/api/users/cart');
        return response.data || { items: [] };
      } catch (error) {
        console.error('Error fetching cart:', error);
        return { items: [] };
      }
    } else {
      return Promise.resolve(localCartService.getCart());
    }
  },

  // Thêm sản phẩm vào giỏ hàng
  addToCart: async (product, quantity = 1) => {
    const isAuthenticated = authService.isAuthenticated();
    
    if (isAuthenticated) {
      try {
        // Lấy giỏ hàng hiện tại
        const currentCart = await cartService.getCart();
        
        // Tạo cart item mới
        const cartItem = {
          productId: product.id,
          quantity: quantity,
          name: product.nameProduct,
          price: product.priceProduct,
          imageUrl: product.imageUrl
        };

        // Thêm hoặc cập nhật item trong giỏ hàng
        const updatedItems = [...currentCart.items];
        const existingItemIndex = updatedItems.findIndex(item => item.productId === product.id);
        
        if (existingItemIndex > -1) {
          updatedItems[existingItemIndex].quantity += quantity;
        } else {
          updatedItems.push(cartItem);
        }

        const updatedCart = { items: updatedItems };
        const response = await api.post('/api/users/cart', updatedCart);
        console.log('Server response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error adding to cart:', error);
        
        // Log detailed error information
        if (error.response) {
          console.error('Server Error Details:', {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            headers: error.response.headers
          });
        }

        // Xử lý các loại lỗi
        if (error.response) {
          switch (error.response.status) {
            case 400:
              throw new Error('Sản phẩm không hợp lệ hoặc không đủ hàng trong kho.');
            case 401:
              throw new Error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.');
            case 403:
              throw new Error('Bạn không có quyền thực hiện chức năng này.');
            case 404:
              throw new Error('Sản phẩm không tồn tại.');
            case 500:
              console.error('Server Error Stack:', error.response.data);
              throw new Error('Lỗi server. Vui lòng thử lại sau hoặc liên hệ admin.');
            default:
              throw new Error(`Lỗi ${error.response.status}: ${error.response.data?.message || 'Không thể thêm sản phẩm vào giỏ hàng.'}`);
          }
        }
        
        // Nếu không có response từ server
        if (error.request) {
          console.error('No response received:', error.request);
          throw new Error('Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng.');
        }
        
        // Lỗi khác
        throw new Error('Lỗi không xác định: ' + error.message);
      }
    } else {
      return Promise.resolve(localCartService.addToCart(product, quantity));
    }
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart: async (product) => {
    const isAuthenticated = authService.isAuthenticated();
    
    if (isAuthenticated) {
      try {
        // Lấy giỏ hàng hiện tại
        const currentCart = await cartService.getCart();
        
        // Xóa item khỏi giỏ hàng
        const updatedItems = currentCart.items.filter(item => item.productId !== product.id);
        const updatedCart = { items: updatedItems };
        
        // Cập nhật giỏ hàng trên server
        const response = await api.post('/api/users/cart', updatedCart);
        return response.data;
      } catch (error) {
        console.error('Error removing from cart:', error);
        throw new Error('Không thể xóa sản phẩm khỏi giỏ hàng. Vui lòng thử lại.');
      }
    } else {
      return Promise.resolve(localCartService.removeItem(product.id));
    }
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async () => {
    const isAuthenticated = authService.isAuthenticated();
    
    if (isAuthenticated) {
      try {
        // Gửi giỏ hàng rỗng lên server
        const emptyCart = { items: [] };
        const response = await api.post('/api/users/cart', emptyCart);
        return response.data;
      } catch (error) {
        console.error('Error clearing cart:', error);
        throw new Error('Không thể xóa giỏ hàng. Vui lòng thử lại.');
      }
    } else {
      return Promise.resolve(localCartService.clearCart());
    }
  },

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateCartItem: async (product, quantity) => {
    const isAuthenticated = authService.isAuthenticated();
    
    if (isAuthenticated) {
      try {
        // Lấy giỏ hàng hiện tại
        const currentCart = await cartService.getCart();
        
        // Cập nhật số lượng của item
        const updatedItems = currentCart.items.map(item => {
          if (item.productId === product.id) {
            return { ...item, quantity: quantity };
          }
          return item;
        });

        // Cập nhật giỏ hàng trên server
        const updatedCart = { items: updatedItems };
        const response = await api.post('/api/users/cart', updatedCart);
        return response.data;
      } catch (error) {
        console.error('Error updating cart item:', error);
        throw new Error('Không thể cập nhật giỏ hàng. Vui lòng thử lại.');
      }
    } else {
      return Promise.resolve(localCartService.updateQuantity(product.id, quantity));
    }
  },

  // Đồng bộ giỏ hàng local lên server sau khi đăng nhập
  syncCartOnLogin: async () => {
    const localCart = localCartService.getCart();
    if (localCart.items.length > 0) {
      try {
        // Thêm từng sản phẩm trong giỏ hàng local vào giỏ hàng server
        await Promise.all(localCart.items.map(item => 
          cartService.addToCart({
            id: item.productId,
            nameProduct: item.name,
            priceProduct: item.price,
            imageUrl: item.imageUrl
          }, item.quantity)
        ));
        
        // Xóa giỏ hàng local sau khi đồng bộ thành công
        localCartService.clearCart();
      } catch (error) {
        console.error('Error syncing cart:', error);
        throw new Error('Không thể đồng bộ giỏ hàng. Vui lòng thử lại.');
      }
    }
  }
};

// Export cartService as default
export default cartService;