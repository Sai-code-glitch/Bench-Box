import test from 'node:test';
import assert from 'node:assert/strict';

import {
  addItem, removeItem, setQuantity, cartCount, cartTotal, normalizeCart,
  parsePrice, formatPrice, validateCustomer, buildOrder, MAX_QUANTITY,
} from '../src/logic/cart.js';
import {
  snacksForDiet, toggleSnack, boxPrice, pruneForDiet, buildCustomBox, MAX_SNACKS, BOX_BASE_PRICE,
} from '../src/logic/customBox.js';

const pack = { id: '1', name: 'BenchBox Elite Pack 1', price: '$15.28' };
const kids = { id: '6', name: 'BenchBox Kids Pack 6', price: '$13.3' };

test('parsePrice and formatPrice', () => {
  assert.equal(parsePrice('$15.28'), 15.28);
  assert.equal(parsePrice(4.5), 4.5);
  assert.equal(parsePrice('abc'), 0);
  assert.equal(formatPrice('$13.3'), '$13.30');
});

test('adding the same pack twice increases quantity instead of duplicating', () => {
  let cart = addItem([], pack);
  cart = addItem(cart, pack);
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 2);
});

test('quantity is capped', () => {
  let cart = addItem([], pack, MAX_QUANTITY);
  cart = addItem(cart, pack);
  assert.equal(cart[0].quantity, MAX_QUANTITY);
});

test('remove works with an id or the whole item (the old bug)', () => {
  const cart = addItem(addItem([], pack), kids);
  assert.deepEqual(removeItem(cart, pack).map((l) => l.id), ['6']);
  assert.deepEqual(removeItem(cart, '6').map((l) => l.id), ['1']);
});

test('setQuantity updates and removes at zero', () => {
  const cart = addItem([], pack);
  assert.equal(setQuantity(cart, '1', 3)[0].quantity, 3);
  assert.equal(setQuantity(cart, '1', 0).length, 0);
});

test('totals use cents so they never drift', () => {
  let cart = addItem([], pack, 3); // 45.84
  cart = addItem(cart, kids); // 13.30
  assert.equal(cartTotal(cart), 59.14);
  assert.equal(cartCount(cart), 4);
});

test('old saved carts (one entry per tap) are merged into quantities', () => {
  const cart = normalizeCart([pack, pack, kids, null, { name: 'no id' }]);
  assert.deepEqual(cart.map((l) => [l.id, l.quantity]), [['1', 2], ['6', 1]]);
  assert.deepEqual(normalizeCart('garbage'), []);
});

test('customer validation', () => {
  assert.deepEqual(validateCustomer({ name: 'Sam', email: 'sam@example.com', address: '12 Main St, Troy' }), {});
  const errors = validateCustomer({ name: ' ', email: 'nope', address: 'x' });
  assert.deepEqual(Object.keys(errors).sort(), ['address', 'email', 'name']);
});

test('buildOrder snapshots the cart', () => {
  const cart = addItem(addItem([], pack, 2), kids);
  const order = buildOrder({
    cart,
    customer: { name: ' Sam ', email: 'sam@example.com ', address: '12 Main St, Troy' },
    now: new Date('2026-10-11T12:00:00Z'),
  });
  assert.equal(order.total, 43.86);
  assert.equal(order.itemCount, 3);
  assert.equal(order.customer.name, 'Sam');
  assert.equal(order.items[0].price, 15.28);
  assert.equal(order.createdAt, '2026-10-11T12:00:00.000Z');
  assert.match(order.id, /^BB-/);
});

test('dietary filters only show safe snacks', () => {
  const nutFree = snacksForDiet({ nutFree: true });
  assert.ok(nutFree.every((s) => s.nutFree));
  assert.ok(!nutFree.find((s) => s.id === 'trailmix'));
  const strict = snacksForDiet({ nutFree: true, glutenFree: true, dairyFree: true });
  assert.ok(strict.length > 3);
  assert.ok(strict.every((s) => s.nutFree && s.glutenFree && s.dairyFree));
});

test('toggleSnack respects the maximum', () => {
  let selected = [];
  for (const id of ['orange', 'banana', 'grapes', 'pretzels', 'cheese', 'yogurt', 'jerky']) {
    selected = toggleSnack(selected, id);
  }
  assert.equal(selected.length, MAX_SNACKS);
  assert.deepEqual(toggleSnack(selected, 'orange').includes('orange'), false);
});

test('box price and pruning', () => {
  assert.equal(boxPrice([]), BOX_BASE_PRICE);
  assert.equal(boxPrice(['orange', 'banana', 'jerky']), 8.0);
  assert.deepEqual(pruneForDiet(['orange', 'cheese', 'trailmix'], { nutFree: true, dairyFree: true }), ['orange']);
});

test('buildCustomBox makes a cart-ready item', () => {
  assert.throws(() => buildCustomBox({ sport: 'Soccer', ageGroup: 'Kids', selected: ['orange'] }));
  const box = buildCustomBox({
    sport: 'Soccer', ageGroup: 'Kids', diet: { nutFree: true }, selected: ['orange', 'banana', 'electrolyte'],
    playerName: 'Maya', now: 123,
  });
  assert.equal(box.id, 'custom-123');
  assert.equal(box.name, "Maya's Soccer Box");
  assert.equal(box.price, 7.25);
  assert.deepEqual(box.details.snacks, ['Orange slices', 'Banana', 'Electrolyte drink']);
  assert.deepEqual(box.details.diet, ['Nut-free']);
});
