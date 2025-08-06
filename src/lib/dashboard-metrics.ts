
// src/lib/dashboard-metrics.ts
import { doc, runTransaction, collection, getDocs } from 'firebase/firestore';
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

    newMetrics.visaStatusCounts[visaStatus] = (newMetrics.visaStatusCounts[visaStatus] || 0) + 1;
    newMetrics.feeStatusCounts[feeStatus] = (newMetrics.feeStatusCounts[feeStatus] || 0) + 1;
    newMetrics.studentsByCounselor[assignedTo] = (newMetrics.studentsByCounselor[assignedTo] || 0) + 1;
    if (newMetrics.studentsByDestination.hasOwnProperty(destination)) {
        newMetrics.studentsByDestination[destination]++;
    }
  }

  const metricsRef = doc(db, 'metrics', 'dashboard');
  // This write is happening outside the original transaction of the caller, which is fine for a full recalculation.
  await runTransaction(db, async (transaction) => {
    transaction.set(metricsRef, newMetrics);
  });
  
  return newMetrics;
}


// Transactional update for a single student creation
export async function updateDashboardMetricsOnCreate(newData: Partial<Student>) {
  const metricsRef = doc(db, 'metrics', 'dashboard');
  try {
    const metricsDoc = await getDoc(metricsRef);

    if (!metricsDoc.exists()) {
      // If the doc doesn't exist, trigger a full recalculation.
      // This is now done outside the transaction to avoid issues.
      await recalculateAllMetrics();
      console.log("Metrics doc did not exist. Recalculated all metrics.");
      return;
    }

    // If it exists, run a normal transaction to update it.
    await runTransaction(db, async (transaction) => {
      const freshMetricsDoc = await transaction.get(metricsRef);
      if (!freshMetricsDoc.exists()) return; // Should not happen given the check above, but for safety.
      const newMetrics = freshMetricsDoc.data() as DashboardMetrics;

      // Increment total students
      newMetrics.totalStudents = (newMetrics.totalStudents || 0) + 1;

      // Update visa status counts
      const visaStatus = newData.visaStatus || 'Not Applied';
      newMetrics.visaStatusCounts[visaStatus] = (newMetrics.visaStatusCounts[visaStatus] || 0) + 1;

      // Update fee status counts
      const feeStatus = newData.serviceFeeStatus || 'Unpaid';
      newMetrics.feeStatusCounts[feeStatus] = (newMetrics.feeStatusCounts[feeStatus] || 0) + 1;

      // Update counselor counts
      const assignedTo = newData.assignedTo || 'Unassigned';
      newMetrics.studentsByCounselor[assignedTo] = (newMetrics.studentsByCounselor[assignedTo] || 0) + 1;

      // Update destination counts
      if (newData.preferredStudyDestination && newMetrics.studentsByDestination.hasOwnProperty(newData.preferredStudyDestination)) {
          newMetrics.studentsByDestination[newData.preferredStudyDestination]++;
      }
      
      transaction.set(metricsRef, newMetrics);
    });
  } catch (e) {
    console.error("Transaction failed: ", e);
  }
}

// Transactional update for a single student update
export async function updateDashboardMetricsOnUpdate(oldData: Student, newData: Partial<Student>) {
  const metricsRef = doc(db, 'metrics', 'dashboard');
  try {
     const metricsDoc = await getDoc(metricsRef);
      if (!metricsDoc.exists()) {
        await recalculateAllMetrics();
        console.log("Metrics doc did not exist during update. Recalculated all metrics.");
        return;
      }
    
    await runTransaction(db, async (transaction) => {
      const freshMetricsDoc = await transaction.get(metricsRef);
      if (!freshMetricsDoc.exists()) return;

      const newMetrics = freshMetricsDoc.data() as DashboardMetrics;

      // Update visa status if it changed
      if (oldData.visaStatus !== newData.visaStatus) {
        newMetrics.visaStatusCounts[oldData.visaStatus] = (newMetrics.visaStatusCounts[oldData.visaStatus] || 1) - 1;
        newMetrics.visaStatusCounts[newData.visaStatus!] = (newMetrics.visaStatusCounts[newData.visaStatus!] || 0) + 1;
      }

      // Update fee status if it changed
      if (oldData.serviceFeeStatus !== newData.serviceFeeStatus) {
        newMetrics.feeStatusCounts[oldData.serviceFeeStatus] = (newMetrics.feeStatusCounts[oldData.serviceFeeStatus] || 1) - 1;
        newMetrics.feeStatusCounts[newData.serviceFeeStatus!] = (newMetrics.feeStatusCounts[newData.serviceFeeStatus!] || 0) + 1;
      }
      
      // Update counselor assignment if it changed
      if (oldData.assignedTo !== newData.assignedTo) {
          newMetrics.studentsByCounselor[oldData.assignedTo] = (newMetrics.studentsByCounselor[oldData.assignedTo] || 1) - 1;
          newMetrics.studentsByCounselor[newData.assignedTo!] = (newMetrics.studentsByCounselor[newData.assignedTo!] || 0) + 1;
      }

      // Update destination if it changed
      if (oldData.preferredStudyDestination !== newData.preferredStudyDestination) {
          if (oldData.preferredStudyDestination && newMetrics.studentsByDestination.hasOwnProperty(oldData.preferredStudyDestination)) {
              newMetrics.studentsByDestination[oldData.preferredStudyDestination]--;
          }
           if (newData.preferredStudyDestination && newMetrics.studentsByDestination.hasOwnProperty(newData.preferredStudyDestination)) {
              newMetrics.studentsByDestination[newData.preferredStudyDestination]++;
          }
      }

      transaction.set(metricsRef, newMetrics);
    });
  } catch (e) {
    console.error("Transaction failed: ", e);
  }
}

// Transactional update for a single student deletion
export async function updateDashboardMetricsOnDelete(deletedData: Student) {
  const metricsRef = doc(db, 'metrics', 'dashboard');
  try {
    const metricsDoc = await getDoc(metricsRef);
    if (!metricsDoc.exists()) {
        await recalculateAllMetrics();
        return;
    }
    
    await runTransaction(db, async (transaction) => {
      const freshMetricsDoc = await transaction.get(metricsRef);
      if (!freshMetricsDoc.exists()) return;
      const newMetrics = freshMetricsDoc.data() as DashboardMetrics;
      
      // Decrement total students
      newMetrics.totalStudents = (newMetrics.totalStudents || 1) - 1;
      
      // Decrement counts
      newMetrics.visaStatusCounts[deletedData.visaStatus] = (newMetrics.visaStatusCounts[deletedData.visaStatus] || 1) - 1;
      newMetrics.feeStatusCounts[deletedData.serviceFeeStatus] = (newMetrics.feeStatusCounts[deletedData.serviceFeeStatus] || 1) - 1;
      newMetrics.studentsByCounselor[deletedData.assignedTo] = (newMetrics.studentsByCounselor[deletedData.assignedTo] || 1) - 1;
      if (deletedData.preferredStudyDestination && newMetrics.studentsByDestination.hasOwnProperty(deletedData.preferredStudyDestination)) {
          newMetrics.studentsByDestination[deletedData.preferredStudyDestination]--;
      }

      transaction.set(metricsRef, newMetrics);
    });
  } catch (e) {
    console.error("Transaction failed: ", e);
  }
}
