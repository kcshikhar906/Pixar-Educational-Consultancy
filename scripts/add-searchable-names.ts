
/**
 * One-time script to add the 'searchableName' field to existing student records.
 *
 * This script will:
 * 1. Connect to your Firestore database.
 * 2. Fetch all student documents from the 'students' collection.
 * 3. For each student, it will add a new field 'searchableName' containing the
 *    lowercase version of the 'fullName'.
 * 4. This is necessary for the case-insensitive search to work on all existing records.
 *
 * How to run:
 * 1. Ensure your Firebase project credentials are set up correctly in
 *    'firebase-service-account.json' in the root of your project.
 * 2. Run the script from your project's root directory using the command:
 *    `npx tsx scripts/add-searchable-names.ts`
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

// --- Configuration ---
const BATCH_SIZE = 250; // Process 250 documents at a time
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

async function addSearchableNames() {
  console.log("🔵 Starting script to add 'searchableName' to student records...");

  try {
    const snapshot = await studentsCollection.get();

    if (snapshot.empty) {
      console.log('✅ No student records found. Nothing to do.');
      return;
    }

    const batches = [];
    let currentBatch = db.batch();
    let currentBatchSize = 0;

    snapshot.forEach(doc => {
      const studentData = doc.data();
      // Process only if fullName exists and searchableName doesn't
      if (studentData.fullName && typeof studentData.fullName === 'string' && !studentData.searchableName) {
        console.log(`- Scheduling update for student ID: ${doc.id} (Name: ${studentData.fullName})`);
        const docRef = studentsCollection.doc(doc.id);
        const newSearchableName = studentData.fullName.toLowerCase();
        currentBatch.update(docRef, { searchableName: newSearchableName });
        currentBatchSize++;
      }

      if (currentBatchSize === BATCH_SIZE) {
        batches.push(currentBatch);
        currentBatch = db.batch();
        currentBatchSize = 0;
      }
    });

    // Add the last batch if it has any operations
    if (currentBatchSize > 0) {
      batches.push(currentBatch);
    }
    
    if (batches.length === 0) {
        console.log('✅ All student records already have the searchableName field. No updates needed.');
        return;
    }

    console.log(`🔍 Found ${snapshot.size} total records. Preparing to update ${batches.reduce((acc, b) => acc + (b as any)._writes.length, 0)} records in ${batches.length} batch(es)...`);

    for (let i = 0; i < batches.length; i++) {
        console.log(`- - - - - - - - - - - - - - - - - - - -`);
        console.log(`🔵 Committing Batch ${i + 1} of ${batches.length}...`);
        await batches[i].commit();
        console.log(`✅ Successfully committed Batch ${i + 1}.`);
    }

    console.log(`✅ Successfully updated all necessary student records.`);
    console.log('🔵 Script finished.');

  } catch (error) {
    console.error('❌ An error occurred while adding searchable names:', error);
  }
}

addSearchableNames().catch(error => {
  console.error("❌ An unexpected error occurred during the script execution:", error);
});
