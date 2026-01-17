/**
 * ProtectedRoute Component
 * 
 * Handles route protection based on authentication and user roles
 */

import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: 'BUYER' | 'MERCHANT' | 'ADMIN';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRole
}) => {
    const { tg } = useTelegram();
    const { user, isAuthenticated } = useAuthStore();

    // Development mode: allow access if not in Telegram WebApp
    if (!tg) {
        console.warn('Development mode: Bypassing authentication');
        return <>{children}</>;
    }

    // Check if authenticated
    if (!isAuthenticated || !user) {
        return <Navigate to="/auth" replace />;
    }

    // Check if user is blocked
    if (user.isBlocked) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-tg-bg">
                <div className="text-center px-6">
                    <h2 className="text-xl font-semibold text-red-500 mb-2">
                        Account Blocked
                    </h2>
                    <p className="text-tg-hint">
                        Your account has been blocked. Please contact support.
                    </p>
                </div>
            </div>
        );
    }

    // Check role requirement
    if (requiredRole && user.role !== requiredRole) {
        // Redirect to appropriate page based on user's actual role
        if (user.role === 'MERCHANT') {
            return <Navigate to="/merchant" replace />;
        } else {
            return <Navigate to="/" replace />;
        }
    }

    // For merchants, check verification status
    if (user.role === 'MERCHANT' && !user.isVerified && requiredRole === 'MERCHANT') {
        // Allow access to pending page even if not verified
        if (window.location.pathname !== '/vendor/pending') {
            return <Navigate to="/vendor/pending" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
