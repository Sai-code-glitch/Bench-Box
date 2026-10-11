// "Build your own box": pick a sport, age group and dietary needs, then choose the snacks.

export const BOX_BASE_PRICE = 4.0;
export const MIN_SNACKS = 3;
export const MAX_SNACKS = 6;

export const SPORTS = ['Soccer', 'Basketball', 'Baseball', 'Football', 'Tennis', 'Swimming', 'Other'];
export const AGE_GROUPS = ['Kids', 'Teens/Adults', 'Elite Athletes'];
export const DIETS = [
  { key: 'nutFree', label: 'Nut-free' },
  { key: 'glutenFree', label: 'Gluten-free' },
  { key: 'dairyFree', label: 'Dairy-free' },
];

// Individual snacks. Flags say what each one is free of.
export const SNACKS = [
  { id: 'orange', name: 'Orange slices', emoji: '🍊', price: 1.0, timing: 'Halftime', nutFree: true, glutenFree: true, dairyFree: true },
  { id: 'banana', name: 'Banana', emoji: '🍌', price: 0.75, timing: 'Pre-game', nutFree: true, glutenFree: true, dairyFree: true },
  { id: 'grapes', name: 'Frozen grapes', emoji: '🍇', price: 1.25, timing: 'Halftime', nutFree: true, glutenFree: true, dairyFree: true },
  { id: 'pretzels', name: 'Pretzel twists', emoji: '🥨', price: 1.0, timing: 'Post-game', nutFree: true, glutenFree: false, dairyFree: true },
  { id: 'trailmix', name: 'Trail mix', emoji: '🥜', price: 1.75, timing: 'Post-game', nutFree: false, glutenFree: true, dairyFree: true },
  { id: 'pbcrackers', name: 'PB crackers', emoji: '🍘', price: 1.5, timing: 'Post-game', nutFree: false, glutenFree: false, dairyFree: true },
  { id: 'cheese', name: 'Cheese stick', emoji: '🧀', price: 1.25, timing: 'Post-game', nutFree: true, glutenFree: true, dairyFree: false },
  { id: 'yogurt', name: 'Yogurt tube', emoji: '🥛', price: 1.25, timing: 'Post-game', nutFree: true, glutenFree: true, dairyFree: false },
  { id: 'oatbar', name: 'Oat energy bar', emoji: '🌾', price: 1.75, timing: 'Pre-game', nutFree: true, glutenFree: false, dairyFree: true },
  { id: 'ricecake', name: 'Rice cakes', emoji: '🍙', price: 1.0, timing: 'Pre-game', nutFree: true, glutenFree: true, dairyFree: true },
  { id: 'applesauce', name: 'Applesauce pouch', emoji: '🍏', price: 1.0, timing: 'Halftime', nutFree: true, glutenFree: true, dairyFree: true },
  { id: 'electrolyte', name: 'Electrolyte drink', emoji: '🧃', price: 1.5, timing: 'Halftime', nutFree: true, glutenFree: true, dairyFree: true },
  { id: 'chocmilk', name: 'Chocolate milk', emoji: '🍫', price: 1.5, timing: 'Post-game', nutFree: true, glutenFree: true, dairyFree: false },
  { id: 'jerky', name: 'Turkey jerky', emoji: '🥩', price: 2.25, timing: 'Post-game', nutFree: true, glutenFree: true, dairyFree: true },
];

export function snacksForDiet(diet = {}) {
  return SNACKS.filter((snack) => DIETS.every(({ key }) => !diet[key] || snack[key]));
}

export function toggleSnack(selected, snackId) {
  if (selected.includes(snackId)) return selected.filter((id) => id !== snackId);
  if (selected.length >= MAX_SNACKS) return selected;
  return [...selected, snackId];
}

export function boxPrice(selected) {
  const cents = selected.reduce((sum, id) => {
    const snack = SNACKS.find((s) => s.id === id);
    return sum + (snack ? Math.round(snack.price * 100) : 0);
  }, Math.round(BOX_BASE_PRICE * 100));
  return cents / 100;
}

// Drop snacks that no longer fit after the dietary filters change.
export function pruneForDiet(selected, diet) {
  const allowed = new Set(snacksForDiet(diet).map((s) => s.id));
  return selected.filter((id) => allowed.has(id));
}

export function buildCustomBox({ sport, ageGroup, diet = {}, selected, playerName = '', now = Date.now() }) {
  if (selected.length < MIN_SNACKS) {
    throw new Error(`Pick at least ${MIN_SNACKS} snacks.`);
  }
  const snacks = selected.map((id) => SNACKS.find((s) => s.id === id)).filter(Boolean);
  const dietLabels = DIETS.filter(({ key }) => diet[key]).map(({ label }) => label);
  const label = playerName.trim() ? `${playerName.trim()}'s` : 'Custom';
  return {
    id: `custom-${now}`,
    name: `${label} ${sport} Box`,
    category: ageGroup,
    tagline: dietLabels.length ? dietLabels.join(' · ') : 'Built by you',
    price: boxPrice(selected),
    image: null,
    custom: true,
    details: {
      sport,
      ageGroup,
      diet: dietLabels,
      snacks: snacks.map((s) => s.name),
    },
  };
}
