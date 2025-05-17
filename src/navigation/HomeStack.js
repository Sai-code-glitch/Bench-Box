import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SnackPackScreen from '../screens/SnackPackScreen';
import CheckoutScreen from '../screens/CheckoutScreen';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Snack Packs" component={SnackPackScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
