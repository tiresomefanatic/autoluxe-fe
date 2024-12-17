// src/config/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyARuM5aox2Jpqz8PyeWvheB-wg0gIums64",
  authDomain: "autoluxe-c6429.firebaseapp.com",
  projectId: "autoluxe-c6429",
  storageBucket: "autoluxe-c6429.firebasestorage.app",
  messagingSenderId: "898279684470",
  appId: "1:898279684470:web:1fbb4932bee843ff596257",
  measurementId: "G-4974YTZ9VX",
  recaptchaSiteKey: "6LcppJcqAAAAAACX6SSC517D21K2Hl68hXERadw-u",
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { auth };
