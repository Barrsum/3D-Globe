// src/contexts/ThemeContext.jsx
import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useMemo,
    useCallback // <--- ADD THIS IMPORT
  } from 'react';
  import PropTypes from 'prop-types';
  
  const ThemeContext = createContext();
  
  export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        return storedTheme;
      }
      // Default to dark theme if no preference stored
      return 'dark';
    });
  
    useEffect(() => {
      const root = window.document.documentElement;
      const isDark = theme === 'dark';
      root.classList.toggle('dark', isDark); // More concise way to toggle class
      localStorage.setItem('theme', theme);
    }, [theme]);
  
    // Wrap toggleTheme in useCallback as it's included in useMemo deps
    const toggleTheme = useCallback(() => {
      setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    }, []); // Empty dependency array means this function reference won't change
  
    // Memoize context value
    const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  
    return (
      <ThemeContext.Provider value={value}>
        {children}
      </ThemeContext.Provider>
    );
  };
  
  export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
      throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
  };
  
  ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  
  export default ThemeContext; // Optional default export