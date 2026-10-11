import React, { useContext } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { CartProvider } from './src/context/CartContext';
import { OrdersProvider } from './src/context/OrdersContext';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider, ThemeContext } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

function ThemedNavigation() {
  const { colors, isDarkMode } = useContext(ThemeContext);
  const base = isDarkMode ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: { ...base.colors, primary: colors.primary, background: colors.background, card: colors.card, text: colors.text, border: colors.border },
  };
  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <OrdersProvider>
          <CartProvider>
            <ThemedNavigation />
          </CartProvider>
        </OrdersProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
