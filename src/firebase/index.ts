
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Centraliza a inicialização para evitar múltiplas instâncias
export function initializeFirebase() {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const db = getFirestore(app);
  return { app, auth, db };
}

interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextType>({
  app: null,
  auth: null,
  db: null,
});

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<FirebaseContextType>({
    app: null,
    auth: null,
    db: null,
  });

  useEffect(() => {
    const { app, auth, db } = initializeFirebase();
    setServices({ app, auth, db });
  }, []);

  return React.createElement(FirebaseContext.Provider, { value: services }, children);
}

export const useFirebaseApp = () => useContext(FirebaseContext).app;
export const useAuth = () => useContext(FirebaseContext).auth;
export const useFirestore = () => useContext(FirebaseContext).db;

export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(auth?.currentUser || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, [auth]);

  return { user, loading };
}
