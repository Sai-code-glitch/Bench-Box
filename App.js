import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { CartProvider } from './src/context/CartContext';
import { ThemeProvider } from './src/context/ThemeContext';

import HomeStack from './src/navigation/HomeStack';
import CartScreen from './src/screens/CartScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import * as Animatable from 'react-native-animatable';



const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <CartProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: '#f5f5f5',
                borderTopWidth: 0,
                paddingBottom: 5,
              },
              tabBarLabelStyle: {
                fontSize: 14,
                fontWeight: '600',
              },
              tabBarActiveTintColor: '#8b4513', // Themed color (SaddleBrown)
              tabBarInactiveTintColor: '#777',
            }}
          >
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Cart" component={CartScreen} />
            <Tab.Screen name="Orders" component={OrdersScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </CartProvider>
  );
}
