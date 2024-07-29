import React from 'react';
import { View, StyleSheet, Button, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import RegisterPage from './RegisterPage';
import SignInPage from './SignInPage';
import MainScreen from './MainScreen';
import AlertPage from './AlertPage';

type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  SignIn: undefined;
  MainScreen: undefined;
  AlertPage: undefined;
};

type HomePageNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomePageNavigationProp;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignInPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AlertPage"
          component={AlertPage}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const HomePage: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('./logo.png')} style={styles.logo} />
      <View style={styles.buttonContainer}>
        <Button
          title="Register"
          onPress={() => navigation.navigate('Register')}
          color="#00796b"
        />
        <Button
          title="Sign In"
          onPress={() => navigation.navigate('SignIn')}
          color="#00796b"
        />
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbe4d4',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
});
