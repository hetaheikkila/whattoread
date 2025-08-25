import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import bcrypt from 'bcryptjs';

const demoUser = {
  username: 'maija',
  passwordHash: bcrypt.hashSync('Salasana123!', 10),
};

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (username === demoUser.username && bcrypt.compareSync(password, demoUser.passwordHash)) {
      await SecureStore.setItemAsync('loggedInUser', JSON.stringify({ username }));
      onLogin(); //kertoo että kirjautuminen onnistui
    } else {
      Alert.alert('Virheellinen käyttäjätunnus tai salasana');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Käyttäjätunnus"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Salasana"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />
      <Button title="Kirjaudu" onPress={handleLogin} />
    </View>
  );
}
