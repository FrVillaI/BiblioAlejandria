import React, { useState } from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { Button, Snackbar, Text, TextInput } from 'react-native-paper';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, dbRealTime } from '../config/firebaseConfig'; 
import { ref, set } from 'firebase/database'; 
import { CommonActions, useNavigation } from '@react-navigation/native';

interface FormRegister {
  username: string;
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  password: string;
}

interface showMessage {
  visible: boolean;
  message: string;
  color: string;
}

export const RegistroScreen = () => {
  const [formRegister, setFormRegister] = useState<FormRegister>({
    username: '',
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    password: '',
  });

  const [showMessage, setShowMessage] = useState<showMessage>({
    visible: false,
    message: '',
    color: '#fff',
  });

  const [hiddenPassword, setHiddenPassword] = useState<boolean>(true);
  const navigation = useNavigation();

  const handleSetValue = (key: string, value: string) => {
    setFormRegister({ ...formRegister, [key]: value });
  };

  const handleRegister = async () => {
    const { email, password, username, firstName, lastName, age } = formRegister;

    if (!email || !password || !username || !firstName || !lastName || !age) {
      setShowMessage({
        visible: true,
        message: 'Completa todos los campos!',
        color: '#DC143C',
      });
      return;
    }

    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);

      const userId = response.user.uid; 
      await set(ref(dbRealTime, 'users/' + userId), {
        username: username,
        firstName: firstName,
        lastName: lastName,
        age: age,
        email: email,
      });

      setShowMessage({
        visible: true,
        message: 'Registro Exitoso!',
        color: '#085f06',
      });

    } catch (e) {
      console.log(e);
      setShowMessage({
        visible: true,
        message: 'No se logró la transacción. Intenta más tarde.',
        color: '#DC143C',
      });
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://th.bing.com/th/id/R.d654fdeb29bdd0f8afbaabc0306c422a?rik=nxbE1dZg4PFh9g&pid=ImgRaw&r=0' }} 
        style={styles.imageBackground}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>El Comienzo, Bienvenido a la Biblioteca de Alejandría</Text>
          <Text style={styles.subtitle}>Registro</Text>

          <TextInput
            label="Nombre de Usuario"
            mode="outlined"
            placeholder="Escribe tu Nombre de Usuario"
            onChangeText={(value) => handleSetValue('username', value)}
            style={styles.input}
          />
          <TextInput
            label="Nombre"
            mode="outlined"
            placeholder="Escribe tu Nombre"
            onChangeText={(value) => handleSetValue('firstName', value)}
            style={styles.input}
          />
          <TextInput
            label="Apellido"
            mode="outlined"
            placeholder="Escribe tu Apellido"
            onChangeText={(value) => handleSetValue('lastName', value)}
            style={styles.input}
          />
          <TextInput
            label="Edad"
            mode="outlined"
            placeholder="Escribe tu Edad"
            keyboardType="numeric"
            onChangeText={(value) => handleSetValue('age', value)}
            style={styles.input}
          />
          <TextInput
            label="Correo"
            mode="outlined"
            placeholder="Escribe tu Correo"
            onChangeText={(value) => handleSetValue('email', value)}
            style={styles.input}
          />
          <TextInput
            label="Contraseña"
            mode="outlined"
            placeholder="Escribe tu Contraseña"
            secureTextEntry={hiddenPassword}
            onChangeText={(value) => handleSetValue('password', value)}
            right={<TextInput.Icon icon="eye" onPress={() => setHiddenPassword(!hiddenPassword)} />}
            style={styles.input}
          />

          <Button mode="contained" onPress={handleRegister} style={styles.button}>
            Registrarse
          </Button>

          <Text
            onPress={() => navigation.dispatch(CommonActions.navigate({ name: 'Login' }))}
            style={styles.registerText}
          >
            ¿Ya tienes una cuenta? Inicia sesión ahora
          </Text>

          <Snackbar
            visible={showMessage.visible}
            onDismiss={() => setShowMessage({ ...showMessage, visible: false })}
          >
            {showMessage.message}
          </Snackbar>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#228B22', 
  },
  registerText: {
    marginTop: 10,
    textAlign: 'center',
  },
});
