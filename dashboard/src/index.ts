
/**
 * @fileOverview Cloud Functions for automatically aggregating student metrics.
 *
 * This set of functions listens for changes in the 'students' collection
 * and automatically updates a summary document in 'metrics/dashboard'.
 * This allows the admin dashboard to load instantly and stay in real-time
 * without needing to query the entire student collection.
 *
 * Functions:
 * - onStudentCreate: Triggered when a new student is added.
 * - onStudentDelete: Triggered when a student is deleted.
 * - onStudentUpdate: Triggered when a student's data changes.
 */

import { onDocumentWritten } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Define a reusable transaction-based update function
const updateMetrics = async (
  docRef: admin.firestore.DocumentReference,
  updateFn: (data: admin.firestore.DocumentData) => admin.firestore.DocumentData
) => {
  return db.runTransaction(async (transaction) => {
    const doc = await transaction.get(docRef);
    const data = doc.data() || {};
    const updatedData = updateFn(data);
    transaction.set(docRef, updatedData, { merge: true });
  });
};

/**
 * Increments a counter within a nested map.
 * e.g., studentsByCounselor['John Doe']++
 */
const increment = (
  currentValue: number | undefined
): admin.firestore.FieldValue => {
  return admin.firestore.FieldValue.increment(currentValue === undefined ? 1 : 1);
};

/**
 * Decrements a counter within a nested map.
 * Ensures the counter does not go below zero.
 */
const decrement = (
  currentValue: number | undefined
): admin.firestore.FieldValue => {
  return admin.firestore.FieldValue.increment(currentValue === undefined || currentValue <= 0 ? 0 : -1);
};


// --- Cloud Function Triggers ---

/**
 * Triggered when a student document is created, updated, or deleted.
 * Intelligently increments and decrements counters in the metrics document.
 */
export const onStudentChange = onDocumentWritten("students/{studentId}", async (event) => {
    const metricsRef = db.collection("metrics").doc("dashboard");

    await updateMetrics(metricsRef, (data) => {
      const before = event.data?.before.data();
      const after = event.data?.after.data();

      // --- Handle Deletes ---
      if (!after) {
        if (!before) return data; // Should not happen, but safeguard
        data.totalStudents = decrement(data.totalStudents);
        // Decrement all fields for the deleted student
        const destination = before.preferredStudyDestination || "N/A";
        data.studentsByDestination = { ...data.studentsByDestination, [destination]: decrement(data.studentsByDestination?.[destination]), };
        const visaStatus = before.visaStatus || "Not Applied";
        data.visaStatusCounts = { ...data.visaStatusCounts, [visaStatus]: decrement(data.visaStatusCounts?.[visaStatus]), };
        const counselor = before.assignedTo || "Unassigned";
        data.studentsByCounselor = { ...data.studentsByCounselor, [counselor]: decrement(data.studentsByCounselor?.[counselor]), };
        const feeStatus = before.serviceFeeStatus || "Unpaid";
        data.serviceFeeStatusCounts = { ...data.serviceFeeStatusCounts, [feeStatus]: decrement(data.serviceFeeStatusCounts?.[feeStatus]), };
        const education = before.lastCompletedEducation || "N/A";
        data.studentsByEducation = { ...data.studentsByEducation, [education]: decrement(data.studentsByEducation?.[education]), };
        const englishTest = before.englishProficiencyTest || "N/A";
        data.studentsByEnglishTest = { ...data.studentsByEnglishTest, [englishTest]: decrement(data.studentsByEnglishTest?.[englishTest]), };
        return data;
      }
      
      // --- Handle Creates ---
      if (!before) {
        data.totalStudents = increment(data.totalStudents);
        // Increment all fields for the new student
        const destination = after.preferredStudyDestination || "N/A";
        data.studentsByDestination = { ...data.studentsByDestination, [destination]: increment(data.studentsByDestination?.[destination]), };
        const visaStatus = after.visaStatus || "Not Applied";
        data.visaStatusCounts = { ...data.visaStatusCounts, [visaStatus]: increment(data.visaStatusCounts?.[visaStatus]), };
        const counselor = after.assignedTo || "Unassigned";
        data.studentsByCounselor = { ...data.studentsByCounselor, [counselor]: increment(data.studentsByCounselor?.[counselor]), };
        const feeStatus = after.serviceFeeStatus || "Unpaid";
        data.serviceFeeStatusCounts = { ...data.serviceFeeStatusCounts, [feeStatus]: increment(data.serviceFeeStatusCounts?.[feeStatus]), };
        const education = after.lastCompletedEducation || "N/A";
        data.studentsByEducation = { ...data.studentsByEducation, [education]: increment(data.studentsByEducation?.[education]), };
        const englishTest = after.englishProficiencyTest || "N/A";
        data.studentsByEnglishTest = { ...data.studentsByEnglishTest, [englishTest]: increment(data.studentsByEnglishTest?.[englishTest]), };
        
        // Monthly admissions tracking for new students
        const date = after.timestamp.toDate();
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        data.monthlyAdmissions = { ...data.monthlyAdmissions, [monthYear]: increment(data.monthlyAdmissions?.[monthYear]), };
        
        return data;
      }

      // --- Handle Updates ---
      const changedFields = (field: string) => before[field] !== after[field];
      
      if (changedFields('preferredStudyDestination')) {
          const oldVal = before.preferredStudyDestination || "N/A";
          const newVal = after.preferredStudyDestination || "N/A";
          data.studentsByDestination = { ...data.studentsByDestination, [oldVal]: decrement(data.studentsByDestination?.[oldVal]), [newVal]: increment(data.studentsByDestination?.[newVal]), };
      }
      if (changedFields('visaStatus')) {
          const oldVal = before.visaStatus || "Not Applied";
          const newVal = after.visaStatus || "Not Applied";
          data.visaStatusCounts = { ...data.visaStatusCounts, [oldVal]: decrement(data.visaStatusCounts?.[oldVal]), [newVal]: increment(data.visaStatusCounts?.[newVal]), };
      }
      if (changedFields('assignedTo')) {
          const oldVal = before.assignedTo || "Unassigned";
          const newVal = after.assignedTo || "Unassigned";
          data.studentsByCounselor = { ...data.studentsByCounselor, [oldVal]: decrement(data.studentsByCounselor?.[oldVal]), [newVal]: increment(data.studentsByCounselor?.[newVal]), };
      }
      if (changedFields('serviceFeeStatus')) {
          const oldVal = before.serviceFeeStatus || "Unpaid";
          const newVal = after.serviceFeeStatus || "Unpaid";
          data.serviceFeeStatusCounts = { ...data.serviceFeeStatusCounts, [oldVal]: decrement(data.serviceFeeStatusCounts?.[oldVal]), [newVal]: increment(data.serviceFeeStatusCounts?.[newVal]), };
      }
      if (changedFields('lastCompletedEducation')) {
          const oldVal = before.lastCompletedEducation || "N/A";
          const newVal = after.lastCompletedEducation || "N/A";
          data.studentsByEducation = { ...data.studentsByEducation, [oldVal]: decrement(data.studentsByEducation?.[oldVal]), [newVal]: increment(data.studentsByEducation?.[newVal]), };
      }
      if (changedFields('englishProficiencyTest')) {
          const oldVal = before.englishProficiencyTest || "N/A";
          const newVal = after.englishProficiencyTest || "N/A";
          data.studentsByEnglishTest = { ...data.studentsByEnglishTest, [oldVal]: decrement(data.studentsByEnglishTest?.[oldVal]), [newVal]: increment(data.studentsByEnglishTest?.[newVal]), };
      }
      return data;
    });
});
