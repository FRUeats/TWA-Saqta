/**
 * Debug Page - Reset app state for testing
 */

import { useNavigate } from 'react-router-dom';
import { useLanguageStore } from '../../store/languageStore';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import Button from '../../components/Button';

const Debug = () => {
    const navigate = useNavigate();
    const { language, isOnboarded } = useLanguageStore();
    const { user, isAuthenticated } = useAuthStore();
    const { items } = useCartStore();

    const resetOnboarding = () => {
        if (confirm('Reset onboarding? You will see welcome screens again.')) {
            localStorage.removeItem('saqta-language');
            location.reload();
        }
    };

    const resetAuth = () => {
        if (confirm('⚠️ Logout? This will clear your session.')) {
            localStorage.removeItem('saqta-auth');
            location.reload();
        }
    };

    const resetCart = () => {
        if (confirm('Clear cart?')) {
            localStorage.removeItem('saqta-cart');
            location.reload();
        }
    };

    const resetAll = () => {
        if (confirm('⚠️⚠️⚠️ RESET EVERYTHING? This cannot be undone!')) {
            localStorage.clear();
            location.reload();
        }
    };

    return (
        <div className="min-h-screen bg-tg-bg p-6">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-tg-button mb-4"
                    >
                        ← Back
                    </button>
                    <h1 className="text-2xl font-bold text-tg-text mb-2">🔧 Debug Panel</h1>
                    <p className="text-tg-hint text-sm">Reset app state for testing</p>
                </div>

                {/* Current State */}
                <div className="bg-tg-secondary rounded-xl p-4 mb-6">
                    <h2 className="font-semibold text-tg-text mb-3">Current State:</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-tg-hint">Language:</span>
                            <span className="text-tg-text font-mono">{language}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-tg-hint">Onboarded:</span>
                            <span className={isOnboarded ? 'text-green-500' : 'text-orange-500'}>
                                {isOnboarded ? 'Yes ✓' : 'No ✗'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-tg-hint">Authenticated:</span>
                            <span className={isAuthenticated ? 'text-green-500' : 'text-orange-500'}>
                                {isAuthenticated ? 'Yes ✓' : 'No ✗'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-tg-hint">User Role:</span>
                            <span className="text-tg-text font-mono">{user?.role || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-tg-hint">Cart Items:</span>
                            <span className="text-tg-text">{items.length}</span>
                        </div>
                    </div>
                </div>

                {/* Reset Buttons */}
                <div className="space-y-3">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-500 rounded-xl p-4 mb-4">
                        <div className="flex items-start gap-2">
                            <span className="text-xl">⚠️</span>
                            <div>
                                <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 text-sm mb-1">
                                    Warning
                                </h3>
                                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                                    These actions only affect local data in your browser. Server data (vendors, offers) remains unchanged.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button
                        fullWidth
                        variant="outline"
                        onClick={resetOnboarding}
                    >
                        🔄 Reset Onboarding
                    </Button>

                    <Button
                        fullWidth
                        variant="outline"
                        onClick={resetAuth}
                    >
                        🚪 Logout (Clear Auth)
                    </Button>

                    <Button
                        fullWidth
                        variant="outline"
                        onClick={resetCart}
                    >
                        🛒 Clear Cart
                    </Button>

                    <Button
                        fullWidth
                        variant="danger"
                        onClick={resetAll}
                    >
                        🗑️ RESET EVERYTHING
                    </Button>
                </div>

                {/* Info */}
                <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 text-sm mb-2">
                        💡 Testing Tips
                    </h4>
                    <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• Reset onboarding to see welcome screens</li>
                        <li>• Logout to test authentication flow</li>
                        <li>• Server vendor data is NOT affected</li>
                        <li>• Refresh page after reset</li>
                    </ul>
                </div>

                {/* LocalStorage Contents */}
                <details className="mt-6 bg-tg-secondary rounded-xl p-4">
                    <summary className="font-semibold text-tg-text cursor-pointer">
                        📦 LocalStorage Contents
                    </summary>
                    <pre className="mt-3 text-xs text-tg-hint overflow-auto">
                        {JSON.stringify(
                            {
                                'saqta-language': localStorage.getItem('saqta-language'),
                                'saqta-auth': localStorage.getItem('saqta-auth')?.slice(0, 100) + '...',
                                'saqta-cart': localStorage.getItem('saqta-cart'),
                            },
                            null,
                            2
                        )}
                    </pre>
                </details>
            </div>
        </div>
    );
};

export default Debug;
