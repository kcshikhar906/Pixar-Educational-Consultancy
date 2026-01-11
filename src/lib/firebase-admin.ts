
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Check if the required environment variables are set
if (
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !process.env.FIREBASE_PRIVATE_KEY
) {
  throw new Error('Firebase Admin SDK environment variables are not set. Please check your .env file.');
}

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  // The private key from the environment variable needs to have its escaped newlines replaced.
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
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
