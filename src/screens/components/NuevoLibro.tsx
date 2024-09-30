import React, { useState } from 'react';
import { Button, Divider, IconButton, Modal, Portal, Snackbar, Text, TextInput } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { dbRealTime } from '../../config/firebaseConfig';
import { push, ref, set } from 'firebase/database';

interface Props {
  showModalProduct: boolean;
  setShowModalProduct: Function;
}

interface FormBook {
  name: string;
  author: string;
  publicationDate: string;
  publisher: string;
  genre: string;
}

interface showMessage {
  visible: boolean;
  message: string;
  color: string;
}

export const NuevoLibro = ({ showModalProduct, setShowModalProduct }: Props) => {
  const [formBook, setFormBook] = useState<FormBook>({
    name: '',
    author: '',
    publicationDate: '',
    publisher: '',
    genre: '',
  });

  const [showMessage, setShowMessage] = useState<showMessage>({
    visible: false,
    message: '',
    color: '#fff',
  });

  const handleSetValue = (key: string, value: string) => {
    setFormBook({ ...formBook, [key]: value });
  };

  const handleSaveBook = async () => {
    try {
      const newBookRef = push(ref(dbRealTime, 'books'));
      await set(newBookRef, formBook);

      setShowMessage({ visible: true, message: 'Libro agregado con éxito', color: 'green' });
      setShowModalProduct(false);
    } catch (error) {
      setShowMessage({ visible: true, message: 'Error al agregar libro', color: 'red' });
    }
  };

  return (
    <Portal>
      <Modal visible={showModalProduct} contentContainerStyle={styles.modal}>
        <View style={styles.modalHeader}>
          <Text variant="headlineSmall">Nuevo Libro</Text>
          <IconButton
            icon="close-circle-outline"
            size={30}
            onPress={() => setShowModalProduct(false)}
          />
        </View>
        <Divider />
        <TextInput
          label="Nombre"
          mode="outlined"
          onChangeText={(value) => handleSetValue('name', value)}
          style={styles.input}
        />
        <TextInput
          label="Autor"
          mode="outlined"
          onChangeText={(value) => handleSetValue('author', value)}
          style={styles.input}
        />
        <TextInput
          label="Fecha de Publicación"
          mode="outlined"
          onChangeText={(value) => handleSetValue('publicationDate', value)}
          style={styles.input}
        />
        <TextInput
          label="Editorial"
          mode="outlined"
          onChangeText={(value) => handleSetValue('publisher', value)}
          style={styles.input}
        />
        <TextInput
          label="Género"
          mode="outlined"
          onChangeText={(value) => handleSetValue('genre', value)}
          style={styles.input}
        />
        <Button 
          mode="contained" 
          onPress={handleSaveBook} 
          style={styles.saveButton}
          icon="book"  
        >
          Agregar
        </Button>
      </Modal>

      <Snackbar
        visible={showMessage.visible}
        onDismiss={() => setShowMessage({ ...showMessage, visible: false })}
        style={{ backgroundColor: showMessage.color }}
        duration={3000}
      >
        {showMessage.message}
      </Snackbar>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    width: '100%', 
    marginBottom: 10,
  },
  saveButton: {
    marginTop: 16,
    width: '100%',
  },
});
