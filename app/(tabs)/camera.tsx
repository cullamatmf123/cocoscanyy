import React, { useRef, useState, useEffect } from 'react';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from 'expo-router';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Alert, BackHandler } from 'react-native';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { usePhotos } from '../../contexts/PhotoContext';
import { healthClassificationService, HealthPrediction } from '../lib/healthClassificationService';

// Plant dataset for leaf identification
const plantDataset = [
  {
    id: 1,
    name: 'Rose',
    scientificName: 'Rosa spp.',
    description: 'Common garden flower with thorny stems and fragrant blooms.',
    leafShape: 'Elliptical with serrated edges',
    commonUses: 'Ornamental, perfumes, teas'
  },
  {
    id: 2,
    name: 'Mint',
    scientificName: 'Mentha spp.',
    description: 'Aromatic herb with cooling properties.',
    leafShape: 'Oval with serrated edges, opposite arrangement',
    commonUses: 'Culinary, medicinal teas, aromatherapy'
  },
  {
    id: 3,
    name: 'Basil',
    scientificName: 'Ocimum basilicum',
    description: 'Popular culinary herb with a sweet, aromatic flavor.',
    leafShape: 'Oval to slightly pointed, opposite arrangement',
    commonUses: 'Culinary, pesto, medicinal'
  },
  {
    id: 4,
    name: 'Aloe Vera',
    scientificName: 'Aloe barbadensis',
    description: 'Succulent plant known for its medicinal properties.',
    leafShape: 'Thick, fleshy, serrated edges',
    commonUses: 'Skin care, burns, digestive issues'
  },
  {
    id: 5,
    name: 'Maple',
    scientificName: 'Acer spp.',
    description: 'Tree known for its distinctive leaves and syrup production.',
    leafShape: 'Palmate with 3-5 lobes',
    commonUses: 'Ornamental, syrup, wood'
  }
];

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, setMediaPermission] = useState<MediaLibrary.PermissionResponse | null>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const navigation = useNavigation();
  const router = useRouter();
  const { addPhoto } = usePhotos();

  const [aiLoading, setAiLoading] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<any>(null);
  const [identifiedPlant, setIdentifiedPlant] = useState<any>(null);
  const [healthPrediction, setHealthPrediction] = useState<HealthPrediction | null>(null);
  const [modelStatus, setModelStatus] = useState('Initializing...');

  // Initialize health classification service
  useEffect(() => {
    initializeHealthService();
  }, []);

  const initializeHealthService = async () => {
    try {
      await healthClassificationService.initialize();
      // Try to load model, but don't fail if it's not available
      try {
        await healthClassificationService.loadModel();
        setModelStatus('AI Model Ready');
      } catch (error) {
        console.log('Model not available, using mock predictions');
        setModelStatus('Using Demo Mode');
      }
    } catch (error) {
      console.error('Failed to initialize health service:', error);
      setModelStatus('AI Unavailable');
    }
  };

  // Request media library permission on mount
  useEffect(() => {
    (async () => {
      const status = await MediaLibrary.requestPermissionsAsync();
      setMediaPermission(status);
    })();
  }, []);

  // Always go back to homepage on Android hardware back
  useEffect(() => {
    const onBackPress = () => {
      router.replace('/(tabs)/homepage');
      return true; // prevent default behavior
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [router]);

  if (!permission || !mediaPermission) {
    return <View />;
  }

  if (!permission.granted || !mediaPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', margin: 20 }}>
          We need your permission to use the camera and save photos to your device.
        </Text>
        {!permission.granted && (
          <Button onPress={requestPermission} title="Grant Camera Permission" />
        )}
        {!mediaPermission.granted && (
          <Button onPress={async () => {
            const status = await MediaLibrary.requestPermissionsAsync();
            setMediaPermission(status);
          }} title="Grant Camera Roll Permission" />
        )}
      </View>
    );
  }

  // Plant identification mock
  const identifyPlant = (photoBase64: string) => {
    const randomIndex = Math.floor(Math.random() * plantDataset.length);
    return plantDataset[randomIndex];
  };

  // Health classification
  const classifyHealth = async (imageUri: string): Promise<HealthPrediction> => {
    try {
      if (healthClassificationService.isReady()) {
        return await healthClassificationService.classifyHealth(imageUri);
      } else {
        // Use mock classification if model is not available
        return await healthClassificationService.mockClassifyHealth();
      }
    } catch (error) {
      console.error('Health classification failed:', error);
      // Fallback to mock if real classification fails
      return await healthClassificationService.mockClassifyHealth();
    }
  };

  // Take a photo
  const handleTakePhoto = async () => {
    if (aiLoading) return;
    if (cameraRef.current) {
      try {
        setAiLoading(true);

        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: true,
          exif: false,
          skipProcessing: false,
        });

        if (!photo) throw new Error('Failed to take photo');

        // Run both plant identification and health classification
        const plant = identifyPlant(photo.base64 || '');
        setIdentifiedPlant(plant);

        // Classify health status
        const healthResult = await classifyHealth(photo.uri);
        setHealthPrediction(healthResult);

        const fileName = `photo_${Date.now()}.jpg`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(
          fileUri,
          photo.base64 || '',
          { encoding: FileSystem.EncodingType.Base64 }
        );

        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (!fileInfo.exists) throw new Error('Failed to save image');

        const newPhoto = {
          id: `camera-${Date.now()}`,
          uri: fileUri,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          location: 'Camera Capture',
          base64: photo.base64,
          // Plant data
          plantName: plant?.name,
          scientificName: plant?.scientificName,
          description: plant?.description,
          leafShape: plant?.leafShape,
          commonUses: plant?.commonUses,
          // Health data
          healthStatus: healthResult.prediction,
          healthConfidence: healthResult.confidence,
          healthAnalysis: healthResult
        };
        addPhoto(newPhoto);

        // Show preview
        setCapturedPhoto({ ...photo, fileUri, newPhoto, plant, healthResult });

      } catch (error) {
        console.error('Camera error:', error);
        Alert.alert('Error', 'Failed to capture image. Please try again.');
      } finally {
        setAiLoading(false);
      }
    }
  };

  // Gallery picker logic
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];

      try {
        setAiLoading(true);
        
        const uri = asset.uri;
        const inferredNameFromUri = uri.split('/').pop() || `image_${Date.now()}.jpg`;
        const hasExtension = /\.[a-zA-Z0-9]+$/.test(inferredNameFromUri);
        const fileName = hasExtension ? inferredNameFromUri : `image_${Date.now()}.jpg`;
        const destUri = `${FileSystem.documentDirectory}${fileName}`;

        await FileSystem.copyAsync({ from: uri, to: destUri });

        // Classify health status for gallery image
        const healthResult = await classifyHealth(destUri);
        setHealthPrediction(healthResult);

        const newPhoto = {
          id: `gallery-${Date.now()}`,
          uri: destUri,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          location: 'Gallery',
          base64: asset.base64,
          healthStatus: healthResult.prediction,
          healthConfidence: healthResult.confidence,
          healthAnalysis: healthResult
        };
        addPhoto(newPhoto);
        setCapturedPhoto({ ...asset, uri: destUri, fileUri: destUri, newPhoto, plant: null, healthResult });
      } catch (err) {
        console.error('Failed to process picked image:', err);
        Alert.alert('Error', 'Failed to process selected image. Please try again.');
      } finally {
        setAiLoading(false);
      }
    }
  };

  // Handle tap on preview image
  const handleImagePress = () => {
    if (capturedPhoto) {
      navigation.navigate('external-conditions' as never, {
        photoUri: capturedPhoto.fileUri,
        photoBase64: capturedPhoto.base64,
        aiStatus: 'completed',
        identifiedPlant: capturedPhoto.plant,
        healthPrediction: capturedPhoto.healthResult,
        photoData: capturedPhoto.newPhoto
      });
      setCapturedPhoto(null);
    }
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedPhoto(null);
    setIdentifiedPlant(null);
    setHealthPrediction(null);
  };

  // Main render
  if (capturedPhoto) {
    return (
      <View style={styles.previewContainer}>
        <TouchableOpacity style={{ flex: 1 }} onPress={handleImagePress} activeOpacity={0.9}>
          <Image
            source={{ uri: capturedPhoto.uri || capturedPhoto.fileUri }}
            style={styles.previewImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        
        {/* Health Status Overlay */}
        {capturedPhoto.healthResult && (
          <View style={styles.healthOverlay}>
            <Text style={styles.healthTitle}>Health Status</Text>
            <Text style={[
              styles.healthStatus,
              { color: capturedPhoto.healthResult.prediction === 'Healthy' ? '#4CAF50' : '#F44336' }
            ]}>
              {capturedPhoto.healthResult.prediction}
            </Text>
            <Text style={styles.healthConfidence}>
              {capturedPhoto.healthResult.confidence}% confidence
            </Text>
          </View>
        )}
        
        <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
          <Text style={styles.retakeText}>Retake</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
      >
        {/* Model Status Indicator */}
        <View style={styles.statusIndicator}>
          <Text style={styles.statusText}>{modelStatus}</Text>
        </View>
        
        <View style={styles.controlsContainer}>
          {/* Centered capture button */}
          <TouchableOpacity
            style={[styles.captureButton, styles.captureCenter]}
            onPress={handleTakePhoto}
            disabled={aiLoading}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          {/* Bottom-right gallery button */}
          <TouchableOpacity
            style={[styles.galleryButton, styles.galleryRight]}
            onPress={handlePickImage}
            disabled={aiLoading}
          >
            <Text style={{ fontSize: 24 }}>🖼️</Text>
          </TouchableOpacity>
        </View>

        {aiLoading && (
          <View style={styles.aiModal}>
            <Text style={styles.aiText}>Analyzing Health & Plant...</Text>
          </View>
        )}
      </CameraView>
    </View>
  );
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  statusIndicator: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  controlsContainer: {
    position: 'absolute', left: 0, right: 0, bottom: 40,
    height: 100,
    justifyContent: 'center', alignItems: 'center',
  },
  spacer: { flex: 1 },
  captureButton: {
    width: 70, height: 70, borderRadius: 35, backgroundColor: 'white',
    justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'red', marginHorizontal: 20,
  },
  captureCenter: {
    position: 'absolute', bottom: 0, alignSelf: 'center',
  },
  captureButtonInner: {
    width: 55, height: 55, borderRadius: 27.5, backgroundColor: '#ff4444',
  },
  galleryButton: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center', alignItems: 'center',
  },
  galleryRight: {
    position: 'absolute', bottom: 10, right: 24,
  },
  aiModal: {
    position: 'absolute', top: '40%', left: '10%', right: '10%',
    backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: 16, padding: 24, alignItems: 'center', zIndex: 20,
  },
  aiText: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  previewContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  previewImage: { width: width, height: height, resizeMode: 'contain' },
  healthOverlay: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  healthTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  healthStatus: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  healthConfidence: {
    color: '#ccc',
    fontSize: 14,
  },
  retakeButton: {
    position: 'absolute', bottom: 60, alignSelf: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 20,
  },
  retakeText: { color: '#ff4444', fontWeight: 'bold', fontSize: 18 },
});