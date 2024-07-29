// src/screens/HomePage.tsx
import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { HomePageNavigationProp } from '../types/navigation';

type Props = {
  navigation: HomePageNavigationProp;
};

const HomePage: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/icon.png')} style={styles.logo} />
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

export default HomePage;
