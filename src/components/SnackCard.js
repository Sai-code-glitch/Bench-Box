import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const SnackCard = ({ item, onAddToCart, onPress }) => {
  const { colors } = useContext(ThemeContext);

  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />

        <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.tagline, { color: colors.accent }]}>{item.tagline}</Text>
        <Text style={[styles.price, { color: colors.text }]}>{item.price}</Text>

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => onAddToCart(item)}>
          <Text style={styles.buttonText}>🛒 Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 180,
    marginRight: 15,
    borderRadius: 12,
    padding: 10,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
  button: {
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default SnackCard;
