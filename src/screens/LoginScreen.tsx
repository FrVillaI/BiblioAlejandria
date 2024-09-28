import React, { useState } from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { Button, Snackbar, Text, TextInput } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { CommonActions, useNavigation } from '@react-navigation/native';

interface FormLogin {
  email: string;
  password: string;
}

interface showMessage {
  visible: boolean;
  message: string;
  color: string;
}

export const LoginScreen = () => {
  const [formLogin, setFormLogin] = useState<FormLogin>({
    email: "",
    password: "",
  });

  const [showMessage, setShowMessage] = useState<showMessage>({
    visible: false,
    message: "",
    color: "#fff",
  });

  const [hiddenPassword, setHiddenPassword] = useState<boolean>(true);
  const navigation = useNavigation();

  const handleSetValue = (key: string, value: string) => {
    setFormLogin({ ...formLogin, [key]: value });
  };

  const handleSingIn = async () => {
    if (!formLogin.email || !formLogin.password) {
      setShowMessage({
        visible: true,
        message: 'Completa todos los campos',
        color: '#7a0808',
      });
      return;
    }
    try {
      const response = await signInWithEmailAndPassword(
        auth,
        formLogin.email,
        formLogin.password
      );
    } catch (e) {
      console.log(e);
      setShowMessage({
        visible: true,
        message: 'Correo y/o Contraseña Incorrecta',
        color: '#7a0808',
      });
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://th.bing.com/th/id/R.d654fdeb29bdd0f8afbaabc0306c422a?rik=nxbE1dZg4PFh9g&pid=ImgRaw&r=0' }}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            El Comienzo, Bienvenido a la Biblioteca de Alejandría
          </Text>
          <Text style={styles.subtitle}>Inicio de Sesión</Text>
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
          <Button
            mode="contained"
            onPress={handleSingIn}
            style={styles.button}
          >
            Iniciar
          </Button>
          <Text
            onPress={() => navigation.dispatch(CommonActions.navigate({ name: 'Register' }))}
            style={styles.registerText}
          >
            No tienes una cuenta? Registrate ahora
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
