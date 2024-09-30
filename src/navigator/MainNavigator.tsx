import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { auth } from '../config/firebaseConfig';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegistroScreen } from '../screens/RegistroScreen';
import { EditarLibro } from '../screens/components/EditarLibros';

interface Routes {
  name: string;
  screen: () => JSX.Element;
  title: string; // Agregamos una propiedad para el título
}

const routesNoAuth: Routes[] = [
  { name: 'Login', screen: LoginScreen, title: 'Iniciar Sesión' },
  { name: 'Register', screen: RegistroScreen, title: 'Registro' }
];

const routesAuth: Routes[] = [
  { name: 'Home', screen: HomeScreen, title: 'Biblioteca' },
  { name: 'EditarLibro', screen: EditarLibro, title: 'Editar Libro' }
];

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  EditarLibro: { bookId: string }; 
};

const Stack = createStackNavigator();

export const MainNavigator = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuth(!!user); 
      setIsLoading(false); 
    });

    return () => unsubscribe(); 
  }, []);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator animating={true} size={30} />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {!isAuth ? (
        routesNoAuth.map((item, index) => (
          <Stack.Screen
            key={index}
            name={item.name}
            component={item.screen}
            options={{ title: item.title }} 
          />
        ))
      ) : (
        routesAuth.map((item, index) => (
          <Stack.Screen
            key={index}
            name={item.name}
            component={item.screen}
            options={{ title: item.title }} 
          />
        ))
      )}
    </Stack.Navigator>
  );
};
