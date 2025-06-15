
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
import { Textarea } from '@/components/ui/textarea';
import SectionTitle from '@/components/ui/section-title';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { allEducationLevels, sopCountries, fieldsOfStudy as allFieldsOfStudy } from '@/lib/data.tsx'; 

import { generateSopFromTemplate } from '@/lib/sop-templates'; 

import { Loader2, Sparkles, Info, FileText, Download, AlertCircle, ListChecks, User, FilePenLine, Copy as CopyIcon, CalendarIcon, School, UserSquare, DollarSign as DollarSignIcon } from 'lucide-react';


// Schemas for Document Checklist (Remains unchanged)
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


export const SopGeneratorInputSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters.").max(100).describe("The student's full name."),
  permanentAddress: z.string().min(5, "Permanent address is required.").max(200).optional().describe("Student's permanent address."),
  passportNumber: z.string().min(5, "Passport number is required.").max(20).optional().describe("Student's passport number."),
  
  targetCountry: z.string().min(1, "Please select a target country.").describe("The country where the student wishes to study."),
  targetEducationLevel: z.string().min(1, "Please select the target education level.").describe("The level of education student is applying for."),
  fieldOfStudy: z.string().min(2, "Field of study must be at least 2 characters.").max(100).describe("The student's desired field of study."),
  institutionName: z.string().min(2, "Institution name is required.").max(150).optional().describe("Name of the target institution."),

  seeSchoolName: z.string().min(2, "SEE School name is required.").max(100).optional().describe("School name for SEE."),
  seeGpa: z.string().min(1, "SEE GPA is required.").max(10).optional().describe("GPA for SEE."),
  seeYear: z.string().min(4, "SEE year is required.").max(4).optional().describe("Year of SEE completion."),
  
  plusTwoSchoolName: z.string().min(2, "+2 School name is required.").max(100).optional().describe("School/College name for +2."),
  plusTwoGpa: z.string().min(1, "+2 GPA is required.").max(10).optional().describe("GPA for +2."),
  plusTwoYear: z.string().min(4, "+2 year is required.").max(4).optional().describe("Year of +2 completion."),

  academicBackground: z.string().min(50, "Academic background must be at least 50 characters.").max(2000).describe("Details of past education, relevant subjects, grades/GPA, key projects, and academic achievements."),
  extracurricularsWorkExperience: z.string().min(20, "Please provide some details, min 20 chars.").max(2000).optional().describe("Relevant work experience, internships, volunteer work, leadership roles, and significant extracurricular activities."),

  pteTestDate: z.string().optional().describe("PTE Test Date (e.g., YYYY-MM-DD)."),
  pteOverallScore: z.string().optional().describe("PTE Overall Score."),
  pteListeningScore: z.string().optional().describe("PTE Listening Score."),
  pteReadingScore: z.string().optional().describe("PTE Reading Score."),
  pteWritingScore: z.string().optional().describe("PTE Writing Score."),
  pteSpeakingScore: z.string().optional().describe("PTE Speaking Score."),
  // Add fields for IELTS/TOEFL/Duolingo if needed for other templates

  fatherName: z.string().optional().describe("Father's Name."),
  fatherIncomeDetails: z.string().optional().describe("Father's income source details."),
  fatherAnnualIncomeNpr: z.string().optional().describe("Father's annual income in NPR."),
  motherName: z.string().optional().describe("Mother's Name."),
  motherIncomeDetails: z.string().optional().describe("Mother's income source details."),
  motherAnnualIncomeNpr: z.string().optional().describe("Mother's annual income in NPR."),
  brotherName: z.string().optional().describe("Brother's Name (if applicable)."),
  brotherIncomeDetails: z.string().optional().describe("Brother's income source details."),
  brotherAnnualIncomeNpr: z.string().optional().describe("Brother's annual income in NPR."),
  uncleName: z.string().optional().describe("Uncle's Name (if applicable)."),
  uncleIncomeDetails: z.string().optional().describe("Uncle's income source details."),
  uncleAnnualIncomeNpr: z.string().optional().describe("Uncle's annual income in NPR."),
  totalAnnualIncomeNpr: z.string().optional().describe("Total combined annual income of sponsors in NPR."),
  totalAnnualIncomeForeignEquivalent: z.string().optional().describe("Total income in foreign currency equivalent (e.g., CAD 12345)."),
  
  educationLoanBank: z.string().optional().describe("Name of the bank providing education loan."),
  educationLoanBankDescription: z.string().optional().describe("Brief description of the bank (e.g., A Grade Commercial Bank)."),
  educationLoanAmountNpr: z.string().optional().describe("Education loan amount in NPR."),
  educationLoanForeignEquivalent: z.string().optional().describe("Loan amount in foreign currency equivalent."),
  
  whyThisProgram: z.string().min(50, "Reasons for choosing this program must be at least 50 characters.").max(1500).describe("Reasons for choosing this specific program and university."),
  whyThisCountry: z.string().min(50, "Reasons for choosing this country must be at least 50 characters.").max(1500).describe("Reasons for choosing this particular country for studies."),
  whyNotHomeCountry: z.string().min(50, "Reasons for not studying in home country must be at least 50 characters.").max(1500).optional().describe("Reasons for not choosing to study in home country."),
  whyThisInstitution: z.string().min(50, "Reasons for choosing this institution must be at least 50 characters.").max(1500).optional().describe("Reasons for choosing this specific institution."),
  
  futureGoals: z.string().min(50, "Future goals must be at least 50 characters.").max(1500).describe("Short-term and long-term career aspirations and how this program/country will help achieve them."),
  expectedInitialSalaryNpr: z.string().optional().describe("Expected initial salary in Nepal (e.g., NPR 80,000 - 90,000)."),
  incentivesToReturnHome: z.string().min(50, "Incentives to return home must be at least 50 characters.").max(1500).optional().describe("Reasons and incentives for returning to home country after studies."),
  
  additionalPoints: z.string().max(1000).optional().describe("Any other specific information or points student wants to include."),
  tone: z.enum(["Formal", "Slightly Informal", "Enthusiastic", "Objective"]).default("Formal").describe("The desired tone of the SOP (template may or may not use this)."),
});

export type SopGeneratorInput = z.infer<typeof SopGeneratorInputSchema>; 

interface SopGeneratorOutput {
  sopText: string;
}


export default function SmartToolsPage() {
  const { toast } = useToast();

  const [isSopLoading, setIsSopLoading] = useState(false); 
  const [sopError, setSopError] = useState<string | null>(null);
  const [sopResult, setSopResult] = useState<SopGeneratorOutput | null>(null);
  const [showSopResultsArea, setShowSopResultsArea] = useState(false);
  const [sopResultsAnimatedIn, setSopResultsAnimatedIn] = useState(false);
  const sopOutputRef = useRef<HTMLTextAreaElement>(null);

  const [isDocChecklistLoading, setIsDocChecklistLoading] = useState(false);
  const [docChecklistError, setDocChecklistError] = useState<string | null>(null);
  const [docChecklistResult, setDocChecklistResult] = useState<RuleBasedDocumentChecklistOutput | null>(null);
  const [showDocChecklistResultsArea, setShowDocChecklistResultsArea] = useState(false);
  const [docChecklistResultsAnimatedIn, setDocChecklistResultsAnimatedIn] = useState(false);

  const [titleSectionRef, isTitleSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [tabsRef, isTabsVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.05 });

  const sopForm = useForm<SopGeneratorInput>({ 
    resolver: zodResolver(SopGeneratorInputSchema),
    defaultValues: {
      fullName: '',
      permanentAddress: '',
      passportNumber: '',
      targetCountry: '',
      targetEducationLevel: '',
      fieldOfStudy: '',
      institutionName: '',
      seeSchoolName: '',
      seeGpa: '',
      seeYear: '',
      plusTwoSchoolName: '',
      plusTwoGpa: '',
      plusTwoYear: '',
      academicBackground: '',
      extracurricularsWorkExperience: '',
      pteTestDate: '',
      pteOverallScore: '',
      pteListeningScore: '',
      pteReadingScore: '',
      pteWritingScore: '',
      pteSpeakingScore: '',
      fatherName: '',
      fatherIncomeDetails: '',
      fatherAnnualIncomeNpr: '',
      motherName: '',
      motherIncomeDetails: '',
      motherAnnualIncomeNpr: '',
      brotherName: '',
      brotherIncomeDetails: '',
      brotherAnnualIncomeNpr: '',
      uncleName: '',
      uncleIncomeDetails: '',
      uncleAnnualIncomeNpr: '',
      totalAnnualIncomeNpr: '',
      totalAnnualIncomeForeignEquivalent: '',
      educationLoanBank: '',
      educationLoanBankDescription: '',
      educationLoanAmountNpr: '',
      educationLoanForeignEquivalent: '',
      whyThisProgram: '',
      whyThisCountry: '',
      whyNotHomeCountry: '',
      whyThisInstitution: '',
      futureGoals: '',
      expectedInitialSalaryNpr: '',
      incentivesToReturnHome: '',
      additionalPoints: '',
      tone: 'Formal',
    },
  });

  const docChecklistForm = useForm<DocumentChecklistFormValues>({ 
    resolver: zodResolver(docChecklistFormSchema),
    defaultValues: {
      userName: '',
      educationLevel: '',
      desiredCountry: '',
    },
  });

  async function onSopSubmit(values: SopGeneratorInput) {
    setSopResult(null);
    setSopError(null);

    if (!showSopResultsArea) {
      setShowSopResultsArea(true);
      requestAnimationFrame(() => {
          setSopResultsAnimatedIn(true);
      });
    }
    setIsSopLoading(true); 

    try {
      const generatedText = generateSopFromTemplate(values);
      setSopResult({ sopText: generatedText });
    } catch (e) {
      setSopError(e instanceof Error ? e.message : 'An unexpected error occurred while generating the SOP.');
      console.error("SOP Template Generation Error:", e);
    } finally {
      setIsSopLoading(false);
    }
  }
  
  const handleCopySop = () => {
    if (sopResult?.sopText) {
      navigator.clipboard.writeText(sopResult.sopText)
        .then(() => {
          toast({ title: "SOP Copied!", description: "The Statement of Purpose has been copied to your clipboard.", variant: "default" });
        })
        .catch(err => {
          console.error('Failed to copy SOP: ', err);
          toast({ title: "Copy Failed", description: "Could not copy the SOP. Please try selecting and copying manually.", variant: "destructive" });
        });
    }
  };


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
            <div className={cn(
                "w-full",
                showSopResultsArea ? "grid grid-cols-1 md:grid-cols-2 gap-8 items-start" : "flex flex-col items-center"
            )}>
              <Card className={cn(
                  "shadow-xl bg-card w-full",
                  showSopResultsArea ? "md:col-span-1" : "max-w-3xl" 
              )}>
                <CardHeader>
                  <CardTitle className="font-headline text-primary flex items-center"><FilePenLine className="mr-2 h-6 w-6" />Craft Your Statement of Purpose</CardTitle>
                  <CardDescription>Fill in your details, and our tool will help draft an SOP based on common templates for your university application.</CardDescription>
                </CardHeader>
                <Form {...sopForm}>
                  <form onSubmit={sopForm.handleSubmit(onSopSubmit)}>
                    <CardContent className="space-y-6">
                      {/* Personal Information Section */}
                      <div className="space-y-2 p-4 border rounded-md bg-secondary/30">
                        <h3 className="font-semibold text-primary text-lg">Personal Information</h3>
                        <FormField control={sopForm.control} name="fullName" render={({ field }) => (
                            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={sopForm.control} name="permanentAddress" render={({ field }) => (
                            <FormItem><FormLabel>Permanent Address</FormLabel><FormControl><Input placeholder="e.g., Jiri Municipality Ward No. 3, Dolakha, Nepal" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={sopForm.control} name="passportNumber" render={({ field }) => (
                            <FormItem><FormLabel>Passport Number</FormLabel><FormControl><Input placeholder="e.g., AB1234567" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                      </div>
                      
                      {/* Target Study Information Section */}
                      <div className="space-y-2 p-4 border rounded-md bg-secondary/30">
                        <h3 className="font-semibold text-primary text-lg">Target Study Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                          <FormField control={sopForm.control} name="targetCountry" render={({ field }) => (
                              <FormItem><FormLabel>Target Country</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                  <FormControl><SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger></FormControl>
                                  <SelectContent>{sopCountries.map(c => <SelectItem key={c.value} value={c.value}>{c.name}</SelectItem>)}</SelectContent>
                                </Select><FormMessage />
                              </FormItem>
                          )}/>
                          <FormField control={sopForm.control} name="targetEducationLevel" render={({ field }) => (
                              <FormItem><FormLabel>Target Education Level</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                  <FormControl><SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger></FormControl>
                                  <SelectContent>{allEducationLevels.map(level => <SelectItem key={level.value} value={level.value}>{level.name}</SelectItem>)}</SelectContent>
                                </Select><FormMessage />
                              </FormItem>
                          )}/>
                        </div>
                         <FormField control={sopForm.control} name="fieldOfStudy" render={({ field }) => (
                          <FormItem><FormLabel>Desired Field of Study</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select field of study" /></SelectTrigger></FormControl>
                                <SelectContent>{allFieldsOfStudy.map(fos => <SelectItem key={fos} value={fos}>{fos}</SelectItem>)}</SelectContent>
                            </Select>
                          <FormMessage /></FormItem>
                        )}/>
                        <FormField control={sopForm.control} name="institutionName" render={({ field }) => (
                            <FormItem><FormLabel>Target Institution Name (Optional)</FormLabel><FormControl><Input placeholder="e.g., Northern Lights College" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                      </div>

                      {/* Academic Background Section */}
                      <div className="space-y-2 p-4 border rounded-md bg-secondary/30">
                          <h3 className="font-semibold text-primary text-lg">Academic History</h3>
                          <FormField control={sopForm.control} name="academicBackground" render={({ field }) => (
                              <FormItem><FormLabel>Overall Academic Background Narrative</FormLabel><FormControl><Textarea placeholder="Detail your past education, relevant subjects, grades/GPA, key projects, research, and academic achievements..." rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                          )}/>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-4">
                              <FormField control={sopForm.control} name="seeSchoolName" render={({ field }) => (
                                  <FormItem><FormLabel>SEE School</FormLabel><FormControl><Input placeholder="School Name" {...field} /></FormControl><FormMessage /></FormItem>
                              )}/>
                              <FormField control={sopForm.control} name="seeGpa" render={({ field }) => (
                                  <FormItem><FormLabel>SEE GPA</FormLabel><FormControl><Input placeholder="e.g., 2.75" {...field} /></FormControl><FormMessage /></FormItem>
                              )}/>
                              <FormField control={sopForm.control} name="seeYear" render={({ field }) => (
                                  <FormItem><FormLabel>SEE Year</FormLabel><FormControl><Input placeholder="e.g., 2019" {...field} /></FormControl><FormMessage /></FormItem>
                              )}/>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-4 pt-2">
                              <FormField control={sopForm.control} name="plusTwoSchoolName" render={({ field }) => (
                                  <FormItem><FormLabel>+2 School/College</FormLabel><FormControl><Input placeholder="School/College Name" {...field} /></FormControl><FormMessage /></FormItem>
                              )}/>
                              <FormField control={sopForm.control} name="plusTwoGpa" render={({ field }) => (
                                  <FormItem><FormLabel>+2 GPA</FormLabel><FormControl><Input placeholder="e.g., 2.75" {...field} /></FormControl><FormMessage /></FormItem>
                              )}/>
                              <FormField control={sopForm.control} name="plusTwoYear" render={({ field }) => (
                                  <FormItem><FormLabel>+2 Year</FormLabel><FormControl><Input placeholder="e.g., 2023" {...field} /></FormControl><FormMessage /></FormItem>
                              )}/>
                          </div>
                      </div>
                      
                      {/* English Proficiency Section (PTE Example) */}
                      <div className="space-y-2 p-4 border rounded-md bg-secondary/30">
                          <h3 className="font-semibold text-primary text-lg">English Proficiency (PTE Example)</h3>
                          <FormField control={sopForm.control} name="pteTestDate" render={({ field }) => (
                              <FormItem><FormLabel>PTE Test Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                          )}/>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-4">
                            <FormField control={sopForm.control} name="pteOverallScore" render={({ field }) => (<FormItem><FormLabel>Overall</FormLabel><FormControl><Input placeholder="e.g., 60" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={sopForm.control} name="pteListeningScore" render={({ field }) => (<FormItem><FormLabel>Listening</FormLabel><FormControl><Input placeholder="e.g., 59" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={sopForm.control} name="pteReadingScore" render={({ field }) => (<FormItem><FormLabel>Reading</FormLabel><FormControl><Input placeholder="e.g., 65" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={sopForm.control} name="pteWritingScore" render={({ field }) => (<FormItem><FormLabel>Writing</FormLabel><FormControl><Input placeholder="e.g., 63" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={sopForm.control} name="pteSpeakingScore" render={({ field }) => (<FormItem><FormLabel>Speaking</FormLabel><FormControl><Input placeholder="e.g., 67" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                          </div>
                      </div>

                      {/* Sponsor Details Section */}
                        <div className="space-y-4 p-4 border rounded-md bg-secondary/30">
                            <h3 className="font-semibold text-primary text-lg">Sponsor Details</h3>
                            {/* Father */}
                            <div className="border-t pt-2 space-y-2">
                                <FormField control={sopForm.control} name="fatherName" render={({ field }) => (<FormItem><FormLabel>Father's Name</FormLabel><FormControl><Input placeholder="Mr. Sarki Sherpa" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={sopForm.control} name="fatherIncomeDetails" render={({ field }) => (<FormItem><FormLabel>Father's Income Sources</FormLabel><FormControl><Textarea placeholder="e.g., Salary from Royalty School, land lease..." {...field} rows={2}/></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={sopForm.control} name="fatherAnnualIncomeNpr" render={({ field }) => (<FormItem><FormLabel>Father's Annual Income (NPR)</FormLabel><FormControl><Input placeholder="e.g., 1824000" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            </div>
                            {/* Mother */}
                             <div className="border-t pt-2 space-y-2">
                                <FormField control={sopForm.control} name="motherName" render={({ field }) => (<FormItem><FormLabel>Mother's Name</FormLabel><FormControl><Input placeholder="Mrs. Furleki Sherpa" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={sopForm.control} name="motherIncomeDetails" render={({ field }) => (<FormItem><FormLabel>Mother's Income Sources</FormLabel><FormControl><Textarea placeholder="e.g., Salary from Co-operative" {...field} rows={2}/></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={sopForm.control} name="motherAnnualIncomeNpr" render={({ field }) => (<FormItem><FormLabel>Mother's Annual Income (NPR)</FormLabel><FormControl><Input placeholder="e.g., 540000" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            </div>
                             {/* Brother - Make these fields optional or guide user if not applicable */}
                            <div className="border-t pt-2 space-y-2">
                                <FormField control={sopForm.control} name="brotherName" render={({ field }) => (<FormItem><FormLabel>Brother's Name (Optional)</FormLabel><FormControl><Input placeholder="Mr. Ang Pasang Sherpa" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={sopForm.control} name="brotherIncomeDetails" render={({ field }) => (<FormItem><FormLabel>Brother's Income Sources</FormLabel><FormControl><Textarea placeholder="e.g., Salary from Co-operative" {...field} rows={2}/></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={sopForm.control} name="brotherAnnualIncomeNpr" render={({ field }) => (<FormItem><FormLabel>Brother's Annual Income (NPR)</FormLabel><FormControl><Input placeholder="e.g., 420000" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            </div>
                            {/* Uncle - Make these fields optional or guide user if not applicable */}
                            <div className="border-t pt-2 space-y-2">
                                <FormField control={sopForm.control} name="uncleName" render={({ field }) => (<FormItem><FormLabel>Uncle's Name (Optional)</FormLabel><FormControl><Input placeholder="Mr. Lakpa Sherpa" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={sopForm.control} name="uncleIncomeDetails" render={({ field }) => (<FormItem><FormLabel>Uncle's Income Sources</FormLabel><FormControl><Textarea placeholder="e.g., Salary from Qatar Catering" {...field} rows={2}/></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={sopForm.control} name="uncleAnnualIncomeNpr" render={({ field }) => (<FormItem><FormLabel>Uncle's Annual Income (NPR)</FormLabel><FormControl><Input placeholder="e.g., 1985358.60" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            </div>
                            {/* Total Income & Loan */}
                             <div className="border-t pt-2 space-y-2">
                                <FormField control={sopForm.control} name="totalAnnualIncomeNpr" render={({ field }) => (<FormItem><FormLabel>Total Annual Income (NPR)</FormLabel><FormControl><Input placeholder="e.g., 4769358.60" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={sopForm.control} name="totalAnnualIncomeForeignEquivalent" render={({ field }) => (<FormItem><FormLabel>Total Income (Foreign Currency Equivalent)</FormLabel><FormControl><Input placeholder="e.g., CAD 48494.00 or A$ 48494.00" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={sopForm.control} name="educationLoanBank" render={({ field }) => (<FormItem><FormLabel>Education Loan Bank (Optional)</FormLabel><FormControl><Input placeholder="e.g., Kumari Bank Limited" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={sopForm.control} name="educationLoanBankDescription" render={({ field }) => (<FormItem><FormLabel>Loan Bank Description (Optional)</FormLabel><FormControl><Input placeholder="e.g., A Grade Commercial Bank" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={sopForm.control} name="educationLoanAmountNpr" render={({ field }) => (<FormItem><FormLabel>Loan Amount (NPR)</FormLabel><FormControl><Input placeholder="e.g., 6100000" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={sopForm.control} name="educationLoanForeignEquivalent" render={({ field }) => (<FormItem><FormLabel>Loan Amount (Foreign Currency Equivalent)</FormLabel><FormControl><Input placeholder="e.g., CAD 62263.95 or A$ 62263.95" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            </div>
                        </div>

                      {/* SOP Content Sections */}
                      <div className="space-y-2 p-4 border rounded-md bg-secondary/30">
                        <h3 className="font-semibold text-primary text-lg">SOP Content Details</h3>
                        <FormField control={sopForm.control} name="extracurricularsWorkExperience" render={({ field }) => (
                          <FormItem><FormLabel>Extracurriculars & Work Experience (Narrative)</FormLabel><FormControl><Textarea placeholder="Describe relevant work experience, internships, volunteer work, leadership roles, or significant extracurricular activities..." rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={sopForm.control} name="whyThisProgram" render={({ field }) => (
                          <FormItem><FormLabel>Why This Program?</FormLabel><FormControl><Textarea placeholder="Explain your reasons for choosing this specific program..." rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                         <FormField control={sopForm.control} name="whyThisInstitution" render={({ field }) => (
                          <FormItem><FormLabel>Why This Institution? (If different from general program reasons)</FormLabel><FormControl><Textarea placeholder="Explain your reasons for choosing this specific institution..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={sopForm.control} name="whyThisCountry" render={({ field }) => (
                          <FormItem><FormLabel>Why This Country?</FormLabel><FormControl><Textarea placeholder="Explain your reasons for choosing this particular country..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                         <FormField control={sopForm.control} name="whyNotHomeCountry" render={({ field }) => (
                          <FormItem><FormLabel>Reasons for Not Studying in Home Country (Optional)</FormLabel><FormControl><Textarea placeholder="Explain why you are choosing to study abroad instead of in your home country..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={sopForm.control} name="futureGoals" render={({ field }) => (
                          <FormItem><FormLabel>Future Goals & Career Aspirations (Narrative)</FormLabel><FormControl><Textarea placeholder="Describe your short-term and long-term career goals and how this program and study in this country will help you achieve them..." rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={sopForm.control} name="expectedInitialSalaryNpr" render={({ field }) => (
                            <FormItem><FormLabel>Expected Initial Salary in Nepal (NPR, Optional)</FormLabel><FormControl><Input placeholder="e.g., 80,000 - 90,000" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                         <FormField control={sopForm.control} name="incentivesToReturnHome" render={({ field }) => (
                          <FormItem><FormLabel>Incentives to Return to Home Country (Narrative)</FormLabel><FormControl><Textarea placeholder="Detail your ties to your home country and reasons for returning..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={sopForm.control} name="additionalPoints" render={({ field }) => (
                          <FormItem><FormLabel>Other Specific Points to Include (Optional)</FormLabel><FormControl><Textarea placeholder="Any other specific information or points you want the tool to consider for your SOP..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                         <FormField control={sopForm.control} name="tone" render={({ field }) => (
                              <FormItem><FormLabel>Desired Tone (informational)</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                  <FormControl><SelectTrigger><SelectValue placeholder="Select tone" /></SelectTrigger></FormControl>
                                  <SelectContent>
                                      <SelectItem value="Formal">Formal</SelectItem>
                                      <SelectItem value="Slightly Informal">Slightly Informal</SelectItem>
                                      <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                                      <SelectItem value="Objective">Objective</SelectItem>
                                  </SelectContent>
                                </Select><FormMessage />
                              </FormItem>
                          )}/>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isSopLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        {isSopLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate SOP Draft
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>

              {showSopResultsArea && (
                <div className={cn(
                    "w-full md:col-span-1 space-y-6", 
                    "transition-all duration-700 ease-out",
                    sopResultsAnimatedIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
                )}>
                  {isSopLoading && ( 
                    <Card className="shadow-xl bg-card">
                      <CardContent className="p-10 text-center">
                        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Generating your SOP draft...</p>
                      </CardContent>
                    </Card>
                  )}
                  {sopError && !isSopLoading && (
                    <Alert variant="destructive">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Error Generating SOP</AlertTitle>
                      <AlertDescription>{sopError}</AlertDescription>
                    </Alert>
                  )}
                  {sopResult && !isSopLoading && (
                    <Card className="shadow-xl bg-gradient-to-br from-accent/10 to-background">
                      <CardHeader className="flex flex-row justify-between items-center">
                        <div>
                          <CardTitle className="font-headline text-accent flex items-center"><Sparkles className="mr-2 h-6 w-6" /> Your Template-Based SOP Draft</CardTitle>
                           <CardDescription>Review, edit, and extensively personalize this draft. This is a starting point based on common structures.</CardDescription>
                        </div>
                        <Button onClick={handleCopySop} variant="outline" size="sm">
                          <CopyIcon className="mr-2 h-4 w-4" /> Copy SOP
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Textarea
                          ref={sopOutputRef}
                          value={sopResult.sopText}
                          readOnly
                          className="w-full h-96 text-sm bg-background/70 resize-none" 
                        />
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle className="font-semibold">Important Note</AlertTitle>
                            <AlertDescription>
                                This SOP is generated from a template based on your inputs. It is crucial to thoroughly review, personalize, and edit it to ensure it accurately reflects your unique voice, experiences, and aspirations. Do not submit it without significant personalization. Consult our advisors for expert review.
                            </AlertDescription>
                        </Alert>
                         <div className="pt-4 text-center">
                              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                                  <Link href="/contact?service=sop_review">
                                      Get Expert SOP Review & Guidance
                                  </Link>
                              </Button>
                          </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Document Checklist Tab Content (Remains Unchanged) */}
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
