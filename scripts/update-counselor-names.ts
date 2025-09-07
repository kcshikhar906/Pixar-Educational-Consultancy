
/**
 * One-time script to update old counselor names in student records to the new full name format.
 *
 * This script will:
 * 1. Connect to your Firestore database.
 * 2. Define a mapping from old names (e.g., "Pawan Sir") to new full names (e.g., "Pawan Acharya").
 * 3. Fetch all student documents.
 * 4. For each student, if their 'assignedTo' field matches an old name, it will be updated to the new name.
 * 5. This is necessary to align historical data with the new security rules.
 *
 * How to run:
 * 1. IMPORTANT: Review and update the 'nameMapping' object in this file to ensure it's correct.
 * 2. Ensure your Firebase project credentials are set up correctly in
 *    'firebase-service-account.json' in the root of your project.
 * 3. Run the script from your project's root directory using the command:
 *    `npx tsx scripts/update-counselor-names.ts`
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

// --- Configuration ---
// !!! IMPORTANT: REVIEW AND EDIT THIS MAPPING TO BE ACCURATE FOR YOUR DATA !!!
const nameMapping: { [oldName: string]: string } = {
  // Add all old name to new name mappings here
  // "Old Name in Database": "New Full Name",
  "Pawan Sir": "Pawan Acharya",
  "Mujal Sir": "Mujal Amatya",
  "Sabina Mam": "Sabina Thapa",
  "Shyam Sir": "Shyam Babu Ojha",
  "Mamta Miss": "Mamata Chapagain",
  "Sonima Mam": "Sonima Rijal",
  "Sujata Mam": "Sujata Nepal",
  "Anisha Mam": "Anisha Thapa",
  "Saubhana Mam": "Saubhana Bhandari",
  "Sunita Mam": "Sunita Khadka",
  "Shikhar Sir": "Shikhar KC",
  "Ram Sir": "Ram Babu Ojha",
  "Pradeep Sir": "Pradeep Khadka"
};

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
const studentsCollection = db.collection('students');

async function updateCounselorNames() {
  console.log("🔵 Starting script to update counselor names...");
  console.log("Using the following name mapping:", nameMapping);

  try {
    const snapshot = await studentsCollection.get();

    if (snapshot.empty) {
      console.log('✅ No student records found. Nothing to do.');
      return;
    }

    const batches = [];
    let currentBatch = db.batch();
    let recordsToUpdateCount = 0;
    const oldNames = Object.keys(nameMapping);

    snapshot.forEach((doc, index) => {
      const studentData = doc.data();
      const currentAssignedTo = studentData.assignedTo;

      if (currentAssignedTo && oldNames.includes(currentAssignedTo)) {
        const newName = nameMapping[currentAssignedTo];
        console.log(`- Scheduling update for student ID: ${doc.id} (Name: ${studentData.fullName}). Changing "${currentAssignedTo}" to "${newName}".`);
        const docRef = studentsCollection.doc(doc.id);
        currentBatch.update(docRef, { assignedTo: newName });
        recordsToUpdateCount++;
      }

      if (recordsToUpdateCount > 0 && (recordsToUpdateCount % BATCH_SIZE === 0 || index === snapshot.size - 1)) {
        batches.push(currentBatch);
        currentBatch = db.batch();
      }
    });

    if (recordsToUpdateCount === 0) {
        console.log('✅ No student records with old counselor names found. No updates needed.');
        return;
    }

    console.log(`🔍 Found ${snapshot.size} total records. Preparing to update ${recordsToUpdateCount} records in ${batches.length} batch(es)...`);

    for (let i = 0; i < batches.length; i++) {
        console.log(`- - - - - - - - - - - - - - - - - - - -`);
        console.log(`🔵 Committing Batch ${i + 1} of ${batches.length}...`);
        await batches[i].commit();
        console.log(`✅ Successfully committed Batch ${i + 1}.`);
    }

    console.log(`✅ Successfully updated all necessary student records.`);
    console.log('🔵 Script finished.');

  } catch (error) {
    console.error('❌ An error occurred while updating counselor names:', error);
  }
}

updateCounselorNames().catch(error => {
  console.error("❌ An unexpected error occurred during the script execution:", error);
});
