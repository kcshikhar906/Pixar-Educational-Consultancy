
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import jsPDF from 'jspdf';
import { useToast } from "@/hooks/use-toast";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SectionTitle from '@/components/ui/section-title';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { allEducationLevels } from '@/lib/data.tsx'; 

import { Loader2, Sparkles, Info, FileText, Download, AlertCircle, ListChecks, User, FilePenLine, Construction } from 'lucide-react';


// Schemas for Document Checklist
const docChecklistFormSchema = z.object({
  userName: z.string().min(2, "Please enter your full name.").max(100, "Name is too long."),
  educationLevel: z.string().min(1, "Please select your education level."),
  desiredCountry: z.string().min(1, "Please select your desired country."),
});
type DocumentChecklistFormValues = z.infer<typeof docChecklistFormSchema>;

interface StaticDocument {
  englishName: string;
  nepaliName: string;
  description: string;
  educationLevels?: string[];
  countries?: string[];
}

interface RuleBasedDocumentChecklistOutput {
  checklist: StaticDocument[];
  notes?: string;
}

const generalDocuments: StaticDocument[] = [
  { englishName: "Passport", nepaliName: "राहदानी", description: "Valid passport with sufficient validity (usually at least 6 months beyond intended stay)." },
  { englishName: "Academic Transcripts & Certificates", nepaliName: "शैक्षिक प्रमाणपत्र र ट्रान्सक्रिप्टहरू", description: "Official transcripts and completion certificates from all previous educational institutions (e.g., SLC/SEE, +2, Bachelor's, Master's)." },
  { englishName: "English Proficiency Test Score", nepaliName: "अंग्रेजी भाषा प्रवीणता परीक्षा स्कोर", description: "Valid score report from IELTS, TOEFL, PTE, or Duolingo, as required by the institution and country. (e.g. IELTS: 6.0-7.5, TOEFL: 80-100)." },
  { englishName: "Statement of Purpose (SOP) / Letter of Intent", nepaliName: "उद्देश्यको कथन / आशय पत्र", description: "An essay outlining your academic background, career goals, reasons for choosing the course and institution, and future plans." },
  { englishName: "Letters of Recommendation (LORs)", nepaliName: "सिफारिश पत्रहरू", description: "Usually 2-3 letters from professors or employers who can attest to your academic abilities and character.", educationLevels: ["Bachelor's Degree", "Master's Degree", "Doctorate (PhD)"] },
  { englishName: "Curriculum Vitae (CV) / Resume", nepaliName: "बायोडाटा / रिजुमे", description: "A summary of your academic qualifications, work experience, skills, and achievements.", educationLevels: ["Master's Degree", "Doctorate (PhD)"] },
  { englishName: "Financial Documents", nepaliName: "वित्तीय कागजातहरू", description: "Proof of sufficient funds to cover tuition fees and living expenses (e.g., bank statements, education loan sanction letter, scholarship letter)." },
  { englishName: "Visa Application Form", nepaliName: "भिसा आवेदन फारम", description: "Completed and signed visa application form for the specific country." },
  { englishName: "Passport-size Photographs", nepaliName: "पासपोर्ट आकारको फोटोहरू", description: "Recent photographs meeting the specific requirements of the country and institution." },
  { englishName: "Birth Certificate", nepaliName: "जन्म दर्ता प्रमाणपत्र", description: "Official birth certificate, sometimes required for verification." },
  { englishName: "Police Clearance Certificate", nepaliName: "पुलिस क्लियरेन्स प्रमाणपत्र", description: "A certificate from the police indicating no criminal record, required by some countries.", countries: ["Australia", "Canada", "New Zealand"] },
  { englishName: "Health Examination / Medical Certificate", nepaliName: "स्वास्थ्य परीक्षण / मेडिकल प्रमाणपत्र", description: "Proof of medical examination, required by some countries for visa purposes.", countries: ["Australia", "Canada", "New Zealand"] },
];

const countrySpecificNotes: Record<string, string> = {
  "USA": "For the USA, the I-20 form from your university is crucial for the F-1 visa application. Also, prepare for the SEVIS fee payment and a visa interview. Financial documentation needs to be robust.",
  "Australia": "Australia requires a Genuine Temporary Entrant (GTE) statement and Overseas Student Health Cover (OSHC). Ensure your financial documents clearly show the source of funds.",
  "Canada": "For Canada, you'll need an acceptance letter from a Designated Learning Institution (DLI). Biometrics and a medical exam might be required. A Guaranteed Investment Certificate (GIC) is a common way to show proof of funds for some programs.",
  "UK": "The UK requires a Confirmation of Acceptance for Studies (CAS) from your university. You'll need to show funds for tuition and living costs, and may need an IELTS UKVI test.",
  "New Zealand": "New Zealand emphasizes that you are a genuine student and have sufficient funds. Health and character checks are important.",
};

function getRuleBasedDocumentChecklist(input: { educationLevel: string; desiredCountry: string }): RuleBasedDocumentChecklistOutput {
  const { educationLevel, desiredCountry } = input;

  let filteredDocuments = generalDocuments.filter(doc => {
    const educationMatch = !doc.educationLevels || doc.educationLevels.includes(educationLevel);
    const countryMatch = !doc.countries || doc.countries.includes(desiredCountry);
    return educationMatch && countryMatch;
  });

  filteredDocuments.sort((a, b) => {
      const aSpecificity = (a.countries ? 1 : 0) + (a.educationLevels ? 1 : 0);
      const bSpecificity = (b.countries ? 1 : 0) + (a.educationLevels ? 1 : 0);
      return aSpecificity - bSpecificity;
  });

  let notes = "This is a general checklist. Requirements can vary significantly based on the specific institution, program, and your individual circumstances. Always verify the exact requirements with the university and the respective country's immigration authorities. \n\nLanguage proficiency tests like IELTS, TOEFL, or PTE are almost always required; aim for competitive scores. Ensure all documents are genuine, and if not in English, provide certified translations (except for Nepali names).";
  if (countrySpecificNotes[desiredCountry]) {
    notes += `\n\nSpecific advice for ${desiredCountry}: ${countrySpecificNotes[desiredCountry]}`;
  }
  notes += "\n\nPixar Educational Consultancy can provide personalized assistance with your documentation. Contact us for detailed guidance!"

  return {
    checklist: filteredDocuments,
    notes: notes,
  };
}

const selectableCountries = [ 
  { name: 'Australia', value: 'Australia' },
  { name: 'Canada', value: 'Canada' },
  { name: 'USA', value: 'USA' },
  { name: 'UK', value: 'UK' },
  { name: 'New Zealand', value: 'New Zealand' },
];


export default function SmartToolsPage() {
  const { toast } = useToast();

  const [isDocChecklistLoading, setIsDocChecklistLoading] = useState(false);
  const [docChecklistError, setDocChecklistError] = useState<string | null>(null);
  const [docChecklistResult, setDocChecklistResult] = useState<RuleBasedDocumentChecklistOutput | null>(null);
  const [showDocChecklistResultsArea, setShowDocChecklistResultsArea] = useState(false);
  const [docChecklistResultsAnimatedIn, setDocChecklistResultsAnimatedIn] = useState(false);

  const [titleSectionRef, isTitleSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [tabsRef, isTabsVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.05 });


  const docChecklistForm = useForm<DocumentChecklistFormValues>({ 
    resolver: zodResolver(docChecklistFormSchema),
    defaultValues: {
      userName: '',
      educationLevel: '',
      desiredCountry: '',
    },
  });
  

  async function onDocChecklistSubmit(values: DocumentChecklistFormValues) { 
    setDocChecklistResult(null);
    setDocChecklistError(null);

    if (!showDocChecklistResultsArea) {
        setShowDocChecklistResultsArea(true);
        requestAnimationFrame(() => {
            setDocChecklistResultsAnimatedIn(true);
        });
    }
    setIsDocChecklistLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); 
    try {
      const ruleBasedResult = getRuleBasedDocumentChecklist({
        educationLevel: values.educationLevel,
        desiredCountry: values.desiredCountry,
      });
      setDocChecklistResult(ruleBasedResult);
    } catch (e) {
      setDocChecklistError(e instanceof Error ? e.message : 'An unexpected error occurred generating the checklist.');
    } finally {
      setIsDocChecklistLoading(false);
    }
  }

  const handleDownloadPdf = () => { 
    if (!docChecklistResult || !docChecklistResult.checklist) return;
    const userName = docChecklistForm.getValues('userName');
    const doc = new jsPDF();
    const logoSrc = '/logo.png'; 

    const addPageElementsAndWatermark = () => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const watermarkWidth = 80; 
      const watermarkHeight = 80; 
      const watermarkX = (pageWidth - watermarkWidth) / 2;
      const watermarkY = (pageHeight - watermarkHeight) / 2;

      try {
        doc.addImage(logoSrc, 'PNG', watermarkX, watermarkY, watermarkWidth, watermarkHeight, undefined, 'FAST');
      } catch (e) {
        console.warn("Watermark image could not be added. Ensure " + logoSrc + " exists in /public. Adding text watermark instead. Error: ", e);
        doc.setFontSize(10);
        doc.setTextColor(200, 200, 200); 
        doc.text("Pixar Edu", pageWidth / 2, pageHeight / 2, { align: 'center', angle: 45 });
        doc.setTextColor(0, 0, 0);
      }

      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text("Pixar Educational Consultancy", pageWidth / 2, 15, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.textWithLink("www.pixaredu.com", pageWidth / 2, 23, { align: 'center', url: 'https://www.pixaredu.com'});

      doc.setLineWidth(0.5);
      doc.line(14, 30, pageWidth - 14, 30); 
    };
    
    let currentY = 35; 

    const startNewPage = () => {
      doc.addPage();
      addPageElementsAndWatermark();
      currentY = 35; 
    };

    addPageElementsAndWatermark(); 

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Document Checklist for ${userName}`, doc.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });
    currentY += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Education Level: ${docChecklistForm.getValues('educationLevel')}`, 14, currentY);
    currentY += 6;
    doc.text(`Desired Country: ${docChecklistForm.getValues('desiredCountry')}`, 14, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Document Checklist:", 14, currentY);
    currentY += 7;

    docChecklistResult.checklist.forEach((item, index) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      const itemNumberText = `${index + 1}. `;
      const englishNameText = item.englishName;
      const fullItemText = itemNumberText + englishNameText;

      const itemNameLines = doc.splitTextToSize(fullItemText, doc.internal.pageSize.getWidth() - 28); 
      const itemNameHeight = itemNameLines.length * 4.5; 

      const descriptionLines = doc.splitTextToSize(`   Description: ${item.description}`, doc.internal.pageSize.getWidth() - 32); 
      const descriptionHeight = descriptionLines.length * 4.5;

      const totalItemHeight = itemNameHeight + descriptionHeight + 3; 

      if (currentY + totalItemHeight > doc.internal.pageSize.getHeight() - 20) { 
        startNewPage();
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text("Document Checklist (Continued):", 14, currentY);
        currentY += 7;
      }
      
      doc.text(itemNameLines, 14, currentY);
      currentY += itemNameHeight;

      doc.text(descriptionLines, 14, currentY); 
      currentY += descriptionHeight + 3; 
    });

    if (docChecklistResult.notes) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      const notesTitle = "Important Notes & Advice:";
      const notesTitleHeight = 7;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const notesLines = doc.splitTextToSize(docChecklistResult.notes, doc.internal.pageSize.getWidth() - 28);
      const notesBodyHeight = notesLines.length * 4.5;
      const totalNotesHeight = notesTitleHeight + notesBodyHeight;

      if (currentY + totalNotesHeight > doc.internal.pageSize.getHeight() - 20) {
        startNewPage();
      }
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(notesTitle, 14, currentY);
      currentY += notesTitleHeight;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(notesLines, 14, currentY);
    }

    doc.save(`document_checklist_${userName.replace(/\s+/g, '_')}.pdf`);
  };


  return (
    <div className="space-y-12">
      <div ref={titleSectionRef} className={cn("transition-all duration-700 ease-out", isTitleSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle
          title="Smart Study Tools"
          subtitle="Utilize our SOP template generator and document checklists for your study abroad journey."
        />
      </div>

      <div ref={tabsRef} className={cn("transition-all duration-700 ease-out", isTabsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <Tabs defaultValue="sop-generator" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-fit mx-auto mb-8">
            <TabsTrigger value="sop-generator" className="py-2.5">
              <FilePenLine className="mr-2 h-5 w-5" /> SOP Generator
            </TabsTrigger>
            <TabsTrigger value="document-checklist" className="py-2.5">
              <ListChecks className="mr-2 h-5 w-5" /> Document Checklist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sop-generator">
            <Card className="shadow-xl bg-card w-full max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="font-headline text-primary flex items-center"><FilePenLine className="mr-2 h-6 w-6" />SOP Generator</CardTitle>
                  <CardDescription>This feature is currently under development.</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                    <Construction className="h-16 w-16 text-accent mx-auto mb-4" />
                    <p className="text-xl font-semibold text-foreground/90 mb-2">Coming Soon!</p>
                    <p className="text-foreground/70">
                        We're working hard to bring you an amazing SOP Generator. Please check back later!
                    </p>
                     <Button asChild variant="link" className="mt-4">
                        <Link href="/contact">Contact us for SOP assistance</Link>
                    </Button>
                </CardContent>
            </Card>
          </TabsContent>

          {/* Document Checklist Tab Content */}
          <TabsContent value="document-checklist">
            <div className={cn(
                "w-full",
                showDocChecklistResultsArea ? "grid grid-cols-1 md:grid-cols-2 gap-8 items-start" : "flex flex-col items-center"
            )}>
              <Card className={cn(
                  "shadow-xl bg-card w-full",
                  showDocChecklistResultsArea ? "md:col-span-1" : "max-w-2xl"
              )}>
                <CardHeader>
                  <CardTitle className="font-headline text-primary flex items-center"><ListChecks className="mr-2 h-6 w-6" />Generate Your Document Checklist</CardTitle>
                  <CardDescription>Provide your details to receive a tailored document list. This feature uses predefined checklists for efficiency.</CardDescription>
                </CardHeader>
                <Form {...docChecklistForm}>
                  <form onSubmit={docChecklistForm.handleSubmit(onDocChecklistSubmit)}>
                    <CardContent className="space-y-6">
                      <FormField
                        control={docChecklistForm.control}
                        name="userName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4 text-accent"/>Full Name</FormLabel>
                            <FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={docChecklistForm.control}
                        name="educationLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Current/Recent Education Level</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select your education level" /></SelectTrigger></FormControl>
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
                        control={docChecklistForm.control}
                        name="desiredCountry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Desired Country for Study</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {selectableCountries.map(country => ( 
                                  <SelectItem key={country.value} value={country.value}>{country.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isDocChecklistLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        {isDocChecklistLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate Checklist
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>

              {showDocChecklistResultsArea && (
                <div className={cn(
                    "w-full md:col-span-1 space-y-6",
                    "transition-all duration-700 ease-out",
                    docChecklistResultsAnimatedIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
                )}>
                  <Alert className="bg-secondary/50 border-secondary">
                    <Info className="h-5 w-5 text-primary" />
                    <AlertTitle className="font-semibold text-primary">Important Disclaimer</AlertTitle>
                    <AlertDescription className="text-foreground/80">
                      The checklist provided here includes commonly required documents based on general criteria. Additional documents may be necessary based on your specific academic profile, chosen institution, and personal circumstances. For a comprehensive and personalized document list, we highly recommend visiting our office or contacting us directly.
                    </AlertDescription>
                  </Alert>

                  {isDocChecklistLoading && (
                    <Card className="shadow-xl bg-card">
                      <CardContent className="p-10 text-center">
                        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Generating your checklist...</p>
                      </CardContent>
                    </Card>
                  )}
                  {docChecklistError && !isDocChecklistLoading && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{docChecklistError}</AlertDescription>
                    </Alert>
                  )}
                  {docChecklistResult && !isDocChecklistLoading && (
                    <Card className="shadow-xl bg-gradient-to-br from-accent/10 to-background">
                      <CardHeader className="flex flex-row justify-between items-center">
                        <div>
                          <CardTitle className="font-headline text-accent flex items-center"><FileText className="mr-2 h-6 w-6" /> Document Checklist for {docChecklistForm.getValues('userName')}</CardTitle>
                          <CardDescription>For {docChecklistForm.getValues('educationLevel')} to {docChecklistForm.getValues('desiredCountry')}</CardDescription>
                        </div>
                        <Button onClick={handleDownloadPdf} variant="outline" size="sm" className="ml-auto">
                          <Download className="mr-2 h-4 w-4" /> Download PDF
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertTitle>PDF Generation Note</AlertTitle>
                          <AlertDescription>
                            Nepali names for documents are shown below for web view but will be excluded from the PDF. Ensure your logo is at `public/logo.png` for the PDF watermark.
                          </AlertDescription>
                        </Alert>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[30%]">English Name</TableHead>
                                <TableHead className="w-[30%]">Nepali Name (नेपाली नाम)</TableHead>
                                <TableHead>Description</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {docChecklistResult.checklist && docChecklistResult.checklist.length > 0 ? (
                                docChecklistResult.checklist.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell className="font-medium">{item.englishName}</TableCell>
                                    <TableCell>{item.nepaliName}</TableCell>
                                    <TableCell className="text-sm text-foreground/80">{item.description}</TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={3} className="text-center text-muted-foreground">No specific documents found for your criteria. Please contact us for personalized advice.</TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                        {docChecklistResult.notes && (
                          <div className="mt-6 p-4 border-t border-border">
                            <h4 className="font-semibold text-lg text-primary mb-2">Important Notes & Advice:</h4>
                            <p className="text-foreground/90 whitespace-pre-line text-sm">{docChecklistResult.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
