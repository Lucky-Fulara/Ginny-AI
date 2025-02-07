// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDknAVq8Wi6lcFPywWJRMpzIY0AbhZtlNE",
  authDomain: "ginny-ai.firebaseapp.com",
  projectId: "ginny-ai",
  storageBucket: "ginny-ai.firebasestorage.app",
  messagingSenderId: "1013123242265",
  appId: "1:1013123242265:web:e72e5b31b4d21e3db88d88",
  measurementId: "G-B7LJBNFSHD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);