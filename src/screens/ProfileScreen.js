import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const profileImages = [
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=4',
  'https://i.pravatar.cc/150?img=5',
];

export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadProfileImage();
  }, []);

  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('@profile_image');
      if (savedImage) {
        setProfileImage(savedImage);
      }
    } catch (e) {
      console.error('Profiilikuvan lataus epäonnistui:', e);
    }
  };

  const saveProfileImage = async (imageUrl) => {
    try {
      await AsyncStorage.setItem('@profile_image', imageUrl);
      setProfileImage(imageUrl);
    } catch (e) {
      console.error('Tallennus epäonnistui:', e);
    }
  };

  const selectImage = (url) => {
    saveProfileImage(url);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profiili</Text>

      <Image
        source={{ uri: profileImage || 'https://i.pravatar.cc/150?img=1' }}
        style={styles.profileImage}
      />

      <Button title="Vaihda profiilikuva" onPress={() => setModalVisible(true)} />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.heading}>Valitse profiilikuva</Text>
          <FlatList
            data={profileImages}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            contentContainerStyle={styles.imageGrid}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selectImage(item)} style={styles.imageOption}>
                <Image source={{ uri: item }} style={styles.optionImage} />
              </TouchableOpacity>
            )}
          />
          <Button title="Sulje" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  modalContainer: { flex: 1, padding: 20 },
  imageGrid: {
    justifyContent: 'space-around',
  },
  imageOption: {
    margin: 10,
    alignItems: 'center',
  },
  optionImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
