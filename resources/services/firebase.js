// resources/js/firebase.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyAtEF_TmmwXYRtBO-zh87SDxEGubXiDF_Y",
  authDomain: "insight-24954.firebaseapp.com",
  projectId: "insight-24954",
  storageBucket: "insight-24954.firebasestorage.app",
  messagingSenderId: "229285878919",
  appId: "1:229285878919:web:df62a08a7c5a9b591aac22",
  measurementId: "G-7190LJKSSS"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export { messaging, getToken, onMessage };
