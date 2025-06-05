import axios from 'axios';
import { auth } from '../auth/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Capacitor } from '@capacitor/core';

const isMobile = Capacitor.isNativePlatform();

export const api = axios.create({
  baseURL: isMobile ? 'http://10.0.2.2:3000' : import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let firebaseReady = new Promise<void>((resolve) => {
  onAuthStateChanged(auth, () => {
    resolve();
  });
});

api.interceptors.request.use(async (config) => {
  await firebaseReady;
  console.log('Current user:', auth.currentUser);
  const token = await auth.currentUser?.getIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
