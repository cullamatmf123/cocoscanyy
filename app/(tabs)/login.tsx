import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseApp } from './utils/firebaseConfig'; // Adjust path if needed

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    const auth = getAuth(firebaseApp);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await AsyncStorage.setItem('isLoggedIn', 'true');
      router.replace('/homepage');
    } catch (error: any) {
      let message = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found') message = 'No user found with this email.';
      if (error.code === 'auth/wrong-password') message = 'Incorrect password.';
      if (error.code === 'auth/invalid-email') message = 'Invalid email address.';
      Alert.alert('Error', message);
    }
  };

  const handleGoToSignUp = () => {
    router.push('/signup');
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
      {/* White Card Login, overlapping header */}
      <View style={styles.androidCard}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
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
            />
          </View>
          {/* Remember Me Row */}
          <View style={styles.rememberForgotRow}>
            <TouchableOpacity style={styles.rememberMe} onPress={() => setRememberMe(!rememberMe)}>
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe ? <Text style={styles.checkboxTick}>✓</Text> : null}
              </View>
              <Text style={styles.rememberMeText}>Remember Me</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Enter</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleGoToSignUp} style={styles.signupLinkContainer}>
          <Text style={styles.signupLink}>Signup</Text>
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
  },
  inputContainer: {
    marginBottom: 18,
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
  rememberForgotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#2d5a3d',
    borderRadius: 4,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#2d5a3d',
    borderColor: '#2d5a3d',
  },
  checkboxTick: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: -1,
  },
  rememberMeText: {
    fontSize: 14,
    color: '#222',
  },
});