import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

export default function BookDetailScreen({ route }) {
  const { book } = route.params;
  const volume = book.volumeInfo;

  return (
    <ScrollView style={styles.container}>
      {volume.imageLinks?.thumbnail && (
        <Image
          source={{ uri: volume.imageLinks.thumbnail }}
          style={styles.cover}
        />
      )}
      <Text style={styles.title}>{volume.title}</Text>
      {volume.authors && (
        <Text style={styles.text}>👤 Kirjailija: {volume.authors.join(', ')}</Text>
      )}
      {volume.categories && (
        <Text style={styles.text}>📚 Genre: {volume.categories.join(', ')}</Text>
      )}
      {volume.description && (
        <Text style={styles.description}>{volume.description}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  cover: { width: 150, height: 220, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  text: { fontSize: 16, marginVertical: 5 },
  description: { marginTop: 15, fontSize: 14, lineHeight: 20 },
});
