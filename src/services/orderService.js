import api from './api';

const orderService = {
  createOrder: async (orderData) => {
    try {
      // Validate required fields
      if (!orderData.customerName || !orderData.shippingAddress) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
      }

      if (!orderData.orderItems || orderData.orderItems.length === 0) {
        throw new Error('Đơn hàng phải có ít nhất một sản phẩm');
      }

      // Chuẩn bị dữ liệu theo cấu trúc OrderDTO backend
      const backendOrderData = {
        customerName: orderData.customerName,
        shippingAddress: orderData.shippingAddress,
        orderDate: new Date().toISOString(),
        items: orderData.orderItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
          // Không gửi price vì OrderItemDTO không có trường này
        }))
      };

      // Thêm userId nếu có (cho user đã đăng nhập)
      if (orderData.userId) {
        backendOrderData.userId = orderData.userId;
      }

      console.log('Sending order data to backend:', backendOrderData);
      const response = await api.post('/api/orders', backendOrderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      if (error.response) {
        // Server trả về lỗi
        const errorMessage = error.response.data?.message || error.response.data || 'Không thể tạo đơn hàng';
        throw new Error(errorMessage);
      } else if (error.request) {
        // Không nhận được response
        throw new Error('Không thể kết nối đến server');
      } else {
        // Lỗi khác
        throw new Error(error.message || 'Lỗi khi tạo đơn hàng');
      }
    }
  },

  // Tạo đơn hàng cho khách không đăng nhập
  createGuestOrder: async (orderData) => {
    try {
      // Đảm bảo không có userId cho đơn hàng khách
      const guestOrderData = { ...orderData };
      delete guestOrderData.userId;
      
      return await orderService.createOrder(guestOrderData);
    } catch (error) {
      throw error;
    }
  },

  getOrderById: async (id) => {
    try {
      const response = await api.get(`/api/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      if (error.response && error.response.status === 404) {
        throw new Error('Không tìm thấy đơn hàng');
      }
      throw new Error('Không thể tải thông tin đơn hàng');
    }
  },
  
  getAllOrders: async () => {
    try {
      const response = await api.get('/api/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw new Error('Không thể tải danh sách đơn hàng');
    }
  }
};

export default orderService;