import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync('favorites');
      setFavorites(stored ? JSON.parse(stored) : []);
    })();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.volumeInfo.title}</Text>
            <Text>{item.volumeInfo.authors?.join(', ')}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Ei suosikkeja</Text>}
      />
    </View>
  );
}
