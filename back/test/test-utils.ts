import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import admin from '../src/firebase';
import { initializeApp, getApps, deleteApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  connectAuthEmulator,
} from 'firebase/auth';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import {
  getApps as getAdminApps,
  deleteApp as deleteAdminApp,
} from 'firebase-admin/app';

export class TestUtils {
  static app: INestApplication;
  static testToken: string;
  static testUid: string;
  static firebaseApp: any;

  static async initializeApp() {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    this.app = moduleFixture.createNestApplication();
    await this.app.init();

    if (getApps().length === 0) {
      this.firebaseApp = initializeApp({
        apiKey: process.env.FIREBASE_API_KEY!,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
        projectId: process.env.FIREBASE_PROJECT_ID!,
        databaseURL: process.env.FIREBASE_DATABASE_URL_EMULATOR,
      });
    } else {
      this.firebaseApp = getApps()[0];
    }

    if (process.env.FIREBASE_DATABASE_EMULATOR_HOST) {
      const db = getDatabase(this.firebaseApp);
      const url = new URL(
        `http://${process.env.FIREBASE_DATABASE_EMULATOR_HOST}`,
      );
      connectDatabaseEmulator(db, url.hostname, parseInt(url.port, 10));
    }

    if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
      const auth = getAuth(this.firebaseApp);
      const url = new URL(`http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}`);
      connectAuthEmulator(auth, `http://${url.hostname}:${url.port}`);
    }
  }

  static async loginTestUser() {
    const auth = getAuth(this.firebaseApp);

    const userCredential = await signInWithEmailAndPassword(
      auth,
      process.env.FIREBASE_TEST_EMAIL!,
      process.env.FIREBASE_TEST_PASSWORD!,
    );
    this.testToken = await userCredential.user.getIdToken();
    this.testUid = userCredential.user.uid;
  }

  static getAuthHeader() {
    return { Authorization: `Bearer ${this.testToken}` };
  }

  static async cleanup() {
    if (this.app) {
      await this.app.close();
    }
    if (this.firebaseApp) {
      await deleteApp(this.firebaseApp);
    }
    if (process.env.NODE_ENV === 'test') {
      await Promise.all(getAdminApps().map(deleteAdminApp));
    }
  }
}
