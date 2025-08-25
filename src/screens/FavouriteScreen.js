import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

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

  const renderBookItem = ({ item }) => {
    const volume = item.volumeInfo;

    return (
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
  bookItem: { flexDirection: 'row', marginVertical: 10 },
  thumbnail: { width: 50, height: 75, marginRight: 10 },
  title: { fontSize: 16, fontWeight: 'bold', flexShrink: 1 },
  authors: { fontSize: 14, color: '#555' },
  categories: { fontSize: 14, color: '#555' },
  description: { fontSize: 12, color: '#333', marginTop: 4 },
  rating: { fontSize: 14, marginTop: 4 },
  review: { fontSize: 14, color: '#555', fontStyle: 'italic', marginTop: 2 },
});
