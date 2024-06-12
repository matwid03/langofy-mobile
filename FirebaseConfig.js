import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
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
let db;

function initializeFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }

  if (!auth) {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }

  if (!db) {
    db = getFirestore(app);
  }

  return { app, auth, db };
}

const { auth: FIREBASE_AUTH, db: FIRESTORE_DB } = initializeFirebase();

export { FIREBASE_AUTH, FIRESTORE_DB };

