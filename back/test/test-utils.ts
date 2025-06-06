import { INestApplication } from '@nestjs/common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import admin from '../src/firebase';
import { FirebaseApp, deleteApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import {
  deleteApp as deleteAdminApp,
  getApps as getAdminApps,
} from 'firebase-admin/app';

export class TestUtils {
  static app: INestApplication;
  static firebaseApp: FirebaseApp;
  private static createdUserUIDs: string[] = [];

  static async initializeApp(
    moduleBuilder?: (builder: TestingModuleBuilder) => TestingModuleBuilder,
  ) {
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

  static getAuthHeader(token: string) {
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

    if (this.createdUserUIDs.length > 0) {
      await admin.auth().deleteUsers(this.createdUserUIDs);
      const updates = {};
      this.createdUserUIDs.forEach((uid) => {
        updates[`users/${uid}`] = null;
      });
      await this.getDb().ref().update(updates);
      this.createdUserUIDs = [];
    }

    await Promise.all(getAdminApps().map(deleteAdminApp));
  }
}
