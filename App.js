import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SecureStore from 'expo-secure-store';
import HomeScreen from './src/screens/HomeScreen';
import FavoritesScreen from './src/screens/FavouriteScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function MainTabs({ onLogout }) {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Aloitussivu" component={HomeScreen} />
      <Tab.Screen name="Suosikit" component={FavoritesScreen} />
      <Tab.Screen name="Profiili">
        {props => <ProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

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

  const handleLogin = async () => {
    await SecureStore.setItemAsync('loggedInUser', 'dummyUser');
    setLoggedIn(true);
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('loggedInUser');
    setLoggedIn(false);
  };

  if (loading) return null;

    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {!loggedIn ? (
              <Stack.Screen name="Login" options={{ headerShown: false }}>
                {props => <LoginScreen {...props} onLogin={handleLogin} />}
              </Stack.Screen>
            ) : (
              <>
                <Stack.Screen name="Main" options={{ headerShown: false }}>
                  {props => <MainTabs {...props} onLogout={handleLogout} />}
                </Stack.Screen>
                <Stack.Screen
                  name="BookDetail"
                  component={BookDetailScreen}
                  options={{ title: 'Kirjan tiedot' }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
}
