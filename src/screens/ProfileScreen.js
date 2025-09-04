import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmojiAvatarPicker from '../components/ProfilePicture';

export default function ProfileScreen({ onLogout }) {
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const loadAvatar = async () => {
      const saved = await AsyncStorage.getItem('userAvatar');
      if (saved) setAvatar(saved);
    };
    loadAvatar();
  }, []);

  const handleSelectAvatar = async (emoji) => {
    setAvatar(emoji);
    await AsyncStorage.setItem('userAvatar', emoji);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Valitse profiilikuva</Text>

      <EmojiAvatarPicker avatar={avatar} onSelect={handleSelectAvatar} />

      <Button title="Kirjaudu ulos" onPress={onLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  label: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
});