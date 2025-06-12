import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EnglishTestGuidePage() {
  return (
    <div className="space-y-12">
      <SectionTitle
        title="English Test Guide"
        subtitle="Navigate the world of English proficiency tests. Find the right test for your goals and learn how to prepare."
      />

      <section className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-center mb-6 text-primary">Comparison of Popular English Tests</h2>
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-primary">Feature</TableHead>
                <TableHead className="font-semibold text-primary">IELTS</TableHead>
                <TableHead className="font-semibold text-primary">PTE Academic</TableHead>
                <TableHead className="font-semibold text-primary">TOEFL iBT</TableHead>
                <TableHead className="font-semibold text-primary">Duolingo English Test</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Structure</TableCell>
                <TableCell>Listening, Reading, Writing, Speaking (Speaking can be on a different day)</TableCell>
                <TableCell>Integrated skills (Speaking & Writing, Reading, Listening)</TableCell>
                <TableCell>Reading, Listening, Speaking, Writing</TableCell>
                <TableCell>Adaptive questions (Reading, Writing, Speaking, Listening)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Scoring</TableCell>
                <TableCell>Band Score (0-9)</TableCell>
                <TableCell>Score (10-90)</TableCell>
                <TableCell>Score (0-120)</TableCell>
                <TableCell>Score (10-160)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Recognition</TableCell>
                <TableCell>Widely accepted globally</TableCell>
                <TableCell>Increasingly accepted globally, especially in Australia & UK</TableCell>
                <TableCell>Widely accepted globally, especially in the US</TableCell>
                <TableCell>Accepted by a growing number of institutions</TableCell>
              </TableRow>
              {/* Add more rows for format, duration, cost, etc. */}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="container mx-auto space-y-8">
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-center mb-6 text-primary">Detailed Test Structures</h2>

        <Card>
          <CardHeader><CardTitle className="text-xl font-semibold">IELTS (International English Language Testing System)</CardTitle></CardHeader>
          <CardContent>
            <p>Structure: Listening (30 mins), Reading (60 mins), Writing (60 mins), Speaking (11-14 mins). Total: Approx. 2 hours 45 mins.</p>
            <p className="mt-2">Details: Two versions (Academic and General Training). Different reading and writing tasks for each.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-xl font-semibold">PTE Academic (Pearson Test of English Academic)</CardTitle></CardHeader>
          <CardContent>
            <p>Structure: Speaking & Writing (54-67 mins), Reading (29-36 mins), Listening (30-43 mins). Total: Approx. 2 hours.</p>
            <p className="mt-2">Details: Computer-based test. Integrated tasks testing multiple skills simultaneously.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-xl font-semibold">TOEFL iBT (Test of English as a Foreign Language Internet-Based Test)</CardTitle></CardHeader>
          <CardContent>
            <p>Structure: Reading (35 mins), Listening (36 mins), Speaking (16 mins), Writing (29 mins). Total: Approx. 2 hours.</p>
            <p className="mt-2">Details: Focus on integrated skills. Academic context.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-xl font-semibold">Duolingo English Test</CardTitle></CardHeader>
          <CardContent>
            <p>Structure: Adaptive section (reading, writing, speaking, listening) and Video Interview + Writing Sample. Total: Approx. 1 hour.</p>
            <p className="mt-2">Details: Online, on-demand test. Relatively lower cost and faster results.</p>
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-center mb-6 text-primary">Minimum Score Requirements by Country/Institution</h2>
        <Card>
          <CardContent className="py-6">
            <p className="text-center text-foreground/80">
              Minimum score requirements vary significantly based on the country, institution, and program you are applying to.
              Always check the specific requirements of your target universities or immigration authorities.
              <br />
              (Detailed data tables or a search feature can be added here in the future)
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-center text-primary">Official Test Websites</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild variant="outline">
            <a href="https://www.ielts.org/" target="_blank" rel="noopener noreferrer">IELTS Official Site</a>
          </Button>
          <Button asChild variant="outline">
            <a href="https://www.pearsonpte.com/" target="_blank" rel="noopener noreferrer">PTE Official Site</a>
          </Button>
          <Button asChild variant="outline">
            <a href="https://www.toefl.org/" target="_blank" rel="noopener noreferrer">TOEFL Official Site</a>
          </Button>
          <Button asChild variant="outline">
            <a href="https://englishtest.duolingo.com/" target="_blank" rel="noopener noreferrer">Duolingo Official Site</a>
          </Button>
        </div>
      </section>

      <section className="container mx-auto text-center">
         <h2 className="text-2xl md:text-3xl font-headline font-bold text-center mb-6 text-primary">Ready to Prepare?</h2>
         <Link href="/contact">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">Join Our English Preparation Class Today!</Button>
         </Link>
      </section>
    </div>
  );
}
'use client';

import { useState, type FormEvent } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import SectionTitle from '@/components/ui/section-title';
import { englishTestAdvisor, type EnglishTestAdvisorInput, type EnglishTestAdvisorOutput } from '@/ai/flows/english-test-advisor';
import { Loader2, Sparkles, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  currentLevel: z.string().min(1, "Please select your current English level."),
  timeline: z.string().min(1, "Please select your timeline."),
  budget: z.string().min(1, "Please select your budget."),
  purpose: z.string().min(1, "Please state the purpose for the test.").max(200, "Purpose too long"),
});

type EnglishTestAdvisorFormValues = z.infer<typeof formSchema>;

export default function EnglishTestAdvisorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EnglishTestAdvisorOutput | null>(null);

  const form = useForm<EnglishTestAdvisorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentLevel: '',
      timeline: '',
      budget: '',
      purpose: '',
    },
  });

  async function onSubmit(values: EnglishTestAdvisorFormValues) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const aiInput: EnglishTestAdvisorInput = {
        currentLevel: values.currentLevel,
        timeline: values.timeline,
        budget: values.budget,
        purpose: values.purpose,
      };
      const aiResult = await englishTestAdvisor(aiInput);
      setResult(aiResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-12">
      <SectionTitle
        title="Smart English Test Advisor"
        subtitle="Answer a few questions to get a personalized recommendation for the most suitable English proficiency test (IELTS, PTE, TOEFL, Duolingo, etc.) for your needs."
      />

      <Card className="max-w-2xl mx-auto shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-primary">Find Your Ideal English Test</CardTitle>
          <CardDescription>Fill in your details below for a tailored recommendation.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="currentLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current English Proficiency Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select your level" /></SelectTrigger>
                      </FormControl>
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
                control={form.control}
                name="timeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeline for Taking the Test</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select your timeline" /></SelectTrigger>
                      </FormControl>
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
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget for the Test</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select your budget" /></SelectTrigger>
                      </FormControl>
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
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose of the Test</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., University application, immigration, job requirement" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Get Recommendation
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {error && (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <Info className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card className="max-w-2xl mx-auto mt-8 shadow-xl bg-gradient-to-br from-accent/10 to-background">
          <CardHeader>
            <CardTitle className="font-headline text-accent flex items-center">
              <Sparkles className="mr-2 h-6 w-6" /> Your Personalized Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-primary">Recommended Test:</h3>
              <p className="text-foreground/90">{result.testRecommendation}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary">Reasoning:</h3>
              <p className="text-foreground/90 whitespace-pre-line">{result.reasoning}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
