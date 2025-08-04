
'use client';

import * as React from "react";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Student, allEducationLevels, englishTestOptions, studyDestinationOptions, counselorNames } from '@/lib/data';
import { collection, addDoc, updateDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const studentSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobileNumber: z.string().min(10, 'Mobile number must be at least 10 digits'),
  lastCompletedEducation: z.string().optional(),
  englishProficiencyTest: z.string().optional(),
  preferredStudyDestination: z.string().optional(),
  additionalNotes: z.string().max(500, "Notes are too long.").optional(),
  visaStatus: z.enum(['Pending', 'Approved', 'Rejected', 'Not Applied']),
  serviceFeeStatus: z.enum(['Paid', 'Unpaid', 'Partial']),
  assignedTo: z.string().min(2, 'Assigned to must be at least 2 characters'),
  // New fields
  emergencyContact: z.string().optional(),
  collegeUniversityName: z.string().optional(),
  serviceFeePaidDate: z.date().optional(),
  visaStatusUpdateDate: z.date().optional(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface StudentFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student | null; // Student data for editing
}

export function StudentForm({ isOpen, onOpenChange, student }: StudentFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: Partial<StudentFormValues> = {
    fullName: '',
    email: '',
    mobileNumber: '',
    lastCompletedEducation: '',
    englishProficiencyTest: '',
    preferredStudyDestination: '',
    additionalNotes: '',
    visaStatus: 'Not Applied',
    serviceFeeStatus: 'Unpaid',
    assignedTo: 'Unassigned',
    emergencyContact: '',
    collegeUniversityName: '',
  };

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues,
  });

  const serviceFeeStatus = form.watch('serviceFeeStatus');
  const visaStatus = form.watch('visaStatus');

  React.useEffect(() => {
    if (isOpen && student) {
      form.reset({
        ...defaultValues,
        ...student,
        serviceFeePaidDate: student.serviceFeePaidDate ? student.serviceFeePaidDate.toDate() : undefined,
        visaStatusUpdateDate: student.visaStatusUpdateDate ? student.visaStatusUpdateDate.toDate() : undefined,
      });
    } else if (isOpen) {
        form.reset(defaultValues);
    }
  }, [isOpen, student, form]);


  const onSubmit = async (data: StudentFormValues) => {
    setIsLoading(true);
    try {
      const submissionData = {
        ...data,
        lastCompletedEducation: data.lastCompletedEducation || '',
        englishProficiencyTest: data.englishProficiencyTest || '',
        preferredStudyDestination: data.preferredStudyDestination || '',
        additionalNotes: data.additionalNotes || '',
        emergencyContact: data.emergencyContact || '',
        collegeUniversityName: data.collegeUniversityName || '',
        serviceFeePaidDate: data.serviceFeePaidDate ? Timestamp.fromDate(data.serviceFeePaidDate) : null,
        visaStatusUpdateDate: data.visaStatusUpdateDate ? Timestamp.fromDate(data.visaStatusUpdateDate) : null,
      };

      if (student) {
        // Update existing student
        const studentRef = doc(db, 'students', student.id);
        await updateDoc(studentRef, submissionData);
        toast({ title: 'Student Updated', description: 'Student data has been successfully updated.' });
      } else {
        // Add new student
        await addDoc(collection(db, 'students'), {
          ...submissionData,
          timestamp: serverTimestamp(),
        });
        toast({ title: 'Student Added', description: 'New student has been successfully added.' });
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving student:', error);
      toast({
        title: 'Error',
        description: 'Failed to save student data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{student ? 'Edit Student' : 'Add New Student'}</DialogTitle>
              <DialogDescription>
                {student ? `Update details for ${student.fullName}.` : 'Fill in the details for a new student record.'}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <FormField control={form.control} name="fullName" render={({ field }) => ( <FormItem> <FormLabel>Full Name</FormLabel> <FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                 <FormField control={form.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>Email</FormLabel> <FormControl><Input type="email" placeholder="student@example.com" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="mobileNumber" render={({ field }) => ( <FormItem> <FormLabel>Mobile Number</FormLabel> <FormControl><Input placeholder="+977..." {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                <FormField control={form.control} name="emergencyContact" render={({ field }) => ( <FormItem> <FormLabel>Emergency Contact</FormLabel> <FormControl><Input placeholder="e.g., +977..." {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
              </div>
               <FormField control={form.control} name="collegeUniversityName" render={({ field }) => ( <FormItem> <FormLabel>College/University Name</FormLabel> <FormControl><Input placeholder="e.g., University of Sydney" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="lastCompletedEducation" render={({ field }) => ( <FormItem><FormLabel>Last Education</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select education level" /></SelectTrigger></FormControl><SelectContent>{allEducationLevels.map(level => (<SelectItem key={level.value} value={level.value}>{level.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem> )}/>
                <FormField control={form.control} name="englishProficiencyTest" render={({ field }) => ( <FormItem><FormLabel>English Test</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select test status" /></SelectTrigger></FormControl><SelectContent>{englishTestOptions.map(option => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem> )}/>
              </div>
              <FormField control={form.control} name="preferredStudyDestination" render={({ field }) => ( <FormItem><FormLabel>Preferred Destination</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger></FormControl><SelectContent>{studyDestinationOptions.map(option => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem> )}/>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                <FormField control={form.control} name="visaStatus" render={({ field }) => ( <FormItem><FormLabel>Visa Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Not Applied">Not Applied</SelectItem><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Approved">Approved</SelectItem><SelectItem value="Rejected">Rejected</SelectItem></SelectContent></Select><FormMessage /></FormItem> )}/>
                 {visaStatus && visaStatus !== 'Rejected' && (
                    <FormField control={form.control} name="visaStatusUpdateDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Visa Status Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)}/>
                 )}
              </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <FormField control={form.control} name="serviceFeeStatus" render={({ field }) => ( <FormItem><FormLabel>Service Fee</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Unpaid">Unpaid</SelectItem><SelectItem value="Partial">Partial</SelectItem><SelectItem value="Paid">Paid</SelectItem></SelectContent></Select><FormMessage /></FormItem> )}/>
                 {serviceFeeStatus === 'Paid' && (
                    <FormField control={form.control} name="serviceFeePaidDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Fee Paid Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)}/>
                 )}
               </div>
               
               <FormField control={form.control} name="assignedTo" render={({ field }) => ( <FormItem><FormLabel>Assigned To</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a counselor" /></SelectTrigger></FormControl><SelectContent>{counselorNames.map(name => (<SelectItem key={name} value={name}>{name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>

              <FormField control={form.control} name="additionalNotes" render={({ field }) => ( <FormItem><FormLabel>Additional Notes</FormLabel><FormControl><Textarea placeholder="Any other details or specific questions..." rows={3} {...field} /></FormControl><FormMessage /></FormItem> )}/>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {student ? 'Save Changes' : 'Add Student'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}