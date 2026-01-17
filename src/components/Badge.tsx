/**
 * Badge Component
 * 
 * Small status/label indicator
 */

import { ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
    size?: 'sm' | 'md';
}

const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    size = 'md'
}) => {
    const variants = {
        success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        default: 'bg-tg-secondary text-tg-text',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
    };

    return (
        <span className={`
      inline-flex items-center rounded-full font-semibold
      ${variants[variant]}
      ${sizes[size]}
    `}>
            {children}
        </span>
    );
};

export default Badge;
