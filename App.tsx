import 'react-native-gesture-handler';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { MainNavigator} from './src/navigator/MainNavigator'; 


const App = () => {
  return (
    <NavigationContainer>
      <PaperProvider>
        <MainNavigator/>
      </PaperProvider>
    </NavigationContainer>
  )
}

export default App;