import api from './api';

const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        const userData = {
          username: response.data.username,
          email: response.data.email,
          role: response.data.role
        };
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Get JWT token from Authorization header
        const authHeader = response.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          localStorage.setItem('token', token);
        } else {
          console.warn('No JWT token found in Authorization header');
        }
        
        return userData;
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        // Log chi tiết lỗi
        console.error('Server response:', error.response.data);
        console.error('Status code:', error.response.status);
        
        // Xử lý các loại lỗi cụ thể
        if (error.response.data && error.response.data.includes('Query did not return a unique result')) {
          throw new Error('Tài khoản bị trùng lặp trong hệ thống. Vui lòng liên hệ admin.');
        } else if (error.response.status === 401) {
          throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
        } else {
          throw new Error(error.response.data || 'Đăng nhập thất bại');
        }
      } else if (error.request) {
        // Không nhận được response
        throw new Error('Không thể kết nối đến server');
      } else {
        // Lỗi khi setting up request
        throw new Error('Đăng nhập thất bại: ' + error.message);
      }
    }
  },
  
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'ROLE_ADMIN';
  }
};

export default authService;