import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigation/AuthStack';
import FlashMessage from "react-native-flash-message";

 function App() {
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
