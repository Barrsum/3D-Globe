// src/components/Header.jsx
import React from 'react';
import ThemeToggle from './ThemeToggle';

function Header() {
  return (
    <header className="bg-secondary-light dark:bg-secondary-dark shadow-md py-3 px-4 sm:px-6 lg:px-8 sticky top-0 z-10"> {/* Made header sticky */}
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            3D Visualization of World Map
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Created by - Ram Bapat
          </p>
        </div>
        <ThemeToggle /> {/* Add the theme toggle button */}
      </div>
    </header>
  );
}

export default Header;