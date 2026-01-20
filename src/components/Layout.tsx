/**
 * Layout Component
 * 
 * Provides consistent layout wrapper for all pages
 */

import { ReactNode } from 'react';
import BottomNav from './BottomNav';

interface LayoutProps {
    children: ReactNode;
    role?: 'buyer' | 'merchant';
    showRoleSwitcher?: boolean; // Kept for backward compatibility but unused
}

const Layout: React.FC<LayoutProps> = ({ children, role = 'buyer' }) => {
    return (
        <div className="min-h-screen bg-tg-bg relative">
            <main className={`w-full max-w-2xl mx-auto ${role === 'buyer' ? 'pb-24' : 'pb-6'}`}>
                {children}
            </main>

            {/* Show BottomNav only for buyers */}
            {role === 'buyer' && <BottomNav />}
        </div>
    );
};

export default Layout;
