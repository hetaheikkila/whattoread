import React from 'react';
import { View, Text, Button } from 'react-native';

export default function ProfileScreen({ onLogout }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profiili</Text>
      <Button title="Kirjaudu ulos" onPress={onLogout} />
    </View>
  );
}
