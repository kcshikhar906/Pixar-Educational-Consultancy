
'use client';

import { useState, useEffect } from 'react'; // Added useEffect for potential future use
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { englishTestAdvisor, type EnglishTestAdvisorInput, type EnglishTestAdvisorOutput } from '@/ai/flows/english-test-advisor';
import { generateDocumentChecklist, type DocumentChecklistInput, type DocumentChecklistOutput } from '@/ai/flows/document-checklist-flow';

import { Loader2, Sparkles, Info, FileText, Download, AlertCircle, BookOpenText, ListChecks, MessageSquare, HelpCircle, CheckCircle as CheckCircleIcon } from 'lucide-react';

// Schemas for English Test Advisor
const englishTestFormSchema = z.object({
  currentLevel: z.string().min(1, "Please select your current English level."),
  timeline: z.string().min(1, "Please select your timeline."),
  budget: z.string().min(1, "Please select your budget in NPR."),
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

const testComparisonData = [
  { name: "IELTS Academic", cost: "~$250 USD / ~रु ३३,०००", typicalDuration: "2h 45m", acceptance: "Very High (Academia, Immigration globally)", format: "Paper or Computer", resultTime: "3-13 days", keyFeatures: ["Face-to-face speaking test option", "Widely available test centers"] },
  { name: "TOEFL iBT", cost: "~$245 USD / ~रु ३२,५००", typicalDuration: "~3 hours", acceptance: "Very High (Especially US Academia)", format: "Computer-based", resultTime: "4-8 days", keyFeatures: ["Strong academic focus", "Integrated tasks simulating university environment"] },
  { name: "PTE Academic", cost: "~$220 USD / ~रु २९,०००", typicalDuration: "2 hours", acceptance: "High (Academia, Immigration in Australia, NZ, UK)", format: "Computer-based, AI scored", resultTime: "Typically 2-5 days", keyFeatures: ["Fast results", "Fully computer-scored including speaking"] },
  { name: "Duolingo English Test", cost: "~$59 USD / ~रु ७,८००", typicalDuration: "~1 hour (including setup)", acceptance: "Growing (Many US universities, some others)", format: "Computer-adaptive, at-home", resultTime: "Within 2 days", keyFeatures: ["Affordable and accessible", "Can be taken online anytime"] }
];


export default function AiAssistantsPage() {
  // State for English Test Advisor
  const [isEnglishTestLoading, setIsEnglishTestLoading] = useState(false);
  const [englishTestError, setEnglishTestError] = useState<string | null>(null);
  const [englishTestResult, setEnglishTestResult] = useState<EnglishTestAdvisorOutput | null>(null);
  const [showEnglishTestResultsArea, setShowEnglishTestResultsArea] = useState(false);
  const [englishTestResultsAnimatedIn, setEnglishTestResultsAnimatedIn] = useState(false);

  // State for Document Checklist
  const [isDocChecklistLoading, setIsDocChecklistLoading] = useState(false);
  const [docChecklistError, setDocChecklistError] = useState<string | null>(null);
  const [docChecklistResult, setDocChecklistResult] = useState<DocumentChecklistOutput | null>(null);
  const [showDocChecklistResultsArea, setShowDocChecklistResultsArea] = useState(false);
  const [docChecklistResultsAnimatedIn, setDocChecklistResultsAnimatedIn] = useState(false);


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
    setEnglishTestResult(null);
    setEnglishTestError(null);

    if (!showEnglishTestResultsArea) {
      setShowEnglishTestResultsArea(true);
      requestAnimationFrame(() => {
          setEnglishTestResultsAnimatedIn(true);
      });
    }
    setIsEnglishTestLoading(true);
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
    setDocChecklistResult(null);
    setDocChecklistError(null);

    if (!showDocChecklistResultsArea) {
        setShowDocChecklistResultsArea(true);
        requestAnimationFrame(() => {
            setDocChecklistResultsAnimatedIn(true);
        });
    }
    setIsDocChecklistLoading(true);
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
          <div className={cn(
              "w-full",
              showEnglishTestResultsArea ? "grid grid-cols-1 md:grid-cols-2 gap-8 items-start" : "flex flex-col items-center"
          )}>
            <Card className={cn(
                "shadow-xl bg-card w-full",
                showEnglishTestResultsArea ? "md:col-span-1" : "max-w-2xl"
            )}>
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
                          <FormLabel>Budget for the Test (NPR)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select your budget (रु)" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="< NPR 15000">Less than रु १५,०००</SelectItem>
                              <SelectItem value="NPR 15000 - NPR 30000">रु १५,००० - रु ३०,०००</SelectItem>
                              <SelectItem value="NPR 30000 - NPR 45000">रु ३०,००० - रु ४५,०००</SelectItem>
                              <SelectItem value="> NPR 45000">More than रु ४५,०००</SelectItem>
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
            
            {showEnglishTestResultsArea && (
              <div className={cn(
                  "w-full md:col-span-1 space-y-6",
                  "transition-all duration-700 ease-out",
                  englishTestResultsAnimatedIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
              )}>
                {isEnglishTestLoading && (
                  <Card className="shadow-xl bg-card">
                    <CardContent className="p-10 text-center">
                      <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
                      <p className="text-muted-foreground">Generating your recommendation...</p>
                    </CardContent>
                  </Card>
                )}
                {englishTestError && !isEnglishTestLoading && (
                  <Alert variant="destructive">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{englishTestError}</AlertDescription>
                  </Alert>
                )}
                {englishTestResult && !isEnglishTestLoading && (
                  <div className="space-y-6">
                    <Card className="shadow-xl bg-gradient-to-br from-accent/10 to-background">
                      <CardHeader>
                        <CardTitle className="font-headline text-accent flex items-center"><Sparkles className="mr-2 h-6 w-6" /> Your Personalized Recommendation</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg text-primary">Recommended Test:</h3>
                          <p className="text-foreground/90 text-xl font-medium">{englishTestResult.testRecommendation}</p>
                        </div>
                        {englishTestResult.badges && englishTestResult.badges.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {englishTestResult.badges.map((badge, index) => (
                              <Badge key={index} variant="secondary" className="text-sm">
                                <CheckCircleIcon className="mr-1.5 h-4 w-4 text-green-500" />
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-lg text-primary">Reasoning:</h3>
                          <p className="text-foreground/90 whitespace-pre-line">{englishTestResult.reasoning}</p>
                        </div>
                        <div className="pt-4 text-center">
                            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                                <Link href="/contact">
                                    <MessageSquare className="mr-2 h-5 w-5" /> Want help preparing or booking your test? Talk to our experts!
                                </Link>
                            </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-xl bg-card">
                      <CardHeader>
                          <CardTitle className="font-headline text-primary flex items-center"><HelpCircle className="mr-2 h-6 w-6" /> Compare Test Types</CardTitle>
                          <CardDescription>General comparison of popular English proficiency tests.</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <div className="overflow-x-auto">
                              <Table>
                                  <TableHeader>
                                      <TableRow>
                                          <TableHead>Test Name</TableHead>
                                          <TableHead>Typical Cost</TableHead>
                                          <TableHead>Duration</TableHead>
                                          <TableHead>Acceptance</TableHead>
                                          <TableHead>Format</TableHead>
                                          <TableHead>Result Time</TableHead>
                                          <TableHead>Key Features</TableHead>
                                      </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                      {testComparisonData.map((test) => (
                                          <TableRow key={test.name}>
                                              <TableCell className="font-medium">{test.name}</TableCell>
                                              <TableCell>{test.cost}</TableCell>
                                              <TableCell>{test.typicalDuration}</TableCell>
                                              <TableCell>{test.acceptance}</TableCell>
                                              <TableCell>{test.format}</TableCell>
                                              <TableCell>{test.resultTime}</TableCell>
                                              <TableCell className="text-xs">{test.keyFeatures.join(', ')}</TableCell>
                                          </TableRow>
                                      ))}
                                  </TableBody>
                              </Table>
                          </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>

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
                    The checklist provided here includes commonly required documents. Additional documents may be necessary based on your specific academic profile, chosen institution, and personal circumstances. For a comprehensive and personalized document list, we highly recommend visiting our office or contacting us directly.
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
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    

    