import React, { useState } from 'react';
import { View, Text, Image, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { G_API_KEY } from '@env';

const API_KEY = G_API_KEY;

export default function HomeScreen({ navigation }) {
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState([]);
  
    const searchBooks = async () => {
      if (!query) return;
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`
        );
        const data = await response.json();
        setBooks(data.items || []);
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Hae kirjaa..."
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
        <Button title="Hae" onPress={searchBooks} />
  
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const volume = item.volumeInfo;
            return (
              <TouchableOpacity
                style={styles.bookItem}
                onPress={() => navigation.navigate('BookDetail', { book: item })}
              >
                {volume.imageLinks?.thumbnail && (
                  <Image
                    source={{ uri: volume.imageLinks.thumbnail }}
                    style={styles.thumbnail}
                  />
                )}
                <Text style={styles.title}>{volume.title}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    input: { borderWidth: 1, padding: 8, marginBottom: 10 },
    bookItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
    thumbnail: { width: 50, height: 75, marginRight: 10 },
    title: { fontSize: 16, flexShrink: 1 },
  });