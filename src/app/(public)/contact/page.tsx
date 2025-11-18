
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SectionTitle from '@/components/ui/section-title';
import { Mail, MapPin, Phone, Send, Loader2, BookUser, StickyNote, Target, Languages, GraduationCap, CalendarIcon as CalendarIconLucide, Users, BookCopy, NotebookPen, ExternalLink, MessageSquare, Building, Home, PhoneCall, CalendarPlus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { allEducationLevels, englishTestOptions, studyDestinationOptions, testPreparationOptions } from '@/lib/data.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { addStudent } from '@/app/actions';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AnimatePresence, motion } from 'framer-motion';

// Schema for General Contact Form with conditional logic
const generalContactFormSchema = z.object({
  connectionType: z.enum(['office', 'remote'], {
    required_error: "Please select how you are connecting with us.",
  }),
  followUpType: z.enum(['visit', 'phone']).optional(),
  appointmentDate: z.date().optional().nullable(),
  name: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name is too long."),
  email: z.string().email("Invalid email address."),
  phoneNumber: z.string().min(7, "Phone number seems too short.").max(15, "Phone number seems too long.").regex(/^\+?[0-9\s-()]*$/, "Invalid phone number format."),
  lastCompletedEducation: z.string().min(1, "Please select your education level."),
  englishProficiencyTest: z.string().min(1, "Please select an option for English proficiency test."),
  preferredStudyDestination: z.string().min(1, "Please select your preferred study destination."),
  additionalNotes: z.string().max(500, "Additional notes are too long.").optional(),
}).refine(data => {
  if (data.connectionType === 'remote' && !data.followUpType) {
    return false;
  }
  return true;
}, {
  message: "Please select a follow-up option.",
  path: ["followUpType"],
}).refine(data => {
    if (data.followUpType === 'visit' && !data.appointmentDate) {
        return false;
    }
    return true;
}, {
    message: "Please select a preferred date for your office visit.",
    path: ["appointmentDate"],
});


type GeneralContactFormValues = z.infer<typeof generalContactFormSchema>;


// Schema for Preparation Class Booking Form
const preparationClassFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name is too long."),
  email: z.string().email("Invalid email address."),
  phoneNumber: z.string().min(7, "Phone number seems too short.").max(15, "Phone number is too long.").regex(/^\+?[0-9\s-()]*$/, "Invalid phone number format."),
  preferredTest: z.string().min(1, "Please select the test you want to prepare for."),
  preferredStartDate: z.date().optional(),
  additionalNotes: z.string().max(500, "Additional notes are too long.").optional(),
});
type PreparationClassFormValues = z.infer<typeof preparationClassFormSchema>;

// Constants for PREPARATION CLASS BOOKING FORM submission (to Google Sheet)
const PREP_CLASS_GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScOw8ztRBTL_iN0yRmszjlIUBPPDebd8fKIl4RcUZThZs9CSA/formResponse';
const PREP_CLASS_NAME_ENTRY_ID = 'entry.44402001';
const PREP_CLASS_EMAIL_ENTRY_ID = 'entry.1939269637';
const PREP_CLASS_PHONE_NUMBER_ENTRY_ID = 'entry.1784825660';
const PREP_CLASS_PREFERRED_TEST_ENTRY_ID = 'entry.418517897';
const PREP_CLASS_PREFERRED_START_DATE_ENTRY_ID = 'entry.894006407';
const PREP_CLASS_ADDITIONAL_NOTES_ENTRY_ID = 'entry.1135205593';


async function submitToPrepClassGoogleSheet(data: PreparationClassFormValues): Promise<{ success: boolean; message: string }> {
  if (PREP_CLASS_GOOGLE_FORM_ACTION_URL.startsWith('REPLACE_WITH_')) {
    console.error("Preparation Class Booking Google Form URL is not configured.");
    return { success: false, message: "Class booking service is temporarily unavailable. Please contact us directly." };
  }

  const formData = new FormData();
  formData.append(PREP_CLASS_NAME_ENTRY_ID, data.name);
  formData.append(PREP_CLASS_EMAIL_ENTRY_ID, data.email);
  formData.append(PREP_CLASS_PHONE_NUMBER_ENTRY_ID, data.phoneNumber);
  formData.append(PREP_CLASS_PREFERRED_TEST_ENTRY_ID, data.preferredTest);
  if (data.preferredStartDate) {
    formData.append(PREP_CLASS_PREFERRED_START_DATE_ENTRY_ID, format(data.preferredStartDate, "yyyy-MM-dd"));
  }
  if (data.additionalNotes && PREP_CLASS_ADDITIONAL_NOTES_ENTRY_ID !== 'REPLACE_WITH_YOUR_ADDITIONAL_NOTES_FIELD_ENTRY_ID_FOR_PREP') {
    formData.append(PREP_CLASS_ADDITIONAL_NOTES_ENTRY_ID, data.additionalNotes);
  }

  try {
    await fetch(PREP_CLASS_GOOGLE_FORM_ACTION_URL, { method: 'POST', body: formData, mode: 'no-cors' });
    return { success: true, message: "Your booking request has been sent! We'll contact you shortly to confirm." };
  } catch (error) {
    console.error('Error submitting to Prep Class Booking Google Sheet:', error);
    return { success: false, message: 'An error occurred with your booking request. Please try again or contact us directly.' };
  }
}

interface OfficeLocation {
  name: string;
  address: string;
  email: string;
  phone: string;
  whatsappLink?: string;
  mapEmbedUrl?: string;
  mapLink?: string;
}

const officeLocations: OfficeLocation[] = [
  {
    name: "Head Office (Kathmandu)",
    address: "New Baneshwor, Kathmandu, Nepal, 44600",
    email: "info@pixaredu.com",
    phone: "015907326 / 015907327",
    whatsappLink: "https://wa.me/+9779761859757",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.165484604168!2d85.3327993749223!3d27.686924426392938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19a84379c423%3A0xef4effecef07815d!2sPIXAR%20EDUCATIONAL%20CONSULTANCY!5e1!3m2!1sen!2sau!4v1749691561992!5m2!1sen!2sau",
  },
  {
    name: "Branch Office (Lalitpur)",
    address: "Kumaripati, Lalitpur 44600, Nepal",
    email: "study@pixaredu.com.au",
    phone: "015913809 / 9765833581",
    // whatsappLink: "https://wa.me/+9779765833581",
    mapLink: "https://maps.app.goo.gl/8JBZXd3SxGq3NjPn7",
  },
  {
    name: "Branch Office (Australia)",
    address: "Level 1/18 Montgomery St, Kogarah NSW 2217",
    email: "info@pixaredu.com.au",
    phone: "02 85939110 / 0425347175",
    // whatsappLink: "https://wa.me/+61425347175", 
    mapLink: "https://maps.app.goo.gl/52hE2ptx3sw24irC9",
  },
];


export default function ContactPage() {
  const { toast } = useToast();
  const [isGeneralSubmitting, setIsGeneralSubmitting] = useState(false);
  const [isPrepClassSubmitting, setIsPrepClassSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [titleSectionRef, isTitleSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [formTabsRef, isFormTabsVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
  const [infoSectionRef, isInfoSectionVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });

  const generalContactForm = useForm<GeneralContactFormValues>({
    resolver: zodResolver(generalContactFormSchema),
    defaultValues: {
      name: '', email: '', phoneNumber: '', lastCompletedEducation: '',
      englishProficiencyTest: '', preferredStudyDestination: '', additionalNotes: '',
      connectionType: undefined, followUpType: undefined, appointmentDate: null,
    },
  });

  const prepClassForm = useForm<PreparationClassFormValues>({
    resolver: zodResolver(preparationClassFormSchema),
    defaultValues: {
      name: '', email: '', phoneNumber: '', preferredTest: '',
      preferredStartDate: undefined, additionalNotes: '',
    },
  });

  const connectionType = generalContactForm.watch('connectionType');
  const followUpType = generalContactForm.watch('followUpType');

  async function onGeneralContactSubmit(values: GeneralContactFormValues) {
    setIsGeneralSubmitting(true);
    try {
      const result = await addStudent(values); // Using the server action
      toast({ title: result.success ? "Message Sent!" : "Submission Error", description: result.message, variant: result.success ? "default" : "destructive" });
      if (result.success) generalContactForm.reset();
    } catch (error) {
      console.error("Client-side error calling server action:", error);
      toast({ title: "Error", description: "An unexpected client-side error occurred.", variant: "destructive" });
    } finally {
      setIsGeneralSubmitting(false);
    }
  }

  async function onPrepClassSubmit(values: PreparationClassFormValues) {
    setIsPrepClassSubmitting(true);
    try {
      const result = await submitToPrepClassGoogleSheet(values);
      toast({ title: result.success ? "Booking Request Sent!" : "Submission Error", description: result.message, variant: result.success ? "default" : "destructive" });
      if (result.success) prepClassForm.reset();
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred with your booking.", variant: "destructive" });
    } finally {
      setIsPrepClassSubmitting(false);
    }
  }

  return (
    <div className="space-y-16 md:space-y-24">
      <div ref={titleSectionRef} className={cn("transition-all duration-700 ease-out", isTitleSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle
          title="Get in Touch"
          subtitle="We're here to help! Reach out for face-to-face or online counselling to start your journey."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div ref={formTabsRef} className={cn("transition-all duration-700 ease-out", isFormTabsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
          <Tabs defaultValue="counselling-form" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="counselling-form"><BookUser className="mr-2 h-4 w-4"/>Counselling Form</TabsTrigger>
              <TabsTrigger value="prep-class-booking"><BookCopy className="mr-2 h-4 w-4"/>Book Prep Class</TabsTrigger>
            </TabsList>
            
            {/* General Inquiry Tab Content */}
            <TabsContent value="counselling-form">
              <Card className="shadow-xl bg-card">
                <CardHeader>
                  <CardTitle className="font-headline text-primary flex items-center"><BookUser className="mr-2 h-6 w-6" /> Student Counselling Form</CardTitle>
                  <CardDescription>This is the first step to begin your study abroad journey. Fill this out to register with us for counselling.</CardDescription>
                </CardHeader>
                <Form {...generalContactForm}>
                  <form onSubmit={generalContactForm.handleSubmit(onGeneralContactSubmit)}>
                    <CardContent className="space-y-4">
                       <FormField
                          control={generalContactForm.control}
                          name="connectionType"
                          render={({ field }) => (
                            <FormItem className="space-y-3 p-4 bg-muted/50 rounded-lg">
                              <FormLabel className="text-base font-semibold text-primary">How are you connecting with us today?</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-2"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="office" /></FormControl>
                                    <FormLabel className="font-normal flex items-center gap-2"><Building className="h-4 w-4"/>I'm at the Pixar Edu Office</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="remote" /></FormControl>
                                    <FormLabel className="font-normal flex items-center gap-2"><Home className="h-4 w-4"/>From Home / Remotely</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <AnimatePresence>
                        {connectionType === 'remote' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4 p-4 border-l-4 border-accent bg-accent/10 rounded-r-lg overflow-hidden"
                            >
                                <FormField
                                    control={generalContactForm.control}
                                    name="followUpType"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="font-semibold">How would you like us to follow up?</FormLabel>
                                            <FormControl>
                                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-1">
                                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="visit" /></FormControl><FormLabel className="font-normal flex items-center gap-1"><CalendarPlus className="h-4 w-4"/>Schedule Office Visit</FormLabel></FormItem>
                                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="phone" /></FormControl><FormLabel className="font-normal flex items-center gap-1"><PhoneCall className="h-4 w-4"/>Request Phone Counselling</FormLabel></FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {followUpType === 'visit' && (
                                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                                         <FormField control={generalContactForm.control} name="appointmentDate" render={({ field }) => (
                                            <FormItem className="flex flex-col"><FormLabel>Preferred Visit Date</FormLabel>
                                                <Popover><PopoverTrigger asChild><FormControl>
                                                    <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                        <CalendarIconLucide className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl></PopoverTrigger>
                                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1 )) } initialFocus /></PopoverContent>
                                                </Popover><FormMessage />
                                            </FormItem>
                                         )}/>
                                     </motion.div>
                                )}
                            </motion.div>
                        )}
                        </AnimatePresence>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={generalContactForm.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel className="flex items-center"><BookUser className="mr-2 h-4 w-4 text-accent" />Full Name</FormLabel><FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={generalContactForm.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4 text-accent" />Email Address</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                      </div>
                      <FormField control={generalContactForm.control} name="phoneNumber" render={({ field }) => (
                          <FormItem><FormLabel className="flex items-center"><Phone className="mr-2 h-4 w-4 text-accent" />Phone Number</FormLabel><FormControl><Input type="tel" placeholder="+977 98XXXXXXXX" {...field} /></FormControl><FormMessage /></FormItem>
                      )}/>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={generalContactForm.control} name="lastCompletedEducation" render={({ field }) => (
                            <FormItem><FormLabel className="flex items-center"><GraduationCap className="mr-2 h-4 w-4 text-accent" />Last Completed Education</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select education level" /></SelectTrigger></FormControl><SelectContent>{allEducationLevels.map(level => (<SelectItem key={level.value} value={level.value}>{level.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                        )}/>
                        <FormField control={generalContactForm.control} name="englishProficiencyTest" render={({ field }) => (
                            <FormItem><FormLabel className="flex items-center"><Languages className="mr-2 h-4 w-4 text-accent" />English Proficiency Test</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select test status" /></SelectTrigger></FormControl><SelectContent>{englishTestOptions.map(option => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                        )}/>
                      </div>
                      <FormField control={generalContactForm.control} name="preferredStudyDestination" render={({ field }) => (
                          <FormItem><FormLabel className="flex items-center"><Target className="mr-2 h-4 w-4 text-accent" />Preferred Study Destination</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger></FormControl><SelectContent>{studyDestinationOptions.map(option => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                      )}/>
                      <FormField control={generalContactForm.control} name="additionalNotes" render={({ field }) => (
                          <FormItem><FormLabel className="flex items-center"><StickyNote className="mr-2 h-4 w-4 text-accent" />Additional Notes (Optional)</FormLabel><FormControl><Textarea placeholder="Any other details or specific questions..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                      )}/>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isGeneralSubmitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        {isGeneralSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Submit for Counselling
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>

            {/* Preparation Class Booking Tab Content */}
            <TabsContent value="prep-class-booking">
              <Card className="shadow-xl bg-card">
                <CardHeader>
                  <CardTitle className="font-headline text-primary flex items-center"><BookCopy className="mr-2 h-6 w-6" />Book a Preparation Class</CardTitle>
                  <CardDescription>Interested in our English test preparation classes? Fill this form.</CardDescription>
                </CardHeader>
                <Form {...prepClassForm}>
                  <form onSubmit={prepClassForm.handleSubmit(onPrepClassSubmit)}>
                    <CardContent className="space-y-4">
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <FormField control={prepClassForm.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel className="flex items-center"><BookUser className="mr-2 h-4 w-4 text-accent" />Full Name</FormLabel><FormControl><Input placeholder="e.g., Alex Rider" {...field} /></FormControl><FormMessage /></FormItem>
                          )}/>
                          <FormField control={prepClassForm.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4 text-accent" />Email Address</FormLabel><FormControl><Input type="email" placeholder="alex@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                          )}/>
                       </div>
                        <FormField control={prepClassForm.control} name="phoneNumber" render={({ field }) => (
                          <FormItem><FormLabel className="flex items-center"><Phone className="mr-2 h-4 w-4 text-accent" />Phone Number</FormLabel><FormControl><Input type="tel" placeholder="+977 98XXXXXXXX" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={prepClassForm.control} name="preferredTest" render={({ field }) => (
                          <FormItem><FormLabel className="flex items-center"><NotebookPen className="mr-2 h-4 w-4 text-accent" />Preferred Test for Preparation</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a test" /></SelectTrigger></FormControl><SelectContent>{testPreparationOptions.map(option => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                        )}/>
                        <FormField control={prepClassForm.control} name="preferredStartDate" render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="flex items-center"><CalendarIconLucide className="mr-2 h-4 w-4 text-accent" />Preferred Start Date (Optional)</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIconLucide className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                {isClient && (
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1 )) } initialFocus />
                                )}
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}/>
                        <FormField control={prepClassForm.control} name="additionalNotes" render={({ field }) => (
                          <FormItem><FormLabel className="flex items-center"><StickyNote className="mr-2 h-4 w-4 text-accent" />Additional Notes (Optional)</FormLabel><FormControl><Textarea placeholder="Any specific requirements or questions about the class..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isPrepClassSubmitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        {isPrepClassSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
                        Request Class Booking
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Contact Information & Map Section */}
        <div ref={infoSectionRef} className={cn("space-y-8 transition-all duration-700 ease-out", isInfoSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{transitionDelay: '100ms'}}>
          <Card className="shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="font-headline text-primary">Our Offices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {officeLocations.map((office, index) => (
                <div key={office.name}>
                  <h3 className="text-lg font-semibold text-accent mb-2">{office.name}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-foreground/80">{office.address}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <a href={`mailto:${office.email}`} className="text-foreground/80 hover:text-accent transition-colors">{office.email}</a>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        {office.phone.includes(' / ') ? (
                          office.phone.split(' / ').map((num, i, arr) => (
                            <span key={i}>
                              <a href={`tel:${num.replace(/[^0-9+]/g, '')}`} className="text-foreground/80 hover:text-accent transition-colors">
                                {num.trim()}
                              </a>
                              {i < arr.length - 1 && <span className="text-foreground/80"> / </span>}
                            </span>
                          ))
                        ) : (
                          <a href={`tel:${office.phone.replace(/[^0-9+]/g, '')}`} className="text-foreground/80 hover:text-accent transition-colors">
                            {office.phone}
                          </a>
                        )}
                      </div>
                    </div>
                    {office.whatsappLink && (
                      <div className="flex items-start space-x-3">
                        <MessageSquare className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <a href={office.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-accent transition-colors">Chat on WhatsApp</a>
                      </div>
                    )}
                    {office.mapLink && !office.mapEmbedUrl && (
                       <div className="flex items-start space-x-3">
                        <ExternalLink className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <a href={office.mapLink} target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-accent transition-colors">View on Map</a>
                      </div>
                    )}
                  </div>
                  {index < officeLocations.length - 1 && <Separator className="my-6" />}
                </div>
              ))}
              
              {/* Main Map Embed (e.g., Head Office) */}
              {officeLocations.find(loc => loc.mapEmbedUrl) && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-lg font-semibold text-primary mb-3">Find Our Head Office</h3>
                  <iframe 
                    src={officeLocations.find(loc => loc.mapEmbedUrl)!.mapEmbedUrl} 
                    width="100%" 
                    height="300" 
                    style={{border:0}} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
