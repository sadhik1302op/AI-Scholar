import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAZx8bzyVfEXdIou5hB-wi0cEOizWnb-RQ",
  authDomain: "ai-scholar-a1817.firebaseapp.com",
  projectId: "ai-scholar-a1817",
  storageBucket: "ai-scholar-a1817.firebasestorage.app",
  messagingSenderId: "12374672022",
  appId: "1:12374672022:web:357726de2aca586d1af8b7",
  measurementId: "G-J1KNR9M2DN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Analytics (safely for SSR/NextJS environments if compiled by Vercel)
export let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});
