import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { CartContext } from '../context/CartContext';
import { OrdersContext } from '../context/OrdersContext';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import PrimaryButton from '../components/PrimaryButton';
import { formatPrice, parsePrice, validateCustomer } from '../logic/cart';

const CheckoutScreen = ({ navigation }) => {
  const { cartItems, total, clearCart } = useContext(CartContext);
  const { placeOrder } = useContext(OrdersContext);
  const { profile, saveProfile } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Pre-fill from the saved profile once it loads, without overwriting typing.
  useEffect(() => {
    setName((v) => v || profile.name);
    setEmail((v) => v || profile.email);
    setAddress((v) => v || profile.address);
  }, [profile]);

  const handlePlaceOrder = async () => {
    const customer = { name, email, address };
    const found = validateCustomer(customer);
    setErrors(found);
    if (Object.keys(found).length) return;
    if (cartItems.length === 0) {
      setSubmitError('Your cart is empty.');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      await saveProfile({ name: name.trim(), email: email.trim(), address: address.trim() });
      const order = await placeOrder({ cart: cartItems, customer });
      clearCart();
      navigation.replace('Order Placed', { orderId: order.id, total: order.total, email: order.customer.email });
    } catch (error) {
      console.error('Error placing order:', error);
      setSubmitError('Something went wrong while placing the order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (field) => [
    styles.input,
    { borderColor: errors[field] ? colors.danger : colors.border, color: colors.text, backgroundColor: colors.card },
  ];

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={[styles.label, { color: colors.muted }]}>Full name</Text>
        <TextInput style={inputStyle('name')} placeholder="e.g. Sam Patel" placeholderTextColor={colors.muted}
          value={name} onChangeText={setName} autoComplete="name" textContentType="name" />
        {errors.name ? <Text style={[styles.error, { color: colors.danger }]}>{errors.name}</Text> : null}

        <Text style={[styles.label, { color: colors.muted }]}>Email</Text>
        <TextInput style={inputStyle('email')} placeholder="you@example.com" placeholderTextColor={colors.muted}
          value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"
          autoComplete="email" textContentType="emailAddress" />
        {errors.email ? <Text style={[styles.error, { color: colors.danger }]}>{errors.email}</Text> : null}

        <Text style={[styles.label, { color: colors.muted }]}>Delivery address</Text>
        <TextInput style={[inputStyle('address'), { height: 84, textAlignVertical: 'top' }]}
          placeholder="Street, city, ZIP" placeholderTextColor={colors.muted}
          value={address} onChangeText={setAddress} multiline autoComplete="street-address" />
        {errors.address ? <Text style={[styles.error, { color: colors.danger }]}>{errors.address}</Text> : null}

        <View style={[styles.summary, { backgroundColor: colors.card }]}>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.summaryRow}>
              <Text style={{ color: colors.text, flex: 1 }} numberOfLines={1}>{item.quantity} × {item.name}</Text>
              <Text style={{ color: colors.text }}>{formatPrice(parsePrice(item.price) * item.quantity)}</Text>
            </View>
          ))}
          <View style={[styles.summaryRow, { marginTop: 8 }]}>
            <Text style={[styles.total, { color: colors.text }]}>Total</Text>
            <Text style={[styles.total, { color: colors.text }]}>{formatPrice(total)}</Text>
          </View>
        </View>

        {submitError ? <Text style={[styles.error, { color: colors.danger }]}>{submitError}</Text> : null}
        <PrimaryButton title={`Place Order · ${formatPrice(total)}`} onPress={handlePlaceOrder} loading={submitting} />
        <Text style={[styles.note, { color: colors.muted }]}>Payment is collected on delivery for now.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 10 },
  input: { borderWidth: 1, padding: 12, borderRadius: 10, fontSize: 16 },
  error: { fontSize: 13, marginTop: 4 },
  summary: { borderRadius: 12, padding: 14, marginVertical: 18, gap: 6 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  total: { fontSize: 18, fontWeight: '800' },
  note: { fontSize: 13, textAlign: 'center', marginTop: 10 },
});

export default CheckoutScreen;
