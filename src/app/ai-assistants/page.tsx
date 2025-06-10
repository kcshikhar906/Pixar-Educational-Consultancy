
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormContext as useFormContextHook } from 'react-hook-form'; // Renamed to avoid conflict
import { z } from 'zod';
import jsPDF from 'jspdf';

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

import { englishTestAdvisor, type EnglishTestAdvisorInput, type EnglishTestAdvisorOutput } from '@/ai/flows/english-test-advisor';
import { generateDocumentChecklist, type DocumentChecklistInput, type DocumentChecklistOutput } from '@/ai/flows/document-checklist-flow';

import { Loader2, Sparkles, Info, FileText, Download, AlertCircle, BookOpenText, ListChecks } from 'lucide-react';

// Schemas for English Test Advisor
const englishTestFormSchema = z.object({
  currentLevel: z.string().min(1, "Please select your current English level."),
  timeline: z.string().min(1, "Please select your timeline."),
  budget: z.string().min(1, "Please select your budget."),
  purpose: z.string().min(1, "Please state the purpose for the test.").max(200, "Purpose too long"),
});
type EnglishTestAdvisorFormValues = z.infer<typeof englishTestFormSchema>;

// Schemas for Document Checklist
const docChecklistFormSchema = z.object({
  educationLevel: z.string().min(1, "Please select your education level."),
  desiredCountry: z.string().min(1, "Please select your desired country."),
});
type DocumentChecklistFormValues = z.infer<typeof docChecklistFormSchema>;

const selectableCountries = [
  { name: 'USA', value: 'USA' },
  { name: 'UK', value: 'UK' },
  { name: 'Australia', value: 'Australia' },
  { name: 'New Zealand', value: 'New Zealand' },
  { name: 'Europe', value: 'Europe' },
];

export default function AiAssistantsPage() {
  // State for English Test Advisor
  const [isEnglishTestLoading, setIsEnglishTestLoading] = useState(false);
  const [englishTestError, setEnglishTestError] = useState<string | null>(null);
  const [englishTestResult, setEnglishTestResult] = useState<EnglishTestAdvisorOutput | null>(null);

  // State for Document Checklist
  const [isDocChecklistLoading, setIsDocChecklistLoading] = useState(false);
  const [docChecklistError, setDocChecklistError] = useState<string | null>(null);
  const [docChecklistResult, setDocChecklistResult] = useState<DocumentChecklistOutput | null>(null);

  const englishTestForm = useForm<EnglishTestAdvisorFormValues>({
    resolver: zodResolver(englishTestFormSchema),
    defaultValues: {
      currentLevel: '',
      timeline: '',
      budget: '',
      purpose: '',
    },
  });

  const docChecklistForm = useForm<DocumentChecklistFormValues>({
    resolver: zodResolver(docChecklistFormSchema),
    defaultValues: {
      educationLevel: '',
      desiredCountry: '',
    },
  });

  async function onEnglishTestSubmit(values: EnglishTestAdvisorFormValues) {
    setIsEnglishTestLoading(true);
    setEnglishTestError(null);
    setEnglishTestResult(null);
    try {
      const aiResult = await englishTestAdvisor(values);
      setEnglishTestResult(aiResult);
    } catch (e) {
      setEnglishTestError(e instanceof Error ? e.message : 'An unexpected error occurred.');
    } finally {
      setIsEnglishTestLoading(false);
    }
  }

  async function onDocChecklistSubmit(values: DocumentChecklistFormValues) {
    setIsDocChecklistLoading(true);
    setDocChecklistError(null);
    setDocChecklistResult(null);
    try {
      const aiResult = await generateDocumentChecklist(values);
      setDocChecklistResult(aiResult);
    } catch (e) {
      setDocChecklistError(e instanceof Error ? e.message : 'An unexpected error occurred.');
    } finally {
      setIsDocChecklistLoading(false);
    }
  }

  const handleDownloadPdf = () => {
    if (!docChecklistResult || !docChecklistResult.checklist) return;

    const doc = new jsPDF();
    const tableStartY = 20;
    let currentY = tableStartY;

    doc.setFontSize(18);
    doc.text("Document Checklist", 105, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Education Level: ${docChecklistForm.getValues('educationLevel')}`, 14, currentY);
    currentY += 6;
    doc.text(`Desired Country: ${docChecklistForm.getValues('desiredCountry')}`, 14, currentY);
    currentY += 10;
    
    doc.setFontSize(12);
    doc.text("Document Checklist:", 14, currentY);
    currentY += 7;

    docChecklistResult.checklist.forEach((item, index) => {
      if (currentY > 270) { 
        doc.addPage();
        currentY = 15;
        doc.setFontSize(12);
        doc.text("Document Checklist (Continued):", 14, currentY);
        currentY += 7;
      }
      doc.setFontSize(10);
      doc.text(`${index + 1}. English: ${item.englishName}`, 14, currentY);
      currentY += 5;
      doc.text(`   Nepali: ${item.nepaliName}`, 14, currentY);
      currentY += 5;
      
      const splitDescription = doc.splitTextToSize(`   Description: ${item.description}`, 180);
      doc.text(splitDescription, 14, currentY);
      currentY += (splitDescription.length * 4) + 3; 
    });
    
    if (docChecklistResult.notes) {
      if (currentY > 250) { 
        doc.addPage();
        currentY = 15;
      }
      doc.setFontSize(12);
      doc.text("Important Notes & Advice:", 14, currentY);
      currentY += 7;
      doc.setFontSize(10);
      const splitNotes = doc.splitTextToSize(docChecklistResult.notes, 180);
      doc.text(splitNotes, 14, currentY);
    }
    doc.save('document_checklist.pdf');
  };

  return (
    <div className="space-y-12">
      <SectionTitle
        title="AI-Powered Assistants"
        subtitle="Get personalized advice and checklists for your study abroad journey."
      />

      <Tabs defaultValue="english-advisor" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 mx-auto mb-8">
          <TabsTrigger value="english-advisor" className="py-2.5">
            <BookOpenText className="mr-2 h-5 w-5" /> English Test Advisor
          </TabsTrigger>
          <TabsTrigger value="document-checklist" className="py-2.5">
            <ListChecks className="mr-2 h-5 w-5" /> Document Checklist
          </TabsTrigger>
        </TabsList>

        <TabsContent value="english-advisor">
          <Card className="max-w-2xl mx-auto shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="font-headline text-primary flex items-center"><BookOpenText className="mr-2 h-6 w-6" />Find Your Ideal English Test</CardTitle>
              <CardDescription>Fill in your details below for a tailored recommendation (IELTS, PTE, TOEFL, Duolingo, etc.).</CardDescription>
            </CardHeader>
            <Form {...englishTestForm}>
              <form onSubmit={englishTestForm.handleSubmit(onEnglishTestSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={englishTestForm.control}
                    name="currentLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current English Proficiency Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select your level" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={englishTestForm.control}
                    name="timeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timeline for Taking the Test</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select your timeline" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="1 month">Within 1 month</SelectItem>
                            <SelectItem value="3 months">Within 3 months</SelectItem>
                            <SelectItem value="6 months">Within 6 months</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={englishTestForm.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget for the Test</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select your budget" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="< $100">Less than $100</SelectItem>
                            <SelectItem value="$100 - $200">$100 - $200</SelectItem>
                            <SelectItem value="$200 - $300">$200 - $300</SelectItem>
                            <SelectItem value="> $300">More than $300</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={englishTestForm.control}
                    name="purpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purpose of the Test</FormLabel>
                        <FormControl><Textarea placeholder="e.g., University application, immigration, job requirement" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isEnglishTestLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    {isEnglishTestLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Get Recommendation
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
          {englishTestError && (
            <Alert variant="destructive" className="max-w-2xl mx-auto mt-6">
              <Info className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{englishTestError}</AlertDescription>
            </Alert>
          )}
          {englishTestResult && (
            <Card className="max-w-2xl mx-auto mt-8 shadow-xl bg-gradient-to-br from-accent/10 to-background">
              <CardHeader><CardTitle className="font-headline text-accent flex items-center"><Sparkles className="mr-2 h-6 w-6" /> Your Personalized Recommendation</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><h3 className="font-semibold text-lg text-primary">Recommended Test:</h3><p className="text-foreground/90">{englishTestResult.testRecommendation}</p></div>
                <div><h3 className="font-semibold text-lg text-primary">Reasoning:</h3><p className="text-foreground/90 whitespace-pre-line">{englishTestResult.reasoning}</p></div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="document-checklist">
          <Card className="max-w-2xl mx-auto shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="font-headline text-primary flex items-center"><ListChecks className="mr-2 h-6 w-6" />Generate Your Document Checklist</CardTitle>
              <CardDescription>Provide your details to receive a tailored document list in English and Nepali.</CardDescription>
            </CardHeader>
            <Form {...docChecklistForm}>
              <form onSubmit={docChecklistForm.handleSubmit(onDocChecklistSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={docChecklistForm.control}
                    name="educationLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Current/Recent Education Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select your education level" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="High School Diploma or Equivalent (e.g., +2, A-Levels)">High School Diploma or Equivalent (e.g., +2, A-Levels)</SelectItem>
                            <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                            <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                            <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                            <SelectItem value="Doctorate (PhD)">Doctorate (PhD)</SelectItem>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {selectableCountries.map(country => (
                              <SelectItem key={country.value} value={country.value}>{country.name}</SelectItem>
                            ))}
                             <SelectItem value="Canada">Canada</SelectItem>
                             <SelectItem value="Germany">Germany</SelectItem>
                             <SelectItem value="Japan">Japan</SelectItem>
                             <SelectItem value="Other">Other (Specify if AI allows)</SelectItem>
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
           <Alert className="max-w-2xl mx-auto mt-6 bg-secondary/50 border-secondary">
            <Info className="h-5 w-5 text-primary" />
            <AlertTitle className="font-semibold text-primary">Important Disclaimer</AlertTitle>
            <AlertDescription className="text-foreground/80">
              The checklist provided here includes commonly required documents. Additional documents may be necessary based on your specific academic profile, chosen institution, and personal circumstances. For a comprehensive and personalized document list, we highly recommend visiting our office or contacting us directly.
            </AlertDescription>
          </Alert>
          {docChecklistError && (
            <Alert variant="destructive" className="max-w-2xl mx-auto mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{docChecklistError}</AlertDescription>
            </Alert>
          )}
          {docChecklistResult && (
            <Card className="max-w-3xl mx-auto mt-8 shadow-xl bg-gradient-to-br from-accent/10 to-background">
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle className="font-headline text-accent flex items-center"><FileText className="mr-2 h-6 w-6" /> Your Document Checklist</CardTitle>
                  <CardDescription>For {docChecklistForm.getValues('educationLevel')} to {docChecklistForm.getValues('desiredCountry')}</CardDescription>
                </div>
                <Button onClick={handleDownloadPdf} variant="outline" size="sm" className="ml-auto">
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                 <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Nepali Text in PDF</AlertTitle>
                  <AlertDescription>
                    Nepali text may not render correctly in the downloaded PDF due to font limitations. The web view below should display it correctly.
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
                          <TableCell colSpan={3} className="text-center text-muted-foreground">No specific documents found for your criteria. This might be an error or a very unique case.</TableCell>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

    