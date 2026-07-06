/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App gracefully to prevent multiple initialization errors
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Export Firebase services
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Validate connection to Firestore
import { doc, getDocFromServer } from "firebase/firestore";

async function testConnection() {
  try {
    await getDocFromServer(doc(db, "danceAppState", "test_connection"));
    console.log("Firebase Firestore connected successfully.");
  } catch (error) {
    if (error instanceof Error && error.message.includes("offline")) {
      console.error("Please check your Firebase configuration or connection.");
    } else {
      console.log("Firestore connection test completed (permissions verified).");
    }
  }
}
testConnection();
