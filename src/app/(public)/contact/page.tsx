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
import { Mail, MapPin, Phone, Send, Loader2, BookUser, StickyNote, Target, Languages, GraduationCap, CalendarIcon as CalendarIconLucide, Users, BookCopy, NotebookPen, ExternalLink, MessageSquare, Building, Home, PhoneCall, CalendarPlus, CheckCircle2, ArrowRight, Download, Wifi, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { allEducationLevels, englishTestOptions, studyDestinationOptions, testPreparationOptions } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isValid } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { addStudent } from '@/app/actions';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

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
    if (data.additionalNotes) {
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
        mapLink: "https://maps.app.goo.gl/8JBZXd3SxGq3NjPn7",
    },
    {
        name: "Branch Office (Australia)",
        address: "Level 1/18 Montgomery St, Kogarah NSW 2217",
        email: "info@pixaredu.com.au",
        phone: "02 85939110 / 0425347175",
        mapLink: "https://maps.app.goo.gl/52hE2ptx3sw24irC9",
    },
];

interface SuccessViewState {
    title: string;
    description: string;
    type: 'visit' | 'phone' | 'office' | 'prep-class';
    date?: Date;
    data?: any;
}



export default function ContactPage() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [isGeneralSubmitting, setIsGeneralSubmitting] = useState(false);
    const [isPrepClassSubmitting, setIsPrepClassSubmitting] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [successView, setSuccessView] = useState<SuccessViewState | null>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const [titleSectionRef, isTitleSectionVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true });
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
            const result = await addStudent(values);
            if (result.success) {
                toast({ title: "Message Sent!", description: result.message, variant: "default" });

                // Determine Success View Type
                if (values.connectionType === 'office') {
                    setSuccessView({
                        title: "You're All Set!",
                        description: "Your details have been registered. Please take a seat, and one of our educational counsellors will call you shortly.",
                        type: 'office',
                        data: { name: values.name }
                    });
                } else if (values.connectionType === 'remote') {
                    if (values.followUpType === 'visit' && values.appointmentDate) {
                        setSuccessView({
                            title: "Visit Scheduled!",
                            description: `We've confirmed your appointment request for ${format(values.appointmentDate, 'PPPP')}.`,
                            type: 'visit',
                            date: values.appointmentDate,
                            data: { name: values.name }
                        });
                    } else if (values.followUpType === 'phone') {
                        setSuccessView({
                            title: "Request Received",
                            description: "Our team has been notified. We will call you at your provided number shortly to discuss your plans.",
                            type: 'phone',
                            data: { name: values.name, phone: values.phoneNumber }
                        });
                    }
                }
            } else {
                toast({ title: "Submission Error", description: result.message, variant: "destructive" });
            }
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
            if (result.success) {
                toast({ title: result.success ? "Booking Request Sent!" : "Submission Error", description: result.message, variant: result.success ? "default" : "destructive" });
                setSuccessView({
                    title: "Class Booking Request Sent",
                    description: "Thanks for choosing Pixar Edu! We've received your inquiry for preparation classes.",
                    type: 'prep-class',
                    date: values.preferredStartDate,
                    data: { test: values.preferredTest, name: values.name }
                });
            } else {
                toast({ title: "Error", description: result.message, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "An unexpected error occurred with your booking.", variant: "destructive" });
        } finally {
            setIsPrepClassSubmitting(false);
        }
    }

    const generateGoogleCalendarUrl = (date: Date, title: string, details: string) => {
        const location = "Pixar Educational Consultancy, New Baneshwor, Kathmandu, Nepal";

        // Format date YYYYMMDD and assuming 10 AM to 11 AM local time
        const dateStr = format(date, 'yyyyMMdd');
        const startTime = `${dateStr}T100000`;
        const endTime = `${dateStr}T110000`;

        const url = new URL('https://calendar.google.com/calendar/render');
        url.searchParams.append('action', 'TEMPLATE');
        url.searchParams.append('text', title);
        url.searchParams.append('dates', `${startTime}/${endTime}`);
        url.searchParams.append('details', details);
        url.searchParams.append('location', location);

        return url.toString();
    };


    return (
        <div className="space-y-16 md:space-y-24">
            <div ref={titleSectionRef} className={cn("transition-all duration-700 ease-out", isTitleSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
                <SectionTitle
                    title="Get in Touch"
                    subtitle="We're here to help! Reach out for face-to-face or online counselling to start your journey."
                />
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start max-w-6xl mx-auto">
                {/* Contact Information Column */}
                <div
                    ref={infoSectionRef}
                    className={cn(
                        "space-y-8 transition-all duration-700 ease-out",
                        isInfoSectionVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                    )}
                >
                    <Card className="bg-card/60 backdrop-blur-sm border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full rounded-2xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-6">
                            <CardTitle className="font-headline text-2xl text-primary flex items-center">
                                <MapPin className="mr-2 h-6 w-6 text-accent" /> Visit Our Office
                            </CardTitle>
                            <CardDescription>
                                We are conveniently located in the heart of Putalisadak.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            {officeLocations.map((office, index) => (
                                <div key={index}>
                                    <h3 className="font-semibold text-lg flex items-center text-foreground/90 mb-2">
                                        <Building className="h-5 w-5 mr-2 text-primary" /> {office.name}
                                    </h3>
                                    <p className="text-muted-foreground ml-7 leading-relaxed mb-3">
                                        {office.address}
                                    </p>
                                    <div className="space-y-3 ml-7">
                                        <div className="flex flex-col gap-2">
                                            <a href={`tel:${office.phone.split('/')[0].trim()}`} className="flex items-center text-muted-foreground hover:text-accent transition-colors group">
                                                <div className="p-1.5 bg-primary/5 rounded-full mr-3 group-hover:bg-primary/10 transition-colors">
                                                    <Phone className="h-4 w-4" />
                                                </div>
                                                {office.phone}
                                            </a>
                                            <a href={`mailto:${office.email}`} className="flex items-center text-muted-foreground hover:text-accent transition-colors group">
                                                <div className="p-1.5 bg-primary/5 rounded-full mr-3 group-hover:bg-primary/10 transition-colors">
                                                    <Mail className="h-4 w-4" />
                                                </div>
                                                {office.email}
                                            </a>
                                        </div>
                                        <div className="flex gap-3 mt-3">
                                            {office.whatsappLink && (
                                                <a href={office.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center bg-green-50 px-3 py-1.5 rounded-full transition-colors">
                                                    <MessageSquare className="h-4 w-4 mr-2" /> Chat on WhatsApp
                                                </a>
                                            )}
                                            {office.mapLink && (
                                                <a href={office.mapLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center bg-primary/5 px-3 py-1.5 rounded-full transition-colors">
                                                    <MapPin className="h-4 w-4 mr-2" /> View Location Map
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    {index < officeLocations.length - 1 && <Separator className="bg-primary/10 my-6" />}
                                </div>
                            ))}

                            <Separator className="bg-primary/10" />

                            <div>
                                <h3 className="font-semibold text-lg flex items-center text-foreground/90 mb-2">
                                    <Clock className="h-5 w-5 mr-2 text-primary" /> Office Hours
                                </h3>
                                <ul className="space-y-2 ml-7 text-muted-foreground text-sm">
                                    <li className="flex justify-between items-center bg-background/50 p-2 rounded-md"><span>Monday - Friday:</span> <span className="font-medium text-foreground">9:00 AM - 6:00 PM</span></li>
                                    <li className="flex justify-between items-center p-2"><span>Saturday:</span> <span className="font-medium text-foreground">10:00 AM - 3:00 PM</span></li>
                                    <li className="flex justify-between items-center p-2 text-destructive/80"><span>Sunday:</span> <span>Closed</span></li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Map Embed (Placeholder visual) */}
                    <div className="rounded-2xl overflow-hidden shadow-lg border border-white/20 h-64 relative group">
                        {/* Normally an iframe would go here */}
                        <div className="absolute inset-0 bg-secondary/30 flex items-center justify-center group-hover:bg-secondary/20 transition-all cursor-pointer">
                            <div className="text-center p-6 bg-background/80 backdrop-blur-sm rounded-xl shadow-lg">
                                <MapPin className="h-10 w-10 text-primary mx-auto mb-2 animate-bounce" />
                                <p className="font-medium text-primary">View on Google Maps</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form Column */}
                <div ref={formTabsRef} className={cn("transition-all duration-700 ease-out", isFormTabsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
                    <Tabs defaultValue={searchParams?.get('service') === 'test_prep' ? 'prep-class' : 'general'} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6 h-14 bg-secondary/30 p-1.5 rounded-full backdrop-blur-sm">
                            <TabsTrigger value="general" className="rounded-full text-base data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary transition-all">General Inquiry</TabsTrigger>
                            <TabsTrigger value="prep-class" className="rounded-full text-base data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary transition-all">Book Prep Class</TabsTrigger>
                        </TabsList>

                        <TabsContent value="general">
                            <Card className="shadow-2xl bg-card/60 backdrop-blur-xl border-white/20 rounded-2xl overflow-hidden">
                                <CardHeader className="text-center pb-2 bg-gradient-to-b from-primary/5 to-transparent">
                                    <CardTitle className="text-2xl font-headline text-primary">Get in Touch</CardTitle>
                                    <CardDescription className="text-base text-muted-foreground/80">
                                        We'd love to hear from you. Fill out the form below.
                                    </CardDescription>
                                </CardHeader>
                                <Form {...generalContactForm}>
                                    <form onSubmit={generalContactForm.handleSubmit(onGeneralContactSubmit)}>
                                        <CardContent className="p-6 md:p-8 space-y-5">
                                            {/* Connection Type Radio Card Selection */}
                                            <FormField
                                                control={generalContactForm.control}
                                                name="connectionType"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-3">
                                                        <FormLabel className="text-base font-semibold">How would you like to connect?</FormLabel>
                                                        <FormControl>
                                                            <RadioGroup
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}
                                                                className="grid grid-cols-2 gap-4"
                                                            >
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <RadioGroupItem value="office" className="peer sr-only" />
                                                                    </FormControl>
                                                                    <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all">
                                                                        <Building className="mb-2 h-6 w-6 text-muted-foreground peer-data-[state=checked]:text-primary" />
                                                                        <span className="font-medium">I am at the Office</span>
                                                                    </FormLabel>
                                                                </FormItem>
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <RadioGroupItem value="remote" className="peer sr-only" />
                                                                    </FormControl>
                                                                    <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all">
                                                                        <Wifi className="mb-2 h-6 w-6 text-muted-foreground peer-data-[state=checked]:text-primary" />
                                                                        <span className="font-medium">I am Online / Remote</span>
                                                                    </FormLabel>
                                                                </FormItem>
                                                            </RadioGroup>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Conditional Fields Animation */}
                                            {/* Conditional Fields Animation */}
                                            <AnimatePresence mode='wait'>
                                                {generalContactForm.watch('connectionType') === 'office' && (
                                                    // No additional fields for office visit as they are already there
                                                    null
                                                )}
                                                {generalContactForm.watch('connectionType') === 'remote' && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="overflow-hidden space-y-3 mb-4"
                                                    >
                                                        <FormField
                                                            control={generalContactForm.control}
                                                            name="followUpType"
                                                            render={({ field }) => (
                                                                <FormItem className="space-y-1">
                                                                    <FormLabel>How would you like to proceed?</FormLabel>
                                                                    <div className="flex gap-4">
                                                                        <Button
                                                                            type="button"
                                                                            variant={field.value === 'visit' ? 'default' : 'outline'}
                                                                            className={cn("flex-1", field.value === 'visit' ? 'bg-primary hover:bg-primary/90' : '')}
                                                                            onClick={() => field.onChange('visit')}
                                                                        >
                                                                            <CalendarPlus className="mr-2 h-4 w-4" /> Schedule Office Visit
                                                                        </Button>
                                                                        <Button
                                                                            type="button"
                                                                            variant={field.value === 'phone' ? 'default' : 'outline'}
                                                                            className={cn("flex-1", field.value === 'phone' ? 'bg-primary hover:bg-primary/90' : '')}
                                                                            onClick={() => field.onChange('phone')}
                                                                        >
                                                                            <PhoneCall className="mr-2 h-4 w-4" /> Request Phone Call
                                                                        </Button>
                                                                    </div>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <AnimatePresence>
                                                            {generalContactForm.watch('followUpType') === 'visit' && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: 'auto' }}
                                                                    exit={{ opacity: 0, height: 0 }}
                                                                    className="overflow-hidden mt-3"
                                                                >
                                                                    <FormField
                                                                        control={generalContactForm.control}
                                                                        name="appointmentDate"
                                                                        render={({ field }) => (
                                                                            <FormItem className="flex flex-col mb-4">
                                                                                <FormLabel>Preferred Visit Date</FormLabel>
                                                                                <Popover>
                                                                                    <PopoverTrigger asChild>
                                                                                        <FormControl>
                                                                                            <Button
                                                                                                variant={"outline"}
                                                                                                className={cn(
                                                                                                    "w-full pl-3 text-left font-normal h-11 bg-background/50 hover:bg-background/80 transition-colors border-input",
                                                                                                    !field.value && "text-muted-foreground"
                                                                                                )}
                                                                                            >
                                                                                                {field.value && isValid(field.value) ? (
                                                                                                    format(field.value, "PPP")
                                                                                                ) : (
                                                                                                    <span>Pick a date</span>
                                                                                                )}
                                                                                                <CalendarIconLucide className="ml-auto h-4 w-4 opacity-50" />
                                                                                            </Button>
                                                                                        </FormControl>
                                                                                    </PopoverTrigger>
                                                                                    <PopoverContent className="w-auto p-0" align="start">
                                                                                        <Calendar
                                                                                            mode="single"
                                                                                            selected={field.value || undefined}
                                                                                            onSelect={field.onChange}
                                                                                            disabled={(date) =>
                                                                                                date < new Date() || date < new Date("1900-01-01")
                                                                                            }
                                                                                            initialFocus
                                                                                        />
                                                                                    </PopoverContent>
                                                                                </Popover>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <div className="grid md:grid-cols-2 gap-5">
                                                <FormField
                                                    control={generalContactForm.control}
                                                    name="name"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Full Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="John Doe" {...field} className="h-11 bg-background/50 focus:bg-background transition-colors" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={generalContactForm.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Email Address</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="john@example.com" {...field} className="h-11 bg-background/50 focus:bg-background transition-colors" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-5">
                                                <FormField
                                                    control={generalContactForm.control}
                                                    name="phoneNumber"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Phone Number</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="+977 9800000000" {...field} className="h-11 bg-background/50 focus:bg-background transition-colors" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={generalContactForm.control}
                                                    name="preferredStudyDestination"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Preferred Destination</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="h-11 bg-background/50 focus:bg-background transition-colors">
                                                                        <SelectValue placeholder="Select country" />
                                                                    </SelectTrigger>
                                                                </FormControl>
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
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-5">
                                                <FormField
                                                    control={generalContactForm.control}
                                                    name="lastCompletedEducation"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Education Level</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="h-11 bg-background/50 focus:bg-background transition-colors">
                                                                        <SelectValue placeholder="Select level" />
                                                                    </SelectTrigger>
                                                                </FormControl>
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
                                                    control={generalContactForm.control}
                                                    name="englishProficiencyTest"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>English Test</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="h-11 bg-background/50 focus:bg-background transition-colors">
                                                                        <SelectValue placeholder="Select test" />
                                                                    </SelectTrigger>
                                                                </FormControl>
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
                                                control={generalContactForm.control}
                                                name="additionalNotes"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Additional Notes (Optional)</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="Tell us more about your study plans..." className="min-h-[100px] bg-background/50 focus:bg-background transition-colors resize-none" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                        <CardFooter className="pt-6 pb-8">
                                            <Button type="submit" disabled={isGeneralSubmitting} className="w-full h-12 text-lg font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                                {isGeneralSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                                                Submit for Counselling
                                            </Button>
                                        </CardFooter>
                                    </form>
                                </Form>
                            </Card>
                        </TabsContent>

                        {/* Preparation Class Booking Tab Content */}
                        <TabsContent value="prep-class">
                            <Card className="shadow-2xl bg-card/60 backdrop-blur-xl border-white/20 rounded-2xl overflow-hidden">
                                <CardHeader className="text-center pb-2 bg-gradient-to-b from-accent/5 to-transparent">
                                    <CardTitle className="text-2xl font-headline text-accent font-bold">Book Preparation Class</CardTitle>
                                    <CardDescription className="text-base text-muted-foreground/80">
                                        Secure your spot for IELTS, PTE, or TOEFL classes.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 md:p-8">
                                    <Form {...prepClassForm}>
                                        <form onSubmit={prepClassForm.handleSubmit(onPrepClassSubmit)} className="space-y-5">
                                            <FormField
                                                control={prepClassForm.control}
                                                name="preferredTest"
                                                render={({ field }) => (
                                                    <FormItem className="mb-6">
                                                        <FormLabel className="text-base font-semibold mb-3 block">Select Preparation Course</FormLabel>
                                                        <FormControl>
                                                            <RadioGroup
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}
                                                                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                                                            >
                                                                {testPreparationOptions.map((option) => (
                                                                    <FormItem key={option.value}>
                                                                        <FormControl>
                                                                            <RadioGroupItem value={option.value} className="peer sr-only" />
                                                                        </FormControl>
                                                                        <FormLabel className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/5 [&:has([data-state=checked])]:border-accent cursor-pointer transition-all h-24 text-center">
                                                                            <BookCopy className="mb-2 h-6 w-6 text-muted-foreground peer-data-[state=checked]:text-accent" />
                                                                            <span className="font-bold">{option.label}</span>
                                                                        </FormLabel>
                                                                    </FormItem>
                                                                ))}
                                                            </RadioGroup>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="grid md:grid-cols-2 gap-5">
                                                <FormField
                                                    control={prepClassForm.control}
                                                    name="name"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Full Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Jane Doe" {...field} className="h-11 bg-background/50 focus:bg-background transition-colors" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={prepClassForm.control}
                                                    name="phoneNumber"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Phone Number</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="+977 98XXXXXXXX" {...field} className="h-11 bg-background/50 focus:bg-background transition-colors" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-5">
                                                <FormField
                                                    control={prepClassForm.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Email Address</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="jane@example.com" {...field} className="h-11 bg-background/50 focus:bg-background transition-colors" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={prepClassForm.control}
                                                    name="preferredStartDate"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Preferred Start Date</FormLabel>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "w-full pl-3 text-left font-normal h-11 bg-background/50 hover:bg-background/80 transition-colors border-input",
                                                                                !field.value && "text-muted-foreground"
                                                                            )}
                                                                        >
                                                                            {field.value && isValid(field.value) ? (
                                                                                format(field.value, "PPP")
                                                                            ) : (
                                                                                <span>Pick a date</span>
                                                                            )}
                                                                            <CalendarIconLucide className="ml-auto h-4 w-4 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0" align="start">
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={field.value}
                                                                        onSelect={field.onChange}
                                                                        disabled={(date) =>
                                                                            date < new Date() || date < new Date("1900-01-01")
                                                                        }
                                                                        initialFocus
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <FormField
                                                control={prepClassForm.control}
                                                name="additionalNotes"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Specific Requirements / Questions</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="I'm aiming for a score of 8.0..." className="min-h-[100px] bg-background/50 focus:bg-background transition-colors resize-none" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button type="submit" className="w-full h-12 text-lg font-medium shadow-lg hover:shadow-xl transition-all bg-accent hover:bg-accent/90 text-accent-foreground" size="lg" disabled={isPrepClassSubmitting}>
                                                {isPrepClassSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <BookUser className="mr-2 h-5 w-5" />}
                                                Book Preparation Class
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}