import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function HomePage() {
  const router = useRouter();

  // Check login state on mount
  useEffect(() => {
    const checkLogin = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (isLoggedIn !== 'true') {
        router.replace('/login');
      }
    };
    checkLogin();
  }, []);

  const handleCapture = () => {
    router.push('/camera');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.appTitle}>CocoScan</Text>
            <View style={{ flex: 1 }} />
            {/* CocoScan logo icon at far right */}
            <View style={styles.iconCircleSmall}>
              <Text style={styles.palmTreeIconSmall}>🌴</Text>
            </View>
          </View>
        </View>

        {/* Main Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryAction} onPress={handleCapture}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="camera" size={32} color="white" />
            </View>
            <Text style={styles.primaryActionText}>Start Scanning</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#2d5a3d',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
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
  actionsContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#388e3c',
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 18,
    marginBottom: 22,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  actionIconContainer: {
    backgroundColor: '#2d5a3d',
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  primaryActionText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d32f2f',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 22,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 7,
    fontSize: 16,
  },
});
