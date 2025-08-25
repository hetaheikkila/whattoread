import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SearchComponent from '../components/SearchComponent';
import DeleteFavourite from '../components/DeleteFavourite';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);

  // Lataa tallennetut suosikit
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@favorites');
      if (jsonValue != null) {
        setFavorites(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Error loading favorites', e);
    }
  };

  const saveFavorites = async (newFavorites) => {
    try {
      await AsyncStorage.setItem('@favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (e) {
      console.error('Error saving favorites', e);
    }
  };

  // Lisää uusi suosikki
  const onAddFavorite = (book) => {
    setSelectedBook(book);
    setReview('');
    setRating(0);
  };

  const onSaveFavorite = () => {
    if (!selectedBook) return;
    const newFavorites = [
      ...favorites,
      { ...selectedBook, userReview: review, userRating: rating },
    ];
    saveFavorites(newFavorites);
    setSelectedBook(null);
    setReview('');
    setRating(0);
    setModalVisible(false);
  };

  // Poista suosikki
  const onDeleteFavorite = (bookToDelete) => {
    const newFavorites = favorites.filter(
      fav => fav.key !== bookToDelete.key && fav.title !== bookToDelete.title
    );
    saveFavorites(newFavorites);
  };

  // Tähtikomponentti
  const StarRating = ({ rating, setRating }) => (
    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => setRating(star)}>
          <Text style={{ fontSize: 32, color: star <= rating ? '#FFD700' : '#ccc' }}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Lisää uusi suosikki" onPress={() => setModalVisible(true)} />

      <FlatList
        data={favorites}
        keyExtractor={(item, index) => item.key || `${item.title}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.cover_i ? (
              <Image
                source={{ uri: `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` }}
                style={styles.bookImage}
              />
            ) : (
              <View style={[styles.bookImage, styles.noImage]}>
                <Text>Ei kuvaa</Text>
              </View>
            )}

            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.title}>{item.title}</Text>
              {item.author_name && <Text>Kirjailija: {item.author_name.join(', ')}</Text>}
              {item.userReview && <Text>Arvostelu: {item.userReview}</Text>}
              {item.userRating != null && (
                <View style={{ flexDirection: 'row' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Text
                      key={star}
                      style={{ fontSize: 20, color: star <= item.userRating ? '#FFD700' : '#ccc' }}
                    >
                      ★
                    </Text>
                  ))}
                </View>
              )}

              {/* Poista-nappi */}
              <DeleteFavourite book={item} onDelete={onDeleteFavorite} />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>Ei suosikkeja</Text>}
      />

      {/* Modal hakua ja lisäystä varten */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          {!selectedBook ? (
            <>
              <Text style={styles.heading}>Hae kirjaa lisättäväksi</Text>
              <SearchComponent onBookSelect={onAddFavorite} />
              <Button title="Sulje" onPress={() => setModalVisible(false)} />
            </>
          ) : (
            <>
              <Text style={styles.title}>{selectedBook.title}</Text>
              <StarRating rating={rating} setRating={setRating} />

              <TextInput
                placeholder="Kirjoita arvostelu"
                value={review}
                onChangeText={setReview}
                style={styles.input}
                multiline
              />

              <Button title="Tallenna suosikki" onPress={onSaveFavorite} />
              <Button
                title="Peruuta"
                onPress={() => {
                  setSelectedBook(null);
                }}
              />
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  item: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  bookImage: {
    width: 60,
    height: 90,
    backgroundColor: '#eee',
    borderRadius: 4,
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontWeight: 'bold', fontSize: 16 },
  modalContainer: { flex: 1, padding: 20 },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    height: 100,
    marginVertical: 10,
  },
});
