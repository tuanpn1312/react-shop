import api from './api';

const productService = {
  getAllProducts: async () => {
    try {
      const response = await api.get('/api/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products from API:', error);
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.');
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id} from API:`, error);
      if (error.response && error.response.status === 404) {
        throw new Error('Sản phẩm không tồn tại.');
      }
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.');
    }
  },

  getProductsByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/products/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId} from API:`, error);
      if (error.response && error.response.status === 404) {
        throw new Error('Không tìm thấy sản phẩm trong danh mục này.');
      }
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.');
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post('/api/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/api/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};

export default productService;