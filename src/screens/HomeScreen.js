import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { OrdersContext } from '../context/OrdersContext';
import { AnimatedView } from '../utils/AnimationUtils';
import PrimaryButton from '../components/PrimaryButton';
import { formatPrice } from '../logic/cart';

const GROUPS = [
  { title: 'Kids', blurb: 'Halftime oranges, juice and crunch for young players.', emoji: '⚽' },
  { title: 'Teens/Adults', blurb: 'Steady energy for practice and weekend games.', emoji: '🏀' },
  { title: 'Elite Athletes', blurb: 'Recovery-focused packs for hard training days.', emoji: '🏃' },
];

const HomeScreen = ({ navigation }) => {
  const { colors, isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { orders } = useContext(OrdersContext);
  const lastOrder = orders[0];

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <AnimatedView animation="slideInUp">
        <Text style={[styles.heading, { color: colors.text }]}>🥤 BenchBox Snacks</Text>
        <Text style={[styles.subtext, { color: colors.muted }]}>
          The snack pack after the kick. Healthy pre-game, halftime and post-game fuel, delivered before game day.
        </Text>
      </AnimatedView>

      <View style={styles.actions}>
        <PrimaryButton title="Browse Snack Packs" onPress={() => navigation.navigate('Snack Packs')} />
        <PrimaryButton title="Build Your Own Box" variant="outline" onPress={() => navigation.navigate('Customize')} />
      </View>

      <Text style={[styles.section, { color: colors.text }]}>Packs for every bench</Text>
      {GROUPS.map((g, i) => (
        <AnimatedView key={g.title} animation="slideInLeft" delay={100 * i}>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('Snack Packs', { category: g.title })}
            style={[styles.group, { backgroundColor: colors.card }]}
          >
            <Text style={styles.groupEmoji}>{g.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.groupTitle, { color: colors.text }]}>{g.title}</Text>
              <Text style={{ color: colors.muted }}>{g.blurb}</Text>
            </View>
          </Pressable>
        </AnimatedView>
      ))}

      {lastOrder ? (
        <Pressable
          onPress={() => navigation.getParent()?.navigate('Orders')}
          style={[styles.group, { backgroundColor: colors.card, marginTop: 8 }]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.groupTitle, { color: colors.text }]}>Last order {lastOrder.id}</Text>
            <Text style={{ color: colors.muted }}>
              {lastOrder.itemCount} item{lastOrder.itemCount === 1 ? '' : 's'} · {formatPrice(lastOrder.total)} · {lastOrder.status}
            </Text>
          </View>
        </Pressable>
      ) : null}

      <Pressable onPress={toggleTheme} accessibilityRole="button" style={styles.themeToggle}>
        <Text style={{ color: colors.primary, fontWeight: '600' }}>{isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
  subtext: { fontSize: 16, lineHeight: 22, marginBottom: 20 },
  actions: { gap: 10, marginBottom: 28 },
  section: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  group: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 14, marginBottom: 10 },
  groupEmoji: { fontSize: 30 },
  groupTitle: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  themeToggle: { alignSelf: 'center', marginTop: 20, padding: 8 },
});

export default HomeScreen;
