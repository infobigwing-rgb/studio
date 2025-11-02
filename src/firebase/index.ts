'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// This function now safely handles initialization for both client and server environments.
export function initializeFirebase() {
  // On the server, we don't have browser environment variables, so we can't initialize.
  // We'll return null and the provider will handle this.
  if (typeof window === 'undefined') {
    return null;
  }
  
  if (!getApps().length) {
    const isFullyConfigured = Object.values(firebaseConfig).every(Boolean);
    if (isFullyConfigured) {
      const app = initializeApp(firebaseConfig);
      return getSdks(app);
    } else {
      console.error("Firebase initialization failed. Ensure your environment variables are set correctly in .env for local development.");
      // In case of misconfiguration on the client, we'll return null to avoid a hard crash.
      return null;
    }
  }

  // If already initialized, return the SDKs.
  return getSdks(getApp());
}


export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';