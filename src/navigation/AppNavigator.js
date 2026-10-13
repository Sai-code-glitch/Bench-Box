import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';
import HomeScreen from '../screens/HomeScreen';
import SnackPackScreen from '../screens/SnackPackScreen';
import CustomizationScreen from '../screens/CustomizationScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderPlacedScreen from '../screens/OrderPlacedScreen';
import OrdersScreen from '../screens/OrdersScreen';

const Tab = createBottomTabNavigator();
const ShopStackNav = createNativeStackNavigator();
const CartStackNav = createNativeStackNavigator();

function useStackOptions() {
  const { colors } = useContext(ThemeContext);
  return {
    headerStyle: { backgroundColor: colors.background },
    headerTintColor: colors.text,
    contentStyle: { backgroundColor: colors.background },
  };
}

export function ShopStack() {
  const options = useStackOptions();
  return (
    <ShopStackNav.Navigator screenOptions={options}>
      <ShopStackNav.Screen name="Home" component={HomeScreen} options={{ title: 'BenchBox' }} />
      <ShopStackNav.Screen name="Snack Packs" component={SnackPackScreen} />
      <ShopStackNav.Screen name="Customize" component={CustomizationScreen} options={{ title: 'Build Your Box' }} />
    </ShopStackNav.Navigator>
  );
}

export function CartStack() {
  const options = useStackOptions();
  return (
    <CartStackNav.Navigator screenOptions={options}>
      <CartStackNav.Screen name="Your Cart" component={CartScreen} />
      <CartStackNav.Screen name="Checkout" component={CheckoutScreen} />
      <CartStackNav.Screen
        name="Order Placed"
        component={OrderPlacedScreen}
        options={{ headerBackVisible: false, gestureEnabled: false }}
      />
    </CartStackNav.Navigator>
  );
}

const ICONS = { Shop: 'storefront', Cart: 'cart', Orders: 'receipt' };

export default function AppNavigator() {
  const { colors } = useContext(ThemeContext);
  const { itemCount } = useContext(CartContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.card, borderTopWidth: 0, paddingBottom: 5 },
        tabBarLabelStyle: { fontSize: 13, fontWeight: '600' },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name={focused ? ICONS[route.name] : `${ICONS[route.name]}-outline`} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Shop" component={ShopStack} />
      <Tab.Screen
        name="Cart"
        component={CartStack}
        options={{ tabBarBadge: itemCount > 0 ? itemCount : undefined }}
      />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ headerShown: true, title: 'Order History',
        headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.text }} />
    </Tab.Navigator>
  );
}
