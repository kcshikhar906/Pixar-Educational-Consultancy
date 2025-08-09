
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Your web app's Firebase configuration is used for client-side initialization.
// For the backend (server actions), we use the Firebase Admin SDK.

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Initialize Firebase Admin SDK (Singleton Pattern)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Correctly specify the database URL for the project
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

// Get the specific 'pixareducation' database instance.
const db = getFirestore(admin.app(), 'pixareducation');

export { admin, db };
