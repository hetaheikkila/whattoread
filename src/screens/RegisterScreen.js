import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function RegisterScreen({ navigation, onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert("Virhe", "Täytä kaikki kentät");
      return;
    }

    try {
      await SecureStore.setItemAsync(
        'registeredUser',
        JSON.stringify({ username, password })
      );

      Alert.alert("Onnistui", "Käyttäjä rekisteröity!");
      onRegister();
    } catch (error) {
      console.error("Virhe rekisteröinnissä:", error);
      Alert.alert("Virhe", "Rekisteröinti epäonnistui");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Luo käyttäjä</Text>

      <TextInput
        style={styles.input}
        placeholder="Käyttäjätunnus"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Salasana"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Rekisteröidy</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Onko sinulla jo tili? Kirjaudu sisään</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { color: '#007AFF', marginTop: 10 },
});
