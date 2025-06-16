
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import SectionTitle from '@/components/ui/section-title';
import { Mail, MapPin, Phone, MessageSquare, Send, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name is too long."),
  email: z.string().email("Invalid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters.").max(100, "Subject is too long."),
  message: z.string().min(10, "Message must be at least 10 characters.").max(500, "Message is too long."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

// IMPORTANT: Replace these placeholders with your actual Google Form Action URL and Entry IDs
const GOOGLE_FORM_ACTION_URL = 'REPLACE_WITH_YOUR_GOOGLE_FORM_ACTION_URL'; // e.g., https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse
const NAME_ENTRY_ID = 'REPLACE_WITH_NAME_FIELD_ENTRY_ID'; // e.g., entry.123456789
const EMAIL_ENTRY_ID = 'REPLACE_WITH_EMAIL_FIELD_ENTRY_ID'; // e.g., entry.987654321
const SUBJECT_ENTRY_ID = 'REPLACE_WITH_SUBJECT_FIELD_ENTRY_ID'; // e.g., entry.112233445
const MESSAGE_ENTRY_ID = 'REPLACE_WITH_MESSAGE_FIELD_ENTRY_ID'; // e.g., entry.556677889

async function submitToGoogleSheet(data: ContactFormValues): Promise<{ success: boolean; message: string }> {
  if (GOOGLE_FORM_ACTION_URL === 'REPLACE_WITH_YOUR_GOOGLE_FORM_ACTION_URL' || !NAME_ENTRY_ID.startsWith('entry.')) {
    console.error("Google Form URL or Entry IDs are not configured. Please update them in src/app/contact/page.tsx");
    return { success: false, message: "Form submission is not configured correctly. Please contact support." };
  }

  const formData = new FormData();
  formData.append(NAME_ENTRY_ID, data.name);
  formData.append(EMAIL_ENTRY_ID, data.email);
  formData.append(SUBJECT_ENTRY_ID, data.subject);
  formData.append(MESSAGE_ENTRY_ID, data.message);

  try {
    await fetch(GOOGLE_FORM_ACTION_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors', // Important for submitting to Google Forms to prevent CORS errors
    });
    // 'no-cors' mode means we don't get a real response, so we assume success if no error is thrown
    return { success: true, message: "Your message has been sent successfully! We'll get back to you soon." };
  } catch (error) {
    console.error('Error submitting to Google Sheet:', error);
    return { success: false, message: 'An error occurred while sending your message. Please try again.' };
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
      subject: '',
      message: '',
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
          title: "Error",
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

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div ref={formCardRef} className={cn("transition-all duration-700 ease-out", isFormCardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
          <Card className="shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="font-headline text-primary flex items-center"><Mail className="mr-2 h-6 w-6" /> Send Us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl><Input placeholder="Inquiry about services" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Message</FormLabel>
                        <FormControl><Textarea placeholder="Tell us more about your needs..." rows={5} {...field} /></FormControl>
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
              {/* Placeholder for Google Map */}
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.165484604168!2d85.3327993749223!3d27.686924426392938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19a84379c423%3A0xef4effecef07815d!2sPIXAR%20EDUCATIONAL%20CONSULTANCY!5e1!3m2!1sen!2sau!4v1749691561992!5m2!1sen!2sau" width="100%" height="300" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
