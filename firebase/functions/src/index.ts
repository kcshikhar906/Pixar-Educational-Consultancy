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

import * as functions from "firebase-functions";
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
 * Triggered when a new student document is created.
 * Increments all relevant counters in the metrics document.
 */
export const onStudentCreate = functions.firestore
  .document("students/{studentId}")
  .onCreate(async (snap) => {
    const student = snap.data();
    const metricsRef = db.collection("metrics").doc("dashboard");

    await updateMetrics(metricsRef, (data) => {
      data.totalStudents = increment(data.totalStudents);
      
      const destination = student.preferredStudyDestination || "N/A";
      data.studentsByDestination = {
        ...data.studentsByDestination,
        [destination]: increment(data.studentsByDestination?.[destination]),
      };

      const visaStatus = student.visaStatus || "Not Applied";
      data.visaStatusCounts = {
        ...data.visaStatusCounts,
        [visaStatus]: increment(data.visaStatusCounts?.[visaStatus]),
      };

      const counselor = student.assignedTo || "Unassigned";
      data.studentsByCounselor = {
        ...data.studentsByCounselor,
        [counselor]: increment(data.studentsByCounselor?.[counselor]),
      };

      const feeStatus = student.serviceFeeStatus || "Unpaid";
      data.serviceFeeStatusCounts = {
        ...data.serviceFeeStatusCounts,
        [feeStatus]: increment(data.serviceFeeStatusCounts?.[feeStatus]),
      };
      
      const education = student.lastCompletedEducation || "N/A";
      data.studentsByEducation = {
        ...data.studentsByEducation,
        [education]: increment(data.studentsByEducation?.[education]),
      };
      
      const englishTest = student.englishProficiencyTest || "N/A";
      data.studentsByEnglishTest = {
        ...data.studentsByEnglishTest,
        [englishTest]: increment(data.studentsByEnglishTest?.[englishTest]),
      };
      
      // Monthly admissions tracking
      const date = student.timestamp.toDate();
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      data.monthlyAdmissions = {
          ...data.monthlyAdmissions,
          [monthYear]: increment(data.monthlyAdmissions?.[monthYear]),
      };
      
      return data;
    });
  });

/**
 * Triggered when a student document is deleted.
 * Decrements all relevant counters in the metrics document.
 */
export const onStudentDelete = functions.firestore
  .document("students/{studentId}")
  .onDelete(async (snap) => {
    const student = snap.data();
    const metricsRef = db.collection("metrics").doc("dashboard");

    await updateMetrics(metricsRef, (data) => {
      data.totalStudents = decrement(data.totalStudents);
      
      const destination = student.preferredStudyDestination || "N/A";
      data.studentsByDestination = {
        ...data.studentsByDestination,
        [destination]: decrement(data.studentsByDestination?.[destination]),
      };

      const visaStatus = student.visaStatus || "Not Applied";
      data.visaStatusCounts = {
        ...data.visaStatusCounts,
        [visaStatus]: decrement(data.visaStatusCounts?.[visaStatus]),
      };

      const counselor = student.assignedTo || "Unassigned";
      data.studentsByCounselor = {
        ...data.studentsByCounselor,
        [counselor]: decrement(data.studentsByCounselor?.[counselor]),
      };

      const feeStatus = student.serviceFeeStatus || "Unpaid";
      data.serviceFeeStatusCounts = {
        ...data.serviceFeeStatusCounts,
        [feeStatus]: decrement(data.serviceFeeStatusCounts?.[feeStatus]),
      };
      
      const education = student.lastCompletedEducation || "N/A";
      data.studentsByEducation = {
        ...data.studentsByEducation,
        [education]: decrement(data.studentsByEducation?.[education]),
      };
      
      const englishTest = student.englishProficiencyTest || "N/A";
      data.studentsByEnglishTest = {
        ...data.studentsByEnglishTest,
        [englishTest]: decrement(data.studentsByEnglishTest?.[englishTest]),
      };
      
      // We generally do not decrement monthly admissions on deletion
      // as it represents a historical record. This can be changed if needed.

      return data;
    });
  });

/**
 * Triggered when a student document is updated.
 * Intelligently increments and decrements counters for fields that changed.
 */
export const onStudentUpdate = functions.firestore
  .document("students/{studentId}")
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();
    const metricsRef = db.collection("metrics").doc("dashboard");

    await updateMetrics(metricsRef, (data) => {
      // Check for changes in visa status
      if (before.visaStatus !== after.visaStatus) {
        const oldStatus = before.visaStatus || "Not Applied";
        const newStatus = after.visaStatus || "Not Applied";
        data.visaStatusCounts = {
          ...data.visaStatusCounts,
          [oldStatus]: decrement(data.visaStatusCounts?.[oldStatus]),
          [newStatus]: increment(data.visaStatusCounts?.[newStatus]),
        };
      }
      
      // Check for changes in assigned counselor
      if (before.assignedTo !== after.assignedTo) {
          const oldCounselor = before.assignedTo || "Unassigned";
          const newCounselor = after.assignedTo || "Unassigned";
          data.studentsByCounselor = {
              ...data.studentsByCounselor,
              [oldCounselor]: decrement(data.studentsByCounselor?.[oldCounselor]),
              [newCounselor]: increment(data.studentsByCounselor?.[newCounselor]),
          };
      }
      
      // Check for other fields like destination, education, etc. and update if needed
      // This pattern can be extended for all tracked fields.
      if (before.preferredStudyDestination !== after.preferredStudyDestination) {
        const oldDest = before.preferredStudyDestination || "N/A";
        const newDest = after.preferredStudyDestination || "N/A";
        data.studentsByDestination = {
          ...data.studentsByDestination,
          [oldDest]: decrement(data.studentsByDestination?.[oldDest]),
          [newDest]: increment(data.studentsByDestination?.[newDest]),
        };
      }

      // Add more checks for other fields as necessary...
      // Example for service fee status:
      if (before.serviceFeeStatus !== after.serviceFeeStatus) {
        const oldFeeStatus = before.serviceFeeStatus || "Unpaid";
        const newFeeStatus = after.serviceFeeStatus || "Unpaid";
        data.serviceFeeStatusCounts = {
          ...data.serviceFeeStatusCounts,
          [oldFeeStatus]: decrement(data.serviceFeeStatusCounts?.[oldFeeStatus]),
          [newFeeStatus]: increment(data.serviceFeeStatusCounts?.[newFeeStatus]),
        };
      }
      
      return data;
    });
  });
