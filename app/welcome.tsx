import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'android' ? { paddingTop: (StatusBar.currentHeight || 24) } : null]}>
      <View style={styles.center}>
        <View style={styles.logoCircle}>
          <Text style={styles.logo}>🌴</Text>
        </View>
        <Text style={styles.brand}>COCOSCAN</Text>

        <TouchableOpacity style={styles.signInBtn} onPress={() => router.push('/login')} accessibilityRole="button" accessibilityLabel="Sign in">
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signUpBtn} onPress={() => router.push('/signup')} accessibilityRole="button" accessibilityLabel="Sign up">
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2d5a3d',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 3,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  logo: {
    fontSize: 42,
  },
  brand: {
    color: '#EFF6E9',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 18,
  },
  signInBtn: {
    width: 260,
    height: 48,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#EFF6E9',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginBottom: 14,
  },
  signInText: {
    color: '#EFF6E9',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  signUpBtn: {
    width: 260,
    height: 48,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpText: {
    color: '#2d5a3d',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
