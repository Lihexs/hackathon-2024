import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, StyleSheet, Dimensions, Button, ScrollView, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { getFirestore, collection, addDoc, doc, getDoc } from 'firebase/firestore';
import * as Location from 'expo-location';
import { auth } from './firebaseConfig'; // Import auth for getting current user

const MainScreen: React.FC = () => {
  const [queryEmergency, setQueryEmergency] = useState<string>('');
  const [queryRegion, setQueryRegion] = useState<string>('');
  const [queryMoreInfo, setQueryMoreInfo] = useState<string>('');
  const [filteredEmergencies, setFilteredEmergencies] = useState<string[]>([]);
  const [filteredRegions, setFilteredRegions] = useState<string[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [userPhoneNumber, setUserPhoneNumber] = useState<string>('');
  const emergencies = ['medical', 'mental', 'rescue', 'fire', 'life danger'];
  const regions = ['North', 'South', 'East', 'West', 'Central'];
  const navigation = useNavigation();
  const db = getFirestore();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Fetch the user's phone number
      if (auth.currentUser) {
        const userDoc = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserPhoneNumber(userData.phoneNumber || '');
        }
      }
    })();
  }, []);

  const findItem = (query: string, items: string[]) => {
    if (query === '') {
      return [];
    }
    const regex = new RegExp(`${query.trim()}`, 'i');
    return items.filter((item) => item.search(regex) >= 0);
  };

  const handleInputChange = (queryKey: string, items: string[], text: string) => {
    const filteredList = findItem(text, items);
    if (queryKey === 'emergency') {
      setQueryEmergency(text);
      setFilteredEmergencies(filteredList);
    } else if (queryKey === 'region') {
      setQueryRegion(text);
      setFilteredRegions(filteredList);
    }
  };

  const handleSelectItem = (queryKey: string, item: string) => {
    if (queryKey === 'emergency') {
      setQueryEmergency(item);
      setFilteredEmergencies([]);
    } else if (queryKey === 'region') {
      setQueryRegion(item);
      setFilteredRegions([]);
    }
  };

  const handleFormSubmit = async () => {
    if (!location) {
      Alert.alert('Location is not available');
      return;
    }

    try {
      await addDoc(collection(db, 'alerts'), {
        emergency: queryEmergency,
        region: queryRegion,
        info: queryMoreInfo,
        location,
        userPhoneNumber, // Add user's phone number to the alert
      });
      Alert.alert('Alert added successfully');
    } catch (e) {
      console.error('Error adding alert: ', e);
      Alert.alert('Error adding alert');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          <Text style={styles.label}>Enter Emergency Type:</Text>
          <TextInput
            style={[styles.input, styles.inputBackgroundColor]}
            placeholder="Type an emergency"
            value={queryEmergency}
            onChangeText={(text) => handleInputChange('emergency', emergencies, text)}
          />
          {filteredEmergencies.map((item) => (
            <TouchableOpacity key={item} onPress={() => handleSelectItem('emergency', item)}>
              <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.label}>Place of emergency:</Text>
          <TextInput
            style={[styles.input, styles.inputBackgroundColor]}
            placeholder="Type a region"
            value={queryRegion}
            onChangeText={(text) => handleInputChange('region', regions, text)}
          />
          {filteredRegions.map((item) => (
            <TouchableOpacity key={item} onPress={() => handleSelectItem('region', item)}>
              <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.label}>More Information:</Text>
          <TextInput
            style={[styles.input, styles.inputBackgroundColor, styles.infoInput]}
            placeholder="Type more information"
            value={queryMoreInfo}
            onChangeText={setQueryMoreInfo}
            multiline
          />

          <Button title="Share with friends" onPress={handleFormSubmit} color="#eb5454" />
        </View>
        {location && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker coordinate={location} />
          </MapView>
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.alertButton}
        onPress={() => navigation.navigate('AlertPage')}
      >
        <Feather name="alert-circle" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6e0c8',
    paddingTop: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '90%',
    justifyContent: 'center',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f6e0c8',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  input: {
    width: 300,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  inputBackgroundColor: {
    backgroundColor: 'white',
  },
  infoInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  itemText: {
    padding: 10,
    fontSize: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
  },
  alertButton: {
    position: 'absolute',
    bottom: 30,
    left: 20, // Adjusted to position the button at the bottom left corner
    backgroundColor: '#f00',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
  alertIcon: {
    width: 30,
    height: 30,
  },
});

export default MainScreen;
