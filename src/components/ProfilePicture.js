import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, FlatList, TouchableWithoutFeedback } from 'react-native';

//Annetaan käyttäjälle vaihtoehtoja profiilikuvaan emojeilla.
const defaultEmojis = ['👻','🐶','🐱','🦄','🧙‍♂️','👩‍💻'];

export default function EmojiAvatarPicker({ avatar, onSelect }) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (emoji) => {
    onSelect(emoji);
    setModalVisible(false);
  };

  //Tässä avatar -> valitaan modaalin avulla käyttäjälle.
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.avatar}>{avatar || defaultEmojis[0]}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modal}>
                <Text style={styles.title}>Valitse profiilikuva</Text>
                <FlatList
                  data={defaultEmojis}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={5}
                  contentContainerStyle={styles.emojiList}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleSelect(item)}>
                      <Text style={styles.icon}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginBottom: 20 },
  avatar: { fontSize: 60, marginBottom: 10 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    minWidth: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  emojiList: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 50,
    margin: 10,
  },
});