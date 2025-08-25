import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

//yksittäisen kirjan "kortti", näyttää kirjan attribuutit kirjalistassa.
export default function BookCard({ book }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{book.title}</Text>
      <Image source={{ uri: book.image }} style={styles.image} />
      <Text>{book.genre}</Text>
    </View>
  );
}

//tyylittely
const styles = StyleSheet.create({
  card: { padding: 10, marginBottom: 10, borderWidth: 1, borderRadius: 5 },
  image: { width: 100, height: 100, marginTop: 5 },
  title: { fontWeight: 'bold' },
});
