// RegisterPage.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { auth, firestore } from './firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';


// Define the type for form values
interface FormValues {
  userName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  isVolunteer: 'yes' | 'no';
  role?: string;
  organization?: string;
}

const RegisterPage: React.FC = () => {
  const [isVolunteer, setIsVolunteer] = useState<'yes' | 'no'>('no');

  const initialValues: FormValues = {
    userName: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    isVolunteer: 'no',
  };

  const validationSchema = Yup.object().shape({
    userName: Yup.string().required('User name is required'),
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: Yup.string(),
    password: Yup.string().required('Password is required'),
    isVolunteer: Yup.string().oneOf(['yes', 'no']).required('Please select an option'),
    role: isVolunteer === 'yes' ? Yup.string().required('Role is required') : Yup.string(),
    organization: isVolunteer === 'yes' ? Yup.string().required('Organization is required') : Yup.string(),
  });

  const handleRegistration = async (values: FormValues) => {
    try {
      const { email, password, userName, fullName, phoneNumber, isVolunteer, role, organization } = values;
      
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional user information in Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        userName,
        fullName,
        email,
        phoneNumber,
        isVolunteer,
        role: isVolunteer === 'yes' ? role : null,
        organization: isVolunteer === 'yes' ? organization : null
      });

      Alert.alert('Registration successful!', `Welcome, ${fullName}`);
    } catch (error) {
      Alert.alert('Registration failed');
      console.error('Registration failed:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegistration}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }: FormikProps<FormValues>) => (
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="User Name"
                placeholderTextColor="#888"
                onChangeText={handleChange('userName')}
                onBlur={handleBlur('userName')}
                value={values.userName}
              />
              {errors.userName && <Text style={styles.error}>{errors.userName}</Text>}

              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#888"
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                value={values.fullName}
              />
              {errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}

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
                placeholder="Phone Number"
                placeholderTextColor="#888"
                onChangeText={handleChange('phoneNumber')}
                onBlur={handleBlur('phoneNumber')}
                value={values.phoneNumber}
              />

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

              <Text style={styles.label}>Are you a volunteer?</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[styles.radioButton, values.isVolunteer === 'yes' && styles.radioButtonSelected]}
                  onPress={() => {
                    handleChange('isVolunteer')('yes');
                    setIsVolunteer('yes');
                  }}
                >
                  <Text style={styles.radioButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.radioButton, values.isVolunteer === 'no' && styles.radioButtonSelected]}
                  onPress={() => {
                    handleChange('isVolunteer')('no');
                    setIsVolunteer('no');
                  }}
                >
                  <Text style={styles.radioButtonText}>No</Text>
                </TouchableOpacity>
              </View>
              {errors.isVolunteer && <Text style={styles.error}>{errors.isVolunteer}</Text>}

              {isVolunteer === 'yes' && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Role"
                    placeholderTextColor="#888"
                    onChangeText={handleChange('role')}
                    onBlur={handleBlur('role')}
                    value={values.role}
                  />
                  {errors.role && <Text style={styles.error}>{errors.role}</Text>}

                  <TextInput
                    style={styles.input}
                    placeholder="Organization"
                    placeholderTextColor="#888"
                    onChangeText={handleChange('organization')}
                    onBlur={handleBlur('organization')}
                    value={values.organization}
                  />
                  {errors.organization && <Text style={styles.error}>{errors.organization}</Text>}
                </>
              )}

              <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmit()}>
                <Text style={styles.submitButtonText}>Register</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#e0f7fa',
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
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
    marginBottom: 20,
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#00796b',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  radioButton: {
    flex: 1,
    height: 40,
    borderColor: '#00796b',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#ffffff',
  },
  radioButtonSelected: {
    backgroundColor: '#b2dfdb',
  },
  radioButtonText: {
    fontSize: 16,
    color: '#00796b',
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

export default RegisterPage;
