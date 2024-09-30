import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

interface Props {
  name: string;
  author: string;
  publicationDate: string;
  publisher: string;
  genre: string;
}

export const LibroCard = ({ name, author, publicationDate, publisher, genre }: Props) => {
  return (
    <View style={styles.rootListProduct}>
      <View>
        <Text variant='labelLarge'>Nombre: {name}</Text>
        <Text variant='bodyMedium'>Autor: {author}</Text>
        <Text variant='bodyMedium'>Fecha de Publicación: {publicationDate}</Text>
        <Text variant='bodyMedium'>Editorial: {publisher}</Text>
        <Text variant='bodyMedium'>Género: {genre}</Text>
      </View>
      <View style={styles.iconHeader}>
        <IconButton
          icon="arrow-right-bold-outline"
          size={25}
          mode='contained'
          onPress={() => console.log('Pressed')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootListProduct: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  iconHeader: {
    marginLeft: 10,
  },
});
