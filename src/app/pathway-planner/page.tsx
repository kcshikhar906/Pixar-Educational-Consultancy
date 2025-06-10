
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SectionTitle from '@/components/ui/section-title';
import { generateDocumentChecklist, type DocumentChecklistInput, type DocumentChecklistOutput } from '@/ai/flows/document-checklist-flow';
import { Loader2, Sparkles, FileText, Download, Info, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const formSchema = z.object({
  educationLevel: z.string().min(1, "Please select your education level."),
  desiredCountry: z.string().min(1, "Please select your desired country."),
});

type DocumentChecklistFormValues = z.infer<typeof formSchema>;

const selectableCountries = [
  { name: 'USA', value: 'USA' },
  { name: 'UK', value: 'UK' },
  { name: 'Australia', value: 'Australia' },
  { name: 'New Zealand', value: 'New Zealand' },
  { name: 'Europe', value: 'Europe' },
];

export default function DocumentChecklistPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DocumentChecklistOutput | null>(null);

  const form = useForm<DocumentChecklistFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      educationLevel: '',
      desiredCountry: '',
    },
  });

  async function onSubmit(values: DocumentChecklistFormValues) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const aiInput: DocumentChecklistInput = {
        educationLevel: values.educationLevel,
        desiredCountry: values.desiredCountry,
      };
      const aiResult = await generateDocumentChecklist(aiInput);
      setResult(aiResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unexpected error occurred while generating the checklist.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDownloadPdf = () => {
    if (!result || !result.checklist) return;

    const doc = new jsPDF();
    const tableStartY = 20;
    let currentY = tableStartY;

    doc.setFontSize(18);
    doc.text("Document Checklist", 105, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Education Level: ${form.getValues('educationLevel')}`, 14, currentY);
    currentY += 6;
    doc.text(`Desired Country: ${form.getValues('desiredCountry')}`, 14, currentY);
    currentY += 10;
    
    doc.setFontSize(12);
    doc.text("Document Checklist:", 14, currentY);
    currentY += 7;

    result.checklist.forEach((item, index) => {
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
    
    if (result.notes) {
      if (currentY > 250) { 
        doc.addPage();
        currentY = 15;
      }
      doc.setFontSize(12);
      doc.text("Important Notes & Advice:", 14, currentY);
      currentY += 7;
      doc.setFontSize(10);
      const splitNotes = doc.splitTextToSize(result.notes, 180);
      doc.text(splitNotes, 14, currentY);
    }

    doc.save('document_checklist.pdf');
  };


  return (
    <div className="space-y-12">
      <SectionTitle
        title="Document Checklist Generator"
        subtitle="Get a personalized list of documents required for your study abroad application and visa, in English and Nepali."
      />

      <Card className="max-w-2xl mx-auto shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-primary flex items-center"><FileText className="mr-2 h-6 w-6" />Generate Your Checklist</CardTitle>
          <CardDescription>Provide your details to receive a tailored document list.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="educationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Current/Recent Education Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select your education level" /></SelectTrigger>
                      </FormControl>
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
                control={form.control}
                name="desiredCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Country for Study</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger>
                      </FormControl>
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
              <Button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Checklist
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

       <Alert className="max-w-2xl mx-auto bg-secondary/50 border-secondary">
        <Info className="h-5 w-5 text-primary" />
        <AlertTitle className="font-semibold text-primary">Important Disclaimer</AlertTitle>
        <AlertDescription className="text-foreground/80">
          The checklist provided here includes commonly required documents. Additional documents may be necessary based on your specific academic profile, chosen institution, and personal circumstances. For a comprehensive and personalized document list, we highly recommend visiting our office or contacting us directly.
        </AlertDescription>
      </Alert>

      {error && (
         <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card className="max-w-3xl mx-auto mt-8 shadow-xl bg-gradient-to-br from-accent/10 to-background">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle className="font-headline text-accent flex items-center">
                <FileText className="mr-2 h-6 w-6" /> Your Document Checklist
              </CardTitle>
              <CardDescription>For {form.getValues('educationLevel')} to {form.getValues('desiredCountry')}</CardDescription>
            </div>
            <Button onClick={handleDownloadPdf} variant="outline" size="sm" className="ml-auto">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
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
                  {result.checklist && result.checklist.length > 0 ? (
                    result.checklist.map((item, index) => (
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
            {result.notes && (
                <div className="mt-6 p-4 border-t border-border">
                    <h4 className="font-semibold text-lg text-primary mb-2">Important Notes & Advice:</h4>
                    <p className="text-foreground/90 whitespace-pre-line text-sm">{result.notes}</p>
                </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
