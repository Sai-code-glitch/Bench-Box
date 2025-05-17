import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { CartContext } from '../context/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';


const CheckoutScreen = ({ navigation }) => {
  const { cartItems } = useContext(CartContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const { colors } = useContext(ThemeContext);


  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('$', '')) || 0;
    return sum + price;
  }, 0);

  // Load previously saved user info
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const saved = await AsyncStorage.getItem('USER_INFO');
        if (saved) {
          const data = JSON.parse(saved);
          setName(data.name || '');
          setEmail(data.email || '');
          setAddress(data.address || '');
        }
      } catch (error) {
        console.error("Error loading user info:", error);
      }
    };

    loadUserInfo();
  }, []);

  const handlePlaceOrder = async () => {
    if (!name || !email || !address) {
      Alert.alert('All fields are required!');
      return;
    }

    try {
      // Save user info locally for future autofill
      await AsyncStorage.setItem(
        'USER_INFO',
        JSON.stringify({ name, email, address })
      );

      // Navigate to confirmation screen
      navigation.navigate('Orders', {
        name,
        email,
        address,
        total,
        items: cartItems,
      });
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Something went wrong while placing the order.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Checkout</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Shipping Address"
        value={address}
        onChangeText={setAddress}
        multiline
      />

      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>

      <Button title="Place Order" onPress={handlePlaceOrder} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
  },
});

export default CheckoutScreen;
