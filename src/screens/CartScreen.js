import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';
import { AnimatedView } from '../utils/AnimationUtils';
import CartItem from '../components/CartItem';
import PrimaryButton from '../components/PrimaryButton';
import { formatPrice } from '../logic/cart';

const CartScreen = ({ navigation }) => {
  const { cartItems, removeFromCart, updateQuantity, total, itemCount } = useContext(CartContext);
  const { colors } = useContext(ThemeContext);

  if (cartItems.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.background }]}>
        <Text style={styles.emptyEmoji}>🧺</Text>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Your cart is empty</Text>
        <Text style={[styles.emptyText, { color: colors.muted }]}>Add a snack pack or build your own box.</Text>
        <PrimaryButton
          title="Browse Snack Packs"
          onPress={() => navigation.getParent()?.navigate('Shop', { screen: 'Snack Packs' })}
          style={{ alignSelf: 'stretch' }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 12 }}
        renderItem={({ item }) => (
          <AnimatedView animation="slideInLeft" duration={350}>
            <CartItem item={item} onRemove={removeFromCart} onChangeQuantity={updateQuantity} />
          </AnimatedView>
        )}
      />
      <View style={[styles.footer, { borderColor: colors.border }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.muted }]}>
            {itemCount} item{itemCount === 1 ? '' : 's'}
          </Text>
          <Text style={[styles.total, { color: colors.text }]}>{formatPrice(total)}</Text>
        </View>
        <PrimaryButton title="Proceed to Checkout" onPress={() => navigation.navigate('Checkout')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  footer: { borderTopWidth: 1, paddingTop: 14, gap: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  totalLabel: { fontSize: 15 },
  total: { fontSize: 22, fontWeight: '800' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 20, fontWeight: '700' },
  emptyText: { fontSize: 15, marginBottom: 12, textAlign: 'center' },
});

export default CartScreen;
