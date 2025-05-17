import React, { useContext } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';
import { AnimatedView, animationPresets } from '../utils/AnimationUtils';
import CartItem from '../components/CartItem';

const CartScreen = ({ navigation }) => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const handleRemove = (item) => {
    removeFromCart(item);
  };
  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')), 0);
  const { colors } = useContext(ThemeContext);
  if (!colors) return null;



  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Cart</Text>
      <FlatList
  data={cartItems}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <AnimatedView animation="slideInLeft" duration={500}>
      <CartItem item={item} onRemove={handleRemove} />
    </AnimatedView>
  )}
/>

      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
      <Button
        title="Proceed to Checkout"
        onPress={() => navigation.navigate('Home', {
          screen: 'Checkout'
        })
        }
        disabled={cartItems.length === 0}
      />
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default CartScreen;
