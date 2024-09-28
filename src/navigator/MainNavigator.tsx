import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { auth } from '../config/firebaseConfig';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegistroScreen } from '../screens/RegistroScreen';

interface Routes {
  name: string;
  screen: () => JSX.Element;
}

const routesNoAuth: Routes[] = [
  { name: 'Login', screen: LoginScreen },
  { name: 'Register', screen: RegistroScreen }
];

const routesAuth: Routes[] = [
  { name: 'Home', screen: HomeScreen }
];

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
            options={{ headerShown: false }}
            component={item.screen}
          />
        ))
      ) : (
        routesAuth.map((item, index) => (
          <Stack.Screen
            key={index}
            name={item.name}
            options={{ headerShown: false }}
            component={item.screen}
          />
        ))
      )}
    </Stack.Navigator>
  );
};
