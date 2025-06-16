
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
import { Mail, MapPin, Phone, Send, Loader2, BookUser, StickyNote, Target, Languages, GraduationCap, MessageSquare } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { allEducationLevels, englishTestOptions, studyDestinationOptions } from '@/lib/data';

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name is too long."),
  email: z.string().email("Invalid email address."),
  phoneNumber: z.string().min(7, "Phone number seems too short.").max(15, "Phone number seems too long.").regex(/^\+?[0-9\s-()]*$/, "Invalid phone number format."),
  lastCompletedEducation: z.string().min(1, "Please select your education level."),
  englishProficiencyTest: z.string().min(1, "Please select an option for English proficiency test."),
  preferredStudyDestination: z.string().min(1, "Please select your preferred study destination."),
  additionalNotes: z.string().max(500, "Additional notes are too long.").optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

// Entry IDs from your pre-filled link:
const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScmMqPLB4NX_BZSSS4C3_2_9wNga-GBmbznGc9nNCs231IeaA/formResponse';
const EMAIL_ENTRY_ID = 'entry.897898403';
const NAME_ENTRY_ID = 'entry.381136677';
const PHONE_NUMBER_ENTRY_ID = 'entry.1344864969';
const EDUCATION_ENTRY_ID = 'entry.2085503739';
const ENGLISH_TEST_ENTRY_ID = 'entry.1325410288';
const DESTINATION_ENTRY_ID = 'entry.22741016';
// **IMPORTANT**: You still need to get the Entry ID for your "Additional Notes" field from Google Form's pre-filled link if you have one.
const ADDITIONAL_NOTES_ENTRY_ID = 'REPLACE_WITH_ADDITIONAL_NOTES_FIELD_ENTRY_ID_IF_APPLICABLE';


async function submitToGoogleSheet(data: ContactFormValues): Promise<{ success: boolean; message: string }> {
  if (GOOGLE_FORM_ACTION_URL.startsWith('REPLACE_WITH_')) {
    console.error("Google Form URL is not configured. Please update it in src/app/contact/page.tsx");
    return { success: false, message: "Form submission is not configured correctly. Please contact support." };
  }

  const formData = new FormData();
  formData.append(NAME_ENTRY_ID, data.name);
  formData.append(EMAIL_ENTRY_ID, data.email);
  formData.append(PHONE_NUMBER_ENTRY_ID, data.phoneNumber);
  formData.append(EDUCATION_ENTRY_ID, data.lastCompletedEducation);
  formData.append(ENGLISH_TEST_ENTRY_ID, data.englishProficiencyTest);
  formData.append(DESTINATION_ENTRY_ID, data.preferredStudyDestination);
  
  if (data.additionalNotes && ADDITIONAL_NOTES_ENTRY_ID !== 'REPLACE_WITH_ADDITIONAL_NOTES_FIELD_ENTRY_ID_IF_APPLICABLE') {
    formData.append(ADDITIONAL_NOTES_ENTRY_ID, data.additionalNotes);
  } else if (data.additionalNotes) {
     console.warn("ADDITIONAL_NOTES_ENTRY_ID is not configured or is a placeholder. 'Additional Notes' field will not be submitted to Google Sheet unless the ID is correctly provided.");
  }

  try {
    await fetch(GOOGLE_FORM_ACTION_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors', 
    });
    // Note: 'no-cors' mode means we don't get a real success/failure response from Google.
    // We assume success if the fetch doesn't throw an error.
    return { success: true, message: "Your message has been sent successfully! We'll get back to you soon." };
  } catch (error) {
    console.error('Error submitting to Google Sheet:', error);
    // This catch block might not be very effective with 'no-cors' for typical Google Form errors.
    // The primary way to debug is to check the Google Sheet itself.
    return { success: false, message: 'An error occurred while sending your message. Please check your internet connection and try again. If the problem persists, ensure the form configuration is correct.' };
  }
}

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [titleSectionRef, isTitleSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [formCardRef, isFormCardVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
  const [infoSectionRef, isInfoSectionVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      lastCompletedEducation: '',
      englishProficiencyTest: '',
      preferredStudyDestination: '',
      additionalNotes: '',
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true);
    try {
      const result = await submitToGoogleSheet(values);

      if (result.success) {
        toast({
          title: "Message Sent!",
          description: result.message,
          variant: "default",
        });
        form.reset();
      } else {
        toast({
          title: "Submission Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in onSubmit:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-16 md:space-y-24">
      <div ref={titleSectionRef} className={cn("transition-all duration-700 ease-out", isTitleSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle
          title="Get in Touch"
          subtitle="We're here to help! Reach out to us with your questions or to start your educational journey."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Contact Form */}
        <div ref={formCardRef} className={cn("transition-all duration-700 ease-out", isFormCardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
          <Card className="shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="font-headline text-primary flex items-center"><Mail className="mr-2 h-6 w-6" /> Send Us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><BookUser className="mr-2 h-4 w-4 text-accent" />Full Name</FormLabel>
                          <FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4 text-accent" />Email Address</FormLabel>
                          <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                   <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><Phone className="mr-2 h-4 w-4 text-accent" />Phone Number</FormLabel>
                          <FormControl><Input type="tel" placeholder="+977 98XXXXXXXX" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="lastCompletedEducation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><GraduationCap className="mr-2 h-4 w-4 text-accent" />Last Completed Education</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select education level" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {allEducationLevels.map(level => (
                                <SelectItem key={level.value} value={level.value}>{level.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="englishProficiencyTest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><Languages className="mr-2 h-4 w-4 text-accent" />English Proficiency Test</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select test status" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {englishTestOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="preferredStudyDestination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><Target className="mr-2 h-4 w-4 text-accent" />Preferred Study Destination</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {studyDestinationOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><StickyNote className="mr-2 h-4 w-4 text-accent" />Additional Notes (Optional)</FormLabel>
                        <FormControl><Textarea placeholder="Any other details or specific questions..." rows={4} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Send Message
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>

        {/* Contact Information & Map */}
        <div ref={infoSectionRef} className={cn("space-y-8 transition-all duration-700 ease-out", isInfoSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{transitionDelay: '100ms'}}>
          <Card className="shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="font-headline text-primary">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Our Office</h4>
                  <p className="text-foreground/80">New Baneshwor, Kathmandu, Nepal, 44600</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Email Us</h4>
                  <a href="mailto:info@pixaredu.com" className="text-foreground/80 hover:text-primary transition-colors">info@pixaredu.com</a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Call Us</h4>
                  <a href="tel:+9779761859757" className="text-foreground/80 hover:text-primary transition-colors">+977 9761859757</a>
                </div>
              </div>
               <div className="flex items-start space-x-3">
                <MessageSquare className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Direct Chat</h4>
                  <a href="https://wa.me/+9779761859757" target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-primary transition-colors">Chat with us on WhatsApp</a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="font-headline text-primary">Find Us On Map</CardTitle>
            </CardHeader>
            <CardContent>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.165484604168!2d85.3327993749223!3d27.686924426392938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19a84379c423%3A0xef4effecef07815d!2sPIXAR%20EDUCATIONAL%20CONSULTANCY!5e1!3m2!1sen!2sau!4v1749691561992!5m2!1sen!2sau" width="100%" height="300" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

    