
/**
 * One-time script to import student data from a CSV file into Firestore.
 *
 * How to run:
 * 1. Ensure you have Node.js and npm installed on your machine.
 * 2. Place this script in a 'scripts' folder at the root of your project.
 * 3. Place your exported 'students.csv' file in the same 'scripts' folder.
 * 4. Ensure your Firebase project credentials are set up for a local Node.js environment.
 *    - Go to Firebase Console > Project Settings > Service accounts.
 *    - Click "Generate new private key" and save the JSON file.
 *    - IMPORTANT: Rename the downloaded file to 'firebase-service-account.json' and place it in the root of your project.
 *    - IMPORTANT: Add 'firebase-service-account.json' to your .gitignore file to avoid committing it to version control.
 * 5. Install dependencies by running `npm install` in your project's root directory.
 * 6. Run the script from your project's root directory using the command: `npx tsx scripts/import-from-csv.ts`
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

// --- Configuration ---
const BATCH_SIZE = 250; // Firestore batch writes are limited to 500 operations.
const CSV_FILE_PATH = path.join(__dirname, 'students.csv'); // Assumes students.csv is in the same directory.
const SERVICE_ACCOUNT_PATH = path.join(process.cwd(), 'firebase-service-account.json');
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
  console.error(
    "❌ Error initializing Firebase Admin SDK. Please check the following:"
  );
  console.error("1. Have you created 'firebase-service-account.json' and placed it in the root of your project?");
  console.error("2. Is the JSON file correctly formatted?");
  console.error("Detailed Error:", error);
  process.exit(1);
}


const db = getFirestore();
const studentsCollection = db.collection('students');

interface StudentCSVRecord {
  [key: string]: string; // Allow any string keys for headers
}

async function importStudents() {
  const records: StudentCSVRecord[] = [];

  if (!fs.existsSync(CSV_FILE_PATH)) {
    console.error(`❌ Error: CSV file not found at ${CSV_FILE_PATH}`);
    console.error("Please make sure your 'students.csv' file is inside the 'scripts' folder.");
    return;
  }

  console.log(`🔵 Reading CSV file from: ${CSV_FILE_PATH}`);

  fs.createReadStream(CSV_FILE_PATH)
    .pipe(csv())
    .on('data', (data: StudentCSVRecord) => {
      // Get the headers from the first row of data
      const headers = Object.keys(data);
      // More robust check: ensure the row is not empty and the first two columns (likely name and email) have values.
      if (headers.length >= 2 && data[headers[1]] && data[headers[2]]) {
        records.push(data);
      }
    })
    .on('end', async () => {
      console.log(`✅ CSV file successfully processed. Found ${records.length} valid records to import.`);
      
      if (records.length === 0) {
        console.log("🔵 No records to import. Please check that your CSV file is not empty and that the columns for 'Full Name' and 'Email Address' are populated.");
        return;
      }

      let totalImported = 0;
      for (let i = 0; i < records.length; i += BATCH_SIZE) {
        const batch = db.batch();
        const chunk = records.slice(i, i + BATCH_SIZE);
        const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(records.length / BATCH_SIZE);

        console.log(`- - - - - - - - - - - - - - - - - - - -`);
        console.log(`🔵 Processing Batch ${batchNumber} of ${totalBatches}...`);

        chunk.forEach(record => {
          const docRef = studentsCollection.doc(); // Auto-generate document ID
          
          // Robust timestamp handling
          const timestampValue = record['Timestamp'] || record['timestamp'];
          const date = timestampValue ? new Date(timestampValue) : new Date();
          const timestamp = date.toString() !== 'Invalid Date' ? date : new Date();

          const studentData = {
            // Match the keys exactly as they appear in your CSV headers
            fullName: record['Full Name'] || record['fullName'] || '',
            email: record['Email Address'] || record['email'] || '',
            mobileNumber: record['Mobile Number'] || record['mobileNumber'] || '',
            lastCompletedEducation: record['Last Completed Education'] || record['lastCompletedEducation'] || '',
            englishProficiencyTest: record['English Proficiency Test'] || record['englishProficiencyTest'] || '',
            preferredStudyDestination: record['Preferred Study Destination'] || record['preferredStudyDestination'] || '',
            additionalNotes: record['Additional Notes / Specific Questions'] || record['additionalNotes'] || '',
            timestamp: timestamp,
            // Set default values for fields not in the form
            visaStatus: 'Not Applied',
            serviceFeeStatus: 'Unpaid',
            assignedTo: 'Unassigned',
            emergencyContact: '',
            collegeUniversityName: '',
            serviceFeePaidDate: null,
            visaStatusUpdateDate: null,
          };
          
          batch.set(docRef, studentData);
        });

        try {
          await batch.commit();
          totalImported += chunk.length;
          console.log(`✅ Successfully imported ${chunk.length} records in this batch.`);
        } catch (error) {
          console.error(`❌ Error committing Batch ${batchNumber}:`, error);
        }
      }
      
      console.log(`- - - - - - - - - - - - - - - - - - - -`);
      console.log(`🔵 Import complete. Total records imported: ${totalImported}`);
      console.log(`- - - - - - - - - - - - - - - - - - - -`);
    });
}

importStudents().catch(error => {
  console.error("❌ An unexpected error occurred during the import process:", error);
});
