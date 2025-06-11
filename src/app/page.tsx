
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SectionTitle from '@/components/ui/section-title';
import { ArrowRight, CheckCircle, Star, Loader2, Sparkles, MapPin, BookOpen, University as UniversityIcon, Info, Search, ExternalLink, Wand2, Briefcase, DollarSign, AwardIcon } from 'lucide-react';
import { testimonials, services, fieldsOfStudy } from '@/lib/data';
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
import { Label } from '@/components/ui/label';


const pathwayFormSchema = z.object({
  country: z.string().min(1, "Please select a country."),
  fieldOfStudy: z.string().min(1, "Please select a field of study."),
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
  // Add more as needed
];

const tuitionCategories = ["All", "Affordable", "Mid-Range", "Premium", "Varies", "Unknown"];
const scholarshipLevels = ["All", "High", "Medium", "Low", "None", "Varies", "Unknown"];


export default function HomePage() {
  const [isLoadingPathway, setIsLoadingPathway] = useState(false);
  const [pathwayError, setPathwayError] = useState<string | null>(null);
  const [pathwayResult, setPathwayResult] = useState<PathwayPlannerOutput | null>(null);
  const [heroAnimated, setHeroAnimated] = useState(false);

  const [currentTaglineText, setCurrentTaglineText] = useState(taglines[0]);
  const [isTaglineVisible, setIsTaglineVisible] = useState(false);

  const [showResultsArea, setShowResultsArea] = useState(false);
  const [resultsContainerAnimatedIn, setResultsContainerAnimatedIn] = useState(false);

  const [filterType, setFilterType] = useState<'all' | 'Public' | 'Private'>('all');
  const [sortOrder, setSortOrder] = useState<string>('name_asc');
  const [filterTuitionCategory, setFilterTuitionCategory] = useState<string>('All');
  const [filterScholarshipLevel, setFilterScholarshipLevel] = useState<string>('All');


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
      const aiResult = await pathwayPlanner(values);
      setPathwayResult(aiResult);
    } catch (e) {
      setPathwayError(e instanceof Error ? e.message : 'An unexpected error occurred.');
      console.error(e);
    } finally {
      setIsLoadingPathway(false);
    }
  }

  const tuitionCategoryOrder: Record<string, number> = { "Affordable": 1, "Mid-Range": 2, "Premium": 3, "Varies": 4, "Unknown": 5, "All": 0 };
  const scholarshipLevelOrder: Record<string, number> = { "High": 1, "Medium": 2, "Low": 3, "None": 4, "Varies": 5, "Unknown": 6, "All": 0 };

  const filteredAndSortedUniversities = useMemo(() => {
    if (!pathwayResult?.universitySuggestions) return [];

    let universities = [...pathwayResult.universitySuggestions];

    // Filtering
    if (filterType !== 'all') {
      universities = universities.filter(uni => uni.type === filterType);
    }
    if (filterTuitionCategory !== 'All') {
      universities = universities.filter(uni => uni.tuitionCategory === filterTuitionCategory);
    }
    if (filterScholarshipLevel !== 'All') {
      universities = universities.filter(uni => uni.scholarshipLevel === filterScholarshipLevel);
    }
    
    // Sorting
    switch (sortOrder) {
      case 'name_asc':
        universities.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        universities.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'tuition_asc':
        universities.sort((a, b) => (tuitionCategoryOrder[a.tuitionCategory] || 99) - (tuitionCategoryOrder[b.tuitionCategory] || 99));
        break;
      case 'tuition_desc':
        universities.sort((a, b) => (tuitionCategoryOrder[b.tuitionCategory] || 99) - (tuitionCategoryOrder[a.tuitionCategory] || 99));
        break;
      case 'scholarship_asc': // High to None
        universities.sort((a, b) => (scholarshipLevelOrder[a.scholarshipLevel] || 99) - (scholarshipLevelOrder[b.scholarshipLevel] || 99));
        break;
      case 'scholarship_desc': // None to High
        universities.sort((a, b) => (scholarshipLevelOrder[b.scholarshipLevel] || 99) - (scholarshipLevelOrder[a.scholarshipLevel] || 99));
        break;
    }
    return universities;
  }, [pathwayResult, filterType, sortOrder, filterTuitionCategory, filterScholarshipLevel]);
  

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
 <section className="relative py-20 md:py-32 rounded-lg shadow-xl overflow-hidden" style={{ backgroundImage: 'url("/main.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
 <div className="absolute inset-0 bg-black opacity-70">
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
            "grid items-start gap-8",
            showResultsArea ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1"
        )}>
          <div className={cn( 
            "w-full", 
            showResultsArea ? "md:col-span-1" : "md:col-span-3" // Full width when only form is shown
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
                  <Button type="submit" disabled={isLoadingPathway} className="h-10 w-full md:w-auto mt-4 md:mt-0 bg-primary text-primary-foreground">
                    {isLoadingPathway ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Get Suggestions
                  </Button>
                </form>
              ) : (
                // Standard Card Form Layout (when results are shown)
                <Card className="shadow-xl bg-card flex flex-col flex-grow w-full">
                  <CardHeader>
                    <CardTitle className="font-headline text-primary flex items-center"><Search className="mr-2 h-6 w-6"/>Refine Your Search</CardTitle>
                    <CardDescription>Adjust your selections or try new ones.</CardDescription>
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
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isLoadingPathway} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        {isLoadingPathway ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Update Suggestions
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              )}
            </Form>
          </div>

          {showResultsArea && (
            <div className={cn(
                "md:col-span-2 flex flex-col min-h-[300px]", // Ensure it takes up space
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
                        For {pathwayForm.getValues('country')} - {pathwayForm.getValues('fieldOfStudy')}.
                        {pathwayResult.searchSummary && <span className="block mt-1 text-xs italic">{pathwayResult.searchSummary}</span>}
                    </CardDescription>
                     {/* Filters and Sort */}
                     <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <Label htmlFor="filterType" className="text-xs text-muted-foreground">Filter by Type</Label>
                            <Select value={filterType} onValueChange={(value) => setFilterType(value as 'all' | 'Public' | 'Private')}>
                                <SelectTrigger id="filterType" className="h-9"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="Public">Public</SelectItem><SelectItem value="Private">Private</SelectItem></SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="filterTuition" className="text-xs text-muted-foreground">Tuition</Label>
                            <Select value={filterTuitionCategory} onValueChange={setFilterTuitionCategory}>
                                <SelectTrigger id="filterTuition" className="h-9"><SelectValue /></SelectTrigger>
                                <SelectContent>{tuitionCategories.map(tc => <SelectItem key={tc} value={tc}>{tc === "All" ? "All Tuitions" : tc}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="filterScholarship" className="text-xs text-muted-foreground">Scholarship</Label>
                            <Select value={filterScholarshipLevel} onValueChange={setFilterScholarshipLevel}>
                                <SelectTrigger id="filterScholarship" className="h-9"><SelectValue /></SelectTrigger>
                                <SelectContent>{scholarshipLevels.map(sl => <SelectItem key={sl} value={sl}>{sl === "All" ? "All Levels" : sl}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="sortOrder" className="text-xs text-muted-foreground">Sort By</Label>
                            <Select value={sortOrder} onValueChange={setSortOrder}>
                                <SelectTrigger id="sortOrder" className="h-9"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name_asc">Name (A-Z)</SelectItem><SelectItem value="name_desc">Name (Z-A)</SelectItem>
                                    <SelectItem value="tuition_asc">Tuition (Affordable First)</SelectItem><SelectItem value="tuition_desc">Tuition (Premium First)</SelectItem>
                                    <SelectItem value="scholarship_asc">Scholarship (High First)</SelectItem><SelectItem value="scholarship_desc">Scholarship (None First)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-y-auto space-y-4 max-h-96 md:max-h-[calc(550px-180px)] p-6"> {/* Adjusted max-h */}
                    {filteredAndSortedUniversities.length > 0 ? (
                        <ul className="space-y-4">
                        {filteredAndSortedUniversities.map((uni: UniversitySuggestion, index: number) => (
                            <li key={index} className="p-4 border rounded-lg bg-background/50 hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Image src={`https://placehold.co/100x60.png?text=${uni.name.substring(0,3)}`} alt={`${uni.name} logo placeholder`} width={100} height={60} className="rounded object-cover self-start" data-ai-hint={uni.logoDataAiHint || 'university building'} />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-primary flex items-center text-lg mb-1">
                                            <UniversityIcon className="mr-2 h-5 w-5 text-accent flex-shrink-0" />
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
                                            <div className="flex items-center" title="University Type"><Briefcase className="mr-1.5 h-4 w-4 text-accent/80 flex-shrink-0" /><span className="text-foreground/80">Type: {uni.type}</span></div>
                                            <div className="flex items-center" title="Program Duration"><BookOpen className="mr-1.5 h-4 w-4 text-accent/80 flex-shrink-0" /><span className="text-foreground/80">Duration: {uni.programDuration}</span></div>
                                            <div className="flex items-center" title="Tuition Category"><DollarSign className="mr-1.5 h-4 w-4 text-accent/80 flex-shrink-0" /><span className="text-foreground/80">Tuition: {uni.tuitionCategory}</span></div>
                                            <div className="flex items-center" title="Scholarship Level"><AwardIcon className="mr-1.5 h-4 w-4 text-accent/80 flex-shrink-0" /><span className="text-foreground/80">Scholarships: {uni.scholarshipLevel}</span></div>
                                        </div>
                                        {uni.rawTuitionInfo && <p className="text-xs text-foreground/70 mb-1 italic">Tuition Note: {uni.rawTuitionInfo}</p>}
                                        {uni.rawScholarshipInfo && <p className="text-xs text-foreground/70 mb-1 italic">Scholarship Note: {uni.rawScholarshipInfo}</p>}
                                    </div>
                                </div>
                                <div className="mt-3 text-right">
                                    <Button asChild size="sm" variant="outline" className="text-accent hover:text-accent-foreground hover:bg-accent/10">
                                        <Link href={`/book-appointment?collegeName=${encodeURIComponent(uni.name)}&country=${encodeURIComponent(pathwayForm.getValues('country'))}&field=${encodeURIComponent(pathwayForm.getValues('fieldOfStudy'))}`}>
                                            Book Consultation
                                        </Link>
                                    </Button>
                                </div>
                            </li>
                        ))}
                        </ul>
                    ) : (
                        <p className="text-foreground/70 text-center py-8">No university suggestions match your current filters. Try adjusting them or broaden your search!</p>
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

