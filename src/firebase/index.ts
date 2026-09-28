
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, onAuthStateChanged, User, getIdTokenResult } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDoc } from 'firebase/firestore';
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
  const db = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'owner' | 'manager' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !db) return;
    
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setLoading(true);
      if (u) {
        try {
          // 1. Tenta pegar a role via Claim
          const tokenResult = await getIdTokenResult(u, true);
          let userRole = tokenResult.claims.role as any;

          // 2. Fallback via Firestore se a claim não existir
          if (!userRole) {
            const userSnap = await getDoc(doc(db, 'users', u.uid));
            if (userSnap.exists()) {
              const data = userSnap.data();
              userRole = (data.role === 'owner' || data.isAdmin) ? 'owner' : data.role || 'user';
            }
          }

          console.log(`[AUTH] UID: ${u.uid} | ROLE: ${userRole || 'user'}`);
          setRole(userRole || 'user');
          setUser(u);
        } catch (e) {
          console.error("[AUTH] Erro ao carregar perfil", e);
          setUser(u);
          setRole('user');
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  return { user, role, loading };
}
