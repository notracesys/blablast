'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, onAuthStateChanged, User, getIdTokenResult } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import React, { createContext, useContext, useEffect, useState } from 'react';

let appInstance: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;

export function initializeFirebase() {
  if (!appInstance) {
    appInstance = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    authInstance = getAuth(appInstance);
    dbInstance = getFirestore(appInstance);
  }
  return { app: appInstance, auth: authInstance!, db: dbInstance! };
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
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;
    
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Forçar atualização do token para pegar claims recentes
        const tokenResult = await getIdTokenResult(u, true);
        const userRole = (tokenResult.claims.role as string) || (tokenResult.claims.isAdmin ? 'owner' : 'user');
        
        console.log(`[AUTH] Identificado: ${u.email} | Role: ${userRole}`);
        setUser(u);
        setRole(userRole);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, role, loading };
}
