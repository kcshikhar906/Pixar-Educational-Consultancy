
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase-admin'; // Using admin SDK for backend operations
import { FieldValue } from 'firebase-admin/firestore';
import { format } from 'date-fns';

// Zod schema for server-side validation, now including optional fields
const studentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name is too long."),
  email: z.string().email("Invalid email address."),
  phoneNumber: z.string().min(7, "Phone number seems too short.").max(15, "Phone number is too long.").regex(/^\+?[0-9\s-()]*$/, "Invalid phone number format."),
  lastCompletedEducation: z.string().min(1, "Please select your education level."),
  englishProficiencyTest: z.string().min(1, "Please select an option for English proficiency test."),
  preferredStudyDestination: z.string().min(1, "Please select your preferred study destination."),
  additionalNotes: z.string().max(500, "Additional notes are too long.").optional(),
  // New optional fields from the form
  connectionType: z.enum(['office', 'remote']).optional(),
  followUpType: z.enum(['visit', 'phone']).optional(),
  appointmentDate: z.date().optional().nullable(),
});

type GeneralContactFormValues = z.infer<typeof studentSchema>;

export async function addStudent(data: GeneralContactFormValues) {
  try {
    // Validate the data on the server
    const validatedData = studentSchema.safeParse(data);

    if (!validatedData.success) {
      console.error('Server-side validation failed:', validatedData.error.flatten().fieldErrors);
      return { success: false, message: 'Invalid data provided. Please check your entries.' };
    }

    // --- Build the additional notes string based on new fields ---
    let notes = validatedData.data.additionalNotes || '';
    if (validatedData.data.connectionType === 'remote') {
      let followUpNote = 'Remote Inquiry: ';
      if (validatedData.data.followUpType === 'visit' && validatedData.data.appointmentDate) {
        followUpNote += `Scheduled for an office visit on ${format(validatedData.data.appointmentDate, 'PPP')}.`;
      } else if (validatedData.data.followUpType === 'phone') {
        followUpNote += 'Requested phone counselling.';
      }
      notes = notes ? `${followUpNote}\n\nStudent's original notes: ${notes}` : followUpNote;
    }
    // --- End of notes building ---

    const studentData = {
      fullName: validatedData.data.name,
      email: validatedData.data.email,
      mobileNumber: validatedData.data.phoneNumber,
      lastCompletedEducation: validatedData.data.lastCompletedEducation,
      englishProficiencyTest: validatedData.data.englishProficiencyTest,
      preferredStudyDestination: validatedData.data.preferredStudyDestination,
      additionalNotes: notes, // Use the new combined notes
      searchableName: validatedData.data.name.toLowerCase(),
      visaStatus: 'Not Applied' as const,
      serviceFeeStatus: 'Unpaid' as const,
      assignedTo: 'Unassigned',
      timestamp: FieldValue.serverTimestamp(),
      serviceFeePaidDate: null,
      visaStatusUpdateDate: null,
      emergencyContact: '',
      collegeUniversityName: '',
      // Store the new structured data
      appointmentDate: validatedData.data.appointmentDate ? validatedData.data.appointmentDate : null,
      inquiryType: validatedData.data.connectionType === 'remote' ? validatedData.data.followUpType : 'office_walk_in',
    };
    
    // Using the Admin SDK to write to Firestore
    await db.collection('students').add(studentData);
    
    return { success: true, message: "Your message has been sent successfully! We'll get back to you soon." };
  } catch (error) {
    console.error('Error writing to Firestore with Admin SDK:', error);
    // Return a generic error message to the user
    return { success: false, message: 'An error occurred while sending your message. Please try again or contact us directly.' };
  }
}
