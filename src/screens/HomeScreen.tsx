import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Avatar, Button, Divider, FAB, IconButton, Modal, Portal, Text, TextInput } from 'react-native-paper';
import { auth } from '../config/firebaseConfig';
import { signOut, updateProfile, updateEmail } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { LibroCard } from './components/LibrosCards';
import { NuevoLibro } from './components/NuevoLibro';
import { ref, onValue, update, remove } from 'firebase/database';
import { dbRealTime } from '../config/firebaseConfig';

interface FormUser {
  name: string;
  firstName: string;
  lastName: string;
  age: string;
  email: string; 
}

interface Book {
  id: string;
  name: string;
  author: string;
  publicationDate: string;
  publisher: string;
  genre: string;
}

export const HomeScreen = () => {
  const navigation = useNavigation();
  
  const [formUser, setFormUser] = useState<FormUser>({
    name: '',
    firstName: '',
    lastName: '',
    age: '',
    email: '',
  });
  const [userData, setUserData] = useState<any>(null); 
  const [books, setBooks] = useState<Book[]>([]);
  const [showModalProfile, setShowModalProfile] = useState<boolean>(false);
  const [showModalProduct, setShowModalProduct] = useState<boolean>(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    setUserData(currentUser);
    setFormUser({
      name: currentUser?.displayName ?? '',
      firstName: '', 
      lastName: '',
      age: '', 
      email: currentUser?.email ?? '', 
    });

    const userRef = ref(dbRealTime, `users/${currentUser?.uid}`);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setFormUser({
          name: currentUser?.displayName ?? '',
          firstName: data.firstName,
          lastName: data.lastName,
          age: data.age,
          email: currentUser?.email ?? '', 
        });
      }
    });

    const booksRef = ref(dbRealTime, 'books');
    onValue(booksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedBooks = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setBooks(loadedBooks);
      }
    });
  }, []);

  const handleSetValue = (key: string, value: string) => {
    setFormUser({ ...formUser, [key]: value });
  };

  const handleUpdateUser = async () => {
    try {
      const currentUser = auth.currentUser;

      if (currentUser) {
        // Actualizar el nombre de perfil
        await updateProfile(currentUser, { displayName: formUser.name });

        // Actualizar el correo electrónico
        if (formUser.email !== currentUser.email) {
          await updateEmail(currentUser, formUser.email);
        }

        const userRef = ref(dbRealTime, `users/${currentUser.uid}`);
        await update(userRef, {
          firstName: formUser.firstName,
          lastName: formUser.lastName,
          age: formUser.age,
        });

        setShowModalProfile(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

  const handleDeleteBook = (bookId: string) => {
    const bookRef = ref(dbRealTime, `books/${bookId}`);
    remove(bookRef)
      .then(() => {
        console.log("Libro eliminado correctamente");
      })
      .catch((error) => {
        console.error("Error al eliminar el libro:", error);
      });
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Avatar.Text size={40} label="PN" style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text variant="bodySmall" style={styles.welcomeText}>Bienvenid@</Text>
            <Text variant="labelLarge" style={styles.userName}>{userData?.displayName}</Text>
          </View>
          <IconButton
            icon="logout" 
            size={30}
            onPress={handleLogout} 
            style={styles.editButton}
          />
          <IconButton
            icon="account-edit"
            size={30}
            onPress={() => setShowModalProfile(true)}
          />
        </View>

        <FlatList
          data={books}
          renderItem={({ item }) => (
            <LibroCard
              name={item.name}
              author={item.author}
              publicationDate={item.publicationDate}
              publisher={item.publisher}
              genre={item.genre}
              onEdit={() => navigation.navigate('EditarLibro', { bookId: item.id })} 
              onDelete={() => handleDeleteBook(item.id)} 
            />
          )}
          keyExtractor={item => item.id}
        />

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setShowModalProduct(true)}
        />
      </View>

      <Portal>
        <Modal visible={showModalProfile} contentContainerStyle={styles.modal}>
          <View style={styles.modalHeader}>
            <Text variant='headlineSmall'>Mi Perfil</Text>
            <IconButton
              icon="close"
              size={30}
              onPress={() => setShowModalProfile(false)}
            />
          </View>
          <Divider />
          <TextInput
            mode='outlined'
            label="Nombre"
            value={formUser.name}
            onChangeText={(value) => handleSetValue('name', value)}
            style={styles.input}
          />
          <TextInput
            mode='outlined'
            label="Nombre de Pila"
            value={formUser.firstName}
            onChangeText={(value) => handleSetValue('firstName', value)}
            style={styles.input}
          />
          <TextInput
            mode='outlined'
            label="Apellido"
            value={formUser.lastName}
            onChangeText={(value) => handleSetValue('lastName', value)}
            style={styles.input}
          />
          <TextInput
            mode='outlined'
            label="Edad"
            keyboardType="numeric"
            value={formUser.age}
            onChangeText={(value) => handleSetValue('age', value)}
            style={styles.input}
          />
          <TextInput
            mode='outlined'
            label="Correo"
            value={formUser.email}
            onChangeText={(value) => handleSetValue('email', value)} 
            style={styles.input}
          />
          <Button 
            mode='contained' 
            onPress={handleUpdateUser}
            icon="content-save"  
            style={styles.saveButton}
          >
            Actualizar
          </Button>
        </Modal>

        <NuevoLibro 
          showModalProduct={showModalProduct} 
          setShowModalProduct={setShowModalProduct} 
        />
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    elevation: 2, 
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: '#3E2723',
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  welcomeText: {
    color: '#6B7280',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2E7D32',
  },
  editButton: {
    backgroundColor: '#FFAB00',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#1E88E5',
  },
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
    marginTop: 15,
    width: '100%',  
  },
});
