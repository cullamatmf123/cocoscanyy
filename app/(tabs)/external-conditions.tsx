import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function ExternalConditions() {
  const navigation = useNavigation();
  const router = useRouter();
  const { photoUri, photoBase64, aiStatus = 'pending' } = useLocalSearchParams<{
    photoUri?: string;
    photoBase64?: string;
    aiStatus?: string;
  }>();

  const [weather, setWeather] = useState('');
  const [soil, setSoil] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const weatherOptions = [
    { label: 'Select weather condition', value: '' },
    { label: 'Sunny', value: 'sunny' },
    { label: 'Rainy', value: 'rainy' },
    { label: 'Cloudy', value: 'cloudy' },
    { label: 'Windy', value: 'windy' },
    { label: 'Other', value: 'other' },
  ];

  const soilOptions = [
    { label: 'Select soil type', value: '' },
    { label: 'Sandy', value: 'sandy' },
    { label: 'Clay', value: 'clay' },
    { label: 'Loamy', value: 'loamy' },
    { label: 'Peaty', value: 'peaty' },
    { label: 'Chalky', value: 'chalky' },
    { label: 'Silty', value: 'silty' },
  ];

  const handleSubmit = () => {
    if (!weather || !soil) {
      Alert.alert('Incomplete Information', 'Please select both weather and soil conditions.');
      return;
    }

    if (!photoUri && !photoBase64) {
      Alert.alert('Error', 'No photo data available. Please go back and take a photo again.');
      return;
    }

    setIsSubmitting(true);
    try {
      navigation.navigate('result' as never, {
        photoUri,
        photoBase64,
        aiStatus,
        weather,
        soil,
      });
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Failed to proceed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>CocoScan</Text>
          <View style={{ flex: 1 }} />
          <View style={styles.iconCircleSmall}>
            <Text style={styles.palmTreeIconSmall}>🌴</Text>
          </View>
        </View>

        {/* Main Card */}
        <View style={styles.card}>
          <Text style={styles.title}>External Conditions</Text>
          <Text style={styles.subtitle}>Please provide the following information:</Text>
          
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Weather Condition</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={weather}
                onValueChange={(itemValue) => setWeather(itemValue)}
                style={styles.picker}
                dropdownIconColor="#666"
              >
                {weatherOptions.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Soil Type</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={soil}
                onValueChange={(itemValue) => setSoil(itemValue)}
                style={styles.picker}
                dropdownIconColor="#666"
              >
                {soilOptions.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>{isSubmitting ? 'Submitting...' : 'Submit'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={20} color="white" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#2d5a3d',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
  },
  iconCircleSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
    marginLeft: 10,
  },
  palmTreeIconSmall: {
    fontSize: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginTop: 100, // <<-- This moves the card even further down
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d5a3d',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#2d5a3d',
    marginBottom: 18,
    textAlign: 'center',
  },
  pickerContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2d5a3d',
    marginBottom: 6,
  },
  pickerWrapper: {
    borderWidth: 1.5,
    borderColor: '#2d5a3d',
    borderRadius: 10,
    backgroundColor: '#f7f7f7',
    overflow: 'hidden',
  },
  picker: {
    height: 44,
    color: '#2d5a3d',
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#FFD700',
    borderRadius: 15,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButtonText: {
    color: '#2d5a3d',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});