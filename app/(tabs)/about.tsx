import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';

export default function AboutScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();

  const handleClose = () => {
    // Behave like a back button; if no history, go to Result page
    if (typeof navigation?.canGoBack === 'function' && navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      router.replace('/(tabs)/result');
    }
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

      <ImageBackground
        source={{ uri: 'https://img.ixintu.com/download/jpg/201912/a833e887736eb56c8fa60d5e76410e4c.jpg!con' }}
        style={styles.bg}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.title}>Opisina arenosella</Text>

            <Text style={styles.paragraph}>Opisina arenosella is a species of moth whose larval stage, commonly known as the black-headed caterpillar, is a serious pest of coconut and other palm trees, causing significant defoliation by feeding on the leaves.</Text>

            <Text style={styles.section}>Sign & Symptoms</Text>
            <Text style={styles.bullet}>• Silken webbing on the underside of leaves</Text>
            <Text style={styles.bullet}>• A silky, web-like covering made by caterpillars, often filled with frass (insect droppings)</Text>
            <Text style={styles.section2}>Feeding marks or leaf scraping</Text>
            <Text style={styles.bullet}>• Caterpillars scrape the green leaf surface, leaving white or brown patches</Text>
            <Text style={styles.section2}>Dying and yellowing of leaf tips</Text>
            <Text style={styles.bullet}>• Starts from the leaf tip and progresses toward the base</Text>
            <Text style={styles.section2}>Presence of black-headed caterpillars</Text>
            <Text style={styles.bullet}>• Small larvae with dark (black) heads, often hidden inside the webs</Text>
            <Text style={styles.section2}>Frass (insect waste) on leaves</Text>
            <Text style={styles.bullet}>• Black or brown droppings seen inside or near the silken web</Text>
            <Text style={styles.section}>Progressive leaf damage</Text>
            <Text style={styles.bullet}>• Leaves become dry, rolled, and eventually fall off in severe cases</Text>
            <Text style={styles.section}>Reduced nut production</Text>
            <Text style={styles.bullet}>• Ongoing infestations weaken the tree, reducing coconut yield</Text>
            <Text style={styles.section}>More damage on nursery or young palms</Text>
            <Text style={styles.bullet}>• Younger trees are more vulnerable to severe defoliation</Text>
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      </ImageBackground>
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
    fontSize: 22,
    fontWeight: 'bold',
    padding: 4,
  },
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    alignItems: 'center',
    paddingTop: 18,
    paddingHorizontal: 16,
  },
  infoCard: {
    width: '90%',
    backgroundColor: '#EFEFEF',
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
  section: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '700',
  },
  section2: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
  },
  paragraph: {
    fontSize: 14,
    color: '#222',
  },
  bullet: {
    fontSize: 14,
    color: '#222',
    marginTop: 4,
  },
});