import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import admin from '../src/firebase';
import { initializeApp, getApps, deleteApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

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
  }

  static async loginTestUser() {
    if (getApps().length === 0) {
      this.firebaseApp = initializeApp({
        apiKey: process.env.FIREBASE_API_KEY!,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
        projectId: process.env.FIREBASE_PROJECT_ID!,
      });
    }

    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, process.env.FIREBASE_TEST_EMAIL!, process.env.FIREBASE_TEST_PASSWORD!);
    this.testToken = await userCredential.user.getIdToken();
  }

  static getAuthHeader() {
    return { Authorization: `Bearer ${this.testToken}` };
  }

  static async cleanup() {
    if (this.testUid) {
      await admin.auth().deleteUser(this.testUid);
    }
    if (this.app) {
      await this.app.close();
    }
    if (this.firebaseApp) {
      await deleteApp(this.firebaseApp);
    }
  }
}
