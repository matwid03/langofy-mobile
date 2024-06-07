import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, initializeAuth, Auth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCnzJNwBZ5BjRM8le2fIlqZdgH8DyBZ8w4",
  authDomain: "lingify-74a52.firebaseapp.com",
  projectId: "lingify-74a52",
  storageBucket: "lingify-74a52.appspot.com",
  messagingSenderId: "159650598657",
  appId: "1:159650598657:web:95ade1490f18affb4cd500",
  measurementId: "G-QW2YLPTX5Q"
};

let app;
let auth;

function initializeFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }

  if (!auth) {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }

  return { app, auth };
}

const { auth: FIREBASE_AUTH } = initializeFirebase();

export { FIREBASE_AUTH };

