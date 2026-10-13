// Pure cart and order helpers. No React here, so they can be unit tested with Node.

export const MAX_QUANTITY = 20;

export function parsePrice(price) {
  if (typeof price === 'number') return Number.isFinite(price) ? price : 0;
  const value = parseFloat(String(price ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(value) ? value : 0;
}

export function formatPrice(amount) {
  return `$${(Math.round(parsePrice(amount) * 100) / 100).toFixed(2)}`;
}

// Older app versions saved the cart as a list with one entry per tap and no quantity.
export function normalizeCart(saved) {
  if (!Array.isArray(saved)) return [];
  return saved.reduce((cart, item) => {
    if (!item || item.id == null) return cart;
    return addItem(cart, item, item.quantity || 1);
  }, []);
}

export function addItem(cart, item, quantity = 1) {
  const existing = cart.find((line) => line.id === item.id);
  if (existing) {
    return cart.map((line) =>
      line.id === item.id
        ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + quantity) }
        : line
    );
  }
  const { quantity: _ignored, ...rest } = item;
  return [...cart, { ...rest, quantity: Math.min(MAX_QUANTITY, Math.max(1, quantity)) }];
}

export function removeItem(cart, itemOrId) {
  const id = typeof itemOrId === 'object' && itemOrId !== null ? itemOrId.id : itemOrId;
  return cart.filter((line) => line.id !== id);
}

export function setQuantity(cart, id, quantity) {
  if (quantity <= 0) return removeItem(cart, id);
  return cart.map((line) =>
    line.id === id ? { ...line, quantity: Math.min(MAX_QUANTITY, Math.floor(quantity)) } : line
  );
}

export function cartCount(cart) {
  return cart.reduce((sum, line) => sum + (line.quantity || 1), 0);
}

export function cartTotal(cart) {
  const cents = cart.reduce(
    (sum, line) => sum + Math.round(parsePrice(line.price) * 100) * (line.quantity || 1),
    0
  );
  return cents / 100;
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function validateCustomer({ name, email, address }) {
  const errors = {};
  if (!name || !name.trim()) errors.name = 'Enter your full name.';
  if (!email || !EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address.';
  if (!address || address.trim().length < 8) errors.address = 'Enter a full delivery address.';
  return errors;
}

export function buildOrder({ cart, customer, now = new Date(), id }) {
  return {
    id: id || `BB-${now.getTime().toString(36).toUpperCase()}`,
    createdAt: now.toISOString(),
    status: 'Placed',
    customer: {
      name: customer.name.trim(),
      email: customer.email.trim(),
      address: customer.address.trim(),
    },
    items: cart.map((line) => ({
      id: line.id,
      name: line.name,
      price: parsePrice(line.price),
      quantity: line.quantity || 1,
      details: line.details || null,
    })),
    itemCount: cartCount(cart),
    total: cartTotal(cart),
  };
}
