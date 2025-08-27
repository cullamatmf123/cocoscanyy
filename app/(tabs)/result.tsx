import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Alert, ScrollView } from 'react-native';
import { useNavigation, useLocalSearchParams, useRouter } from 'expo-router';
import { usePhotos } from '../../contexts/PhotoContext';

export default function ResultScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { photoUri, photoBase64, aiStatus, weather, soil } = useLocalSearchParams<{
    photoUri?: string;
    photoBase64?: string;
    aiStatus?: string;
    weather?: string;
    soil?: string;
  }>();
  const { photos } = usePhotos();
  const aboutText = useMemo(() => {
    if (!photoUri) return undefined;
    const found = photos.find(p => p.uri === photoUri);
    return found?.description;
  }, [photos, photoUri]);

  useEffect(() => {
    console.log('Photo URI in result:', photoUri); // Debug log
    
    // If no photoUri, go back to camera
    if (!photoUri) {
      Alert.alert('No Image', 'No image was captured. Please try again.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  }, [photoUri]);

  // Prefetch About screen background image to reduce perceived delay
  useEffect(() => {
    Image.prefetch('https://img.ixintu.com/download/jpg/201912/a833e887736eb56c8fa60d5e76410e4c.jpg!con');
  }, []);

  if (!photoUri) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <Text>Loading image...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.headerBar}>
        <View style={styles.logoRow}>
          <Text style={{ fontSize: 22, marginRight: 8 }}>🌴</Text>
          <Text style={styles.headerTitle}>COCOSCAN</Text>
        </View>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/camera')} accessibilityRole="button" accessibilityLabel="Close and return to camera">
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Scan Result</Text>
          {/* Image */}
          <View style={styles.imageFrame}>
            {!!photoUri ? (
              <Image
                source={{ uri: photoUri }}
                style={styles.image}
                resizeMode="cover"
                onError={(e) => {
                  console.log('Image loading error:', e.nativeEvent.error);
                  if (!photoBase64) Alert.alert('Error', 'Failed to load image');
                }}
              />
            ) : null}
            {!photoUri && photoBase64 ? (
              <Image
                source={{ uri: `data:image/jpeg;base64,${photoBase64}` }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : null}
          </View>

          {/* Info chips */}
          <View style={styles.chipsRow}>
            {!!aiStatus && (
              <View style={[styles.chip, aiStatus?.toLowerCase() === 'healthy' ? styles.chipHealthy : styles.chipWarn]}>
                <Text style={styles.chipText}>AI: {String(aiStatus)}</Text>
              </View>
            )}
            {!!weather && (
              <View style={styles.chip}>
                <Text style={styles.chipText}>Weather: {String(weather)}</Text>
              </View>
            )}
            {!!soil && (
              <View style={styles.chip}>
                <Text style={styles.chipText}>Soil: {String(soil)}</Text>
              </View>
            )}
          </View>

          {/* Buttons */}
          <View style={styles.buttonsCol}>
            <TouchableOpacity
              style={[styles.primaryBtn, styles.btnShadow]}
              activeOpacity={0.9}
              onPress={() => router.push({ pathname: '/(tabs)/about', params: { photoUri, aboutText } })}
            >
              <Text style={styles.primaryBtnText}>About Plant</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryBtn, styles.btnShadow]}
              activeOpacity={0.9}
              onPress={() => router.push({ pathname: '/(tabs)/treatment-control', params: { aboutText, photoUri, photoBase64 } })}
            >
              <Text style={styles.secondaryBtnText}>Treatment & Control</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.ghostBtn]} activeOpacity={0.9}>
              <Text style={styles.ghostBtnText}>Pesticide Recommendation</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer actions */}
        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.footerBtn} onPress={() => router.replace('/(tabs)/camera')}>
            <Text style={styles.footerBtnText}>Scan Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.footerBtn, styles.footerBtnAlt]} onPress={() => router.replace('/(tabs)/homepage')}>
            <Text style={[styles.footerBtnText, styles.footerBtnTextAlt]}>Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBar: {
    height: 56,
    backgroundColor: '#27613A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  closeBtn: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    padding: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2d5a3d',
    marginBottom: 12,
    textAlign: 'center',
  },
  imageFrame: {
    width: '100%',
    height: 240,
    backgroundColor: '#f0f2f0',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#E8F5E9',
  },
  chipText: {
    color: '#2d5a3d',
    fontWeight: '700',
    fontSize: 12,
  },
  chipHealthy: {
    backgroundColor: '#E6F4EA',
  },
  chipWarn: {
    backgroundColor: '#FFF1F0',
  },
  buttonsCol: {
    marginTop: 8,
    gap: 12,
  },
  btnShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  primaryBtn: {
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#2d5a3d',
    fontWeight: '800',
    fontSize: 16,
  },
  secondaryBtn: {
    backgroundColor: '#2d5a3d',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
  ghostBtn: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  ghostBtnText: {
    color: '#1f2937',
    fontWeight: '700',
    fontSize: 16,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  footerBtn: {
    flex: 1,
    backgroundColor: '#2d5a3d',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  footerBtnAlt: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  footerBtnText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  footerBtnTextAlt: {
    color: '#1f2937',
  },
});