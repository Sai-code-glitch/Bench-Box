// Orders API.
// Orders are stored on the device for now. When a backend exists, replace the
// bodies of these functions with network calls; screens don't need to change.
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'ORDERS';

export async function fetchOrders() {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    const orders = saved ? JSON.parse(saved) : [];
    return Array.isArray(orders) ? orders : [];
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
}

export async function submitOrder(order) {
  const orders = await fetchOrders();
  const next = [order, ...orders];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return order;
}

export async function clearOrders() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
