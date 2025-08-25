import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

export default function DeleteFavourite({ book, onDelete }) {
  const handleDelete = () => {
    Alert.alert(
      "Poista suosikki",
      `Haluatko varmasti poistaa kirjan "${book.title}" suosikeista?`,
      [
        { text: "Peruuta", style: "cancel" },
        { text: "Poista", style: "destructive", onPress: () => onDelete(book) }
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleDelete}>
      <Text style={styles.buttonText}>Poista</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#e63946",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    marginTop: 5,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
