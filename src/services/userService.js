import api from './api';

const userService = {
  register: async (userData) => {
    try {
      // Format request theo UserRegisterRequest
      const requestData = {
        username: userData.username,
        email: userData.email,
        password: userData.password
      };
      console.log('Sending registration request with data:', {
        url: '/api/users/register',
        data: {...requestData, password: '******'} // Log an che password
      });
      const response = await api.post('/api/users/register', requestData);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        console.error('Status code:', error.response.status);
        console.error('Headers:', error.response.headers);
        
        // Handle specific status codes
        switch (error.response.status) {
          case 403:
            throw new Error('Không có quyền đăng ký người dùng');
          case 409:
            throw new Error('Tên đăng nhập hoặc email đã tồn tại');
          case 400:
            const validationErrors = error.response.data?.errors;
            if (validationErrors) {
              throw new Error(`Lỗi xác thực: ${Object.values(validationErrors).join(', ')}`);
            }
            break;
          default:
            break;
        }
        
        // Xử lý message từ server
        const serverMessage = error.response.data?.message 
          || (typeof error.response.data === 'string' ? error.response.data : null)
          || 'Đăng ký thất bại';
        throw new Error(serverMessage);
      } else if (error.request) {
        console.error('No response:', error.request);
        throw new Error('Không thể kết nối đến server');
      } else {
        console.error('Error:', error.message);
        throw new Error('Lỗi đăng ký: ' + error.message);
      }
    }
  },

  registerAdmin: async (userData) => {
    try {
      const response = await api.post('/api/users/register-admin', userData);
      return response.data;
    } catch (error) {
      console.error('Error registering admin:', error);
      if (error.response) {
        if (error.response.status === 409) {
          throw new Error('Tên đăng nhập hoặc email đã tồn tại');
        } else if (error.response.status === 403) {
          throw new Error('Không có quyền tạo tài khoản admin');
        }
        throw new Error(error.response.data || 'Đăng ký admin thất bại');
      } else if (error.request) {
        throw new Error('Không thể kết nối đến server');
      } else {
        throw new Error('Lỗi đăng ký admin: ' + error.message);
      }
    }
  },

  getAllUsers: async () => {
    try {
      const response = await api.get('/api/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Xóa phương thức registerAdmin trùng lặp
};

export default userService;