import React, { useMemo } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';

export default function TreatmentControlScreen() {
  const navigation = useNavigation<any>();
  const router = useRouter();
  const { aboutText, photoUri, photoBase64 } = useLocalSearchParams<{
    aboutText?: string;
    photoUri?: string;
    photoBase64?: string;
  }>();

  // Very light heuristic to tailor suggestions if the detected pest is mentioned
  const { treatment, control } = useMemo(() => {
    const lower = (aboutText || '').toLowerCase();
    const isOpisina = lower.includes('opisina arenosella') || lower.includes('black-headed caterpillar');

    if (isOpisina) {
      return {
        treatment: [
          'Prune and safely destroy heavily infested and dried fronds to reduce larval populations.',
          'Release biological control agents such as parasitoid wasps (e.g., Bracon spp., Goniozus spp.) where available.',
          'Apply botanical sprays like 2% neem oil + emulsifier targeting undersides of leaves with webbing.',
          'In severe cases, consult a licensed professional for selective insecticide use; follow local regulations and label directions strictly.',
        ],
        control: [
          'Encourage natural enemies by minimizing broad-spectrum insecticide use.',
          'Maintain sanitation: remove and dispose of infested leaflets and webs regularly.',
          'Improve tree vigor through proper irrigation and balanced fertilization.',
          'Monitor young palms more frequently; early detection greatly reduces damage.',
        ],
      };
    }

    // Generic coconut pest guidance
    return {
      treatment: [
        'Remove and dispose of severely infested plant parts to reduce pest load.',
        'Use botanicals (e.g., neem-based) first; spot-treat and avoid overapplication.',
        'If required, consult local extension services for approved selective insecticides and pre-harvest intervals.',
      ],
      control: [
        'Promote beneficial insects by maintaining habitat and avoiding unnecessary chemicals.',
        'Keep the area clean; remove fallen debris where pests may breed.',
        'Water and fertilize appropriately to keep palms healthy and resilient.',
        'Scout weekly during peak seasons; act early if thresholds are reached.',
      ],
    };
  }, [aboutText]);

  const handleClose = () => {
    router.replace('/(tabs)/result');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerBar}>
        <View style={styles.logoRow}>
          <Text style={{ fontSize: 20, marginRight: 8 }}>🌴</Text>
          <Text style={styles.headerTitle}>COCOSCAN</Text>
        </View>
        <TouchableOpacity onPress={handleClose}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bg}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Result Image */}
          <View style={styles.heroImageWrap}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.heroImage} resizeMode="cover" />
            ) : photoBase64 ? (
              <Image source={{ uri: `data:image/jpeg;base64,${photoBase64}` }} style={styles.heroImage} resizeMode="cover" />
            ) : null}
          </View>

          {/* Card with recommendations */}
          <View style={styles.card}>
            <Text style={styles.title}>Treatment & Control</Text>
            {!!aboutText && <Text style={styles.subtitle}>Based on: {aboutText.split('\n')[0]}</Text>}

            <Text style={styles.section}>Recommended Treatment</Text>
            {treatment.map((t, idx) => (
              <Text key={`t-${idx}`} style={styles.bullet}>• {t}</Text>
            ))}

            <Text style={styles.section}>Integrated Control Practices</Text>
            {control.map((c, idx) => (
              <Text key={`c-${idx}`} style={styles.bullet}>• {c}</Text>
            ))}

            <Text style={styles.note}>
              Note: Always follow your local agricultural guidelines and product labels. Consider consulting an
              agricultural extension officer for site-specific advice.
            </Text>
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#e9e9e9',
  },
  headerBar: {
    height: 56,
    backgroundColor: '#27613A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
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
    fontSize: 18,
    fontWeight: 'bold',
    padding: 4,
  },
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#27613A',
  },
  content: {
    alignItems: 'center',
    paddingTop: 18,
    paddingHorizontal: 16,
  },
  heroImageWrap: {
    width: '92%',
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  card: {
    width: '92%',
    backgroundColor: 'rgba(239,239,239,0.95)',
    borderRadius: 14,
    padding: 14,
    borderColor: '#999',
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 13,
    color: '#444',
    textAlign: 'center',
    marginBottom: 6,
  },
  section: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '700',
  },
  bullet: {
    fontSize: 14,
    color: '#222',
    marginTop: 6,
  },
  note: {
    marginTop: 14,
    fontSize: 12,
    color: '#555',
  },
});
