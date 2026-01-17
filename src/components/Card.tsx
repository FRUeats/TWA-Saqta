/**
 * Card Component
 * 
 * Reusable card container with Telegram theme
 */

import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
    const clickableStyles = onClick ? 'cursor-pointer hover:shadow-lg active:scale-98 transition-all' : '';

    return (
        <div
            className={`
        bg-tg-secondary rounded-2xl p-4 shadow-sm
        ${clickableStyles}
        ${className}
      `}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;
