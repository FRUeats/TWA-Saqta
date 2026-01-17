/**
 * Layout Component
 * 
 * Provides consistent layout wrapper for all pages
 */

import { ReactNode } from 'react';
import RoleSwitcher from './RoleSwitcher';

interface LayoutProps {
    children: ReactNode;
    role?: 'buyer' | 'merchant';
    showRoleSwitcher?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showRoleSwitcher = true }) => {
    return (
        <div className="min-h-screen bg-tg-bg">
            <main className="w-full max-w-2xl mx-auto">
                {children}
            </main>
            {showRoleSwitcher && <RoleSwitcher />}
        </div>
    );
};

export default Layout;
