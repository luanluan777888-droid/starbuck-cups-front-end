import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ClientLayout from '@/components/layout/ClientLayout';
import ScrollToTop from '@/components/layout/ScrollToTop';

// Loading fallback
const LoadingPage = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
  </div>
);

// Admin Layout
import AdminLayout from '@/components/admin/AdminLayout';

// Admin Pages - lazy loaded
const AdminDashboardPage = React.lazy(() => import('@/app/admin/(dashboard)/dashboard/page').then(m => ({ default: m.default || m })));
const ProductsPage = React.lazy(() => import('@/app/admin/(dashboard)/products/page').then(m => ({ default: m.default || m })));
const CategoriesPage = React.lazy(() => import('@/app/admin/(dashboard)/categories/page').then(m => ({ default: m.default || m })));
const ColorsPage = React.lazy(() => import('@/app/admin/(dashboard)/colors/page').then(m => ({ default: m.default || m })));
const CapacitiesPage = React.lazy(() => import('@/app/admin/(dashboard)/capacities/page').then(m => ({ default: m.default || m })));
const OrdersPage = React.lazy(() => import('@/app/admin/(dashboard)/orders/page').then(m => ({ default: m.default || m })));
const ConsultationsPage = React.lazy(() => import('@/app/admin/(dashboard)/consultations/page').then(m => ({ default: m.default || m })));
const CustomersPage = React.lazy(() => import('@/app/admin/(dashboard)/customers/page').then(m => ({ default: m.default || m })));
const AdminSettingsPage = React.lazy(() => import('@/app/admin/(dashboard)/settings/page').then(m => ({ default: m.default || m })));
const NotificationsPage = React.lazy(() => import('@/app/admin/(dashboard)/notifications/page').then(m => ({ default: m.default || m })));
const StatisticsPage = React.lazy(() => import('@/app/admin/(dashboard)/statistics/page').then(m => ({ default: m.default || m })));
const HeroImagesPage = React.lazy(() => import('@/app/admin/(dashboard)/hero-images/page').then(m => ({ default: m.default || m })));
const PromotionalBannersPage = React.lazy(() => import('@/app/admin/(dashboard)/promotional-banners/page').then(m => ({ default: m.default || m })));

// Admin Auth - lazy loaded
const AdminLogin = React.lazy(() => import('@/app/admin/login/page').then(m => ({ default: m.default || m })));

// Storefront Pages - lazy loaded
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const StorefrontProductsPage = React.lazy(() => import('@/app/products/page').then(m => ({ default: m.default || m })));
const StorefrontProductDetailPage = React.lazy(() => import('@/app/products/[slug]/page').then(m => ({ default: m.default || m })));
const ContactsPage = React.lazy(() => import('@/app/contacts/page').then(m => ({ default: m.default || m })));
const CartPage = React.lazy(() => import('@/app/cart/page').then(m => ({ default: m.default || m })));

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<LoadingPage />}>
        <ClientLayout>
          <Routes>
            {/* Admin Auth */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Panel */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="colors" element={<ColorsPage />} />
              <Route path="capacities" element={<CapacitiesPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:id" element={<OrdersPage />} />
              <Route path="consultations" element={<ConsultationsPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="customers/:id" element={<CustomersPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="statistics" element={<StatisticsPage />} />
              <Route path="hero-images" element={<HeroImagesPage />} />
              <Route path="promotional-banners" element={<PromotionalBannersPage />} />
            </Route>

            {/* Storefront */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<StorefrontProductsPage />} />
            <Route path="/products/:slug" element={<StorefrontProductDetailPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/cart" element={<CartPage />} />

            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ClientLayout>
      </Suspense>
    </BrowserRouter>
  );
}
