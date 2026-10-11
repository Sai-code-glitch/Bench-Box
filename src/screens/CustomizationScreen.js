// Build Your Own Box: choose the sport, age group and dietary needs, then pick the snacks.
import React, { useContext, useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable } from 'react-native';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';
import PrimaryButton from '../components/PrimaryButton';
import { formatPrice } from '../logic/cart';
import {
  AGE_GROUPS, DIETS, SPORTS, MAX_SNACKS, MIN_SNACKS, BOX_BASE_PRICE,
  boxPrice, buildCustomBox, pruneForDiet, snacksForDiet, toggleSnack,
} from '../logic/customBox';

const Chip = ({ label, selected, onPress, colors }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{ selected }}
    onPress={onPress}
    style={[
      styles.chip,
      { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.primary : 'transparent' },
    ]}
  >
    <Text style={{ color: selected ? colors.onPrimary : colors.text, fontWeight: '600' }}>{label}</Text>
  </Pressable>
);

const CustomizationScreen = ({ navigation }) => {
  const { colors } = useContext(ThemeContext);
  const { addToCart } = useContext(CartContext);

  const [sport, setSport] = useState('Soccer');
  const [ageGroup, setAgeGroup] = useState('Kids');
  const [diet, setDiet] = useState({});
  const [selected, setSelected] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [message, setMessage] = useState('');

  const available = useMemo(() => snacksForDiet(diet), [diet]);
  const price = boxPrice(selected);
  const remaining = MIN_SNACKS - selected.length;

  const toggleDiet = (key) => {
    const next = { ...diet, [key]: !diet[key] };
    setDiet(next);
    setSelected((prev) => pruneForDiet(prev, next));
  };

  const handleAdd = () => {
    try {
      const box = buildCustomBox({ sport, ageGroup, diet, selected, playerName });
      addToCart(box);
      setSelected([]);
      setPlayerName('');
      setMessage(`${box.name} added to cart.`);
      navigation.getParent()?.navigate('Cart');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Build your own box</Text>
        <Text style={{ color: colors.muted, marginBottom: 12 }}>
          Pick {MIN_SNACKS} to {MAX_SNACKS} snacks. {formatPrice(BOX_BASE_PRICE)} box and packing, plus each snack.
        </Text>

        <Text style={[styles.label, { color: colors.text }]}>Sport</Text>
        <View style={styles.chips}>
          {SPORTS.map((s) => (
            <Chip key={s} label={s} selected={sport === s} onPress={() => setSport(s)} colors={colors} />
          ))}
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Who's it for?</Text>
        <View style={styles.chips}>
          {AGE_GROUPS.map((a) => (
            <Chip key={a} label={a} selected={ageGroup === a} onPress={() => setAgeGroup(a)} colors={colors} />
          ))}
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Dietary needs</Text>
        <View style={styles.chips}>
          {DIETS.map(({ key, label }) => (
            <Chip key={key} label={label} selected={!!diet[key]} onPress={() => toggleDiet(key)} colors={colors} />
          ))}
        </View>

        <Text style={[styles.label, { color: colors.text }]}>
          Snacks ({selected.length}/{MAX_SNACKS})
        </Text>
        <View style={styles.grid}>
          {available.map((snack) => {
            const isOn = selected.includes(snack.id);
            const full = !isOn && selected.length >= MAX_SNACKS;
            return (
              <Pressable
                key={snack.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isOn, disabled: full }}
                accessibilityLabel={`${snack.name}, ${formatPrice(snack.price)}`}
                onPress={() => setSelected((prev) => toggleSnack(prev, snack.id))}
                disabled={full}
                style={[
                  styles.snack,
                  { backgroundColor: colors.card, borderColor: isOn ? colors.primary : 'transparent', opacity: full ? 0.45 : 1 },
                ]}
              >
                <Text style={styles.snackEmoji}>{snack.emoji}</Text>
                <Text style={[styles.snackName, { color: colors.text }]}>{snack.name}</Text>
                <Text style={{ color: colors.muted, fontSize: 12 }}>{snack.timing} · {formatPrice(snack.price)}</Text>
                {isOn ? <Text style={[styles.check, { color: colors.primary }]}>✓</Text> : null}
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Player name (optional)</Text>
        <TextInput
          value={playerName}
          onChangeText={setPlayerName}
          maxLength={30}
          placeholder="Printed on the box, e.g. Maya"
          placeholderTextColor={colors.muted}
          style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]}
        />
        {message ? <Text style={{ color: colors.muted, marginTop: 10 }}>{message}</Text> : null}
      </ScrollView>

      <View style={[styles.footer, { borderColor: colors.border, backgroundColor: colors.background }]}>
        <View>
          <Text style={{ color: colors.muted, fontSize: 12 }}>{sport} · {ageGroup}</Text>
          <Text style={[styles.price, { color: colors.text }]}>{formatPrice(price)}</Text>
        </View>
        <PrimaryButton
          title={remaining > 0 ? `Pick ${remaining} more` : 'Add Box to Cart'}
          disabled={remaining > 0}
          onPress={handleAdd}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  label: { fontSize: 15, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1.5, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  snack: { width: '47%', flexGrow: 1, borderRadius: 14, padding: 12, borderWidth: 2 },
  snackEmoji: { fontSize: 26, marginBottom: 4 },
  snackName: { fontWeight: '700', fontSize: 15 },
  check: { position: 'absolute', top: 8, right: 10, fontSize: 18, fontWeight: '800' },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 16 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, borderTopWidth: 1 },
  price: { fontSize: 22, fontWeight: '800' },
});

export default CustomizationScreen;
