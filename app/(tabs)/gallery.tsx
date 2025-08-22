import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image, Button, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { usePhotoContext } from '../../components/PhotoContext';
import { initModel, isModelReady, predictFromUri } from '../lib/model';

export default function GalleryScreen() {
  const { photos, removePhoto } = usePhotoContext();

  const [errorUris, setErrorUris] = useState<string[]>([]);
  const [ready, setReady] = useState<boolean>(false);
  const [predicting, setPredicting] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, { label: string; confidence: number }>>({});
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await initModel();
        if (mounted) setReady(isModelReady());
      } catch (e: any) {
        console.warn('Model init failed', e);
        if (mounted) setErrMsg('Failed to initialize AI model.');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (photos.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No photos yet. Take some!</Text>
      </View>
    );
  }

  const handleImageError = (uri: string) => {
    setErrorUris((prev) => [...prev, uri]);
  };

  const onPredict = async (uri: string) => {
    setErrMsg(null);
    setPredicting(uri);
    try {
      const res = await predictFromUri(uri);
      setResults((r) => ({ ...r, [uri]: { label: res.label, confidence: res.confidence } }));
    } catch (e: any) {
      console.warn('Predict failed', e);
      setErrMsg(e?.message || 'Prediction failed');
    } finally {
      setPredicting(null);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!ready && (
        <View style={{ marginBottom: 12, alignItems: 'center' }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 6 }}>Loading AI model…</Text>
          {errMsg ? <Text style={{ color: 'red' }}>{errMsg}</Text> : null}
        </View>
      )}
      {photos.map((photo) => {
        const result = results[photo.uri];
        const isLoading = predicting === photo.uri;
        return (
          <View key={photo.uri} style={styles.photoContainer}>
            {errorUris.includes(photo.uri) ? (
              <Text style={{ color: 'red', marginBottom: 8 }}>
                Failed to load image: {photo.uri}
              </Text>
            ) : (
              <Image
                source={{ uri: photo.uri }}
                style={styles.image}
                onError={() => handleImageError(photo.uri)}
              />
            )}
            {result ? (
              <Text style={{ marginBottom: 8 }}>
                Result: {result.label} ({(result.confidence * 100).toFixed(1)}%)
              </Text>
            ) : null}
            {isLoading ? (
              <ActivityIndicator style={{ marginBottom: 8 }} />
            ) : (
              <Button
                title={ready ? 'Predict' : 'Model loading…'}
                onPress={() => onPredict(photo.uri)}
                disabled={!ready}
              />
            )}
            <View style={{ height: 8 }} />
            <Button title="Delete" onPress={() => removePhoto(photo.uri)} />
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 16 },
  photoContainer: { marginBottom: 20, alignItems: 'center' },
  image: { width: 200, height: 200, borderRadius: 10, marginBottom: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});