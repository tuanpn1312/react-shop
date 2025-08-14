import React, { createContext, useState, useContext, useEffect } from 'react';
import categoryService from '../services/categoryService';
import productService from '../services/productService';

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch categories and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [categoriesData, productsData] = await Promise.all([
          categoryService.getAllCategories(),
          productService.getAllProducts()
        ]);
        setCategories(categoriesData);
        setProducts(productsData);
      } catch (err) {
        setError(err.message || 'Không thể tải dữ liệu. Vui lòng thử lại.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProductsByCategory = async (categoryId) => {
    try {
      if (!categoryId) {
        return products;
      }
      
      const selectedCat = categories.find(c => c.id === categoryId);
      if (selectedCat?.productIds?.length > 0) {
        return await Promise.all(
          selectedCat.productIds.map(id => productService.getProductById(id))
        );
      }
      return [];
    } catch (err) {
      console.error('Error getting products by category:', err);
      throw new Error('Không thể tải sản phẩm theo danh mục.');
    }
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const [categoriesData, productsData] = await Promise.all([
        categoryService.getAllCategories(),
        productService.getAllProducts()
      ]);
      setCategories(categoriesData);
      setProducts(productsData);
    } catch (err) {
      console.error('Error refreshing data:', err);
      throw new Error('Không thể làm mới dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    categories,
    products,
    loading,
    error,
    getProductsByCategory,
    refreshData
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
