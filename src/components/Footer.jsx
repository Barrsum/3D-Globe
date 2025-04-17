// src/components/Footer.jsx
import React from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

function Footer() {
  const currentProjectGithub = "https://github.com/Barrsum/3D-Globe.git";

  return (
    <footer className="bg-secondary-light dark:bg-secondary-dark text-gray-600 dark:text-gray-400 py-4 px-4 sm:px-6 lg:px-8 mt-auto shadow-inner">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
        <div className="mb-2 sm:mb-0">
          <p className="text-sm">Created By Ram Bapat</p>
          <p className="text-xs mt-1">Connect or View Source:</p>
        </div>
        <div className="flex space-x-4">
          <a
            href="https://www.linkedin.com/in/ram-bapat-barrsum-diamos"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            title="LinkedIn Profile"
            className="text-gray-500 hover:text-accent dark:hover:text-blue-400 transition-colors duration-200"
          >
            <FaLinkedin size={24} />
          </a>
          <a
            href={currentProjectGithub} // Use the variable
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            title="View Source on GitHub"
            className="text-gray-500 hover:text-accent dark:hover:text-blue-400 transition-colors duration-200"
          >
            <FaGithub size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default React.memo(Footer); // Memoize if content is static