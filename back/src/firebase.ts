import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

if (process.env.NODE_ENV === 'test') {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
    databaseURL: process.env.FIREBASE_DATABASE_URL_EMULATOR,
  });
} else {
  const serviceAccountPath = path.resolve(__dirname, '../../firebase-service-account.json');



  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(
      `Firebase service account JSON not found at ${serviceAccountPath}.`
    );
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

export default admin;
