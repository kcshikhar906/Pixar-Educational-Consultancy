
/**
 * @fileOverview Firebase Cloud Function to aggregate student data for a real-time analytics dashboard.
 *
 * This function listens for onCreate, onUpdate, and onDelete events in the 'students' Firestore collection.
 * It maintains a single aggregation document at 'metrics/dashboard' with various counts and breakdowns.
 * All writes are batched for efficiency.
 *
 * To deploy this function, you would typically use the Firebase CLI:
 * `firebase deploy --only functions:aggregateStudentMetrics`
 *
 * Ensure your Firebase project is correctly configured in your environment.
 */

import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();

// Function to safely handle increments on nested map fields
function updateNestedField(batch: FirebaseFirestore.WriteBatch, ref: FirebaseFirestore.DocumentReference, fieldName: string, key: string | undefined | null, value: number) {
  if (key && typeof key === 'string' && key.trim() !== '') {
    // Sanitize key to be Firestore field path compliant
    const sanitizedKey = key.replace(/[.`[\]*]/g, '_');
    batch.set(ref, { [fieldName]: { [sanitizedKey]: FieldValue.increment(value) } }, { merge: true });
  }
}

export const aggregateStudentMetrics = onDocumentWritten('students/{studentId}', async (event) => {
  const metricsRef = db.collection('metrics').doc('dashboard');
  const batch = db.batch();

  const dataAfter = event.data?.after.data();
  const dataBefore = event.data?.before.data();

  // Handle document creation
  if (!event.data?.before.exists && event.data?.after.exists) {
    batch.set(metricsRef, { totalStudents: FieldValue.increment(1) }, { merge: true });
    
    if (dataAfter?.visaStatus === 'Approved') {
      batch.set(metricsRef, { visaGranted: FieldValue.increment(1) }, { merge: true });
    } else if (['Pending', 'Rejected', 'Not Applied'].includes(dataAfter?.visaStatus)) {
      batch.set(metricsRef, { pendingVisa: FieldValue.increment(1) }, { merge: true });
    }
    
    if (dataAfter?.serviceFeeStatus === 'Paid') {
      batch.set(metricsRef, { serviceFeePaid: FieldValue.increment(1) }, { merge: true });
    }

    updateNestedField(batch, metricsRef, 'byDestination', dataAfter?.preferredStudyDestination, 1);
    updateNestedField(batch, metricsRef, 'byEducation', dataAfter?.lastCompletedEducation, 1);
    updateNestedField(batch, metricsRef, 'byCounselor', dataAfter?.assignedTo, 1);
    updateNestedField(batch, metricsRef, 'byEnglishTest', dataAfter?.englishProficiencyTest, 1);
  }

  // Handle document deletion
  else if (event.data?.before.exists && !event.data?.after.exists) {
    batch.set(metricsRef, { totalStudents: FieldValue.increment(-1) }, { merge: true });

    if (dataBefore?.visaStatus === 'Approved') {
      batch.set(metricsRef, { visaGranted: FieldValue.increment(-1) }, { merge: true });
    } else if (['Pending', 'Rejected', 'Not Applied'].includes(dataBefore?.visaStatus)) {
      batch.set(metricsRef, { pendingVisa: FieldValue.increment(-1) }, { merge: true });
    }

    if (dataBefore?.serviceFeeStatus === 'Paid') {
      batch.set(metricsRef, { serviceFeePaid: FieldValue.increment(-1) }, { merge: true });
    }

    updateNestedField(batch, metricsRef, 'byDestination', dataBefore?.preferredStudyDestination, -1);
    updateNestedField(batch, metricsRef, 'byEducation', dataBefore?.lastCompletedEducation, -1);
    updateNestedField(batch, metricsRef, 'byCounselor', dataBefore?.assignedTo, -1);
    updateNestedField(batch, metricsRef, 'byEnglishTest', dataBefore?.englishProficiencyTest, -1);
  }

  // Handle document updates
  else if (event.data?.before.exists && event.data?.after.exists) {
    // Visa Status Change
    if (dataBefore?.visaStatus !== dataAfter?.visaStatus) {
      // Decrement old status
      if (dataBefore?.visaStatus === 'Approved') {
        batch.set(metricsRef, { visaGranted: FieldValue.increment(-1) }, { merge: true });
      } else if (['Pending', 'Rejected', 'Not Applied'].includes(dataBefore?.visaStatus)) {
        batch.set(metricsRef, { pendingVisa: FieldValue.increment(-1) }, { merge: true });
      }
      // Increment new status
      if (dataAfter?.visaStatus === 'Approved') {
        batch.set(metricsRef, { visaGranted: FieldValue.increment(1) }, { merge: true });
      } else if (['Pending', 'Rejected', 'Not Applied'].includes(dataAfter?.visaStatus)) {
        batch.set(metricsRef, { pendingVisa: FieldValue.increment(1) }, { merge: true });
      }
    }

    // Service Fee Status Change
    if (dataBefore?.serviceFeeStatus !== dataAfter?.serviceFeeStatus) {
      if(dataBefore?.serviceFeeStatus === 'Paid') {
        batch.set(metricsRef, { serviceFeePaid: FieldValue.increment(-1) }, { merge: true });
      }
      if(dataAfter?.serviceFeeStatus === 'Paid') {
        batch.set(metricsRef, { serviceFeePaid: FieldValue.increment(1) }, { merge: true });
      }
    }
    
    // Categorical Field Changes
    const fieldsToCompare: (keyof typeof dataBefore)[] = ['preferredStudyDestination', 'lastCompletedEducation', 'assignedTo', 'englishProficiencyTest'];
    const fieldMap: Record<string, string> = {
        preferredStudyDestination: 'byDestination',
        lastCompletedEducation: 'byEducation',
        assignedTo: 'byCounselor',
        englishProficiencyTest: 'byEnglishTest'
    };

    for(const field of fieldsToCompare) {
        if(dataBefore?.[field] !== dataAfter?.[field]) {
            updateNestedField(batch, metricsRef, fieldMap[field], dataBefore?.[field], -1);
            updateNestedField(batch, metricsRef, fieldMap[field], dataAfter?.[field], 1);
        }
    }
  }

  return batch.commit().catch(err => {
    console.error('Error updating metrics:', err);
  });
});
