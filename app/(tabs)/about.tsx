import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { usePhotos } from '../../contexts/PhotoContext';
import { initModel, isModelReady, predictFromUri, getLabels } from '../lib/model';

export default function AboutScreen() {
  const navigation = useNavigation();
  const { photos } = usePhotos();

  const { photoUri, photoBase64, aboutText } = useLocalSearchParams<{
    photoUri?: string;
    photoBase64?: string;
    aboutText?: string;
  }>();

  const [ready, setReady] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [prediction, setPrediction] = useState<{ label: string; confidence: number } | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const photoMeta = useMemo(() => {
    if (!photoUri) return null;
    return photos.find((p) => p.uri === photoUri) || null;
  }, [photos, photoUri]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await initModel();
        if (mounted) setReady(isModelReady());
      } catch (e) {
        console.warn('AI model init failed', e);
        if (mounted) setErrMsg('Failed to initialize AI model.');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!photoUri && !photoBase64) {
      Alert.alert('No Image', 'No image was provided.', [
        { text: 'OK', onPress: () => navigation.goBack() as unknown as void },
      ]);
    }
  }, [photoUri, photoBase64, navigation]);

  const onAnalyze = async () => {
    if (!photoUri) {
      setErrMsg('Cannot analyze: missing photo URI.');
      return;
    }
    setErrMsg(null);
    setPredicting(true);
    try {
      if (!isModelReady()) await initModel();
      const res = await predictFromUri(photoUri);
      setPrediction({ label: res.label, confidence: res.confidence });
    } catch (e: any) {
      console.warn('Predict error', e);
      setErrMsg(e?.message || 'Prediction failed');
    } finally {
      setPredicting(false);
    }
  };

  const labels = getLabels();

  const plantName = photoMeta?.plantName || 'Unknown Plant';
  const scientificName = photoMeta?.scientificName || '—';
  const description = (aboutText as string | undefined) || photoMeta?.description || 'No description available.';

  return (
    <SafeAreaView style={styles.safe}> 
      <View style={styles.headerBar}>
        <View style={styles.logoRow}>
          <Text style={{ fontSize: 22, marginRight: 8 }}>🌴</Text>
          <Text style={styles.headerTitle}>About</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageContainer}>
          {photoUri ? (
            <Image
              source={{ uri: photoUri }}
              style={styles.image}
              resizeMode="contain"
              onError={() => {
                if (!photoBase64) Alert.alert('Error', 'Failed to load image');
              }}
            />
          ) : null}
          {!photoUri && photoBase64 ? (
            <Image
              source={{ uri: `data:image/jpeg;base64,${photoBase64}` }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Overview</Text>
          <Text style={styles.name}>{plantName}</Text>
          <Text style={styles.scientific}>{scientificName}</Text>
          <Text style={styles.paragraph}>{description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>AI Classification</Text>
          {!ready && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <ActivityIndicator />
              <Text style={{ marginLeft: 8 }}>Loading model…</Text>
            </View>
          )}
          {prediction ? (
            <Text style={styles.paragraph}>
              Predicted: {prediction.label} ({(prediction.confidence * 100).toFixed(1)}%)
            </Text>
          ) : (
            <Text style={styles.paragraph}>No prediction yet.</Text>
          )}
          {errMsg ? <Text style={{ color: 'red', marginTop: 6 }}>{errMsg}</Text> : null}

          <TouchableOpacity style={[styles.actionBtn, !ready && styles.actionBtnDisabled]} onPress={onAnalyze} disabled={!ready || predicting}>
            {predicting ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionBtnText}>Analyze</Text>}
          </TouchableOpacity>

          {labels?.length ? (
            <Text style={styles.hint}>Labels: {labels.join(', ')}</Text>
          ) : null}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  headerBar: {
    height: 56,
    backgroundColor: '#27613A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
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
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 12,
  },
  imageContainer: {
    width: '95%',
    height: 220,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  scientific: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  paragraph: {
    fontSize: 14,
    color: '#222',
  },
  actionBtn: {
    marginTop: 10,
    backgroundColor: '#1C8FFF',
    borderRadius: 10,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnDisabled: {
    opacity: 0.6,
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  hint: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
});