import React, { createContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addItem,
  cartCount,
  cartTotal,
  normalizeCart,
  removeItem,
  setQuantity,
} from '../logic/cart';

export const CartContext = createContext();

const STORAGE_KEY = 'CART';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const loaded = useRef(false);

  // Load the saved cart once. Older saves had one entry per tap; normalizeCart merges them.
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setCartItems(normalizeCart(JSON.parse(saved)));
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      } finally {
        loaded.current = true;
      }
    })();
  }, []);

  // Save after the first load so an empty initial state never overwrites the saved cart.
  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems)).catch((error) =>
      console.error('Error saving cart to storage:', error)
    );
  }, [cartItems]);

  const value = useMemo(
    () => ({
      cartItems,
      itemCount: cartCount(cartItems),
      total: cartTotal(cartItems),
      addToCart: (item, quantity = 1) => setCartItems((prev) => addItem(prev, item, quantity)),
      removeFromCart: (itemOrId) => setCartItems((prev) => removeItem(prev, itemOrId)),
      updateQuantity: (id, quantity) => setCartItems((prev) => setQuantity(prev, id, quantity)),
      clearCart: () => setCartItems([]),
    }),
    [cartItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
