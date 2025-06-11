
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SectionTitle from '@/components/ui/section-title';
import { ArrowRight, CheckCircle, Star, Loader2, Sparkles, MapPin, BookOpen, University as UniversityIconLucide, Info, Search, ExternalLink, Wand2, Briefcase, DollarSign, Award as AwardIconLucideComp, ClipboardCheck } from 'lucide-react';
import { testimonials, services, fieldsOfStudy, gpaScaleOptions, educationLevelOptions, AwardIcon, UniversityIcon } from '@/lib/data';
import type { Testimonial, Service } from '@/lib/data';
import { useState, useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { pathwayPlanner, type PathwayPlannerInput, type PathwayPlannerOutput } from '@/ai/flows/pathway-planner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';


const pathwayFormSchema = z.object({
  country: z.string().min(1, "Please select a country."),
  fieldOfStudy: z.string().min(1, "Please select a field of study."),
  gpa: z.string().min(1, "Please select your GPA."),
  targetEducationLevel: z.string().min(1, "Please select your target education level."),
});

type PathwayFormValues = z.infer<typeof pathwayFormSchema>;
type UniversitySuggestion = Exclude<PathwayPlannerOutput['universitySuggestions'], undefined>[number];


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

  const [heroSectionRef, isHeroSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.05, initialVisible: true });
  const [pathwaySearchSectionRef, isPathwaySearchSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.1 });
  const [whyChooseUsSectionRef, isWhyChooseUsSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.1 });
  const [servicesOverviewSectionRef, isServicesOverviewSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.1 });
  const [testimonialsSectionRef, isTestimonialsSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.1 });


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
    return () => clearInterval(intervalId);
  }, [heroAnimated]);


  const pathwayForm = useForm<PathwayFormValues>({
    resolver: zodResolver(pathwayFormSchema),
    defaultValues: {
      country: '',
      fieldOfStudy: '',
      gpa: '',
      targetEducationLevel: '',
    },
  });

  async function onPathwaySubmit(values: PathwayFormValues) {
    setPathwayResult(null);
    setPathwayError(null);
    
    if (!showResultsArea) {
        setShowResultsArea(true);
        requestAnimationFrame(() => {
            setResultsContainerAnimatedIn(true);
        });
    }
    setIsLoadingPathway(true);
    
    try {
      const aiInput: PathwayPlannerInput = {
        country: values.country,
        fieldOfStudy: values.fieldOfStudy,
        gpa: values.gpa,
        targetEducationLevel: values.targetEducationLevel,
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

  const universitySuggestions = useMemo(() => {
    if (!pathwayResult?.universitySuggestions) return [];
    return pathwayResult.universitySuggestions;
  }, [pathwayResult]);
  
  const renderPathwayForm = () => (
     <Card className={cn(
        "shadow-xl bg-card w-full",
         !showResultsArea ? "" : ""
     )}>
      <CardHeader>
        <CardTitle className="font-headline text-primary flex items-center">
          <Search className="mr-2 h-6 w-6"/> Plan Your Study Pathway
        </CardTitle>
        <CardDescription>
          Tell us your preferences to discover suitable university options.
        </CardDescription>
      </CardHeader>
      <Form {...pathwayForm}>
        <form onSubmit={pathwayForm.handleSubmit(onPathwaySubmit)}>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <FormField
              control={pathwayForm.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-accent"/>Country</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
                <FormItem>
                  <FormLabel className="flex items-center"><BookOpen className="mr-2 h-4 w-4 text-accent"/>Field of Study</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
            <FormField
              control={pathwayForm.control}
              name="gpa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><AwardIcon className="mr-2 h-4 w-4 text-accent"/>GPA / Academic Standing</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select GPA" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {gpaScaleOptions.map(gpa => (
                        <SelectItem key={gpa.value} value={gpa.value}>{gpa.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={pathwayForm.control}
              name="targetEducationLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><UniversityIcon className="mr-2 h-4 w-4 text-accent"/>Target Education Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select target level" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {educationLevelOptions.map(level => (
                        <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
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
              {showResultsArea ? "Update Suggestions" : "Get Suggestions"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section
        ref={heroSectionRef}
        className={cn(
          "relative py-20 md:py-32 rounded-lg shadow-xl overflow-hidden transition-all duration-700 ease-out",
          isHeroSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
          "bg-cover bg-center"
        )}
        style={{ backgroundImage: 'url("/main.jpg")' }}
      >
        <div className="absolute inset-0 bg-black opacity-70"></div>
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
      <section
        ref={pathwaySearchSectionRef}
        className={cn(
          "transition-all duration-700 ease-out",
          isPathwaySearchSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <SectionTitle title="Pathway Quick Search" subtitle="Find universities matching your interests instantly." />
        <div className={cn(
            "grid items-start gap-8",
            showResultsArea ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1"
        )}>
          <div className={cn(
            "w-full", 
            showResultsArea ? "md:col-span-1" : (!showResultsArea ? "" : "")
           )}>
            {renderPathwayForm()}
          </div>

          {showResultsArea && (
            <div className={cn(
                "md:col-span-2 flex flex-col min-h-[300px]", 
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
                        For {pathwayForm.getValues('country')} - {pathwayForm.getValues('fieldOfStudy')} (GPA: {pathwayForm.getValues('gpa')}, Level: {pathwayForm.getValues('targetEducationLevel')}).
                        {pathwayResult.searchSummary && <span className="block mt-1 text-xs italic">{pathwayResult.searchSummary}</span>}
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-y-auto space-y-4 max-h-96 md:max-h-[450px] p-6">
                    {universitySuggestions.length > 0 ? (
                        <ul className="space-y-4">
                        {universitySuggestions.map((uni: UniversitySuggestion, index: number) => (
                            <li key={index} className="p-4 border rounded-lg bg-background/50 hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Image src={`https://placehold.co/100x60.png?text=${encodeURIComponent(uni.name.substring(0,3))}`} alt={`${uni.name} logo placeholder`} width={100} height={60} className="rounded object-cover self-start" data-ai-hint={uni.logoDataAiHint || 'university building'} />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-primary flex items-center text-lg mb-1">
                                            <UniversityIconLucide className="mr-2 h-5 w-5 text-accent flex-shrink-0" />
                                            {uni.website ? (
                                            <a href={uni.website} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center">
                                                {uni.name} <ExternalLink className="ml-1.5 h-4 w-4 text-muted-foreground" />
                                            </a>
                                            ) : (
                                            uni.name
                                            )}
                                        </h4>
                                        <p className="text-xs text-muted-foreground mb-2 ml-7">{uni.category}</p>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm mb-3">
                                            <div className="flex items-center" title="University Location"><MapPin className="mr-1.5 h-4 w-4 text-accent/80 flex-shrink-0" /><span className="text-foreground/80">{uni.location}</span></div>
                                            <div className="flex items-center" title="University Type"><Briefcase className="mr-1.5 h-4 w-4 text-accent/80 flex-shrink-0" /><span className="text-foreground/80">Type: {uni.type}</span></div>
                                            <div className="flex items-center" title="Program Duration"><BookOpen className="mr-1.5 h-4 w-4 text-accent/80 flex-shrink-0" /><span className="text-foreground/80">Duration: {uni.programDuration}</span></div>
                                            <div className="flex items-center" title="Tuition Category & Range">
                                                <DollarSign className="mr-1.5 h-4 w-4 text-accent/80 flex-shrink-0" />
                                                <span className="text-foreground/80">Tuition: {uni.tuitionCategory} {uni.tuitionFeeRange && `(${uni.tuitionFeeRange})`}</span>
                                            </div>
                                            <div className="flex items-center" title="Scholarship Level & Info">
                                                <AwardIconLucideComp className="mr-1.5 h-4 w-4 text-accent/80 flex-shrink-0" />
                                                <span className="text-foreground/80">Scholarships: {uni.scholarshipLevel} {uni.rawScholarshipInfo && `(${uni.rawScholarshipInfo})`}</span>
                                            </div>
                                            {uni.englishTestRequirements && (
                                                <div className="flex items-center sm:col-span-2" title="English Test Requirements">
                                                    <ClipboardCheck className="mr-1.5 h-4 w-4 text-accent/80 flex-shrink-0" />
                                                    <span className="text-foreground/80">English Tests: {uni.englishTestRequirements}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 text-right">
                                    <Button asChild size="sm" variant="outline" className="text-accent hover:text-accent-foreground hover:bg-accent/10">
                                        <Link href={`/book-appointment?collegeName=${encodeURIComponent(uni.name)}&country=${encodeURIComponent(pathwayForm.getValues('country'))}&field=${encodeURIComponent(pathwayForm.getValues('fieldOfStudy'))}&gpa=${encodeURIComponent(pathwayForm.getValues('gpa'))}&level=${encodeURIComponent(pathwayForm.getValues('targetEducationLevel'))}`}>
                                            Book Consultation
                                        </Link>
                                    </Button>
                                </div>
                            </li>
                        ))}
                        </ul>
                    ) : (
                        <p className="text-foreground/70 text-center py-8">No university suggestions match your current query. Please try different criteria.</p>
                    )}
                    </CardContent>
                </Card>
                )}
                {!isLoadingPathway && !pathwayError && !pathwayResult && (
                    <Card className="shadow-xl bg-card flex flex-col items-center justify-center flex-grow min-h-[200px] md:min-h-0">
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
      <section
        ref={whyChooseUsSectionRef}
        className={cn(
          "transition-all duration-700 ease-out",
          isWhyChooseUsSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <SectionTitle title="Why Choose Pixar Edu?" subtitle="Your success is our priority. We offer unparalleled support and expertise." />
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Expert Guidance", description: "Experienced counselors providing personalized advice.", icon: <CheckCircle className="h-10 w-10 text-accent mb-4" /> },
            { title: "Global Network", description: "Access to a wide range of universities and programs.", icon: <CheckCircle className="h-10 w-10 text-accent mb-4" /> },
            { title: "Proven Success", description: "High success rates in admissions and visa applications.", icon: <CheckCircle className="h-10 w-10 text-accent mb-4" /> },
          ].map((item, index) => {
            const [cardRef, isCardVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
            return (
              <div key={item.title} ref={cardRef} className={cn("transition-all duration-700 ease-out", isCardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{transitionDelay: `${index * 100}ms`}}>
                <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card h-full">
                  <CardContent className="p-6 pt-8">
                    {item.icon}
                    <h3 className="text-xl font-headline font-semibold text-primary mb-2">{item.title}</h3>
                    <p className="text-foreground/80">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </section>

      {/* Services Overview Section */}
      <section
        ref={servicesOverviewSectionRef}
        className={cn(
          "transition-all duration-700 ease-out",
          isServicesOverviewSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <SectionTitle title="Our Core Services" subtitle="Comprehensive support to navigate your educational path." />
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {services.slice(0,3).map((service: Service, index: number) => {
             const [cardRef, isCardVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
            return (
              <div key={service.id} ref={cardRef} className={cn("transition-all duration-700 ease-out", isCardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{transitionDelay: `${index * 100}ms`}}>
                <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card h-full flex flex-col">
                  {service.imageUrl && (
                    <div className="relative h-48 w-full">
                      <Image src={service.imageUrl} alt={service.title} layout="fill" objectFit="cover" data-ai-hint={service.dataAiHint || 'education service'} />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="font-headline text-primary flex items-center"><service.icon className="mr-2 h-6 w-6 text-accent" />{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-foreground/80">{service.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="link" className="text-accent p-0">
                      <Link href={`/services#${service.id}`}>Learn More <ArrowRight className="ml-1 h-4 w-4" /></Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-10">
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/services">View All Services</Link>
            </Button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        ref={testimonialsSectionRef}
        className={cn(
          "bg-secondary/50 py-16 rounded-lg shadow-inner transition-all duration-700 ease-out",
          isTestimonialsSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <SectionTitle title="Success Stories" subtitle="Hear from students who achieved their dreams with us." />
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial: Testimonial, index: number) => {
            const [cardRef, isCardVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
            return (
            <div key={testimonial.id} ref={cardRef} className={cn("transition-all duration-700 ease-out", isCardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{transitionDelay: `${index * 100}ms`}}>
              <Card className="bg-card shadow-lg h-full">
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
            </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
