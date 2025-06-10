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
import SectionTitle from '@/components/ui/section-title';
import { pathwayPlanner, type PathwayPlannerInput, type PathwayPlannerOutput } from '@/ai/flows/pathway-planner';
import { Loader2, Sparkles, Map, University, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  educationLevel: z.string().min(1, "Please select your education level."),
  fieldOfStudy: z.string().min(2, "Field of study must be at least 2 characters.").max(100, "Field of study is too long."),
});

type PathwayPlannerFormValues = z.infer<typeof formSchema>;

export default function PathwayPlannerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PathwayPlannerOutput | null>(null);

  const form = useForm<PathwayPlannerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      educationLevel: '',
      fieldOfStudy: '',
    },
  });

  async function onSubmit(values: PathwayPlannerFormValues) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const aiInput: PathwayPlannerInput = {
        educationLevel: values.educationLevel,
        fieldOfStudy: values.fieldOfStudy,
      };
      const aiResult = await pathwayPlanner(aiInput);
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
        title="Intelligent Pathway Planner"
        subtitle="Discover the ideal countries and universities that align with your current education level and desired field of study. Let our AI guide your academic future."
      />

      <Card className="max-w-2xl mx-auto shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-primary">Plan Your Educational Pathway</CardTitle>
          <CardDescription>Provide your details to receive personalized suggestions.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="educationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Education Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select your education level" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high school">High School Diploma</SelectItem>
                        <SelectItem value="associate degree">Associate Degree</SelectItem>
                        <SelectItem value="bachelor degree">Bachelor's Degree</SelectItem>
                        <SelectItem value="master degree">Master's Degree</SelectItem>
                        <SelectItem value="doctorate">Doctorate (PhD)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fieldOfStudy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Field of Study</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Computer Science, Engineering, Arts" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Suggest Pathway
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
              <Sparkles className="mr-2 h-6 w-6" /> Your Suggested Pathway
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg text-primary flex items-center mb-2">
                <Map className="mr-2 h-5 w-5" /> Suggested Countries:
              </h3>
              {result.countrySuggestions && result.countrySuggestions.length > 0 ? (
                <ul className="list-disc list-inside text-foreground/90 space-y-1">
                  {result.countrySuggestions.map((country, index) => (
                    <li key={`country-${index}`}>{country}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-foreground/70">No specific country suggestions at this time. Consider broadening your criteria.</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary flex items-center mb-2">
                <University className="mr-2 h-5 w-5" /> Suggested Universities:
              </h3>
              {result.universitySuggestions && result.universitySuggestions.length > 0 ? (
                <ul className="list-disc list-inside text-foreground/90 space-y-1">
                  {result.universitySuggestions.map((uni, index) => (
                    <li key={`uni-${index}`}>{uni}</li>
                  ))}
                </ul>
              ) : (
                 <p className="text-foreground/70">No specific university suggestions based on your input. You might want to explore options more broadly or consult with an advisor.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
