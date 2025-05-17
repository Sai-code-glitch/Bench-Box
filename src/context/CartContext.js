import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load saved cart items from AsyncStorage on first load
  useEffect(() => {
    const loadCart = async () => {
      try {
        const saved = await AsyncStorage.getItem('CART');
        if (saved) {
          setCartItems(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    };

    loadCart();
  }, []);

  // Save cart to AsyncStorage whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('CART', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error saving cart to storage:', error);
      }
    };

    saveCart();
  }, [cartItems]);

  // Add and remove functions
  const addToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
