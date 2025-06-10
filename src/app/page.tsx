
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SectionTitle from '@/components/ui/section-title';
import { ArrowRight, CheckCircle, Star, Loader2, Sparkles, MapPin, BookOpen, University as UniversityIcon, Info, Search, ExternalLink, Wand2 } from 'lucide-react';
import { testimonials, services, fieldsOfStudy } from '@/lib/data';
import type { Testimonial, Service } from '@/lib/data';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { pathwayPlanner, type PathwayPlannerInput, type PathwayPlannerOutput } from '@/ai/flows/pathway-planner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from '@/lib/utils';

const pathwayFormSchema = z.object({
  country: z.string().min(1, "Please select a country."),
  fieldOfStudy: z.string().min(1, "Please select a field of study."),
});

type PathwayFormValues = z.infer<typeof pathwayFormSchema>;

const taglines = [
  "Unlock Your Global Education Journey",
  "Your Bridge to World-Class Universities",
];

const FADE_DURATION_MS = 300;
const DISPLAY_DURATION_MS = 2500;

const selectableCountriesHomepage = [
  { name: 'USA', value: 'USA' },
  { name: 'UK', value: 'UK' },
  { name: 'Australia', value: 'Australia' },
  { name: 'New Zealand', value: 'New Zealand' },
  { name: 'Europe', value: 'Europe' },
];

export default function HomePage() {
  const [isLoadingPathway, setIsLoadingPathway] = useState(false);
  const [pathwayError, setPathwayError] = useState<string | null>(null);
  const [pathwayResult, setPathwayResult] = useState<PathwayPlannerOutput | null>(null);
  const [heroAnimated, setHeroAnimated] = useState(false);

  const [currentTaglineText, setCurrentTaglineText] = useState(taglines[0]);
  const [isTaglineVisible, setIsTaglineVisible] = useState(false);

  const [showResultsArea, setShowResultsArea] = useState(false);
  const [resultsContainerAnimatedIn, setResultsContainerAnimatedIn] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => setHeroAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!heroAnimated) {
      setIsTaglineVisible(false);
      return;
    }

    setIsTaglineVisible(true);
    let currentIdx = 0;

    const cycleTime = DISPLAY_DURATION_MS + FADE_DURATION_MS;

    const intervalId = setInterval(() => {
      setIsTaglineVisible(false);

      setTimeout(() => {
        currentIdx = (currentIdx + 1) % taglines.length;
        setCurrentTaglineText(taglines[currentIdx]);
        setIsTaglineVisible(true);
      }, FADE_DURATION_MS);
    }, cycleTime);

    return () => {
      clearInterval(intervalId);
    };
  }, [heroAnimated]);


  const pathwayForm = useForm<PathwayFormValues>({
    resolver: zodResolver(pathwayFormSchema),
    defaultValues: {
      country: '',
      fieldOfStudy: '',
    },
  });

  async function onPathwaySubmit(values: PathwayFormValues) {
    setPathwayResult(null);
    setPathwayError(null);
    setIsLoadingPathway(true);

    if (!showResultsArea) {
        setShowResultsArea(true);
        requestAnimationFrame(() => {
            setResultsContainerAnimatedIn(true);
        });
    }
    
    try {
      const aiInput: PathwayPlannerInput = {
        country: values.country,
        fieldOfStudy: values.fieldOfStudy,
      };
      const aiResult = await pathwayPlanner(aiInput);
      setPathwayResult(aiResult);
    } catch (e) {
      setPathwayError(e instanceof Error ? e.message : 'An unexpected error occurred.');
      console.error(e);
    } finally {
      setIsLoadingPathway(false);
    }
  }
  

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary to-accent/80 rounded-lg shadow-xl overflow-hidden">
        <div className="absolute inset-0 opacity-10">
            {/* Placeholder for a subtle background pattern if desired e.g. <SvgHeroPattern /> */}
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div
            className={`text-5xl md:text-7xl font-headline font-bold text-primary-foreground mb-4 transition-all ease-out duration-700 ${
              heroAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Pixar Education
          </div>
          <h1
            className={cn(
              "text-4xl md:text-5xl font-headline font-bold text-primary-foreground mb-6",
              "transition-transform ease-out duration-700 delay-100",
              heroAnimated ? "translate-y-0" : "translate-y-10 opacity-0",
              "transition-opacity ease-in-out"
            )}
            style={{ transitionDuration: `${FADE_DURATION_MS}ms`, opacity: isTaglineVisible && heroAnimated ? 1 : 0 }}
          >
            {currentTaglineText}
          </h1>
          <p
            className={`text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-10 transition-all ease-out duration-700 delay-200 ${
              heroAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Your trusted partner for international studies, specializing in guiding Nepali students to U.S. success. 🇺🇸 Start your adventure today!
          </p>
          <div
             className={`space-x-4 transition-all ease-out duration-700 delay-300 ${
              heroAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <Button size="lg" asChild className="bg-background text-primary hover:bg-background/90 shadow-lg">
              <Link href="/services">Explore Services <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 shadow-lg bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/ai-assistants">Use our AI Assistants <Wand2 className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pathway Quick Search Section */}
      <section>
        <SectionTitle title="Pathway Quick Search" subtitle="Find universities matching your interests instantly." />
        <div className={cn(
            "grid grid-cols-1 gap-8 items-start",
            showResultsArea && "md:grid-cols-3" 
        )}>
          <div className={cn( // Form container
            "w-full", 
            showResultsArea ? "md:col-span-1" : "" 
           )}>
            <Form {...pathwayForm}>
              {!showResultsArea ? (
                // Initial Single-Row Form Layout
                <form
                  onSubmit={pathwayForm.handleSubmit(onPathwaySubmit)}
                  className="flex flex-col md:flex-row md:items-end gap-4 p-6 bg-card rounded-lg shadow-xl w-full"
                >
                  <FormField
                    control={pathwayForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-[200px] md:min-w-[250px]">
                        <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-accent"/>Country</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {selectableCountriesHomepage.map(country => (
                              <SelectItem key={country.value} value={country.value}>{country.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={pathwayForm.control}
                    name="fieldOfStudy"
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-[200px] md:min-w-[250px]">
                        <FormLabel className="flex items-center"><BookOpen className="mr-2 h-4 w-4 text-accent"/>Field of Study</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select a field" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {fieldsOfStudy.map(fos => (
                              <SelectItem key={fos} value={fos}>{fos}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoadingPathway} className="h-10 w-full md:w-auto mt-4 md:mt-0">
                    {isLoadingPathway ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Get Suggestions
                  </Button>
                </form>
              ) : (
                // Standard Card Form Layout (when results are shown)
                <Card className="shadow-xl bg-card flex flex-col flex-grow w-full">
                  <CardHeader>
                    <CardTitle className="font-headline text-primary flex items-center"><Search className="mr-2 h-6 w-6"/>Find Your University</CardTitle>
                    <CardDescription>Select a country and field of study.</CardDescription>
                  </CardHeader>
                  <form onSubmit={pathwayForm.handleSubmit(onPathwaySubmit)} className="flex flex-col flex-grow">
                    <CardContent className="space-y-6 flex-grow">
                      <FormField
                        control={pathwayForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-accent"/>Country</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {selectableCountriesHomepage.map(country => (
                                  <SelectItem key={country.value} value={country.value}>{country.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={pathwayForm.control}
                        name="fieldOfStudy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center"><BookOpen className="mr-2 h-4 w-4 text-accent"/>Field of Study</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select a field" /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {fieldsOfStudy.map(fos => (
                                  <SelectItem key={fos} value={fos}>{fos}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isLoadingPathway} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        {isLoadingPathway ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Get Suggestions
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              )}
            </Form>
          </div>

          {showResultsArea && (
            <div className={cn(
                "md:col-span-2 flex flex-col",
                "transition-all duration-700 ease-out",
                resultsContainerAnimatedIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
            )}>
                {isLoadingPathway && (
                <Card className="shadow-xl bg-card flex flex-col items-center justify-center flex-grow min-h-[200px] p-6">
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <p className="text-muted-foreground mt-2">Finding universities...</p>
                </Card>
                )}
                {pathwayError && !isLoadingPathway && (
                <Alert variant="destructive" className="bg-card">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{pathwayError}</AlertDescription>
                </Alert>
                )}
                {pathwayResult && !isLoadingPathway && (
                <Card className="shadow-xl bg-card flex flex-col flex-grow">
                    <CardHeader>
                    <CardTitle className="font-headline text-accent flex items-center">
                        <Sparkles className="mr-2 h-6 w-6" /> University Suggestions
                    </CardTitle>
                    <CardDescription>
                        Based on your selection of {pathwayForm.getValues('country')} and {pathwayForm.getValues('fieldOfStudy')}.
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-y-auto space-y-4 max-h-96 md:max-h-[450px] p-6">
                    {pathwayResult.universitySuggestions && pathwayResult.universitySuggestions.length > 0 ? (
                        <ul className="space-y-4">
                        {pathwayResult.universitySuggestions.map((uni, index) => (
                            <li key={index} className="p-4 border rounded-lg bg-background/50 hover:shadow-md transition-shadow">
                            <h4 className="font-semibold text-primary flex items-center mb-1">
                                <UniversityIcon className="mr-2 h-5 w-5 text-accent" />
                                {uni.website ? (
                                <a href={uni.website} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center">
                                    {uni.name} <ExternalLink className="ml-1.5 h-4 w-4 text-muted-foreground" />
                                </a>
                                ) : (
                                uni.name
                                )}
                            </h4>
                            <p className="text-sm text-foreground/80 ml-7">Category: {uni.category}</p>
                            </li>
                        ))}
                        </ul>
                    ) : (
                        <p className="text-foreground/70 text-center py-8">No specific university suggestions found for your criteria. Try broadening your search or contact us for personalized advice!</p>
                    )}
                    </CardContent>
                </Card>
                )}
                {!isLoadingPathway && !pathwayError && !pathwayResult && (
                    <Card className="shadow-xl bg-card flex flex-col items-center justify-center flex-grow min-h-[200px]">
                        <CardContent className="text-center p-6">
                            <Search className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">Your university suggestions will appear here.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
          )}
        </div>
      </section>


      {/* Why Choose Us Section */}
      <section>
        <SectionTitle title="Why Choose Pixar Edu?" subtitle="Your success is our priority. We offer unparalleled support and expertise." />
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Expert Guidance", description: "Experienced counselors providing personalized advice.", icon: <CheckCircle className="h-10 w-10 text-accent mb-4" /> },
            { title: "Global Network", description: "Access to a wide range of universities and programs.", icon: <CheckCircle className="h-10 w-10 text-accent mb-4" /> },
            { title: "Proven Success", description: "High success rates in admissions and visa applications.", icon: <CheckCircle className="h-10 w-10 text-accent mb-4" /> },
          ].map(item => (
            <Card key={item.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
              <CardContent className="p-6 pt-8">
                {item.icon}
                <h3 className="text-xl font-headline font-semibold text-primary mb-2">{item.title}</h3>
                <p className="text-foreground/80">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Services Overview Section */}
      <section>
        <SectionTitle title="Our Core Services" subtitle="Comprehensive support to navigate your educational path." />
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {services.slice(0,3).map((service: Service) => (
            <Card key={service.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
              {service.imageUrl && (
                <div className="relative h-48 w-full">
                  <Image src={service.imageUrl} alt={service.title} layout="fill" objectFit="cover" data-ai-hint={service.dataAiHint || 'education service'} />
                </div>
              )}
              <CardHeader>
                <CardTitle className="font-headline text-primary flex items-center"><service.icon className="mr-2 h-6 w-6 text-accent" />{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">{service.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="link" className="text-accent p-0">
                  <Link href={`/services#${service.id}`}>Learn More <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center mt-10">
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/services">View All Services</Link>
            </Button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-secondary/50 py-16 rounded-lg shadow-inner">
        <SectionTitle title="Success Stories" subtitle="Hear from students who achieved their dreams with us." />
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial: Testimonial) => (
            <Card key={testimonial.id} className="bg-card shadow-lg">
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                {testimonial.avatarUrl && <Image src={testimonial.avatarUrl} alt={testimonial.name} width={60} height={60} className="rounded-full" data-ai-hint="person student" />}
                <div>
                  <CardTitle className="font-headline text-primary">{testimonial.name}</CardTitle>
                  <p className="text-sm text-accent">{testimonial.studyDestination}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-foreground/80 italic">&quot;{testimonial.text}&quot;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
