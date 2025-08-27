import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'android' ? { paddingTop: (StatusBar.currentHeight || 24) } : null]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/homepage')} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go to homepage">
          <Ionicons name="arrow-back" size={22} color="#1b1b1b" />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={48} color="#2E7D32" />
        </View>
        <Text style={styles.name}>Your Name</Text>
        <Text style={styles.subtitle}>user@example.com</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>About</Text>
          <Text style={styles.cardText}>This is a placeholder profile screen. You can customize your user details here.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6FBF7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1b1b1b',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  avatar: {
    alignSelf: 'center',
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  name: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    color: '#1b1b1b',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#4F4F4F',
    marginTop: 4,
  },
  card: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
    color: '#2E7D32',
  },
  cardText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});
