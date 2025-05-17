import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OrdersScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Order History</Text>
      <Text>You haven't placed any orders yet.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default OrdersScreen;
