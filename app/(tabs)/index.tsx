import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/login');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };


  const handleLogoTap = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Icon Section */}
        <View style={styles.logoContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.palmTreeIcon}>🌴</Text>
          </View>
        </View>
        {/* App Name */}
        <Text style={styles.appName}>COCOSCAN</Text>
                {/* Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn} activeOpacity={0.85}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} activeOpacity={0.85}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2d5a3d',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 20,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  welcomeText: {
    color: 'white',
    fontSize: 20,
    marginTop: 6,
    marginBottom: 32,
    letterSpacing: 1,
    textAlign: 'center',
  },
  palmTreeIcon: {
    fontSize: 50,
    textAlign: 'center',
  },
  buttonGroup: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  signInButton: {
    width: 260,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: 'transparent',
  },
  signInText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  signUpButton: {
    width: 260,
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  signUpText: {
    color: '#2d5a3d',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
});
