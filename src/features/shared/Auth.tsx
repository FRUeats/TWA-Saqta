/**
 * Auth Component
 * 
 * Handles Telegram WebApp authentication and user registration
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { useAuthStore } from '../../store/authStore';

const Auth = () => {
    const navigate = useNavigate();
    const { user, initData, tg } = useTelegram();
    const { login, checkAuth, isLoading } = useAuthStore();
    const [authError, setAuthError] = useState<string | null>(null);
    const [status, setStatus] = useState<string>('Initializing...');

    useEffect(() => {
        // Development mode: Skip auth if not in Telegram
        if (!tg || !initData) {
            console.warn('Not running in Telegram WebApp - redirecting to home in dev mode');
            // navigate('/'); // Don't redirect automatically in debug mode
            setAuthError("Not in Telegram. Launch via Bot.");
            return;
        }

        // If we have initData, authenticate with backend
        if (user && initData) {
            authenticateUser();
        }
    }, [user, initData, tg]);

    const authenticateUser = async () => {
        try {
            setAuthError(null);

            // 1. Check if user already exists
            setStatus('Checking account...');
            try {
                await checkAuth(initData!);
                const currentUser = useAuthStore.getState().user;

                // Redirect based on role
                if (currentUser) {
                    setStatus('Welcome back!');
                    redirectUser(currentUser.role);
                    return;
                }
            } catch (err) {
                console.log('User not found, proceeding to registration');
            }

            // 2. Login/Register as buyer by default
            setStatus('Creating account...');
            await login(initData!);
            const authenticatedUser = useAuthStore.getState().user;

            if (authenticatedUser) {
                setStatus('Success!');
                redirectUser(authenticatedUser.role);
            } else {
                setAuthError('Login succeeded but user is null');
            }

        } catch (error: any) {
            console.error('Authentication failed:', error);
            setStatus('Failed');
            setAuthError(error.response?.data?.error || error.message || 'Authentication failed');
        }
    };

    const redirectUser = (role: string) => {
        if (role === 'MERCHANT') {
            // Check if verified
            const user = useAuthStore.getState().user;
            if (user && !user.isVerified) {
                navigate('/vendor/pending');
            } else {
                navigate('/merchant');
            }
        } else {
            navigate('/');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-tg-bg">
            <div className="text-center max-w-md px-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tg-button mb-4 mx-auto"></div>
                <h2 className="text-xl font-semibold text-tg-text mb-2">
                    {status}
                </h2>
                <p className="text-tg-hint text-sm mb-4">
                    Please wait while we verify your account
                </p>

                {authError && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-left">
                        <p className="font-bold text-red-500 text-sm mb-1">Error:</p>
                        <p className="text-red-500 text-xs font-mono break-all mb-3">{authError}</p>

                        <div className="flex gap-2 justify-center">
                            <button
                                onClick={() => authenticateUser()}
                                className="bg-tg-button text-white px-4 py-2 rounded-lg text-sm"
                            >
                                Retry
                            </button>
                            {/* Debug Option */}
                            <button
                                onClick={() => navigate('/')}
                                className="text-tg-hint underline text-xs"
                            >
                                Skip (Dev)
                            </button>
                        </div>
                    </div>
                )}

                {/* Connection Debug Info */}
                <div className="mt-8 text-xs text-gray-500">
                    Host: {import.meta.env.VITE_API_URL}<br />
                    User ID: {user?.id}
                </div>
            </div>
        </div>
    );
};

export default Auth;
