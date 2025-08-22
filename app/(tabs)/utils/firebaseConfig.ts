import { initializeApp, getApps } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyBhUr94wnjPzgBq491eVHEsnelpq0ngblQ",
  authDomain: "cocoscan-app-web.firebaseapp.com",
  projectId: "cocoscan-app-web",
  storageBucket: "cocoscan-app-web.appspot.com",
  messagingSenderId: "483349048929",
  appId: "1:483349048929:web:055da0171fccba26288420",
  measurementId: "G-MXS9LJKZXS"
};

// Prevent re-initialization if already initialized
export const firebaseApp = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

// Export the correct Auth instance depending on platform
let auth;
if (Platform.OS === "web") {
  auth = getAuth(firebaseApp);
} else {
  // Only initialize once
  try {
    auth = initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (e) {
    // If already initialized, fallback to getAuth
    auth = getAuth(firebaseApp);
  }
}
export { auth };