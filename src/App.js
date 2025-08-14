import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/home/HomePage';
import ProductsPage from './pages/products/ProductsPage';
import { ProductProvider } from './contexts/ProductContext';
import ProductDetailPage from './pages/products/ProductDetailPage';
import CartPage from './pages/cart/CartPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import OrderConfirmationPage from './pages/checkout/OrderConfirmationPage';
import OrdersPage from './pages/orders/OrdersPage';
import OrderDetailPage from './pages/orders/OrderDetailPage';
import UsersPage from './pages/users/UsersPage';
import UserDetailPage from './pages/users/UserDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import RegisterAdminPage from './pages/auth/RegisterAdminPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import NotFoundPage from './pages/errors/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import { CartProvider } from './contexts/CartContext';
import { ROUTES } from './utils/constants';
import CartDebug from './debug/CartDebug';
import './App.css';
import './styles/cart.css';
import './styles/checkout.css';

function App() {
  return (
    <Router>
      <ProductProvider>
        <CartProvider>
          <Container fluid className="p-0">
          <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
            <Route path={ROUTES.PRODUCT_DETAILS.replace(':id', ':id')} element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/debug/cart" element={<CartDebug />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            
            {/* Protected Routes (require authentication) */}
            <Route element={<ProtectedRoute />}>
              <Route path={ROUTES.ORDERS} element={<OrdersPage />} />
              <Route path={ROUTES.ORDER_DETAILS.replace(':id', ':id')} element={<OrderDetailPage />} />
            </Route>
            
            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path={ROUTES.USERS} element={<UsersPage />} />
              <Route path={ROUTES.USER_DETAILS.replace(':id', ':id')} element={<UserDetailPage />} />
              <Route path={ROUTES.REGISTER_ADMIN} element={<RegisterAdminPage />} />
            </Route>
            
            {/* Error Routes */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Container>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        </CartProvider>
      </ProductProvider>
    </Router>
  );
}

export default App;
