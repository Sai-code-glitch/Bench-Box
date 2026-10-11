import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { fetchOrders, submitOrder } from '../api/orders';
import { buildOrder } from '../logic/cart';

export const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders().then((saved) => {
      setOrders(saved);
      setLoading(false);
    });
  }, []);

  const placeOrder = useCallback(async ({ cart, customer }) => {
    const order = buildOrder({ cart, customer });
    await submitOrder(order);
    setOrders((prev) => [order, ...prev]);
    return order;
  }, []);

  const value = useMemo(() => ({ orders, loading, placeOrder }), [orders, loading, placeOrder]);
  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};
