import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar, Image, ImageBackground, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { usePhotos } from '../../contexts/PhotoContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { photos } = usePhotos();

  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'android' ? { paddingTop: (StatusBar.currentHeight || 24) } : null]}>
      {/* Top bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/homepage')} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go to homepage">
          <Ionicons name="arrow-back" size={22} color="#1b1b1b" />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Cover and avatar */}
      <View style={styles.coverWrap}>
        <ImageBackground
          source={{ uri: 'https://img.ixintu.com/download/jpg/201912/a833e887736eb56c8fa60d5e76410e4c.jpg!con' }}
          style={styles.cover}
          resizeMode="cover"
        >
          <View style={styles.coverOverlay} />
        </ImageBackground>
        <View style={styles.avatarWrap}>
          <View style={styles.avatarCircle}>
            <Image
              source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXunsSV3Og-I49ehwGoV-PZkL_mg50pl-SPA&s' }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>

      {/* Name and actions */}
      <View style={styles.profileHeader}>
        <Text style={styles.name}>Francellyn Estorpe</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionBtn, styles.actionPrimary]}>
            <Text style={[styles.actionText, styles.actionTextPrimary]}>Add to history</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionSecondary]} onPress={() => {}}>
            <Text style={styles.actionText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionIconBtn]}>
            <Text style={styles.actionIcon}>…</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* History list */}
      <FlatList
        contentContainerStyle={styles.listContent}
        data={photos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Image source={{ uri: item.uri }} style={styles.historyThumb} />
            <View style={styles.historyTextCol}>
              <Text style={styles.historyTitle}>{item.plantName || 'Unknown Plant'}</Text>
              <Text style={styles.historySub}>
                {item.healthAnalysis?.prediction === 'Unhealthy' ? 'Detected' : 'Not Detected'}
              </Text>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        style={{ flex: 1 }}
      />
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
  // Cover + avatar
  coverWrap: {
    position: 'relative',
    width: '100%',
    height: 140,
    backgroundColor: '#2d5a3d',
  },
  cover: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
    zIndex: 0,
  },
  avatarWrap: {
    position: 'absolute',
    left: 24,
    bottom: -20,
    zIndex: 100,
    elevation: 10,
  },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#F6FBF7',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 42,
  },
  // Name + actions
  profileHeader: {
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#F6FBF7',
    zIndex: 1,
    elevation: 0,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  name: {
    marginTop: 4,
    textAlign: 'left',
    fontSize: 22,
    fontWeight: '800',
    color: '#1b1b1b',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  actionBtn: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPrimary: {
    backgroundColor: '#2E7D32',
  },
  actionSecondary: {
    backgroundColor: '#1B5E20',
  },
  actionText: {
    color: '#E8F5E9',
    fontWeight: '700',
  },
  actionTextPrimary: {
    color: '#FFFFFF',
  },
  actionIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 18,
    color: '#2E7D32',
    fontWeight: '700',
  },
  // History list
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  historyThumb: {
    width: 90,
    height: 64,
  },
  historyTextCol: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  historyTitle: {
    fontWeight: '700',
    color: '#1b1b1b',
    marginBottom: 2,
  },
  historySub: {
    color: '#2E7D32',
    fontWeight: '600',
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
