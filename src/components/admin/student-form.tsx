
'use client';

import * as React from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Student, allEducationLevels, englishTestOptions, studyDestinationOptions, counselorNames } from '@/lib/data';
import { collection, addDoc, updateDoc, doc, serverTimestamp, Timestamp, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { CalendarIcon, Loader2, BookUser, Mail, Phone, GraduationCap, Languages, Target, StickyNote, Users, CalendarDays, CircleDollarSign, Briefcase, ShieldQuestion, FilePenLine, Trash2, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";


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
  emergencyContact: z.string().optional(),
  collegeUniversityName: z.string().optional(),
  serviceFeePaidDate: z.date().optional().nullable(),
  visaStatusUpdateDate: z.date().optional().nullable(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface StudentFormProps {
  student?: Student | null;
  onFormClose: () => void;
  onFormSubmitSuccess: () => void;
}

const DetailItem = ({ icon: Icon, label, value, valueClassName }: { icon: React.ElementType, label: string, value: React.ReactNode, valueClassName?: string }) => (
  <div className="flex items-start space-x-3">
    <Icon className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
    <div className="flex-grow">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className={cn("text-md text-foreground", valueClassName)}>{value || 'N/A'}</div>
    </div>
  </div>
);

export function StudentForm({ student, onFormClose, onFormSubmitSuccess }: StudentFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const isNewStudent = !student?.id;

  const defaultValues: Partial<StudentFormValues> = {
    fullName: '', email: '', mobileNumber: '', lastCompletedEducation: '',
    englishProficiencyTest: '', preferredStudyDestination: '', additionalNotes: '',
    visaStatus: 'Not Applied', serviceFeeStatus: 'Unpaid', assignedTo: 'Unassigned',
    emergencyContact: '', collegeUniversityName: '', serviceFeePaidDate: null, visaStatusUpdateDate: null
  };

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues,
  });

  const serviceFeeStatus = form.watch('serviceFeeStatus');
  const visaStatus = form.watch('visaStatus');

  React.useEffect(() => {
    if (student) {
      form.reset({
        ...defaultValues,
        ...student,
        serviceFeePaidDate: student.serviceFeePaidDate ? student.serviceFeePaidDate.toDate() : null,
        visaStatusUpdateDate: student.visaStatusUpdateDate ? student.visaStatusUpdateDate.toDate() : null,
      });
      setIsEditing(isNewStudent); // Automatically enter edit mode for new students
    }
  }, [student, form, isNewStudent]);

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

      if (!isNewStudent) {
        const studentRef = doc(db, 'students', student.id);
        await updateDoc(studentRef, submissionData);
        toast({ title: 'Student Updated', description: 'Student data has been successfully updated.' });
      } else {
        await addDoc(collection(db, 'students'), { ...submissionData, timestamp: serverTimestamp() });
        toast({ title: 'Student Added', description: 'New student has been successfully added.' });
      }
      onFormSubmitSuccess();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving student:', error);
      toast({ title: 'Error', description: 'Failed to save student data.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!student || isNewStudent) return;
    setIsLoading(true);
    try {
      const studentRef = doc(db, 'students', student.id);
      await deleteDoc(studentRef);
      toast({ title: 'Student Deleted', description: `${student.fullName} has been removed.` });
      onFormSubmitSuccess();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete student.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
      setIsAlertOpen(false);
    }
  };
  
  const getVisaStatusBadgeVariant = (status?: Student['visaStatus']) => {
    switch (status) {
      case 'Approved': return 'default';
      case 'Pending': return 'secondary';
      case 'Rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getFeeStatusBadgeVariant = (status?: Student['serviceFeeStatus']) => {
    switch (status) {
        case 'Paid': return 'default';
        case 'Partial': return 'secondary';
        case 'Unpaid': return 'outline';
        default: return 'outline';
    }
  };

  const formContent = (
    <CardContent className="space-y-6 flex-grow overflow-y-auto p-4 sm:p-6 pr-2 sm:pr-4">
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <FormField control={form.control} name="fullName" render={({ field }) => ( <FormItem> <FormLabel>Full Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
           <FormField control={form.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>Email</FormLabel> <FormControl><Input type="email" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
       </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="mobileNumber" render={({ field }) => ( <FormItem> <FormLabel>Mobile Number</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
          <FormField control={form.control} name="emergencyContact" render={({ field }) => ( <FormItem> <FormLabel>Emergency Contact</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
       </div>
       <FormField control={form.control} name="collegeUniversityName" render={({ field }) => ( <FormItem> <FormLabel>College/University Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="lastCompletedEducation" render={({ field }) => ( <FormItem><FormLabel>Last Education</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger></FormControl><SelectContent>{allEducationLevels.map(l => (<SelectItem key={l.value} value={l.value}>{l.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem> )}/>
          <FormField control={form.control} name="englishProficiencyTest" render={({ field }) => ( <FormItem><FormLabel>English Test</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent>{englishTestOptions.map(o => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem> )}/>
       </div>
       <FormField control={form.control} name="preferredStudyDestination" render={({ field }) => ( <FormItem><FormLabel>Destination</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger></FormControl><SelectContent>{studyDestinationOptions.map(o => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem> )}/>
       
       <Separator />
       <h4 className="font-medium">Internal Records</h4>

       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="visaStatus" render={({ field }) => ( <FormItem><FormLabel>Visa Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent>{['Not Applied', 'Pending', 'Approved', 'Rejected'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )}/>
          {visaStatus && visaStatus !== 'Not Applied' && <FormField control={form.control} name="visaStatusUpdateDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Visa Status Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value || undefined} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)}/>}
       </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <FormField control={form.control} name="serviceFeeStatus" render={({ field }) => ( <FormItem><FormLabel>Service Fee</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent>{['Unpaid', 'Partial', 'Paid'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )}/>
           {serviceFeeStatus === 'Paid' && <FormField control={form.control} name="serviceFeePaidDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Fee Paid Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value || undefined} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)}/>}
       </div>
       <FormField control={form.control} name="assignedTo" render={({ field }) => ( <FormItem><FormLabel>Assigned To</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select counselor" /></SelectTrigger></FormControl><SelectContent>{counselorNames.map(name => (<SelectItem key={name} value={name}>{name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
       <FormField control={form.control} name="additionalNotes" render={({ field }) => ( <FormItem><FormLabel>Additional Notes</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem> )}/>
    </CardContent>
  );

  if (isEditing) {
     return (
        <Card className="h-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{isNewStudent ? 'Add New Student' : `Edit: ${student.fullName}`}</CardTitle>
                    <CardDescription>
                      {isNewStudent ? 'Fill in the details for a new student record.' : 'Update the details for this student.'}
                    </CardDescription>
                  </div>
                   <Button type="button" variant="ghost" size="icon" onClick={() => isNewStudent ? onFormClose() : setIsEditing(false)} disabled={isLoading}>
                      <X className="h-4 w-4" />
                   </Button>
                </div>
              </CardHeader>
              {formContent}
              <CardFooter className="flex justify-between mt-auto bg-background/95 sticky bottom-0 py-3">
                <Button type="button" variant="outline" onClick={() => isNewStudent ? onFormClose() : setIsEditing(false)} disabled={isLoading}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isNewStudent ? 'Add Student' : 'Save Changes'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      );
  }

  return (
    <Card className="h-full flex flex-col">
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="flex items-center"><BookUser className="mr-2 h-6 w-6 text-primary"/>{student?.fullName}</CardTitle>
                    <CardDescription>Student Details Overview</CardDescription>
                </div>
                 <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}><FilePenLine className="h-4 w-4" /><span className="sr-only">Edit</span></Button>
                    <Button variant="destructive" size="icon" onClick={() => setIsAlertOpen(true)}><Trash2 className="h-4 w-4" /><span className="sr-only">Delete</span></Button>
                    <Button variant="ghost" size="icon" onClick={onFormClose}><X className="h-4 w-4" /></Button>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6 flex-grow overflow-y-auto p-4 sm:p-6 pr-2 sm:pr-4">
             <div className="space-y-4">
                <h3 className="font-semibold text-lg text-primary">Personal & Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem icon={Mail} label="Email" value={student?.email} />
                  <DetailItem icon={Phone} label="Mobile Number" value={student?.mobileNumber} />
                  <DetailItem icon={Phone} label="Emergency Contact" value={student?.emergencyContact} />
                  <DetailItem icon={Briefcase} label="College/University" value={student?.collegeUniversityName} />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                 <h3 className="font-semibold text-lg text-primary">Academic & Study Preferences</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem icon={GraduationCap} label="Last Completed Education" value={student?.lastCompletedEducation} />
                    <DetailItem icon={Languages} label="English Proficiency Test" value={student?.englishProficiencyTest} />
                    <DetailItem icon={Target} label="Preferred Study Destination" value={student?.preferredStudyDestination} />
                 </div>
                 <DetailItem icon={StickyNote} label="Additional Notes" value={<p className="whitespace-pre-wrap">{student?.additionalNotes}</p>} />
              </div>
               <Separator />
               <div className="space-y-4">
                 <h3 className="font-semibold text-lg text-primary">Internal Records</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem icon={Users} label="Assigned To" value={student?.assignedTo} />
                    <DetailItem icon={ShieldQuestion} label="Visa Status" value={<Badge variant={getVisaStatusBadgeVariant(student?.visaStatus)}>{student?.visaStatus}</Badge>} />
                    {student?.visaStatusUpdateDate && <DetailItem icon={CalendarDays} label="Visa Status Date" value={format(student.visaStatusUpdateDate.toDate(), 'PPP')} />}
                    <DetailItem icon={CircleDollarSign} label="Service Fee Status" value={<Badge variant={getFeeStatusBadgeVariant(student?.serviceFeeStatus)}>{student?.serviceFeeStatus}</Badge>} />
                    {student?.serviceFeePaidDate && <DetailItem icon={CalendarDays} label="Fee Paid Date" value={format(student.serviceFeePaidDate.toDate(), 'PPP')} />}
                    <DetailItem icon={CalendarDays} label="Date Added" value={student?.timestamp ? format(student.timestamp.toDate(), 'PPP, p') : 'N/A'} />
                 </div>
              </div>
        </CardContent>
         <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the student record for {student?.fullName}.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className={cn(buttonVariants({ variant: "destructive" }))}>Continue</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </Card>
  );
}
