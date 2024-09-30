import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { ref, onValue, update } from 'firebase/database';
import { dbRealTime } from '../../config/firebaseConfig';

interface Book {
  id: string;
  name: string;
  author: string;
  publicationDate: string;
  publisher: string;
  genre: string;
}

export const EditarLibro = ({ route, navigation }: any) => {
  const { bookId } = route.params; 
  const [bookData, setBookData] = useState<Book>({
    id: '',
    name: '',
    author: '',
    publicationDate: '',
    publisher: '',
    genre: '',
  });

  // Cargar datos del libro específico desde Firebase
  useEffect(() => {
    const bookRef = ref(dbRealTime, `books/${bookId}`);
    onValue(bookRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBookData({
          id: bookId,
          name: data.name,
          author: data.author,
          publicationDate: data.publicationDate,
          publisher: data.publisher,
          genre: data.genre,
        });
      }
    });
  }, [bookId]);

  const handleSetValue = (key: string, value: string) => {
    setBookData({ ...bookData, [key]: value });
  };

  const handleSaveChanges = async () => {
    try {
      const bookRef = ref(dbRealTime, `books/${bookId}`);
      await update(bookRef, {
        name: bookData.name,
        author: bookData.author,
        publicationDate: bookData.publicationDate,
        publisher: bookData.publisher,
        genre: bookData.genre,
      });

      console.log('Libro actualizado correctamente');
      navigation.goBack(); // Regresar a la pantalla anterior
    } catch (error) {
      console.error('Error al actualizar el libro:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant='headlineSmall'>Editar Libro</Text>
      <TextInput
        label="Nombre"
        value={bookData.name}
        onChangeText={(value) => handleSetValue('name', value)}
        style={styles.input}
      />
      <TextInput
        label="Autor"
        value={bookData.author}
        onChangeText={(value) => handleSetValue('author', value)}
        style={styles.input}
      />
      <TextInput
        label="Fecha de Publicación"
        value={bookData.publicationDate}
        onChangeText={(value) => handleSetValue('publicationDate', value)}
        style={styles.input}
      />
      <TextInput
        label="Editorial"
        value={bookData.publisher}
        onChangeText={(value) => handleSetValue('publisher', value)}
        style={styles.input}
      />
      <TextInput
        label="Género"
        value={bookData.genre}
        onChangeText={(value) => handleSetValue('genre', value)}
        style={styles.input}
      />
      <Button mode="contained" onPress={handleSaveChanges} style={styles.saveButton}>
        Guardar Cambios
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  input: {
    marginBottom: 15,
  },
  saveButton: {
    marginTop: 15,
  },
});
