import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Swipeable, RectButton } from 'react-native-gesture-handler';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Virhe ladatessa suosikkeja:', error);
      setFavorites([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const handleDeleteFavorite = async (book) => {
    try {
      const updatedFavorites = favorites.filter(fav => fav.id !== book.id);
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Virhe suosikin poistossa:', error);
    }
  };

  const renderRightActions = (progress, dragX, book) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.8],
      extrapolate: 'clamp',
    });

    return (
      <RectButton
        style={styles.deleteButton}
        onPress={() => handleDeleteFavorite(book)}
      >
        <Animated.Text style={[styles.deleteText, { transform: [{ scale }] }]}>
          Poista
        </Animated.Text>
      </RectButton>
    );
  };

  const renderBookItem = ({ item }) => {
    const volume = item.volumeInfo;

    return (
      <Swipeable
        renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
        onSwipeableOpen={() => handleDeleteFavorite(item)} // poistaa kun swipattu kokonaan
      >
        <View style={styles.bookItem}>
          {volume.imageLinks?.thumbnail && (
            <Image source={{ uri: volume.imageLinks.thumbnail }} style={styles.thumbnail} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{volume.title}</Text>
            {volume.authors && <Text style={styles.authors}>Kirjailija: {volume.authors.join(', ')}</Text>}
            {volume.categories && <Text style={styles.categories}>Genre: {volume.categories.join(', ')}</Text>}
            {volume.description && <Text style={styles.description}>{volume.description}</Text>}

            {item.userRating != null && <Text style={styles.rating}>⭐ {item.userRating}/5</Text>}
            {item.userReview && <Text style={styles.review}>📝 {item.userReview}</Text>}
          </View>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text>Ei vielä suosikkeja 📚</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderBookItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  bookItem: {
    flexDirection: 'row',
    marginVertical: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
  },
  thumbnail: { width: 50, height: 75, marginRight: 10 },
  title: { fontSize: 16, fontWeight: 'bold', flexShrink: 1 },
  authors: { fontSize: 14, color: '#555' },
  categories: { fontSize: 14, color: '#555' },
  description: { fontSize: 12, color: '#333', marginTop: 4 },
  rating: { fontSize: 14, marginTop: 4 },
  review: { fontSize: 14, color: '#555', fontStyle: 'italic', marginTop: 2 },

  deleteButton: {
    backgroundColor: '#e63946',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 8,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
