import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

const lightColors = {
  background: '#FFFFFF',
  text: '#1E1E1E',
  card: '#F3F3F3',
  accent: '#FFA726',
  primary: '#FF5722',
  border: '#E0E0E0',
  shadow: '#00000020',
};

const darkColors = {
  background: '#121212',
  text: '#FFFFFF',
  card: '#1E1E1E',
  accent: '#FFD54F',
  primary: '#FF9800',
  border: '#333333',
  shadow: '#FFFFFF10',
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const theme = {
    colors: isDarkMode ? darkColors : lightColors,
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
