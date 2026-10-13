// components/CartItem.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { formatPrice, parsePrice, MAX_QUANTITY } from '../logic/cart';

const CartItem = ({ item, onRemove, onChangeQuantity }) => {
  const { colors } = useContext(ThemeContext);
  const quantity = item.quantity || 1;

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.meta, { color: colors.muted }]}>
            {formatPrice(item.price)} each{item.category ? ` · ${item.category}` : ''}
          </Text>
          {item.details?.snacks ? (
            <Text style={[styles.meta, { color: colors.muted }]} numberOfLines={2}>
              {item.details.snacks.join(', ')}
            </Text>
          ) : null}
        </View>
        <Text style={[styles.lineTotal, { color: colors.text }]}>
          {formatPrice(parsePrice(item.price) * quantity)}
        </Text>
      </View>

      <View style={[styles.row, { marginTop: 10 }]}>
        <View style={[styles.stepper, { borderColor: colors.border }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Decrease ${item.name}`}
            onPress={() => onChangeQuantity(item.id, quantity - 1)}
            style={styles.stepBtn}
          >
            <Text style={[styles.stepText, { color: colors.primary }]}>−</Text>
          </Pressable>
          <Text style={[styles.qty, { color: colors.text }]} accessibilityLabel={`Quantity ${quantity}`}>{quantity}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Increase ${item.name}`}
            onPress={() => onChangeQuantity(item.id, quantity + 1)}
            disabled={quantity >= MAX_QUANTITY}
            style={[styles.stepBtn, quantity >= MAX_QUANTITY && { opacity: 0.4 }]}
          >
            <Text style={[styles.stepText, { color: colors.primary }]}>+</Text>
          </Pressable>
        </View>
        <Pressable accessibilityRole="button" onPress={() => onRemove(item.id)} hitSlop={8}>
          <Text style={[styles.remove, { color: colors.danger }]}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { padding: 15, marginBottom: 10, borderRadius: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  name: { fontSize: 16, fontWeight: '700' },
  meta: { fontSize: 13, marginTop: 2 },
  lineTotal: { fontSize: 16, fontWeight: '700' },
  stepper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10 },
  stepBtn: { paddingHorizontal: 14, paddingVertical: 6 },
  stepText: { fontSize: 20, fontWeight: '700' },
  qty: { minWidth: 26, textAlign: 'center', fontSize: 16, fontWeight: '600' },
  remove: { fontWeight: '600' },
});

export default CartItem;
