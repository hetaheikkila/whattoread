import React, { useState, useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import LoginScreen from './src/screens/LoginScreen'; // polku omaan LoginScreen.js

const Stack = createNativeStackNavigator();

// Näkymät
function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Aloitussivu</Text>
      <Button title="Suosikit" onPress={() => navigation.navigate('Favorites')} />
      <Button title="Profiili" onPress={() => navigation.navigate('Profile')} />
    </View>
  );
}

function FavoritesScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Suosikit</Text>
    </View>
  );
}

function ProfileScreen({ onLogout }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profiili</Text>
      <Button title="Kirjaudu ulos" onPress={onLogout} />
    </View>
  );
}

// Sovellus
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const user = await SecureStore.getItemAsync('loggedInUser');
      setLoggedIn(!!user);
      setLoading(false);
    })();
  }, []);

  const handleLogin = () => setLoggedIn(true);
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('loggedInUser');
    setLoggedIn(false);
  };

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {!loggedIn ? (
          <Stack.Screen name="Login">
            {() => <LoginScreen onLogin={handleLogin} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
            <Stack.Screen name="Profile">
              {() => <ProfileScreen onLogout={handleLogout} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
