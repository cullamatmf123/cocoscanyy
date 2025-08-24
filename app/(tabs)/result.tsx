import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Alert } from 'react-native';
import { useNavigation, useLocalSearchParams, useRouter } from 'expo-router';
import { usePhotos } from '../../contexts/PhotoContext';

export default function ResultScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { photoUri, photoBase64 } = useLocalSearchParams<{
    photoUri?: string;
    photoBase64?: string;
    aiStatus?: string;
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
      <View style={styles.headerBar}>
        <View style={styles.logoRow}>
          <Text style={{ fontSize: 22, marginRight: 8 }}>🌴</Text>
          <Text style={styles.headerTitle}>COCOSCAN</Text>
        </View>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/camera')} accessibilityRole="button" accessibilityLabel="Close and return to camera">
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Captured Image */}
        <View style={styles.imageContainer}>
          {!!photoUri ? (
            <Image 
              source={{ uri: photoUri }} 
              style={styles.image}
              resizeMode="contain"
              onError={(e) => {
                console.log('Image loading error:', e.nativeEvent.error);
                if (!photoBase64) {
                  Alert.alert('Error', 'Failed to load image');
                }
              }}
            />
          ) : null}

          {/* Fallback to base64 if file URI is not available or fails */}
          {!photoUri && photoBase64 ? (
            <Image
              source={{ uri: `data:image/jpeg;base64,${photoBase64}` }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : null}
        </View>
        
        {/* ABOUT Button */}
        <TouchableOpacity 
          style={styles.treeBtn} 
          activeOpacity={0.8}
          onPress={() => {
            // Navigate to About page with the photo data
            router.push({ pathname: '/(tabs)/about', params: { photoUri, photoBase64, aboutText } });
          }}
        >
          <Text style={styles.treeBtnText}>ABOUT</Text>
        </TouchableOpacity>

        {/* TREATMENT & CONTROL Button */}
        <TouchableOpacity
          style={[styles.treeBtn, styles.treeBtnActive]}
          activeOpacity={0.8}
          onPress={() => {
            router.push({ pathname: '/(tabs)/treatment-control', params: { aboutText, photoUri, photoBase64 } });
          }}
        >
          <Text style={styles.treeBtnText}>TREATMENT{"\n"}& CONTROL</Text>
        </TouchableOpacity>

        {/* PESTICIDE RECOMMENDATION Button */}
        <TouchableOpacity style={styles.treeBtn} activeOpacity={0.8}>
          <Text style={styles.treeBtnText}>
            PESTICIDE{"\n"}RECOMMENDATION
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f7f7f7',
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
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#f7f7f7',
  },
  imageContainer: {
    width: '90%',
    height: 250,
    backgroundColor: 'transparent',
    borderRadius: 0,
    marginBottom: 20,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    overflow: 'visible',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  treeBtn: {
    width: 260,
    height: 80,
    borderRadius: 24,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    backgroundColor: '#fff',
    borderWidth: 0,
  },
  treeBtnActive: {
    borderWidth: 4,
    borderColor: '#1C8FFF',
  },
  treeBtnText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 26,
    letterSpacing: 0.5,
    textAlign: 'center',
    lineHeight: 32,
  },
});