import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { firebaseApp } from './utils/firebaseConfig'; // Adjust path if needed

export default function SignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    const auth = getAuth(firebaseApp);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Set the display name
      await updateProfile(userCredential.user, { displayName: fullName });
      await AsyncStorage.setItem('isLoggedIn', 'true');
      router.replace('/homepage');
    } catch (error: any) {
      let message = 'Sign up failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') message = 'Email already in use.';
      if (error.code === 'auth/invalid-email') message = 'Invalid email address.';
      Alert.alert('Error', message);
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  return (
    <View style={{flex: 1, backgroundColor: '#2d5a3d'}}>
      {/* Green Header with Logo, rounded bottom */}
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.palmTreeIcon}>🌴</Text>
          </View>
        </View>
      </View>
      {/* White Card Signup, overlapping header */}
      <View style={styles.androidCard}>
        <Text style={styles.title}>Sign Up</Text>
        <View style={styles.form}>
          
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#888"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
          <Text style={styles.loginButtonText}>Create Account</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 18,
    marginBottom: 0,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
    marginBottom: -22,
  },
  androidCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    marginTop: 80, // move card and icon lower
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
    width: '100%',
  },
  palmTreeIcon: {
    fontSize: 48,
    marginBottom: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 18,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginBottom: 8,
    alignItems: 'stretch',
  },
  inputContainer: {
    marginBottom: 18,
    width: '100%',
  },
  label: {
    fontSize: 15,
    color: '#222',
    marginBottom: 6,
    marginLeft: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 18,
    fontSize: 16,
    color: '#222',
    borderWidth: 1,
    borderColor: '#bbb',
    width: '100%',
  },
  headerContainer: {
    height: 160,
    backgroundColor: '#2d5a3d',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: 0,
    paddingTop: 80,
    width: '100%',
    zIndex: 2,
  },
  loginButton: {
    backgroundColor: '#2d5a3d',
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    alignSelf: 'stretch',
    elevation: 2,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 1,
  },
  signupLinkContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  signupLink: {
    color: '#2d5a3d',
    fontSize: 15,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});