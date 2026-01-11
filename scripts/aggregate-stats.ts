
/**
 * One-time script to aggregate student data into a summary document for the dashboard.
 *
 * This script will:
 * 1. Connect to your Firestore database.
 * 2. Fetch ALL student documents from the 'students' collection.
 * 3. Calculate key metrics:
 *    - Total number of students.
 *    - Count of students by preferred study destination.
 *    - Count of students by visa status.
 *    - Count of new students per month over the last 12 months.
 *    - Count of students assigned to each counselor.
 *    - Count of students by service fee status.
 *    - Count of students by last completed education level.
 *    - Count of students by English proficiency test status.
 * 4. Write this aggregated data to a single document: 'metrics/dashboard'.
 *
 * This allows the admin dashboard to load instantly by reading only one document,
 * instead of querying the entire student collection, which is much more efficient and scalable.
 *
 * How to run:
 * 1. Ensure your Firebase project credentials are set up correctly in
 *    'firebase-service-account.json' in the root of your project.
 * 2. Run the script from your project's root directory using the command:
 *    `npx tsx scripts/aggregate-stats.ts`
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

// --- Configuration ---
const SERVICE_ACCOUNT_PATH = path.join(process.cwd(), 'firebase-service-account.json');
const DATABASE_ID = 'pixareducation';
const SUMMARY_DOC_PATH = 'metrics/dashboard';
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

// Name mapping to consolidate old names to new full names for metrics
const counselorNameMapping: { [oldName: string]: string } = {
  "Pawan Sir": "Pawan Acharya",
  "Mujal Sir": "Mujal Amatya",
  "Sabina Mam": "Sabina Thapa",
  "Shyam Sir": "Shyam Babu Ojha",
  "Mamta Miss": "Mamata Chapagain",
  "Pradeep Sir": "Pradeep Khadka",
};

// Helper to normalize strings to Title Case for consistency
const toTitleCase = (str: string | undefined | null): string => {
  if (!str) return "N/A";
  return str.trim().replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};

// Helper to normalize and map counselor names
const getNormalizedCounselorName = (name: string | undefined | null): string => {
  if (!name) return "Unassigned";
  const trimmedName = name.trim();
  // Return the new full name if the input is an old name, otherwise return the name as is.
  return counselorNameMapping[trimmedName] || toTitleCase(trimmedName);
};


async function aggregateStudentStats() {
  console.log('🔵 Starting dashboard data aggregation...');

  try {
    const studentsSnapshot = await db.collection('students').get();

    if (studentsSnapshot.empty) {
      console.log('⚠️ No student records found. Cannot generate dashboard stats.');
      return;
    }

    console.log(`🔍 Processing ${studentsSnapshot.size} student records...`);

    // Initialize stats object
    const stats = {
      totalStudents: 0,
      studentsByDestination: {} as { [country: string]: number },
      visaStatusCounts: {} as { [status: string]: number },
      monthlyAdmissions: {} as { [month: string]: number },
      studentsByCounselor: {} as { [counselor: string]: number },
      serviceFeeStatusCounts: {} as { [status: string]: number },
      studentsByEducation: {} as { [education: string]: number },
      studentsByEnglishTest: {} as { [test: string]: number },
    };

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    studentsSnapshot.docs.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      const student = doc.data();

      // Increment total students
      stats.totalStudents++;

      // Count by country
      const country = toTitleCase(student.preferredStudyDestination);
      stats.studentsByDestination[country] = (stats.studentsByDestination[country] || 0) + 1;

      // Count by visa status
      const visaStatus = toTitleCase(student.visaStatus);
      stats.visaStatusCounts[visaStatus] = (stats.visaStatusCounts[visaStatus] || 0) + 1;

      // Count monthly admissions
      if (student.timestamp && student.timestamp.toDate) {
        const date = student.timestamp.toDate();
        if (date > twelveMonthsAgo) {
          const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          stats.monthlyAdmissions[monthYear] = (stats.monthlyAdmissions[monthYear] || 0) + 1;
        }
      }

      // Count by assigned counselor
      const counselor = getNormalizedCounselorName(student.assignedTo);
      stats.studentsByCounselor[counselor] = (stats.studentsByCounselor[counselor] || 0) + 1;

      // Count by service fee status
      const feeStatus = toTitleCase(student.serviceFeeStatus);
      stats.serviceFeeStatusCounts[feeStatus] = (stats.serviceFeeStatusCounts[feeStatus] || 0) + 1;

      // Count by education level
      const education = toTitleCase(student.lastCompletedEducation);
      stats.studentsByEducation[education] = (stats.studentsByEducation[education] || 0) + 1;

      // Count by English test status
      const test = toTitleCase(student.englishProficiencyTest);
      stats.studentsByEnglishTest[test] = (stats.studentsByEnglishTest[test] || 0) + 1;
    });

    // Write the aggregated stats to the summary document
    const summaryDocRef = db.doc(SUMMARY_DOC_PATH);
    await summaryDocRef.set(stats); // Use set to completely overwrite with new, clean data

    console.log(`✅ Successfully aggregated stats and saved to '${SUMMARY_DOC_PATH}'.`);
    console.log('📊 Dashboard data is now up-to-date.');
    console.log('🔵 Script finished.');

  } catch (error) {
    console.error('❌ An error occurred during aggregation:', error);
  }
}

aggregateStudentStats().catch(error => {
  console.error("❌ An unexpected error occurred during the script execution:", error);
});
