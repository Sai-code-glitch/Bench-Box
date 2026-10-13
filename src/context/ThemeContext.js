import React, { createContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

const lightColors = {
  background: '#FFFFFF',
  text: '#1E1E1E',
  muted: '#6B6B6B',
  card: '#F3F3F3',
  accent: '#B8650F',
  primary: '#FF5722',
  onPrimary: '#FFFFFF',
  border: '#E0E0E0',
  shadow: '#00000020',
  success: '#2E7D32',
  danger: '#C62828',
};

const darkColors = {
  background: '#121212',
  text: '#FFFFFF',
  muted: '#A8A8A8',
  card: '#1E1E1E',
  accent: '#FFD54F',
  primary: '#FF9800',
  onPrimary: '#121212',
  border: '#333333',
  shadow: '#FFFFFF10',
  success: '#81C784',
  danger: '#EF9A9A',
};

const STORAGE_KEY = 'THEME';

export const ThemeProvider = ({ children }) => {
  const system = useColorScheme();
  // null = follow the phone's setting until the user picks one.
  const [choice, setChoice] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => (saved === 'dark' || saved === 'light') && setChoice(saved))
      .catch(() => {});
  }, []);

  const isDarkMode = choice ? choice === 'dark' : system === 'dark';

  const theme = useMemo(
    () => ({
      colors: isDarkMode ? darkColors : lightColors,
      isDarkMode,
      toggleTheme: () => {
        const next = isDarkMode ? 'light' : 'dark';
        setChoice(next);
        AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
      },
    }),
    [isDarkMode]
  );

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};
