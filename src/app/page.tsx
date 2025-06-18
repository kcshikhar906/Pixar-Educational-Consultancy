
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SectionTitle from '@/components/ui/section-title';
import { ArrowRight, CheckCircle, Star, Loader2, Sparkles, MapPin, BookOpen, University as UniversityIconLucide, Info as InfoIcon, Search, ExternalLink, Wand2, Briefcase, DollarSign, ClipboardCheck, CalendarDays, Award as AwardIconFromData, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonials, services, fieldsOfStudy, gpaScaleOptions, educationLevelOptions, upcomingIntakeData } from '@/lib/data.tsx';
import type { Testimonial, Service, IntakeInfo } from '@/lib/data.tsx';
import { useState, useEffect, useMemo, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { pathwayPlanner, type PathwayPlannerInput, type PathwayPlannerOutput } from '@/ai/flows/pathway-planner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { format, differenceInCalendarMonths, addMonths, differenceInCalendarWeeks, startOfDay, differenceInDays } from 'date-fns';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);


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
  "Study in USA, AUS, UK, CAN, NZ with Us",
];

const FADE_DURATION_MS = 500;
const DISPLAY_DURATION_MS = 2500;

const selectableCountriesHomepage = [
  { name: 'Australia', value: 'Australia' },
  { name: 'Canada', value: 'Canada' },
  { name: 'USA', value: 'USA' },
  { name: 'UK', value: 'UK' },
  { name: 'New Zealand', value: 'New Zealand' },
];


interface TimeRemaining {
  displayText: string;
}

function calculateTimeRemaining(targetDateString: string): TimeRemaining {
  const targetDate = startOfDay(new Date(targetDateString));
  const now = startOfDay(new Date());

  if (targetDate <= now) {
    return { displayText: "Intake has passed or is current" };
  }

  let totalMonths = 0;
  let tempDate = new Date(now);
  while(addMonths(tempDate, 1) <= targetDate) {
    tempDate = addMonths(tempDate, 1);
    totalMonths++;
  }

  const dateAfterFullMonths = addMonths(now, totalMonths);
  let totalWeeks = 0;
  if (dateAfterFullMonths < targetDate) {
      totalWeeks = differenceInCalendarWeeks(targetDate, dateAfterFullMonths, { weekStartsOn: 1 });
  }
  if (totalWeeks < 0) totalWeeks = 0;


  const parts = [];
  if (totalMonths > 0) {
    parts.push(`${totalMonths} month${totalMonths > 1 ? 's' : ''}`);
  }
  if (totalWeeks > 0) {
    parts.push(`${totalWeeks} week${totalWeeks > 1 ? 's' : ''}`);
  }

  if (parts.length === 0) {
    const days = differenceInDays(targetDate, now);
    if (days < 7 && days >=0) {
        return { displayText: "Upcoming (less than 1 week)" };
    }
    return { displayText: "Upcoming soon" };
  }

  return { displayText: parts.join(', ') + " remaining" };
}


export default function HomePage() {
  const [isLoadingPathway, setIsLoadingPathway] = useState(false);
  const [pathwayError, setPathwayError] = useState<string | null>(null);
  const [pathwayResult, setPathwayResult] = useState<PathwayPlannerOutput | null>(null);
  const [heroAnimated, setHeroAnimated] = useState(false);

  const [currentTaglineText, setCurrentTaglineText] = useState(taglines[0]);

  const [showResultsArea, setShowResultsArea] = useState(false);
  const [resultsContainerAnimatedIn, setResultsContainerAnimatedIn] = useState(false);

  const [intakeTimes, setIntakeTimes] = useState<Record<string, TimeRemaining>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const heroTitleRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLHeadingElement>(null);
  
  const svgStageRef = useRef<SVGSVGElement>(null);
  const heroBackgroundPathRef = useRef<SVGPathElement>(null); 
  const heroAnimatedElementRef = useRef<SVGGElement>(null); 

  const [heroSectionRef, isHeroSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.05, initialVisible: true });
  const [pathwaySearchSectionRef, isPathwaySearchSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.02, initialVisible: false });
  const [upcomingIntakesSectionRef, isUpcomingIntakesSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.1 });
  const [whyChooseUsSectionRef, isWhyChooseUsSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.1 });
  const [servicesOverviewSectionRef, isServicesOverviewSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.1 });
  const [testimonialsSectionRef, isTestimonialsSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.1 });


  useEffect(() => {
    const timer = setTimeout(() => setHeroAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (heroAnimated && heroTitleRef.current) {
      gsap.fromTo(
        heroTitleRef.current,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, [heroAnimated]);

  useEffect(() => {
    if (!heroAnimated || !taglineRef.current) {
      return;
    }
    gsap.fromTo(
      taglineRef.current,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: FADE_DURATION_MS / 1000, ease: 'power2.out', delay: 0.4 }
    );

    let currentIdx = 0;
    const cycleTime = DISPLAY_DURATION_MS + FADE_DURATION_MS;
    const intervalId = setInterval(() => {
      gsap.to(taglineRef.current, {
        autoAlpha: 0,
        y: -20,
        duration: FADE_DURATION_MS / 1000,
        ease: 'power2.in',
        onComplete: () => {
          currentIdx = (currentIdx + 1) % taglines.length;
          setCurrentTaglineText(taglines[currentIdx]); 
          gsap.fromTo(
            taglineRef.current,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: FADE_DURATION_MS / 1000, ease: 'power2.out' }
          );
        }
      });
    }, cycleTime);
    return () => clearInterval(intervalId);
  }, [heroAnimated]);
  
 useEffect(() => {
    if (heroAnimated && heroAnimatedElementRef.current && heroBackgroundPathRef.current && svgStageRef.current) {
      gsap.to(svgStageRef.current, {
        opacity: 1,
        duration: 1.5,
        delay: 0.5, 
        ease: "power1.inOut"
      });

      gsap.to(heroAnimatedElementRef.current, {
        duration: 12, 
        repeat: -1,   
        ease: "linear", 
        motionPath: {
          path: heroBackgroundPathRef.current,
          align: heroBackgroundPathRef.current,
          alignOrigin: [0.5, 0.5], 
          autoRotate: true,
        }
      });
    }
  }, [heroAnimated]);
  
  useEffect(() => {
    const newIntakeTimes: Record<string, TimeRemaining> = {};
    upcomingIntakeData.forEach(intake => {
      newIntakeTimes[intake.countrySlug] = calculateTimeRemaining(intake.nextIntakeDate);
    });
    setIntakeTimes(newIntakeTimes);
  }, []);


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

  const handleScroll = (scrollOffset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  const renderPathwayForm = () => (
     <Card className={cn(
        "shadow-xl bg-card w-full",
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
                  <FormLabel className="flex items-center"><AwardIconFromData className="mr-2 h-4 w-4 text-accent"/>GPA / Academic Standing</FormLabel>
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
                  <FormLabel className="flex items-center"><UniversityIconLucide className="mr-2 h-4 w-4 text-accent"/>Target Education Level</FormLabel>
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
          "relative py-20 md:py-32 rounded-lg shadow-xl overflow-hidden",
          isHeroSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
          "transition-all duration-700 ease-out bg-card" 
        )}
      >
        <Image
          src="/main.jpg"
          alt="Global Education Journey Background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
          priority
        />
        <div className="absolute inset-0 bg-black opacity-70 z-10"></div>
        
        {/* GSAP Motion Path Background Animation Layer */}
        <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
          <svg 
            id="svg-stage" 
            ref={svgStageRef}
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="-40 -180 1250 1100" 
            opacity="0" 
            className="w-full h-full" 
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="grad" x1="154" x2="160" y1="49" y2="132" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="hsl(var(--primary) / 0.6)"></stop> 
                <stop offset="1" stopColor="hsl(var(--accent) / 0.6)"></stop>
              </linearGradient>
            </defs>
            <path 
              ref={heroBackgroundPathRef}
              className="mp" 
              fill="none" 
              stroke="transparent" 
              strokeWidth="2" 
              d="M-92 17.713c154.32 237.253 348.7 486.913 585.407 466.93 137.542-17.257 247.733-123.595 279.259-239.307 27.368-100.43-21.323-229.59-140.017-241.76-118.693-12.172-208.268 98.897-231.122 199.803-34.673 151.333 12.324 312.301 125.096 429.074C639.395 749.225 815.268 819.528 995 819"
            />
            <g ref={heroAnimatedElementRef} className="plane"> 
              <path fill="url(#grad)" opacity="0.3" d="m82.8 35 215.9 94.6L79 92l3.8-57Z"/>
              <path fill="url(#grad)" d="m82.8 35 52-23.5 163.9 118.1-216-94.5Z"/>
              <path fill="url(#grad)" opacity="0.3" d="m76.8 107.1 214.4 19.6L74.7 131l2.1-23.9Z"/>
              <path fill="url(#grad)" d="M298.8 130.4 1.9 103.3l54-45 242.9 72.1Z"/>
            </g>
          </svg>
        </div>

        {/* Hero Content Layer */}
        <div className="container mx-auto px-4 text-center relative z-30">
          <div
            ref={heroTitleRef}
            className={`text-5xl md:text-7xl font-headline font-bold text-primary-foreground mb-4`}
            style={{ opacity: 0 }} 
          >
            Pixar Education
          </div>
          <h1
            ref={taglineRef}
            className={cn(
              "text-4xl md:text-5xl font-headline font-bold text-primary-foreground mb-6 h-[5rem] md:min-h-[6rem] flex items-center justify-center"
            )}
            style={{ opacity: 0 }} 
          >
            <span>{currentTaglineText}</span>
          </h1>
          <p
            className={`text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-10 transition-all ease-out duration-700 delay-200 ${
              heroAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Your trusted partner for international studies, guiding Nepali students to success in the{' '}
            <Link href="/country-guides#usa" className="hover:underline text-blue-300">USA 🇺🇸</Link>,{' '}
            <Link href="/country-guides#australia" className="hover:underline text-yellow-300">Australia 🇦🇺</Link>,{' '}
            <Link href="/country-guides#uk" className="hover:underline text-red-300">UK 🇬🇧</Link>,{' '}
            <Link href="/country-guides#canada" className="hover:underline text-red-200">Canada 🇨🇦</Link>, &{' '}
            <Link href="/country-guides#new-zealand" className="hover:underline text-sky-300">New Zealand 🇳🇿</Link>.
            Start your adventure today!
          </p>
          <div
             className={cn(
              "flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 items-center justify-center",
              `transition-all ease-out duration-700 delay-300 ${heroAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`
            )}
          >
            <Button size="lg" asChild className="w-full sm:w-auto bg-background text-primary hover:bg-background/90 shadow-lg">
              <Link href="/services">Explore Services <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 shadow-lg bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/ai-assistants">Use our Smart Tools <Wand2 className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pathway Quick Search Section */}
      <section
        id="pathway-search-section"
        ref={pathwaySearchSectionRef}
        className={cn(
          "transition-all duration-700 ease-out",
          isPathwaySearchSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <SectionTitle title="Pathway Quick Search" subtitle="Find universities matching your interests instantly." />
        <div className={cn(
            "items-start gap-8",
            showResultsArea ? "grid grid-cols-1 md:grid-cols-3" : "max-w-4xl mx-auto" 
        )}>
          <div className={cn(
            showResultsArea ? "md:col-span-1 w-full" : "w-full" 
           )}>
            {renderPathwayForm()}
          </div>

          {showResultsArea && (
            <div className={cn(
                "md:col-span-2 flex flex-col w-full", 
                "transition-all duration-700 ease-out",
                resultsContainerAnimatedIn ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
                {isLoadingPathway && (
                <Card className="shadow-xl bg-card flex flex-col items-center justify-center flex-grow min-h-[200px] p-6 w-full">
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <p className="text-muted-foreground mt-2">Finding universities...</p>
                </Card>
                )}
                {pathwayError && !isLoadingPathway && (
                <Alert variant="destructive" className="bg-card w-full">
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{pathwayError}</AlertDescription>
                </Alert>
                )}
                {pathwayResult && !isLoadingPathway && (
                <Card className="shadow-xl bg-card flex flex-col flex-grow w-full">
                    <CardHeader>
                    <CardTitle className="font-headline text-accent flex items-center">
                        <Sparkles className="mr-2 h-6 w-6" /> University Suggestions
                    </CardTitle>
                    <CardDescription>
                        For {pathwayForm.getValues('country')} - {pathwayForm.getValues('fieldOfStudy')} (GPA: {pathwayForm.getValues('gpa')}, Level: {pathwayForm.getValues('targetEducationLevel')}).
                        {pathwayResult.searchSummary && <span className="block mt-1 text-xs italic">{pathwayResult.searchSummary}</span>}
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-y-auto space-y-4 max-h-96 md:max-h-[calc(100vh-300px)] p-6 w-full">
                    {universitySuggestions.length > 0 ? (
                        <ul className="space-y-4">
                        {universitySuggestions.map((uni: UniversitySuggestion, index: number) => (
                            <li key={index} className="p-4 border rounded-lg bg-background/50 hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Image src={`https://placehold.co/120x80.png?text=${encodeURIComponent(uni.name.substring(0,3))}`} alt={`${uni.name} logo placeholder`} width={120} height={80} className="rounded object-cover self-start sm:self-center" data-ai-hint={uni.logoDataAiHint || 'university building'} />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-primary flex items-center text-lg mb-1">
                                            <UniversityIconLucide className="mr-2 h-5 w-5 text-accent flex-shrink-0" />
                                            {uni.name}
                                        </h4>
                                        <p className="text-xs text-muted-foreground mb-2 ml-7">{uni.category || 'N/A'}</p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-sm mb-3">
                                            <div className="flex items-start" title="University Location">
                                                <MapPin className="mr-1.5 h-4 w-4 text-accent/80 flex-shrink-0 mt-0.5" />
                                                <span className="text-foreground/80">{uni.location || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-start" title="University Type">
                                                <Briefcase className="mr-1.5 h-4 w-4 text-accent/80 flex-shrink-0 mt-0.5" />
                                                <span className="text-foreground/80">Type: {uni.type || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-start" title="Program Duration">
                                                <BookOpen className="mr-1.5 h-4 w-4 text-accent/80 flex-shrink-0 mt-0.5" />
                                                <span className="text-foreground/80">Duration: {uni.programDuration || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-start" title="Tuition Category & Range">
                                                <DollarSign className="mr-1.5 h-4 w-4 text-accent/80 flex-shrink-0 mt-0.5" />
                                                <span className="text-foreground/80">
                                                    Tuition: {uni.tuitionCategory || 'N/A'}
                                                    {uni.tuitionFeeRange && ` (${uni.tuitionFeeRange})`}
                                                    {uni.tuitionFeeRange && <span className="text-xs text-muted-foreground italic"> (Estimates, may vary. Check official site.)</span>}
                                                </span>
                                            </div>
                                            <div className="flex items-start" title="Next Intake Date">
                                                <CalendarDays className="mr-1.5 h-4 w-4 text-accent/80 flex-shrink-0 mt-0.5" />
                                                <span className="text-foreground/80">Next Intake: {uni.nextIntakeDate || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-start" title="English Test Requirements">
                                                <ClipboardCheck className="mr-1.5 h-4 w-4 text-accent/80 flex-shrink-0 mt-0.5" />
                                                <span className="text-foreground/80">English Tests: {uni.englishTestRequirements || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 text-right space-x-2">
                                    {uni.website && (
                                      <Button asChild size="sm" variant="outline" className="text-primary hover:text-primary-foreground hover:bg-primary/10">
                                        <a href={uni.website} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="mr-1.5 h-4 w-4" /> More Info
                                        </a>
                                      </Button>
                                    )}
                                    <Button asChild size="sm" variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90">
                                        <Link href={`/contact?service=university_guidance&collegeName=${encodeURIComponent(uni.name)}&country=${encodeURIComponent(pathwayForm.getValues('country'))}&field=${encodeURIComponent(pathwayForm.getValues('fieldOfStudy'))}&gpa=${encodeURIComponent(pathwayForm.getValues('gpa'))}&level=${encodeURIComponent(pathwayForm.getValues('targetEducationLevel'))}`}>
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
                    <Card className="shadow-xl bg-card flex flex-col items-center justify-center flex-grow min-h-[200px] md:min-h-0 w-full">
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

      {/* Upcoming Intakes Section */}
      <section
        ref={upcomingIntakesSectionRef}
        className={cn(
          "transition-all duration-700 ease-out",
          isUpcomingIntakesSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <SectionTitle title="Upcoming Intakes & Deadlines" subtitle="Plan ahead for key application windows in popular countries." />
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className={cn(
              "py-2 no-scrollbar", 
              "flex flex-nowrap overflow-x-auto space-x-4 snap-x snap-mandatory scroll-smooth", 
              "lg:grid lg:grid-cols-5 lg:gap-4 lg:space-x-0 lg:overflow-visible lg:snap-none" 
            )}
          >
            {upcomingIntakeData.map((intake: IntakeInfo, index: number) => {
              const [intakeCardRef, isIntakeCardVisibleInner] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
              const timeRemainingText = intakeTimes[intake.countrySlug]?.displayText || 'Calculating...';
              
              return (
                <div
                  key={intake.countrySlug}
                  ref={intakeCardRef}
                  className={cn(
                    "transition-all duration-500 ease-out snap-center",
                    "flex-shrink-0 w-[250px] xs:w-[270px] sm:w-[290px]", 
                    "lg:w-full lg:flex-shrink-1", 
                    isIntakeCardVisibleInner ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  )}
                  style={{transitionDelay: `${index * 100}ms`}}
                >
                  <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
                    <CardHeader className="pb-3">
                      <CardTitle className="font-headline text-lg text-primary flex items-center">
                        <span className="text-xl mr-2">{intake.flagEmoji}</span>{intake.countryName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-1.5 text-sm pt-0">
                      <div className="flex items-center" title={`Specific intake period: ${intake.intakeNote}. Actual start: ${intake.nextIntakeDate ? format(new Date(intake.nextIntakeDate), "MMMM d, yyyy") : 'N/A'}`}>
                        <CalendarDays className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                        <span className="text-foreground/90 font-medium">{intake.intakeNote}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                        <span className="text-foreground/80">{timeRemainingText}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button asChild variant="link" className="text-accent p-0 text-sm hover:text-primary">
                         <Link href={`/country-guides#${intake.countrySlug}`}>
                          Learn more <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              );
            })}
          </div>
          {/* Scroll Buttons: only show them on screens smaller than lg */}
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-10 bg-card hover:bg-card/80 opacity-80 hover:opacity-100 shadow-md rounded-full p-2 h-10 w-10 lg:hidden"
            onClick={() => handleScroll(-280)} 
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-10 bg-card hover:bg-card/80 opacity-80 hover:opacity-100 shadow-md rounded-full p-2 h-10 w-10 lg:hidden"
            onClick={() => handleScroll(280)} 
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
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
            { title: "Expert Guidance", description: "Experienced counselors providing personalized advice for global destinations.", icon: <CheckCircle className="h-10 w-10 text-accent mb-4" /> },
            { title: "Global University Network", description: "Access to a wide range of universities and programs in the USA, Australia, UK, Canada & NZ.", icon: <CheckCircle className="h-10 w-10 text-accent mb-4" /> },
            { title: "Proven Success Record", description: "High success rates in admissions and visa applications across multiple countries.", icon: <CheckCircle className="h-10 w-10 text-accent mb-4" /> },
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
             const [cardRef, isServiceCardVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
            return (
              <div key={service.id} ref={cardRef} className={cn("transition-all duration-700 ease-out", isServiceCardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{transitionDelay: `${index * 100}ms`}}>
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
                    <p className="text-foreground/80">{service.longDescription || service.description}</p>
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
        <div className="relative w-full overflow-hidden group">
          <div className="flex flex-nowrap animate-marquee pause-on-hover">
            {[...testimonials, ...testimonials].map((testimonial: Testimonial, index: number) => (
              <div key={`${testimonial.id}-${index}`} className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] p-3">
                <Card className="bg-card shadow-lg h-full flex flex-col">
                  <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    {testimonial.avatarUrl && (
                      <Image 
                        src={testimonial.avatarUrl} 
                        alt={testimonial.name} 
                        width={60} 
                        height={60} 
                        className="rounded-full" 
                        data-ai-hint={testimonial.dataAiHint || "student person"}
                      />
                    )}
                    <div>
                      <CardTitle className="font-headline text-lg text-primary">{testimonial.name}</CardTitle>
                      <p className="text-xs text-accent">{testimonial.studyDestination}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />)}
                    </div>
                    <p className="text-foreground/80 italic text-sm">&quot;{testimonial.text}&quot;</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
    
