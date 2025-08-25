import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import ProfileScreen from './screens/ProfileScreen';
import * as SecureStore from 'expo-secure-store';

const Tab = createBottomTabNavigator();

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

  if (loading) return null;

  if (!loggedIn) {
    //jos kirjautuminen ei onnistu, näytetään loginscreen.
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  // Jos kirjautunut, näytetään navigaattori
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Aloitussivu" component={HomeScreen} />
        <Tab.Screen name="Suosikit" component={FavoritesScreen} />
        <Tab.Screen name="Profiili" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
