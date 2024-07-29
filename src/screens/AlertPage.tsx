import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Dimensions, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import MapView, { Marker } from 'react-native-maps';

interface Alert {
  id: string;
  emergency: string;
  region: string;
  info: string;
  location: {
    latitude: number;
    longitude: number;
  };
  userPhoneNumber: string; // Add this field to the Alert interface
}

const AlertPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const navigation = useNavigation();
  const db = getFirestore();

  const fetchAlerts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'alerts'));
      const alertList: Alert[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        alertList.push({ id: doc.id, ...data } as Alert);
      });
      setAlerts(alertList);
    } catch (e) {
      console.error('Error fetching alerts: ', e);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleAlertPress = (location: { latitude: number; longitude: number }) => {
    setSelectedLocation(location);
  };

  const handleCallPress = (userPhoneNumber: string) => {
    Linking.openURL(`tel:${userPhoneNumber}`);
  };

  const mapRegion = selectedLocation
    ? {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    : {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alerts</Text>
      <View style={styles.listContainer}>
        <ScrollView>
          <FlatList
            data={alerts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleAlertPress(item.location)}>
                <View style={styles.alertItem}>
                  <Feather name="alert-circle" size={24} color="red" />
                  <View style={styles.alertInfo}>
                    <Text style={styles.alertText}>Emergency: <Text style={styles.boldText}>{item.emergency}</Text></Text>
                    <Text style={styles.alertText}>Region: <Text style={styles.boldText}>{item.region}</Text></Text>
                    <Text style={styles.alertText}>Info: <Text style={styles.boldText}>{item.info}</Text></Text>
                  </View>
                  <TouchableOpacity onPress={() => handleCallPress(item.userPhoneNumber)} style={styles.callIcon}>
                    <Feather name="phone" size={24} color="lightgreen" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      </View>
      <View style={styles.mapContainer}>
        <MapView style={styles.map} region={mapRegion}>
          {selectedLocation && <Marker coordinate={selectedLocation} />}
        </MapView>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40, // Adjusted padding from the top
    paddingHorizontal: 20,
    backgroundColor: '#f5f7fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    height: Dimensions.get('window').height / 2,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  alertInfo: {
    flex: 1,
    marginLeft: 10,
  },
  alertText: {
    fontSize: 16,
    color: '#555',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#000',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  button: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#007bff',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
  callIcon: {
    marginLeft: 15,
    padding: 5,
  },
});

export default AlertPage;
