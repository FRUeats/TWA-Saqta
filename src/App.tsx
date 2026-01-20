/**
 * App.tsx - Main Application Component
 * 
 * Handles routing, authentication, and role-based navigation
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';

// Feature Pages - Buyer
import Home from './features/buyer/Home';
import OfferDetail from './features/buyer/OfferDetail';
import Cart from './features/buyer/Cart';
import Checkout from './features/buyer/Checkout';
import MapView from './features/buyer/MapView';
import OrderHistory from './features/buyer/OrderHistory';

// Feature Pages - Merchant
import MerchantDashboard from './features/merchant/Dashboard';
import CreateOffer from './features/merchant/CreateOffer';
import QRScanner from './features/merchant/QRScanner';
import MerchantOrders from './features/merchant/MerchantOrders';
import StoreSettings from './features/merchant/StoreSettings';

// Shared Pages
import Profile from './features/shared/Profile';
import Auth from './features/shared/Auth';
import VendorRegistration from './features/shared/VendorRegistration';
import VendorPending from './features/shared/VendorPending';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const { isReady, colorScheme } = useTelegram();

    // Apply Telegram theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', colorScheme);
    }, [colorScheme]);

    // Show loading while Telegram initializes
    if (!isReady) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-tg-bg">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tg-button mb-4 mx-auto"></div>
                    <p className="text-tg-text">Loading Saqta...</p>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                {/* Authentication */}
                <Route path="/auth" element={<Auth />} />

                {/* Vendor Routes */}
                <Route path="/vendor/register" element={<VendorRegistration />} />
                <Route
                    path="/vendor/pending"
                    element={
                        <ProtectedRoute requiredRole="MERCHANT">
                            <VendorPending />
                        </ProtectedRoute>
                    }
                />

                {/* Buyer Routes */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout role="buyer">
                                <Home />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/offer/:id"
                    element={
                        <ProtectedRoute>
                            <Layout role="buyer">
                                <OfferDetail />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <Layout role="buyer">
                                <Cart />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute>
                            <Layout role="buyer">
                                <Checkout />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/map"
                    element={
                        <ProtectedRoute>
                            <Layout role="buyer">
                                <MapView />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute>
                            <Layout role="buyer">
                                <OrderHistory />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                {/* Merchant Routes */}
                <Route
                    path="/merchant"
                    element={
                        <ProtectedRoute requiredRole="MERCHANT">
                            <Layout role="merchant">
                                <MerchantDashboard />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/merchant/create"
                    element={
                        <ProtectedRoute requiredRole="MERCHANT">
                            <Layout role="merchant">
                                <CreateOffer />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/merchant/scan"
                    element={
                        <ProtectedRoute requiredRole="MERCHANT">
                            <Layout role="merchant">
                                <QRScanner />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/merchant/orders"
                    element={
                        <ProtectedRoute requiredRole="MERCHANT">
                            <Layout role="merchant">
                                <MerchantOrders />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/merchant/settings"
                    element={
                        <ProtectedRoute requiredRole="MERCHANT">
                            <Layout role="merchant">
                                <StoreSettings />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                {/* Shared Routes */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Profile />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                {/* 404 Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
