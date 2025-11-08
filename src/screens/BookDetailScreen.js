import React, { useState } from 'react';
import { View, Text, Image, Button, TextInput, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BookDetailScreen({ route }) {
  const { book } = route.params;
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');

  const addFavorite = async () => {
    const storedFavorites = await AsyncStorage.getItem('favorites');
    const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

    if (!favorites.some(item => item.id === book.id)) {
      favorites.push({
        ...book,
        userRating: rating ? parseInt(rating) : null,
        userReview: review || null
      });
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      alert('Kirja lisätty suosikkeihin!');
    } else {
      alert('Kirja on jo suosikeissa.');
    }
  };

  const volume = book.volumeInfo;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {volume.imageLinks?.thumbnail && (
        <Image source={{ uri: volume.imageLinks.thumbnail }} style={styles.thumbnail} />
      )}
      <Text style={styles.title}>{volume.title}</Text>
      {volume.authors && <Text style={styles.authors}>Kirjailija: {volume.authors.join(', ')}</Text>}
      {volume.categories && <Text style={styles.categories}>Genre: {volume.categories.join(', ')}</Text>}
      {volume.description && <Text style={styles.description}>{volume.description}</Text>}

      <Text style={styles.label}>Anna tähdet (1-5):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={rating}
        onChangeText={setRating}
        placeholder="esim. 4"
        maxLength={1}
      />

      <Text style={styles.label}>Kirjoita arvostelu:</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        value={review}
        onChangeText={setReview}
        placeholder="Kirjoita arvostelu..."
      />

      <View style={styles.buttons}>
        <Button title="Lisää suosikkeihin" onPress={addFavorite} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  thumbnail: { width: 120, height: 180, marginBottom: 20, alignSelf: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  authors: { fontSize: 16, marginBottom: 5, textAlign: 'center' },
  categories: { fontSize: 16, marginBottom: 10, textAlign: 'center' },
  description: { fontSize: 14, color: '#333', marginBottom: 20 },
  label: { fontSize: 14, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginTop: 5, borderRadius: 5 },
  buttons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
});