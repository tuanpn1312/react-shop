import api from './api';

const categoryService = {
  getAllCategories: async () => {
    try {
      const response = await api.get('/api/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories from API:', error);
      if (error.response) {
        // Lỗi từ server với status code
        console.error('Server responded with:', error.response.status, error.response.data);
        throw new Error(error.response.data.message || 'Lỗi server');
      } else if (error.request) {
        // Không nhận được response
        console.error('No response received:', error.request);
        throw new Error('Không nhận được phản hồi từ server');
      } else {
        // Lỗi trong quá trình gửi request
        console.error('Error setting up request:', error.message);
        throw new Error('Lỗi kết nối');
      }
    }
  },

  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/api/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id} from API:`, error);
      if (error.response && error.response.status === 404) {
        throw new Error('Danh mục không tồn tại.');
      }
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.');
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/api/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/api/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/api/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
};

export default categoryService;