import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const HomeScreen = ({ navigation }) => {
  const { colors } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.heading, { color: colors.text }]}>🏋️‍♂️ BenchBox Snacks</Text>
      <Text style={[styles.subtext, { color: colors.text }]}>
        Healthy pre- and post-game fuel delivered to your door.
      </Text>

      <View style={{ marginBottom: 10 }}>
        <Button
          title="Browse Snack Packs"
          onPress={() => navigation.navigate('Snack Packs')}
          color={colors.primary}
        />
      </View>

      <Button
        title="View Cart"
        onPress={() => navigation.navigate('Cart')}
        color="darkgreen"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    marginBottom: 20,
  }
});

export default HomeScreen;
