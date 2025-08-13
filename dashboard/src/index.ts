
/**
 * @fileOverview Cloud Functions for automatically aggregating student metrics.
 *
 * This set of functions listens for changes in the 'students' collection
 * and automatically updates a summary document in 'metrics/dashboard'.
 * This allows the admin dashboard to load instantly and stay in real-time
 * without needing to query the entire student collection.
 *
 * Functions:
 * - onStudentChange: Triggered when a student is created, updated, or deleted.
 */

import {onDocumentWritten} from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Helper to normalize strings to Title Case for consistency
const toTitleCase = (str: string) => {
  if (!str) return "N/A";
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};

const updateMetrics = (
  updateFn: (data: admin.firestore.DocumentData) => admin.firestore.DocumentData
) => {
  const metricsRef = db.collection("metrics").doc("dashboard");
  return db.runTransaction(async (transaction) => {
    const doc = await transaction.get(metricsRef);
    const data = doc.data() || {};
    const updatedData = updateFn(data);
    transaction.set(metricsRef, updatedData, {merge: true});
  });
};

const increment = (currentValue: number | undefined) => {
  return admin.firestore.FieldValue.increment(currentValue === undefined ? 1: 1);
};

const decrement = (currentValue: number | undefined) => {
  const value = currentValue === undefined || currentValue <= 0 ? 0 : -1;
  return admin.firestore.FieldValue.increment(value);
};


export const onStudentChange = onDocumentWritten("students/{studentId}",
  (event) => {
    return updateMetrics((data) => {
      const before = event.data?.before.data();
      const after = event.data?.after.data();

      // --- Handle Deletes ---
      if (!after) {
        if (!before) return data; // Should not happen
        const dest = toTitleCase(before.preferredStudyDestination);
        const visa = toTitleCase(before.visaStatus);
        const coun = toTitleCase(before.assignedTo);
        const fee = toTitleCase(before.serviceFeeStatus);
        const edu = toTitleCase(before.lastCompletedEducation);
        const test = toTitleCase(before.englishProficiencyTest);

        data.totalStudents = decrement(data.totalStudents);
        data.studentsByDestination = {
          ...data.studentsByDestination,
          [dest]: decrement(data.studentsByDestination?.[dest]),
        };
        data.visaStatusCounts = {
          ...data.visaStatusCounts,
          [visa]: decrement(data.visaStatusCounts?.[visa]),
        };
        data.studentsByCounselor = {
          ...data.studentsByCounselor,
          [coun]: decrement(data.studentsByCounselor?.[coun]),
        };
        data.serviceFeeStatusCounts = {
          ...data.serviceFeeStatusCounts,
          [fee]: decrement(data.serviceFeeStatusCounts?.[fee]),
        };
        data.studentsByEducation = {
          ...data.studentsByEducation,
          [edu]: decrement(data.studentsByEducation?.[edu]),
        };
        data.studentsByEnglishTest = {
          ...data.studentsByEnglishTest,
          [test]: decrement(data.studentsByEnglishTest?.[test]),
        };
        return data;
      }

      // --- Handle Creates ---
      if (!before) {
        const dest = toTitleCase(after.preferredStudyDestination);
        const visa = toTitleCase(after.visaStatus);
        const coun = toTitleCase(after.assignedTo);
        const fee = toTitleCase(after.serviceFeeStatus);
        const edu = toTitleCase(after.lastCompletedEducation);
        const test = toTitleCase(after.englishProficiencyTest);
        const date = after.timestamp.toDate();
        const monthYear =
          `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

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
        const oldVal = toTitleCase(before.assignedTo);
        const newVal = toTitleCase(after.assignedTo);
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
  });
