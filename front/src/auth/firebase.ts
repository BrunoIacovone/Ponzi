import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAO13Is1bLPvWOsHmDJwoPL8AHNcpqpvpY",
  authDomain: "ponzi-ed3f2.firebaseapp.com",
  projectId: "ponzi-ed3f2",
  storageBucket: "ponzi-ed3f2.firebasestorage.app",
  messagingSenderId: "901082313815",
  appId: "1:901082313815:web:0720dc15d3670a4f75df12"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
