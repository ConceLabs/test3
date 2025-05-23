
import React from 'react';
import { ArrowLeftIcon } from './Icons';

interface HeaderProps {
  title: string;
  showBackButton: boolean;
  onBack?: () => void;
  leftIcon?: React.ReactNode;
  rightControls?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton, onBack, leftIcon, rightControls }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between h-16">
        <div className="flex items-center space-x-3">
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              aria-label="Volver"
              className="text-brand-primary hover:text-brand-secondary p-2 -ml-2"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
          )}
          {leftIcon && !showBackButton && <div className="flex items-center">{leftIcon}</div>}
          <h1 className="text-xl sm:text-2xl font-semibold text-brand-text truncate" style={{ maxWidth: 'calc(100vw - 180px)' }}> 
            {/* Adjusted maxWidth for cases with controls on both sides on smaller screens */}
            {title}
          </h1>
        </div>
        {rightControls && <div className="flex items-center space-x-2">{rightControls}</div>}
      </div>
    </header>
  );
};

export default Header;
