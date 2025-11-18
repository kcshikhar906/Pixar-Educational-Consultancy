
/**
 * @fileOverview Cloud Functions for automatically aggregating student metrics
 * and managing the office welcome screen display.
 *
 * Functions:
 * - onStudentChange: Triggered when a student is created, updated, or deleted.
 *   This function handles two main tasks:
 *   1. Re-calculating and updating the welcome screen list of unassigned
 *      students.
 *   2. Incrementally updating aggregated dashboard metrics for real-time stats.
 */

import {
  onDocumentWritten,
  FirestoreEvent,
} from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import {Change} from "firebase-functions";
import {DocumentData, DocumentSnapshot} from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
admin.initializeApp();

// Explicitly connect to the 'pixareducation' database.
const db = admin.firestore();

// Name mapping to consolidate old names to new full names for metrics
const counselorNameMapping: {[oldName: string]: string} = {
  "Pawan Sir": "Pawan Acharya",
  "Mujal Sir": "Mujal Amatya",
  "Sabina Mam": "Sabina Thapa",
  "Shyam Sir": "Shyam Babu Ojha",
  "Mamta Miss": "Mamata Chapagain",
  "Pradeep Sir": "Pradeep Khadka",
};

// Helper to normalize and map counselor names
const getNormalizedCounselorName = (name: string | undefined | null): string => {
    if (!name) return "Unassigned";
    const trimmedName = name.trim();
    // Return the new full name if the input is an old name, otherwise return the name as is.
    return counselorNameMapping[trimmedName] || toTitleCase(trimmedName);
};


// Helper to normalize strings to Title Case for consistency
const toTitleCase = (str: string | undefined | null): string => {
  if (!str) return "N/A";
  return str.trim().replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};

const updateMetrics = (
  updateFn: (data: DocumentData) => DocumentData
) => {
  const metricsRef = db.collection("metrics").doc("dashboard");
  return db.runTransaction(async (transaction) => {
    const doc = await transaction.get(metricsRef);
    const data = doc.data() || {};
    const updatedData = updateFn(data);
    transaction.set(metricsRef, updatedData, {merge: true});
  });
};

/**
 * Recalculates the list of unassigned students and updates the welcome screen.
 * This is a robust, self-correcting approach that runs on any student change.
 */
const regenerateWelcomeScreen = async () => {
  console.log("Starting: regenerateWelcomeScreen function triggered.");
  const welcomeRef = db.collection("display").doc("officeTV");

  // Query for the 20 most recent students who are unassigned.
  // This ensures the list is always fresh and relevant.
  const studentsQuery = db.collection("students")
    .where("assignedTo", "==", "Unassigned")
    .orderBy("timestamp", "desc")
    .limit(20);

  try {
    const querySnapshot = await studentsQuery.get();
    const unassignedNames = querySnapshot.docs.map(
      (doc) => doc.data().fullName
    );

    console.log(`Found ${unassignedNames.length} unassigned students.`);
    console.log("Names to be written:", unassignedNames.join(", ") || "None");

    // Overwrite the document with the fresh list of names.
    await welcomeRef.set({studentNames: unassignedNames});

    console.log("SUCCESS: Welcome screen updated successfully.");
  } catch (error) {
    console.error("Error regenerating welcome screen:", error);
  }
};

/**
 * @param {number | undefined} currentValue The current value to increment.
 * @return {admin.firestore.FieldValue} The FieldValue increment operation.
 */
const increment = (currentValue: number | undefined) => {
  const val = currentValue === undefined ? 1 : 1;
  return admin.firestore.FieldValue.increment(val);
};

/**
 * @param {number | undefined} currentValue The current value to decrement.
 * @return {admin.firestore.FieldValue} The FieldValue decrement operation.
 */
const decrement = (currentValue: number | undefined) => {
  // Ensure we don't go below zero.
  if (currentValue === undefined || currentValue <= 0) {
    return admin.firestore.FieldValue.increment(0);
  }
  return admin.firestore.FieldValue.increment(-1);
};


export const onStudentChange = onDocumentWritten(
  {
    document: "students/{studentId}",
    database: "pixareducation", // Specify the database here
  },
  async (event: FirestoreEvent<Change<DocumentSnapshot> | undefined,
    { studentId: string }>) => {
    if (!event.data) {
      console.log("No data associated with the event. Exiting function.");
      return;
    }

    console.log(`Function triggered for studentId: ${event.params.studentId}`);
    const before = event.data.before.data();
    const after = event.data.after.data();

    const welcomeScreenPromise = regenerateWelcomeScreen();

    const metricsPromise = updateMetrics((data) => {
      // --- Handle Deletes ---
      if (!after) {
        if (!before) return data;
        console.log(`Processing DELETE for student: ${before.fullName}`);
        const dest = toTitleCase(before.preferredStudyDestination);
        const visa = toTitleCase(before.visaStatus);
        const coun = getNormalizedCounselorName(before.assignedTo);
        const fee = toTitleCase(before.serviceFeeStatus);
        const edu = toTitleCase(before.lastCompletedEducation);
        const test = toTitleCase(before.englishProficiencyTest);
        
        data.totalStudents = decrement(data.totalStudents);
        
        if (dest && data.studentsByDestination?.[dest]) {
          data.studentsByDestination[dest] = decrement(data.studentsByDestination[dest]);
        }
        if (visa && data.visaStatusCounts?.[visa]) {
          data.visaStatusCounts[visa] = decrement(data.visaStatusCounts[visa]);
        }
        if (coun && data.studentsByCounselor?.[coun]) {
          data.studentsByCounselor[coun] = decrement(data.studentsByCounselor[coun]);
        }
        if (fee && data.serviceFeeStatusCounts?.[fee]) {
          data.serviceFeeStatusCounts[fee] = decrement(data.serviceFeeStatusCounts[fee]);
        }
        if (edu && data.studentsByEducation?.[edu]) {
          data.studentsByEducation[edu] = decrement(data.studentsByEducation[edu]);
        }
        if (test && data.studentsByEnglishTest?.[test]) {
          data.studentsByEnglishTest[test] = decrement(data.studentsByEnglishTest[test]);
        }
        
        // Handle monthly admissions decrement (more complex)
        if (before.timestamp) {
            const date = before.timestamp.toDate();
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            if (data.monthlyAdmissions?.[monthYear]) {
                data.monthlyAdmissions[monthYear] = decrement(data.monthlyAdmissions[monthYear]);
            }
        }
        return data;
      }

      // --- Handle Creates ---
      if (!before) {
        console.log(`Processing CREATE for student: ${after.fullName}`);
        const dest = toTitleCase(after.preferredStudyDestination);
        const visa = toTitleCase(after.visaStatus);
        const coun = getNormalizedCounselorName(after.assignedTo);
        const fee = toTitleCase(after.serviceFeeStatus);
        const edu = toTitleCase(after.lastCompletedEducation);
        const test = toTitleCase(after.englishProficiencyTest);
        const date = after.timestamp.toDate();
        const monthYear = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;

        data.totalStudents = increment(data.totalStudents);
        data.studentsByDestination = {
          ...data.studentsByDestination,
          [dest]: increment(data.studentsByDestination?.[dest]),
        };
        data.visaStatusCounts = {
          ...data.visaStatusCounts,
          [visa]: increment(data.visaStatusCounts?.[visa]),
        };
        data.studentsByCounselor = {
          ...data.studentsByCounselor,
          [coun]: increment(data.studentsByCounselor?.[coun]),
        };
        data.serviceFeeStatusCounts = {
          ...data.serviceFeeStatusCounts,
          [fee]: increment(data.serviceFeeStatusCounts?.[fee]),
        };
        data.studentsByEducation = {
          ...data.studentsByEducation,
          [edu]: increment(data.studentsByEducation?.[edu]),
        };
        data.studentsByEnglishTest = {
          ...data.studentsByEnglishTest,
          [test]: increment(data.studentsByEnglishTest?.[test]),
        };
        data.monthlyAdmissions = {
          ...data.monthlyAdmissions,
          [monthYear]: increment(data.monthlyAdmissions?.[monthYear]),
        };
        return data;
      }

      // --- Handle Updates ---
      console.log(`Processing UPDATE for student: ${after.fullName}`);
      const changed = (field: string) => before[field] !== after[field];

      if (changed("preferredStudyDestination")) {
        const oldVal = toTitleCase(before.preferredStudyDestination);
        const newVal = toTitleCase(after.preferredStudyDestination);
        data.studentsByDestination = {
          ...data.studentsByDestination,
          [oldVal]: decrement(data.studentsByDestination?.[oldVal]),
          [newVal]: increment(data.studentsByDestination?.[newVal]),
        };
      }
      if (changed("visaStatus")) {
        const oldVal = toTitleCase(before.visaStatus);
        const newVal = toTitleCase(after.visaStatus);
        data.visaStatusCounts = {
          ...data.visaStatusCounts,
          [oldVal]: decrement(data.visaStatusCounts?.[oldVal]),
          [newVal]: increment(data.visaStatusCounts?.[newVal]),
        };
      }
      if (changed("assignedTo")) {
        const oldVal = getNormalizedCounselorName(before.assignedTo);
        const newVal = getNormalizedCounselorName(after.assignedTo);
        data.studentsByCounselor = {
          ...data.studentsByCounselor,
          [oldVal]: decrement(data.studentsByCounselor?.[oldVal]),
          [newVal]: increment(data.studentsByCounselor?.[newVal]),
        };
      }
      if (changed("serviceFeeStatus")) {
        const oldVal = toTitleCase(before.serviceFeeStatus);
        const newVal = toTitleCase(after.serviceFeeStatus);
        data.serviceFeeStatusCounts = {
          ...data.serviceFeeStatusCounts,
          [oldVal]: decrement(data.serviceFeeStatusCounts?.[oldVal]),
          [newVal]: increment(data.serviceFeeStatusCounts?.[newVal]),
        };
      }
      if (changed("lastCompletedEducation")) {
        const oldVal = toTitleCase(before.lastCompletedEducation);
        const newVal = toTitleCase(after.lastCompletedEducation);
        data.studentsByEducation = {
          ...data.studentsByEducation,
          [oldVal]: decrement(data.studentsByEducation?.[oldVal]),
          [newVal]: increment(data.studentsByEducation?.[newVal]),
        };
      }
      if (changed("englishProficiencyTest")) {
        const oldVal = toTitleCase(before.englishProficiencyTest);
        const newVal = toTitleCase(after.englishProficiencyTest);
        data.studentsByEnglishTest = {
          ...data.studentsByEnglishTest,
          [oldVal]: decrement(data.studentsByEnglishTest?.[oldVal]),
          [newVal]: increment(data.studentsByEnglishTest?.[newVal]),
        };
      }
      return data;
    });

    await Promise.all([welcomeScreenPromise, metricsPromise]);
    console.log(`Function finished for studentId: ${event.params.studentId}`);
  }
);
