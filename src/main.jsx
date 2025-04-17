// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Make sure Tailwind CSS is imported
import { ThemeProvider } from './contexts/ThemeContext.jsx'; // Import the provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider> {/* Wrap App with the ThemeProvider */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);