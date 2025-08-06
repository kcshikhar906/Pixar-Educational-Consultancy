
// src/lib/dashboard-metrics.ts
import { doc, runTransaction, collection, getDocs, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebase';
import { counselorNames, studyDestinationOptions } from './data';
import type { Student } from './data';

export interface DashboardMetrics {
  totalStudents: number;
  visaStatusCounts: Record<string, number>;
  feeStatusCounts: Record<string, number>;
  studentsByCounselor: Record<string, number>;
  studentsByDestination: Record<string, number>;
}

// This function is for a full recalculation.
export async function recalculateAllMetrics(): Promise<DashboardMetrics> {
  const studentsSnapshot = await getDocs(collection(db, 'students'));
  const allStudents = studentsSnapshot.docs.map(doc => doc.data() as Student);

  const newMetrics: DashboardMetrics = {
    totalStudents: allStudents.length,
    visaStatusCounts: { 'Not Applied': 0, 'Pending': 0, 'Approved': 0, 'Rejected': 0 },
    feeStatusCounts: { 'Unpaid': 0, 'Partial': 0, 'Paid': 0 },
    studentsByCounselor: {},
    studentsByDestination: {},
  };

  // Initialize all known counselors and destinations to 0
  counselorNames.forEach(name => newMetrics.studentsByCounselor[name] = 0);
  studyDestinationOptions.forEach(dest => newMetrics.studentsByDestination[dest.value] = 0);

  for (const student of allStudents) {
    const visaStatus = student.visaStatus || 'Not Applied';
    const feeStatus = student.serviceFeeStatus || 'Unpaid';
    const assignedTo = student.assignedTo || 'Unassigned';
    const destination = student.preferredStudyDestination || 'Unknown';

    if (newMetrics.visaStatusCounts.hasOwnProperty(visaStatus)) {
      newMetrics.visaStatusCounts[visaStatus]++;
    }
    if (newMetrics.feeStatusCounts.hasOwnProperty(feeStatus)) {
      newMetrics.feeStatusCounts[feeStatus]++;
    }
     if (newMetrics.studentsByCounselor.hasOwnProperty(assignedTo)) {
      newMetrics.studentsByCounselor[assignedTo]++;
    }
    if (newMetrics.studentsByDestination.hasOwnProperty(destination)) {
        newMetrics.studentsByDestination[destination]++;
    }
  }

  const metricsRef = doc(db, 'metrics', 'dashboard');
  await setDoc(metricsRef, newMetrics);
  
  return newMetrics;
}


async function ensureMetricsExist() {
  const metricsRef = doc(db, 'metrics', 'dashboard');
  const metricsSnap = await getDoc(metricsRef);
  if (!metricsSnap.exists()) {
    console.log("Metrics document not found. Triggering full recalculation...");
    await recalculateAllMetrics();
    console.log("Full recalculation complete.");
    return true; // Indicates that a recalculation was performed
  }
  return false; // Indicates that the doc already existed
}


// Transactional update for a single student creation
export async function updateDashboardMetricsOnCreate(newData: Partial<Student>) {
  // First, ensure the metrics document exists, creating it if necessary.
  const wasRecalculated = await ensureMetricsExist();
  // If a full recalculation was just done, it already includes the new student.
  // So we can stop here to avoid double-counting.
  if (wasRecalculated) return;

  const metricsRef = doc(db, 'metrics', 'dashboard');
  try {
     const updates: {[key: string]: any} = {
        totalStudents: increment(1)
     };

     const visaStatus = newData.visaStatus || 'Not Applied';
     updates[`visaStatusCounts.${visaStatus}`] = increment(1);

     const feeStatus = newData.serviceFeeStatus || 'Unpaid';
     updates[`feeStatusCounts.${feeStatus}`] = increment(1);

     const assignedTo = newData.assignedTo || 'Unassigned';
     updates[`studentsByCounselor.${assignedTo}`] = increment(1);
     
     if (newData.preferredStudyDestination) {
        updates[`studentsByDestination.${newData.preferredStudyDestination}`] = increment(1);
     }
     
     await updateDoc(metricsRef, updates);

  } catch (e) {
    console.error("Failed to update metrics on create: ", e);
  }
}

// Transactional update for a single student update
export async function updateDashboardMetricsOnUpdate(oldData: Student, newData: Partial<Student>) {
  const wasRecalculated = await ensureMetricsExist();
  if (wasRecalculated) return; // Full recalc already has the latest state

  const metricsRef = doc(db, 'metrics', 'dashboard');
  try {
     const updates: {[key: string]: any} = {};

      if (oldData.visaStatus !== newData.visaStatus) {
        updates[`visaStatusCounts.${oldData.visaStatus}`] = increment(-1);
        updates[`visaStatusCounts.${newData.visaStatus!}`] = increment(1);
      }

      if (oldData.serviceFeeStatus !== newData.serviceFeeStatus) {
        updates[`feeStatusCounts.${oldData.serviceFeeStatus}`] = increment(-1);
        updates[`feeStatusCounts.${newData.serviceFeeStatus!}`] = increment(1);
      }
      
      if (oldData.assignedTo !== newData.assignedTo) {
          updates[`studentsByCounselor.${oldData.assignedTo}`] = increment(-1);
          updates[`studentsByCounselor.${newData.assignedTo!}`] = increment(1);
      }

      if (oldData.preferredStudyDestination !== newData.preferredStudyDestination) {
          if (oldData.preferredStudyDestination) {
            updates[`studentsByDestination.${oldData.preferredStudyDestination}`] = increment(-1);
          }
           if (newData.preferredStudyDestination) {
             updates[`studentsByDestination.${newData.preferredStudyDestination}`] = increment(1);
          }
      }

      if (Object.keys(updates).length > 0) {
        await updateDoc(metricsRef, updates);
      }

  } catch (e) {
    console.error("Failed to update metrics on update: ", e);
  }
}

// Transactional update for a single student deletion
export async function updateDashboardMetricsOnDelete(deletedData: Student) {
  const wasRecalculated = await ensureMetricsExist();
  if (wasRecalculated) return; // Full recalc accounts for the deletion.

  const metricsRef = doc(db, 'metrics', 'dashboard');
  try {
    const updates: {[key: string]: any} = {
        totalStudents: increment(-1)
     };

     const visaStatus = deletedData.visaStatus || 'Not Applied';
     updates[`visaStatusCounts.${visaStatus}`] = increment(-1);

     const feeStatus = deletedData.serviceFeeStatus || 'Unpaid';
     updates[`feeStatusCounts.${feeStatus}`] = increment(-1);

     const assignedTo = deletedData.assignedTo || 'Unassigned';
     updates[`studentsByCounselor.${assignedTo}`] = increment(-1);
     
     if (deletedData.preferredStudyDestination) {
        updates[`studentsByDestination.${deletedData.preferredStudyDestination}`] = increment(-1);
     }
     
    await updateDoc(metricsRef, updates);

  } catch (e) {
    console.error("Failed to update metrics on delete: ", e);
  }
}
