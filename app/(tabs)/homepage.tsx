import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, ImageBackground, Platform, StatusBar, Modal, Animated, Easing, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function HomePage() {
  const router = useRouter();
  const isTall = height >= 800;
  const [menuVisible, setMenuVisible] = useState(false);
  const panelWidth = Math.min(width * 0.82, 360);
  const slideX = useRef(new Animated.Value(panelWidth)).current;

  // Check login state on mount
  useEffect(() => {
    const checkLogin = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (isLoggedIn !== 'true') {
        router.replace('/login');
      }
    };
    checkLogin();
  }, []);

  const handleCapture = () => {
    router.push('/camera');
  };

  const handleHistory = () => {
    router.push('/(tabs)/gallery');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    router.replace('/login');
  };

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideX, {
      toValue: 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };
  const closeMenu = () => {
    Animated.timing(slideX, {
      toValue: panelWidth,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setMenuVisible(false);
    });
  };
  const handleProfile = () => {
    setMenuVisible(false);
    router.push('/(tabs)/profile');
  };

  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'android' ? { paddingTop: (StatusBar.currentHeight || 24) } : null]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground
        source={{ uri: 'https://img.ixintu.com/download/jpg/201912/a833e887736eb56c8fa60d5e76410e4c.jpg!con' }}
        style={styles.bg}
        resizeMode="cover"
      >
        {/* Top-right menu icon */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={openMenu}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
        >
          <Ionicons name="menu" size={26} color="#1b1b1b" />
        </TouchableOpacity>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top welcome area */}
          <View style={[
            styles.welcomeWrap,
            Platform.select({ android: { marginTop: isTall ? 92 : 68 }, ios: {} })
          ]}>
            {/* COCOSCAN: white outer glow + green stroke + minty fill */}
            <View style={styles.headerStack}>
              {/* outer white */}
              <Text style={[styles.brandOuterOutline, { top: -1.5, left: 0 }]}>COCOSCAN</Text>
              <Text style={[styles.brandOuterOutline, { top: 1.5, left: 0 }]}>COCOSCAN</Text>
              <Text style={[styles.brandOuterOutline, { top: 0, left: -1.5 }]}>COCOSCAN</Text>
              <Text style={[styles.brandOuterOutline, { top: 0, left: 1.5 }]}>COCOSCAN</Text>
              {/* green stroke */}
              <Text style={[styles.brandOutline, { top: -1, left: 0 }]}>COCOSCAN</Text>
              <Text style={[styles.brandOutline, { top: 1, left: 0 }]}>COCOSCAN</Text>
              <Text style={[styles.brandOutline, { top: 0, left: -1 }]}>COCOSCAN</Text>
              <Text style={[styles.brandOutline, { top: 0, left: 1 }]}>COCOSCAN</Text>
              {/* fill */}
              <Text style={styles.brand}>COCOSCAN</Text>
            </View>

            {/* WELCOME!: yellow outer + green stroke + white fill */}
            <View style={[styles.headerStack, { marginTop: 2 }]}> 
              {/* yellow outer */}
              <Text style={[styles.welcomeOuterOutline, { top: -3, left: 0 }]}>WELCOME!</Text>
              <Text style={[styles.welcomeOuterOutline, { top: 3, left: 0 }]}>WELCOME!</Text>
              <Text style={[styles.welcomeOuterOutline, { top: 0, left: -3 }]}>WELCOME!</Text>
              <Text style={[styles.welcomeOuterOutline, { top: 0, left: 3 }]}>WELCOME!</Text>
              {/* diagonals to thicken yellow */}
              <Text style={[styles.welcomeOuterOutline, { top: -2.5, left: -2.5 }]}>WELCOME!</Text>
              <Text style={[styles.welcomeOuterOutline, { top: -2.5, left: 2.5 }]}>WELCOME!</Text>
              <Text style={[styles.welcomeOuterOutline, { top: 2.5, left: -2.5 }]}>WELCOME!</Text>
              <Text style={[styles.welcomeOuterOutline, { top: 2.5, left: 2.5 }]}>WELCOME!</Text>
              {/* green inner stroke */}
              <Text style={[styles.welcomeOutline, { top: -2, left: 0 }]}>WELCOME!</Text>
              <Text style={[styles.welcomeOutline, { top: 2, left: 0 }]}>WELCOME!</Text>
              <Text style={[styles.welcomeOutline, { top: 0, left: -2 }]}>WELCOME!</Text>
              <Text style={[styles.welcomeOutline, { top: 0, left: 2 }]}>WELCOME!</Text>
              {/* diagonals to thicken green */}
              <Text style={[styles.welcomeOutline, { top: -1.7, left: -1.7 }]}>WELCOME!</Text>
              <Text style={[styles.welcomeOutline, { top: -1.7, left: 1.7 }]}>WELCOME!</Text>
              <Text style={[styles.welcomeOutline, { top: 1.7, left: -1.7 }]}>WELCOME!</Text>
              <Text style={[styles.welcomeOutline, { top: 1.7, left: 1.7 }]}>WELCOME!</Text>
              {/* fill */}
              <Text style={styles.welcome}>WELCOME!</Text>
            </View>
          </View>

          {/* Main card */}
          <View style={styles.cardWrap}>
            <View style={[
              styles.card,
              Platform.OS === 'android' ? { marginTop: isTall ? 84 : 64, minHeight: isTall ? 420 : 360, paddingTop: isTall ? 64 : 48 } : { marginTop: isTall ? 84 : 64, minHeight: isTall ? 420 : 360, paddingTop: isTall ? 64 : 48 }
            ]}>
              <View style={styles.logoEmblem}>
                <Text style={{ fontSize: 28 }}>🌴</Text>
              </View>

              <TouchableOpacity
                style={[styles.cameraBtn, { width: Math.min(width * 0.6, 260) }]}
                activeOpacity={0.9}
                onPress={handleCapture}
              >
                <View style={styles.cameraIconCircle}>
                  <Ionicons name="camera" size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.cameraBtnText}>Start Scanning</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.cameraBtn, { width: Math.min(width * 0.6, 260) }]}
                activeOpacity={0.9}
                onPress={handleHistory}
              >
                <View style={styles.cameraIconCircle}>
                  <Ionicons name="time" size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.cameraBtnText}>View History</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Right-side Drawer Menu */}
        <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={closeMenu}>
          <View style={styles.drawerOverlay}>
            <Pressable style={styles.drawerBackdrop} onPress={closeMenu} accessibilityLabel="Close menu" />
            <Animated.View style={[styles.drawerPanel, { transform: [{ translateX: slideX }] }]}>
              <View style={styles.drawerHeader}>
                <Text style={styles.drawerTitle}>Menu</Text>
                <TouchableOpacity onPress={closeMenu} accessibilityLabel="Close">
                  <Ionicons name="close" size={18} color="#E0E0E0" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.drawerItem} onPress={handleProfile}>
                <Ionicons name="person" size={20} color="#E8F5E9" />
                <Text style={styles.drawerItemText}>Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.drawerItem, styles.drawerItemDanger]} onPress={handleLogout}>
                <Ionicons name="log-out" size={20} color="#FFCDD2" />
                <Text style={[styles.drawerItemText, styles.drawerItemDangerText]}>Logout</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2d5a3d',
  },
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 0,
    flexGrow: 1,
    justifyContent: 'flex-start',
    minHeight: height,
  },
  cardWrap: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    paddingBottom: 0,
  },
  welcomeWrap: {
    alignItems: 'center',
    marginBottom: 8,
  },
  headerStack: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    color: '#EFFFF3',
    fontWeight: '900',
    letterSpacing: 2,
    fontSize: 14,
    textTransform: 'uppercase',
  },
  brandOutline: {
    position: 'absolute',
    color: '#1C6A45',
    fontWeight: '900',
    letterSpacing: 2,
    fontSize: 14,
    textTransform: 'uppercase',
    textShadowColor: '#1C6A45',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  brandOuterOutline: {
    position: 'absolute',
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 2,
    fontSize: 14,
    textTransform: 'uppercase',
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  welcome: {
    marginTop: 4,
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.12)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  welcomeOutline: {
    position: 'absolute',
    color: '#1C6A45',
    fontWeight: '900',
    fontSize: 40,
    textShadowColor: '#1C6A45',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  welcomeOuterOutline: {
    position: 'absolute',
    color: '#E8C547',
    fontWeight: '900',
    fontSize: 40,
    textShadowColor: '#E8C547',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  card: {
    marginTop: 90,
    alignSelf: 'stretch',
    width: '100%',
    minHeight: 360,
    // allow card to expand until it reaches the logout clearance (handled by cardWrap paddingBottom)
    flexGrow: 1,
    backgroundColor: '#27613A',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingVertical: 28,
    alignItems: 'center',
    gap: 20,
    marginBottom: 0,
    paddingBottom: 24,
  },
  logoEmblem: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#E8C547',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  pillBtn: {
    width: width * 0.7,
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cameraBtn: {
    backgroundColor: '#FFFFFF',
    borderColor: '#2E7D32',
    borderWidth: 1,
    height: 56,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cameraIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  cameraBtnText: {
    color: '#2E7D32',
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: 0.3,
  },
  pillBtnText: {
    color: '#1b6a47',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.3,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d32f2f',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 22,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 7,
    fontSize: 16,
  },
  menuButton: {
    position: 'absolute',
    top: 16,
    right: 20,
    zIndex: 20,
    backgroundColor: 'transparent',
  },
  drawerOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  drawerBackdrop: {
    flex: 1,
  },
  drawerPanel: {
    width: Math.min(width * 0.82, 360),
    backgroundColor: '#121212',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: -2, height: 2 },
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  drawerTitle: {
    color: '#E0E0E0',
    fontSize: 18,
    fontWeight: '800',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(46,125,50,0.12)',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  drawerItemText: {
    color: '#E8F5E9',
    fontSize: 16,
    fontWeight: '700',
  },
  drawerItemDanger: {
    backgroundColor: 'rgba(211,47,47,0.10)',
  },
  drawerItemDangerText: {
    color: '#FFCDD2',
  },
});
