import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DashboardLayout } from './components/DashboardLayout';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { RestaurantPage } from './pages/RestaurantPage';
import { RestaurantListPage } from './pages/RestaurantListPage';
import { FoodDetailsPage } from './pages/FoodDetailsPage';
import { SearchPage } from './pages/SearchPage';
import { CartPage } from './pages/CartPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RestaurantDashboardPage } from './pages/restaurant/RestaurantDashboardPage';
import { ManageFoodsPage } from './pages/restaurant/ManageFoodsPage';
import { RestaurantOrdersPage } from './pages/restaurant/RestaurantOrdersPage';
import { RestaurantProfilePage } from './pages/restaurant/RestaurantProfilePage';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <SocketProvider>
        <AppProvider>
          <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes with Layout */}
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/restaurants"
            element={
              <Layout>
                <RestaurantListPage />
              </Layout>
            }
          />
          <Route
            path="/restaurants/:id"
            element={
              <Layout>
                <RestaurantPage />
              </Layout>
            }
          />
          <Route
            path="/foods/:id"
            element={
              <Layout>
                <FoodDetailsPage />
              </Layout>
            }
          />
          <Route
            path="/search"
            element={
              <Layout>
                <SearchPage />
              </Layout>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute requireRole="user">
                <Layout>
                  <CartPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Layout>
                  <OrdersPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id/track"
            element={
              <ProtectedRoute>
                <Layout>
                  <OrderTrackingPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Restaurant Dashboard Routes */}
          <Route
            path="/restaurant/dashboard"
            element={
              <ProtectedRoute requireRole="restaurant">
                <DashboardLayout>
                  <RestaurantDashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurant/foods"
            element={
              <ProtectedRoute requireRole="restaurant">
                <DashboardLayout>
                  <ManageFoodsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurant/orders"
            element={
              <ProtectedRoute requireRole="restaurant">
                <DashboardLayout>
                  <RestaurantOrdersPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurant/profile"
            element={
              <ProtectedRoute requireRole="restaurant">
                <DashboardLayout>
                  <RestaurantProfilePage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Redirect /restaurant to /restaurant/dashboard */}
          <Route
            path="/restaurant"
            element={<Navigate to="/restaurant/dashboard" replace />}
          />
          
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppProvider>
      </SocketProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;

