import React from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';

export default function TreatmentControlScreen() {
  const navigation = useNavigation();
  const { photoUri, photoBase64, aiStatus, aboutText } = useLocalSearchParams<{
    photoUri?: string;
    photoBase64?: string;
    aiStatus?: string;
    aboutText?: string;
  }>();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Treatment & Control</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Image preview */}
        <View style={styles.imageContainer}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.image} resizeMode="cover" />
          ) : photoBase64 ? (
            <Image source={{ uri: `data:image/jpeg;base64,${photoBase64}` }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Text style={{ color: '#666' }}>No image</Text>
            </View>
          )}
        </View>

        {/* Context card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Context</Text>
          <Text style={styles.paragraph}>AI Status: {aiStatus || '—'}</Text>
          {aboutText ? (
            <Text style={styles.paragraph}>Notes: {aboutText}</Text>
          ) : null}
        </View>

        {/* Treatment recommendations */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recommended Treatments</Text>
          <Text style={styles.paragraph}>• Remove heavily infected leaves using sterilized tools.</Text>
          <Text style={styles.paragraph}>• Improve airflow around the plant to reduce moisture.</Text>
          <Text style={styles.paragraph}>• Apply organic fungicide/insecticidal soap as needed.</Text>
          <Text style={styles.paragraph}>• Ensure adequate nutrients (balanced N-P-K) and micronutrients.</Text>
        </View>

        {/* Control and prevention */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Control & Prevention</Text>
          <Text style={styles.paragraph}>• Water at the base to keep foliage dry.</Text>
          <Text style={styles.paragraph}>• Mulch to prevent soil splash and conserve moisture.</Text>
          <Text style={styles.paragraph}>• Monitor regularly and act on early symptoms.</Text>
          <Text style={styles.paragraph}>• Sanitize tools before and after use.</Text>
        </View>

        {/* Safety */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Safety</Text>
          <Text style={styles.paragraph}>• Wear gloves and eye protection when handling treatments.</Text>
          <Text style={styles.paragraph}>• Follow product labels and local regulations.</Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f7f7' },
  headerBar: {
    height: 56,
    backgroundColor: '#27613A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  headerTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  closeBtn: { color: '#fff', fontSize: 18, fontWeight: 'bold', padding: 4 },
  content: { alignItems: 'center', paddingTop: 16, paddingHorizontal: 12 },
  imageContainer: { width: '95%', height: 220, marginBottom: 16 },
  image: { width: '100%', height: '100%', borderRadius: 8 },
  imagePlaceholder: { backgroundColor: '#e9e9e9', alignItems: 'center', justifyContent: 'center' },
  card: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  paragraph: { fontSize: 14, color: '#222', marginBottom: 4 },
});