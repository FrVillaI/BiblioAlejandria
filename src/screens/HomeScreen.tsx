import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, IconButton, Text } from 'react-native-paper';
import { auth } from '../config/firebaseConfig'; 
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

export const HomeScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text size={40} label="PN" style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text variant="bodySmall" style={styles.welcomeText}>Bienvenid@</Text>
          <Text variant="labelLarge" style={styles.userName}>Isaac Villacis</Text>
        </View>
        <IconButton
          icon="logout" 
          size={30}
          onPress={handleLogout} 
          style={styles.editButton}
        />
      </View>
    </View>
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
  },
  avatar: {
    backgroundColor: '#6200EE',
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
  },
  editButton: {
    backgroundColor: '#E0E0E0',
  },
});
