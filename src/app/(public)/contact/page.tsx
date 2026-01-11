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
import { Mail, MapPin, Phone, Send, Loader2, BookUser, StickyNote, Target, Languages, GraduationCap, CalendarIcon as CalendarIconLucide, Users, BookCopy, NotebookPen, ExternalLink, MessageSquare, Building, Home, PhoneCall, CalendarPlus, CheckCircle2, ArrowRight, Download, Wifi } from 'lucide-react';
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

interface SuccessViewState {
    title: string;
    description: string;
    type: 'visit' | 'phone' | 'office' | 'prep-class';
    date?: Date;
    data?: any;
}

export default function ContactPage() {
    const { toast } = useToast();
    const [isGeneralSubmitting, setIsGeneralSubmitting] = useState(false);
    const [isPrepClassSubmitting, setIsPrepClassSubmitting] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [successView, setSuccessView] = useState<SuccessViewState | null>(null);

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

            <div className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={formTabsRef} className={cn("transition-all duration-700 ease-out", isFormTabsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
                    {successView ? (
                        // Unified Success View
                        <Card className="shadow-2xl border-t-4 border-t-green-500 bg-card/50 backdrop-blur-sm h-full flex flex-col justify-center items-center p-8 text-center animate-in fade-in zoom-in duration-500 min-h-[500px]">
                            <CardHeader className="space-y-4">
                                <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner">
                                    <CheckCircle2 className="h-10 w-10" />
                                </div>
                                <CardTitle className="text-3xl font-bold text-green-700">{successView.title}</CardTitle>
                                <CardDescription className="text-lg text-foreground/80 max-w-md mx-auto">
                                    {successView.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 w-full max-w-sm">

                                {/* 1. Office Visit Success Actions */}
                                {successView.type === 'office' && (
                                    <div className="p-4 bg-muted/50 rounded-lg border border-border text-left space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Wifi className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="font-semibold text-sm">Free Guest Wi-Fi</p>
                                                <p className="text-xs text-muted-foreground">Network: Pixar_Guest / Pass: Study@Pixar</p>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center gap-3">
                                            <Building className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="font-semibold text-sm">Waiting Area</p>
                                                <p className="text-xs text-muted-foreground">Please wait in the lobby. Tea/Coffee is available.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 2. Remote Visit Success Actions */}
                                {successView.type === 'visit' && successView.date && (
                                    <>
                                        <div className="p-4 bg-muted/50 rounded-lg border border-border text-left space-y-2">
                                            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Before you visit</p>
                                            <ul className="text-sm space-y-1 list-disc list-inside text-foreground/90">
                                                <li>Bring your academic transcripts</li>
                                                <li>Bring a valid ID document</li>
                                                <li>Write down any specific questions</li>
                                            </ul>
                                        </div>
                                        <Button
                                            className="w-full h-12 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                                            onClick={() => {
                                                const details = `Student Counselling Session with Pixar Educational Consultancy.\n\nName: ${successView.data.name}\n\nKey Contacts:\nPhone: 015907326\nEmail: info@pixaredu.com\n\nLocation:\nPixar Educational Consultancy (Head Office)\nNew Baneshwor, Kathmandu`;
                                                window.open(generateGoogleCalendarUrl(successView.date!, "Pixar Edu Counselling Session", details), '_blank');
                                            }}
                                        >
                                            <CalendarPlus className="mr-2 h-5 w-5" />
                                            Add to Google Calendar
                                        </Button>
                                    </>
                                )}

                                {/* 3. Phone Success Actions */}
                                {successView.type === 'phone' && (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-muted/50 rounded-lg border border-border text-center">
                                            <p className="text-sm font-medium">Want a quicker response?</p>
                                            <p className="text-sm text-muted-foreground">You can chat with us directly on WhatsApp while you wait.</p>
                                        </div>
                                        <Button
                                            className="w-full h-12 text-base font-medium bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
                                            onClick={() => window.open("https://wa.me/+9779761859757", '_blank')}
                                        >
                                            <MessageSquare className="mr-2 h-5 w-5" />
                                            Open WhatsApp Chat
                                        </Button>
                                    </div>
                                )}

                                {/* 4. Prep Class Success Actions */}
                                {successView.type === 'prep-class' && (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-muted/50 rounded-lg border border-border text-left space-y-2">
                                            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Next Steps</p>
                                            <ul className="text-sm space-y-1 list-disc list-inside text-foreground/90">
                                                <li>We will confirm your seat availability shortly.</li>
                                                <li>You can take a free mock test at our office.</li>
                                            </ul>
                                        </div>
                                        {successView.date && (
                                            <Button
                                                className="w-full h-11 text-base font-medium border-primary text-primary hover:bg-primary/5"
                                                variant="outline"
                                                onClick={() => {
                                                    const details = `English Test Preparation Class (${successView.data.test}) at Pixar Edu.\n\nStart Date: ${format(successView.date!, 'PPP')}\n\nLocation:\nPixar Educational Consultancy\nNew Baneshwor, Kathmandu`;
                                                    window.open(generateGoogleCalendarUrl(successView.date!, `${successView.data.test} Class Start - Pixar Edu`, details), '_blank');
                                                }}
                                            >
                                                <CalendarPlus className="mr-2 h-4 w-4" />
                                                Save Start Date
                                            </Button>
                                        )}
                                        <Button
                                            className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                                            onClick={() => window.open("/courses", "_self")} // Placeholder link
                                        >
                                            <BookCopy className="mr-2 h-5 w-5" />
                                            Explore Course Modules
                                        </Button>
                                    </div>
                                )}

                            </CardContent>
                            <CardFooter>
                                <Button variant="ghost" onClick={() => { setSuccessView(null); generalContactForm.reset(); prepClassForm.reset(); }} className="text-muted-foreground hover:text-foreground">
                                    <ArrowRight className="mr-2 h-4 w-4" /> Submit another response
                                </Button>
                            </CardFooter>
                        </Card>
                    ) : (
                        // Standard Tabs View
                        <Tabs defaultValue="counselling-form" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-muted/50 p-1 rounded-xl">
                                <TabsTrigger value="counselling-form" className="rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"><BookUser className="mr-2 h-4 w-4" />Counselling Form</TabsTrigger>
                                <TabsTrigger value="prep-class-booking" className="rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"><BookCopy className="mr-2 h-4 w-4" />Book Prep Class</TabsTrigger>
                            </TabsList>

                            {/* General Inquiry Tab Content */}
                            <TabsContent value="counselling-form">
                                <Card className="shadow-2xl border-t-4 border-t-primary bg-card/50 backdrop-blur-sm">
                                    <CardHeader className="pb-8 text-center bg-muted/20 text-card-foreground">
                                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                            <BookUser className="h-6 w-6 text-primary" />
                                        </div>
                                        <CardTitle className="font-headline text-2xl text-primary">Student Counselling Form</CardTitle>
                                        <CardDescription className="text-base max-w-md mx-auto">This is the first step to begin your study abroad journey. Fill this out to register with us for counselling.</CardDescription>
                                    </CardHeader>
                                    <Form {...generalContactForm}>
                                        <form onSubmit={generalContactForm.handleSubmit(onGeneralContactSubmit)}>
                                            <CardContent className="space-y-6 pt-6 text-card-foreground">
                                                <FormField
                                                    control={generalContactForm.control}
                                                    name="connectionType"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-3">
                                                            <FormLabel className="text-base font-semibold text-primary/90">How are you connecting with us today?</FormLabel>
                                                            <FormControl>
                                                                <RadioGroup
                                                                    onValueChange={field.onChange}
                                                                    defaultValue={field.value}
                                                                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                                                >
                                                                    <FormItem className="space-y-0">
                                                                        <FormControl>
                                                                            <RadioGroupItem value="office" className="peer sr-only" />
                                                                        </FormControl>
                                                                        <FormLabel className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all">
                                                                            <Building className="mb-2 h-6 w-6 text-foreground/70 peer-data-[state=checked]:text-primary" />
                                                                            <span className="font-semibold text-sm">At Pixar Edu Office</span>
                                                                        </FormLabel>
                                                                    </FormItem>
                                                                    <FormItem className="space-y-0">
                                                                        <FormControl>
                                                                            <RadioGroupItem value="remote" className="peer sr-only" />
                                                                        </FormControl>
                                                                        <FormLabel className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all">
                                                                            <Home className="mb-2 h-6 w-6 text-foreground/70 peer-data-[state=checked]:text-primary" />
                                                                            <span className="font-semibold text-sm">From Home / Remote</span>
                                                                        </FormLabel>
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
                                                            className="space-y-4 pt-2"
                                                        >
                                                            <FormField
                                                                control={generalContactForm.control}
                                                                name="followUpType"
                                                                render={({ field }) => (
                                                                    <FormItem className="space-y-3 p-5 rounded-xl border border-primary/20 bg-primary/5">
                                                                        <FormLabel className="text-base font-semibold text-primary/90">How would you like us to follow up?</FormLabel>
                                                                        <FormControl>
                                                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                                <FormItem className="space-y-0">
                                                                                    <FormControl><RadioGroupItem value="visit" className="peer sr-only" /></FormControl>
                                                                                    <FormLabel className="flex items-center gap-3 rounded-lg border border-transparent bg-background/50 p-3 hover:bg-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-background peer-data-[state=checked]:shadow-sm cursor-pointer transition-all">
                                                                                        <div className="p-2 rounded-full bg-primary/10 text-primary"><CalendarPlus className="h-4 w-4" /></div>
                                                                                        <span className="font-medium">Schedule Visit</span>
                                                                                    </FormLabel>
                                                                                </FormItem>
                                                                                <FormItem className="space-y-0">
                                                                                    <FormControl><RadioGroupItem value="phone" className="peer sr-only" /></FormControl>
                                                                                    <FormLabel className="flex items-center gap-3 rounded-lg border border-transparent bg-background/50 p-3 hover:bg-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-background peer-data-[state=checked]:shadow-sm cursor-pointer transition-all">
                                                                                        <div className="p-2 rounded-full bg-primary/10 text-primary"><PhoneCall className="h-4 w-4" /></div>
                                                                                        <span className="font-medium">Phone Call</span>
                                                                                    </FormLabel>
                                                                                </FormItem>
                                                                            </RadioGroup>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            {followUpType === 'visit' && (
                                                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                                                    <FormField control={generalContactForm.control} name="appointmentDate" render={({ field }) => (
                                                                        <FormItem className="flex flex-col"><FormLabel>Preferred Visit Date</FormLabel>
                                                                            <Popover><PopoverTrigger asChild><FormControl>
                                                                                <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal h-12", !field.value && "text-muted-foreground")}>
                                                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                                    <CalendarIconLucide className="ml-auto h-5 w-5 opacity-50" />
                                                                                </Button>
                                                                            </FormControl></PopoverTrigger>
                                                                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))} initialFocus /></PopoverContent>
                                                                            </Popover><FormMessage />
                                                                        </FormItem>
                                                                    )} />
                                                                </motion.div>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                        <FormField control={generalContactForm.control} name="name" render={({ field }) => (
                                                            <FormItem><FormLabel className="flex items-center text-foreground/80">Full Name</FormLabel><FormControl><Input className="h-12 bg-muted/20" placeholder="e.g., Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
                                                        )} />
                                                        <FormField control={generalContactForm.control} name="email" render={({ field }) => (
                                                            <FormItem><FormLabel className="flex items-center text-foreground/80">Email Address</FormLabel><FormControl><Input className="h-12 bg-muted/20" type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                                                        )} />
                                                    </div>
                                                    <FormField control={generalContactForm.control} name="phoneNumber" render={({ field }) => (
                                                        <FormItem><FormLabel className="flex items-center text-foreground/80">Phone Number</FormLabel><FormControl><Input className="h-12 bg-muted/20" type="tel" placeholder="+977 98XXXXXXXX" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                        <FormField control={generalContactForm.control} name="lastCompletedEducation" render={({ field }) => (
                                                            <FormItem><FormLabel className="flex items-center text-foreground/80">Recently Completed Education</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-12 bg-muted/20"><SelectValue placeholder="Select level" /></SelectTrigger></FormControl><SelectContent>{allEducationLevels.map(level => (<SelectItem key={level.value} value={level.value}>{level.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                                                        )} />
                                                        <FormField control={generalContactForm.control} name="englishProficiencyTest" render={({ field }) => (
                                                            <FormItem><FormLabel className="flex items-center text-foreground/80">English Proficiency Test</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-12 bg-muted/20"><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent>{englishTestOptions.map(option => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                                                        )} />
                                                    </div>
                                                    <FormField control={generalContactForm.control} name="preferredStudyDestination" render={({ field }) => (
                                                        <FormItem><FormLabel className="flex items-center text-foreground/80">Preferred Study Destination</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-12 bg-muted/20"><SelectValue placeholder="Select destination" /></SelectTrigger></FormControl><SelectContent>{studyDestinationOptions.map(option => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={generalContactForm.control} name="additionalNotes" render={({ field }) => (
                                                        <FormItem><FormLabel className="flex items-center text-foreground/80">Additional Notes (Optional)</FormLabel><FormControl><Textarea className="bg-muted/20 min-h-[100px]" placeholder="Any other details or specific questions..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                </div>
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
                            <TabsContent value="prep-class-booking">
                                <Card className="shadow-2xl border-t-4 border-t-accent bg-card/50 backdrop-blur-sm">
                                    <CardHeader className="pb-8 text-center bg-muted/20 text-card-foreground">
                                        <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                                            <BookCopy className="h-6 w-6 text-accent" />
                                        </div>
                                        <CardTitle className="font-headline text-2xl text-accent-foreground">Book a Preparation Class</CardTitle>
                                        <CardDescription className="text-base max-w-md mx-auto">Interested in our English test preparation classes? Fill this form.</CardDescription>
                                    </CardHeader>
                                    <Form {...prepClassForm}>
                                        <form onSubmit={prepClassForm.handleSubmit(onPrepClassSubmit)}>
                                            <CardContent className="space-y-5 pt-6 text-card-foreground">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                    <FormField control={prepClassForm.control} name="name" render={({ field }) => (
                                                        <FormItem><FormLabel className="flex items-center text-foreground/80">Full Name</FormLabel><FormControl><Input className="h-12 bg-muted/20" placeholder="e.g., Alex Rider" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={prepClassForm.control} name="email" render={({ field }) => (
                                                        <FormItem><FormLabel className="flex items-center text-foreground/80">Email Address</FormLabel><FormControl><Input className="h-12 bg-muted/20" type="email" placeholder="alex@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                </div>
                                                <FormField control={prepClassForm.control} name="phoneNumber" render={({ field }) => (
                                                    <FormItem><FormLabel className="flex items-center text-foreground/80">Phone Number</FormLabel><FormControl><Input className="h-12 bg-muted/20" type="tel" placeholder="+977 98XXXXXXXX" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                    <FormField control={prepClassForm.control} name="preferredTest" render={({ field }) => (
                                                        <FormItem><FormLabel className="flex items-center text-foreground/80">Preferred Test</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-12 bg-muted/20"><SelectValue placeholder="Select a test" /></SelectTrigger></FormControl><SelectContent>{testPreparationOptions.map(option => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={prepClassForm.control} name="preferredStartDate" render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel className="flex items-center text-foreground/80">Preferred Start Date (Optional)</FormLabel>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal h-12 bg-muted/20 border-input", !field.value && "text-muted-foreground")}>
                                                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                            <CalendarIconLucide className="ml-auto h-5 w-5 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0" align="start">
                                                                    {isClient && (
                                                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))} initialFocus />
                                                                    )}
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )} />
                                                </div>
                                                <FormField control={prepClassForm.control} name="additionalNotes" render={({ field }) => (
                                                    <FormItem><FormLabel className="flex items-center text-foreground/80">Additional Notes (Optional)</FormLabel><FormControl><Textarea className="bg-muted/20 min-h-[100px]" placeholder="Any specific requirements or questions about the class..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                            </CardContent>
                                            <CardFooter className="pt-6 pb-8">
                                                <Button type="submit" disabled={isPrepClassSubmitting} className="w-full h-12 text-lg font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all bg-accent hover:bg-accent/90 text-accent-foreground">
                                                    {isPrepClassSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Users className="mr-2 h-5 w-5" />}
                                                    Request Class Booking
                                                </Button>
                                            </CardFooter>
                                        </form>
                                    </Form>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    )}
                </div>

                {/* Contact Information & Map Section */}
                <div ref={infoSectionRef} className={cn("space-y-8 transition-all duration-700 ease-out", isInfoSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{ transitionDelay: '100ms' }}>
                    <Card className="shadow-xl bg-card border-l-4 border-l-primary/50">
                        <CardHeader>
                            <CardTitle className="font-headline text-primary text-xl">Our Contact Offices</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {officeLocations.map((office, index) => (
                                <div key={office.name} className="relative pl-4 border-l-2 border-muted hover:border-accent transition-colors">
                                    <h3 className="text-lg font-bold text-foreground mb-3">{office.name}</h3>
                                    <div className="space-y-3 text-sm text-muted-foreground">
                                        <div className="flex items-start space-x-3 group">
                                            <div className="mt-0.5 p-1.5 bg-primary/10 rounded-md text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"><MapPin className="h-4 w-4" /></div>
                                            <p className="leading-tight">{office.address}</p>
                                        </div>
                                        <div className="flex items-start space-x-3 group">
                                            <div className="mt-0.5 p-1.5 bg-primary/10 rounded-md text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"><Mail className="h-4 w-4" /></div>
                                            <a href={`mailto:${office.email}`} className="hover:text-accent transition-colors leading-tight">{office.email}</a>
                                        </div>
                                        <div className="flex items-start space-x-3 group">
                                            <div className="mt-0.5 p-1.5 bg-primary/10 rounded-md text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"><Phone className="h-4 w-4" /></div>
                                            <div className="leading-tight">
                                                {office.phone.includes(' / ') ? (
                                                    office.phone.split(' / ').map((num, i, arr) => (
                                                        <span key={i}>
                                                            <a href={`tel:${num.replace(/[^0-9+]/g, '')}`} className="hover:text-accent transition-colors">
                                                                {num.trim()}
                                                            </a>
                                                            {i < arr.length - 1 && <span className="mx-1">/</span>}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <a href={`tel:${office.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-accent transition-colors">
                                                        {office.phone}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        {office.whatsappLink && (
                                            <div className="flex items-start space-x-3 group">
                                                <div className="mt-0.5 p-1.5 bg-green-100 rounded-md text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors"><MessageSquare className="h-4 w-4" /></div>
                                                <a href={office.whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors leading-tight font-medium">Chat on WhatsApp</a>
                                            </div>
                                        )}
                                        {office.mapLink && !office.mapEmbedUrl && (
                                            <div className="flex items-start space-x-3 group">
                                                <div className="mt-0.5 p-1.5 bg-primary/10 rounded-md text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"><ExternalLink className="h-4 w-4" /></div>
                                                <a href={office.mapLink} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors leading-tight">View Location Map</a>
                                            </div>
                                        )}
                                    </div>
                                    {index < officeLocations.length - 1 && <Separator className="my-6 opacity-50" />}
                                </div>
                            ))}

                            {/* Main Map Embed (e.g., Head Office) */}
                            {officeLocations.find(loc => loc.mapEmbedUrl) && (
                                <div className="mt-6 pt-6 border-t border-border">
                                    <h3 className="text-lg font-semibold text-primary mb-3">Visit Head Office</h3>
                                    <div className="rounded-xl overflow-hidden shadow-sm border border-border">
                                        <iframe
                                            src={officeLocations.find(loc => loc.mapEmbedUrl)!.mapEmbedUrl}
                                            width="100%"
                                            height="350"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        ></iframe>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
