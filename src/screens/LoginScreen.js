import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

const demoUser = {
  username: 'maija',
  password: '123',
};

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (username === demoUser.username && password === demoUser.password) {
      await SecureStore.setItemAsync('loggedInUser', JSON.stringify({ username }));
      onLogin();
    } else {
      Alert.alert('Virhe', 'Virheellinen käyttäjätunnus tai salasana');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.box}>
        <Text style={styles.title}>Kirjaudu sisään</Text>

        <TextInput
          placeholder="Käyttäjätunnus"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          placeholder="Salasana"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Kirjaudu</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  box: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
