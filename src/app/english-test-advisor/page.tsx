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
