import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { OrdersContext } from '../context/OrdersContext';
import { ThemeContext } from '../context/ThemeContext';
import { formatPrice } from '../logic/cart';

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  } catch (e) {
    return iso;
  }
}

const OrdersScreen = () => {
  const { orders, loading } = useContext(OrdersContext);
  const { colors } = useContext(ThemeContext);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={styles.emoji}>🧾</Text>
        <Text style={[styles.heading, { color: colors.text }]}>No orders yet</Text>
        <Text style={{ color: colors.muted }}>Orders you place will show up here.</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.list}
      data={orders}
      keyExtractor={(o) => o.id}
      renderItem={({ item: order }) => (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.row}>
            <Text style={[styles.orderId, { color: colors.text }]}>{order.id}</Text>
            <Text style={[styles.status, { color: colors.success }]}>{order.status}</Text>
          </View>
          <Text style={[styles.meta, { color: colors.muted }]}>{formatDate(order.createdAt)}</Text>
          <View style={styles.items}>
            {order.items.map((line) => (
              <Text key={line.id} style={{ color: colors.text }} numberOfLines={1}>
                {line.quantity} × {line.name}
              </Text>
            ))}
          </View>
          <View style={styles.row}>
            <Text style={[styles.meta, { color: colors.muted }]} numberOfLines={1}>To {order.customer.name}</Text>
            <Text style={[styles.total, { color: colors.text }]}>{formatPrice(order.total)}</Text>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 6 },
  emoji: { fontSize: 44 },
  heading: { fontSize: 20, fontWeight: '700' },
  list: { padding: 16, gap: 12 },
  card: { borderRadius: 14, padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  orderId: { fontSize: 16, fontWeight: '800' },
  status: { fontWeight: '700' },
  meta: { fontSize: 13, marginTop: 2 },
  items: { marginVertical: 10, gap: 2 },
  total: { fontSize: 17, fontWeight: '800' },
});

export default OrdersScreen;
