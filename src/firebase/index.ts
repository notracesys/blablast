'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (typeof window !== 'undefined') {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getFirestore(app);
}

export function initializeFirebase() {
  return { app, auth, db };
}

export function useFirebaseApp() {
  return app;
}

export function useAuth() {
  return auth;
}

export function useFirestore() {
  return db;
}

export function useCollection(query: any) {
  return { data: [], loading: false, error: null };
}

export function useDoc(ref: any) {
  return { data: null, loading: false, error: null };
}

export function useUser() {
  return { user: auth ? auth.currentUser : null, loading: false };
}

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  return children;
}

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  return children;
}
