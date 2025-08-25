import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

export default function SearchComponent({ onBookSelect }) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResult(data.docs.slice(0, 10));
    } catch (error) {
      console.error('Hakivirhe:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Syötä kirjan nimi"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <Button title="Hae" onPress={handleSearch} />
      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      {result && (
        <ScrollView style={{ maxHeight: 300 }}>
          {result.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.item}
              onPress={() => onBookSelect(item)}
            >
              <Text style={styles.title}>{item.title}</Text>
              {item.author_name && (
                <Text>Kirjailija: {item.author_name.join(', ')}</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontWeight: 'bold',
  },
});
