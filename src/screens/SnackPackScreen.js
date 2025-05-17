import React, { useContext, useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';
import SnackCard from '../components/SnackCard';
import snackPackData from '../data/snackPackData';
import debounce from 'lodash.debounce';

const SnackPackScreen = ({ navigation }) => {
  const { addToCart } = useContext(CartContext);
  const { colors, isDarkMode, toggleTheme } = useContext(ThemeContext);

  const [searchText, setSearchText] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState('All');

  const groupedByCategory = {
    Kids: snackPackData.filter((item) => item.category === 'Kids'),
    'Teens/Adults': snackPackData.filter((item) => item.category === 'Teens/Adults'),
    'Elite Athletes': snackPackData.filter((item) => item.category === 'Elite Athletes'),
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    alert(`${item.name} added to cart`);
  };

  const debouncedSearch = useMemo(() => debounce((text) => setSearchText(text), 300), []);

  const filterAndSearch = (items) =>
    items.filter(
      (item) =>
        (filter === 'All' || item.category === filter) &&
        item.name.toLowerCase().includes(searchText.toLowerCase())
    );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>BenchBox Snack Packs</Text>
        <TouchableOpacity onPress={toggleTheme}>
          <Text style={[styles.toggleText, { color: colors.primary }]}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Search Snack Packs"
        onChangeText={debouncedSearch}
        placeholderTextColor={colors.text}
        style={[styles.searchBox, { borderColor: colors.card, color: colors.text }]}
      />

      <View style={styles.row}>
        <Picker
          selectedValue={filter}
          onValueChange={(value) => setFilter(value)}
          style={[styles.picker, { color: colors.text }]}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Kids" value="Kids" />
          <Picker.Item label="Teens/Adults" value="Teens/Adults" />
          <Picker.Item label="Elite Athletes" value="Elite Athletes" />
        </Picker>

        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Text style={[styles.cartButton, { color: colors.primary }]}>Go to Cart</Text>
        </TouchableOpacity>
      </View>

      {Object.keys(groupedByCategory).map((category) => {
        const filteredItems = filterAndSearch(groupedByCategory[category]);
        if (filteredItems.length === 0) return null;

        return (
          <View key={category} style={{ marginBottom: 25 }}>
            <Text style={[styles.categoryTitle, { color: colors.text }]}>{category}</Text>
            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <SnackCard
                  item={item}
                  onPress={() => setSelectedItem(item)}
                  onAddToCart={handleAddToCart}
                />
              )}
            />
          </View>
        );
      })}

      <Modal
        visible={!!selectedItem}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <Image
            source={{ uri: selectedItem?.image }}
            style={styles.modalImage}
            resizeMode="contain"
          />
          <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedItem?.name}</Text>
          <Text style={[styles.modalTagline, { color: colors.accent }]}>{selectedItem?.tagline}</Text>
          <Text style={[styles.modalText, { color: colors.text }]}>
            Target: {selectedItem?.category}
          </Text>
          <Text style={[styles.modalText, { color: colors.text }]}>Price: {selectedItem?.price}</Text>
          <Text style={[styles.modalDesc, { color: colors.text }]}>
            This performance snack pack is ideal for {selectedItem?.category.toLowerCase()}. Packed with
            essential nutrients to help with recovery, energy, and focus.
          </Text>
          <TouchableOpacity onPress={() => setSelectedItem(null)}>
            <Text style={[styles.closeText, { color: colors.primary }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 22, fontWeight: 'bold' },
  toggleText: { fontSize: 16 },
  searchBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  picker: { flex: 1 },
  cartButton: { fontSize: 16, marginLeft: 10 },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 10,
  },
  modalContent: { flex: 1, padding: 20 },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalTagline: { fontSize: 16, marginBottom: 6 },
  modalText: { fontSize: 16, marginBottom: 4 },
  modalDesc: { marginVertical: 10, fontSize: 14 },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  closeText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default SnackPackScreen;
