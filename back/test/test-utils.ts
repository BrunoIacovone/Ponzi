import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import admin from '../src/firebase';
import { initializeApp, getApps, deleteApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, UserCredential } from 'firebase/auth';
import {
  getApps as getAdminApps,
  deleteApp as deleteAdminApp,
} from 'firebase-admin/app';
import { TestingModuleBuilder, TestingModule } from '@nestjs/testing';

export class TestUtils {
  static app: INestApplication;
  static firebaseApp: FirebaseApp;
  private static createdUserUIDs: string[] = [];

  static async initializeApp(
    moduleBuilder?: (builder: TestingModuleBuilder) => TestingModuleBuilder,
  ) {
    // Prevent admin SDK from using emulator env variables
    delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
    delete process.env.FIREBASE_DATABASE_EMULATOR_HOST;

    let builder = Test.createTestingModule({
      imports: [AppModule],
    });

    if (moduleBuilder) {
      builder = moduleBuilder(builder);
    }

    const moduleFixture: TestingModule = await builder.compile();

    this.app = moduleFixture.createNestApplication();
    await this.app.init();

    if (getApps().length === 0) {
      this.firebaseApp = initializeApp({
        apiKey: process.env.FIREBASE_API_KEY!,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
        projectId: process.env.FIREBASE_PROJECT_ID!,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });
    } else {
      this.firebaseApp = getApps()[0];
    }
  }

  static async createTestUser(
    email = `test-user-${Date.now()}@test.com`,
    password = 'password123',
  ): Promise<{ uid: string; token: string; email: string }> {
    const userRecord = await admin.auth().createUser({ email, password });
    const customToken = await admin.auth().createCustomToken(userRecord.uid);
    const auth = getAuth(this.firebaseApp);
    const userCredential = await signInWithCustomToken(auth, customToken);
    const token = await userCredential.user.getIdToken();
    this.createdUserUIDs.push(userRecord.uid);
    return { uid: userRecord.uid, token, email };
  }

  static async getAuthHeader(token: string) {
    return { Authorization: `Bearer ${token}` };
  }

  static getDb() {
    return admin.database();
  }

  static async setBalance(uid: string, amount: number) {
    await this.getDb().ref(`users/${uid}/balance`).set(amount);
  }

  static async getBalance(uid: string): Promise<number> {
    const snapshot = await this.getDb().ref(`users/${uid}/balance`).get();
    return snapshot.val() || 0;
  }

  static async cleanup() {
    if (this.app) {
      await this.app.close();
    }
    if (this.firebaseApp) {
      await deleteApp(this.firebaseApp);
    }
    // Delete all users created during tests
    if (this.createdUserUIDs.length > 0) {
      await admin.auth().deleteUsers(this.createdUserUIDs);
      // Also clean up their data in the RTDB
      const updates = {};
      this.createdUserUIDs.forEach((uid) => {
        updates[`users/${uid}`] = null;
      });
      await this.getDb().ref().update(updates);
      this.createdUserUIDs = [];
    }
    if (process.env.NODE_ENV === 'test') {
      await Promise.all(getAdminApps().map(deleteAdminApp));
    }
  }
}
