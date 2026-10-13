import React, { useContext, useState, useMemo, useEffect, useRef } from 'react';
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
import PrimaryButton from '../components/PrimaryButton';
import { formatPrice } from '../logic/cart';

const SnackPackScreen = ({ navigation, route }) => {
  const { addToCart, itemCount } = useContext(CartContext);
  const { colors, isDarkMode, toggleTheme } = useContext(ThemeContext);

  const [searchText, setSearchText] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState(route?.params?.category || 'All');
  const [notice, setNotice] = useState('');
  const noticeTimer = useRef(null);

  // Opening from a Home category card pre-selects that category.
  useEffect(() => {
    if (route?.params?.category) setFilter(route.params.category);
  }, [route?.params?.category]);

  useEffect(() => () => clearTimeout(noticeTimer.current), []);

  const groupedByCategory = {
    Kids: snackPackData.filter((item) => item.category === 'Kids'),
    'Teens/Adults': snackPackData.filter((item) => item.category === 'Teens/Adults'),
    'Elite Athletes': snackPackData.filter((item) => item.category === 'Elite Athletes'),
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    setNotice(`${item.name} added to cart`);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(''), 2200);
  };

  const goToCart = () => navigation.getParent()?.navigate('Cart');

  const debouncedSearch = useMemo(() => debounce((text) => setSearchText(text), 300), []);

  const filterAndSearch = (items) =>
    items.filter(
      (item) =>
        (filter === 'All' || item.category === filter) &&
        item.name.toLowerCase().includes(searchText.toLowerCase())
    );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 40 }}>
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

        <TouchableOpacity onPress={goToCart} accessibilityRole="button">
          <Text style={[styles.cartButton, { color: colors.primary }]}>
            Go to Cart{itemCount ? ` (${itemCount})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('Customize')}
        accessibilityRole="button"
        style={[styles.buildCard, { backgroundColor: colors.card, borderColor: colors.primary }]}
      >
        <Text style={[styles.buildTitle, { color: colors.text }]}>🛠️ Build your own box</Text>
        <Text style={{ color: colors.muted }}>Pick the sport, allergies and the exact snacks.</Text>
      </TouchableOpacity>

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
          <Text style={[styles.modalText, { color: colors.text }]}>Price: {selectedItem ? formatPrice(selectedItem.price) : ''}</Text>
          <Text style={[styles.modalDesc, { color: colors.text }]}>
            This performance snack pack is ideal for {selectedItem?.category?.toLowerCase()}. Packed with
            essential nutrients to help with recovery, energy, and focus.
          </Text>
          <PrimaryButton
            title="Add to Cart"
            onPress={() => {
              handleAddToCart(selectedItem);
              setSelectedItem(null);
            }}
          />
          <TouchableOpacity onPress={() => setSelectedItem(null)} accessibilityRole="button">
            <Text style={[styles.closeText, { color: colors.primary }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
    {notice ? (
      <View style={[styles.notice, { backgroundColor: colors.text }]} accessibilityLiveRegion="polite" pointerEvents="none">
        <Text style={{ color: colors.background, fontWeight: '600' }}>{notice}</Text>
      </View>
    ) : null}
    </View>
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
  buildCard: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
    marginBottom: 6,
  },
  buildTitle: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  notice: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
});

export default SnackPackScreen;
