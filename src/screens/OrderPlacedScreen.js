import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { AnimatedView } from '../utils/AnimationUtils';
import PrimaryButton from '../components/PrimaryButton';
import { formatPrice } from '../logic/cart';

const OrderPlacedScreen = ({ navigation, route }) => {
  const { colors } = useContext(ThemeContext);
  const { orderId, total, email } = route.params || {};

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AnimatedView animation="slideInUp" style={{ alignItems: 'center' }}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={[styles.title, { color: colors.text }]}>Order placed!</Text>
        <Text style={[styles.text, { color: colors.muted }]}>
          Order {orderId} · {formatPrice(total)}
        </Text>
        <Text style={[styles.text, { color: colors.muted }]}>We'll contact you at {email} about delivery.</Text>
      </AnimatedView>
      <View style={styles.actions}>
        <PrimaryButton title="View Order History" onPress={() => navigation.getParent()?.navigate('Orders')} />
        <PrimaryButton
          title="Keep Shopping"
          variant="outline"
          onPress={() => {
            navigation.popToTop();
            navigation.getParent()?.navigate('Shop', { screen: 'Home' });
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  emoji: { fontSize: 56, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 8 },
  text: { fontSize: 15, textAlign: 'center', marginBottom: 4 },
  actions: { gap: 10, marginTop: 28 },
});

export default OrderPlacedScreen;
