// SignInPage.tsx
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from './firebaseConfig';
import { initializeApp } from 'firebase/app';

interface FormValues {
  email: string;
  password: string;
}

interface SignInPageProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

const handleSignIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw error;
  }
};

export default function SignInPage({ navigation }: SignInPageProps) {
  const initialValues: FormValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      const { email, password } = values;
      const userCredential = await handleSignIn(email, password);
      const user = userCredential.user;
      navigation.navigate('MainScreen'); // Navigate to MainScreen on successful sign-in
      console.log('Sign-in successful:', user);
    } catch (error) {
      Alert.alert('Sign-in failed', 'Please check your credentials and try again.');
      console.error('Sign-in failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }: FormikProps<FormValues>) => (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
            />
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}

            <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmit()}>
              <Text style={styles.submitButtonText}>Sign in</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#00796b',
  },
  form: {
    width: '90%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    height: 50,
    borderColor: '#00796b',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f1f8e9',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#00796b',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
