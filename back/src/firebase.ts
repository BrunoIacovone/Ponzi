import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import serviceAccount from '../firebase-service-account.json';
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
});

export default admin;
