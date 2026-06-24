import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, initializeFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// Fetch config from the server
const response = await fetch('./firebase-applet-config.json');
const firebaseConfig = await response.json();

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  databaseId: firebaseConfig.firestoreDatabaseId,
});

export const auth = getAuth(app);

signInAnonymously(auth).catch(console.error);
