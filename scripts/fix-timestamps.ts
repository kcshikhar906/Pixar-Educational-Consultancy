
/**
 * One-time script to fix student records with future timestamps.
 *
 * This script will:
 * 1. Connect to your Firestore database.
 * 2. Query the 'students' collection for any documents where the 'timestamp'
 *    field is set to a date in the future.
 * 3. Update each of those documents, setting the 'timestamp' to the
 *    current server time.
 *
 * How to run:
 * 1. Ensure your Firebase project credentials are set up correctly in
 *    'firebase-service-account.json' in the root of your project.
 * 2. Run the script from your project's root directory using the command:
 *    `npx tsx scripts/fix-timestamps.ts`
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

// --- Configuration ---
const SERVICE_ACCOUNT_PATH = path.join(process.cwd(), 'firebase-service-account.json');
const DATABASE_ID = 'pixareducation';
// --- End Configuration ---

// Initialize Firebase Admin SDK
try {
  if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    throw new Error(`Service account key not found at: ${SERVICE_ACCOUNT_PATH}\nPlease follow the setup instructions in the script file.`);
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const serviceAccount = require(SERVICE_ACCOUNT_PATH);
  
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  });

  console.log('✅ Firebase Admin SDK initialized successfully.');

} catch (error) {
  console.error("❌ Error initializing Firebase Admin SDK:", error);
  process.exit(1);
}

const db = getFirestore(DATABASE_ID);
console.log(`✅ Connected to Firestore database: ${DATABASE_ID}`);
const studentsCollection = db.collection('students');

async function fixFutureTimestamps() {
  console.log('🔵 Starting script to fix future timestamps...');

  const now = new Date();
  const futureStudentsQuery = studentsCollection.where('timestamp', '>', now);

  try {
    const snapshot = await futureStudentsQuery.get();

    if (snapshot.empty) {
      console.log('✅ No student records with future timestamps were found. Your data is likely correct.');
      return;
    }

    console.log(`🔍 Found ${snapshot.size} records with future timestamps. Starting update process...`);

    const batch = db.batch();
    snapshot.forEach(doc => {
      console.log(`- Fixing timestamp for student ID: ${doc.id} (Name: ${doc.data().fullName})`);
      const docRef = studentsCollection.doc(doc.id);
      batch.update(docRef, { timestamp: FieldValue.serverTimestamp() });
    });

    await batch.commit();

    console.log(`✅ Successfully updated ${snapshot.size} student records.`);
    console.log('🔵 Script finished.');

  } catch (error) {
    console.error('❌ An error occurred while fixing timestamps:', error);
    if ((error as any).code === 'failed-precondition') {
        console.error('\n❗️ FIRESTORE INDEX REQUIRED ❗️');
        console.error('This script requires a Firestore index. Please create a composite index in your Firebase console for the "students" collection with the following fields:');
        console.error('1. `timestamp` (Ascending)');
        console.error('This is a one-time setup.');
    }
  }
}

fixFutureTimestamps().catch(error => {
  console.error("❌ An unexpected error occurred during the script execution:", error);
});
