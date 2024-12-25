import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigation/AuthStack';
import FlashMessage from "react-native-flash-message";
import registerNNPushToken from 'native-notify';

 function App() {
  registerNNPushToken(25582, 'DowBN7qkm455dOdSTMH4w0');
  
        return (
          <>
          <NavigationContainer>
              <AuthStack />
          </NavigationContainer>
          <FlashMessage position="top" />
          </>
        );
}

export default App;
