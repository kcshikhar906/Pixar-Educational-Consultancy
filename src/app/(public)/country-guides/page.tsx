
'use client';

import React, { useEffect, useState } from 'react'; // Added explicit React import and useEffect, useState
import Image from 'next/image';
import Link from 'next/link';
import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { countryData } from '@/lib/data.tsx';
import type { CountryInfo, University } from '@/lib/data.tsx';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { ExternalLink, DollarSign, Clock, FileSpreadsheet, UserCheck, Briefcase, GitCompareArrows, TrendingUp, KeyRound, Activity } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CountryGuidesPage() {
  const [titleSectionRef, isTitleSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [tabsContainerRef, isTabsContainerVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.05 });

  const defaultCountrySlug = countryData.length > 0 ? countryData[0].slug : 'compare'; // Default to 'compare' if no countries
  const [activeTab, setActiveTab] = useState<string>(defaultCountrySlug);

  const [selectedCountry1Slug, setSelectedCountry1Slug] = useState<string | null>(null);
  const [selectedCountry2Slug, setSelectedCountry2Slug] = useState<string | null>(null);

  const selectedCountry1Data = selectedCountry1Slug ? countryData.find(c => c.slug === selectedCountry1Slug) : null;
  const selectedCountry2Data = selectedCountry2Slug ? countryData.find(c => c.slug === selectedCountry2Slug) : null;

  useEffect(() => {
    const hash = window.location.hash.substring(1); // Remove #
    const isValidSlug = countryData.some(country => country.slug === hash) || hash === 'compare';
    if (hash && isValidSlug) {
      setActiveTab(hash);
    } else if (!hash && countryData.length > 0) {
        // If no hash, set to default (first country or compare) and update URL
        // This handles initial load without a hash.
        const initialTab = countryData.length > 0 ? countryData[0].slug : 'compare';
        setActiveTab(initialTab);
        // Only update hash if it's not already the default to avoid loop
        // For initial load, we don't necessarily want to force a hash.
        // If there's an invalid hash, we could clear it or set to default.
    } else if (!hash && activeTab !== defaultCountrySlug) {
        // If no hash but activeTab isn't default (e.g. user navigated away then back)
        // This ensures URL reflects current tab state if it's not default.
        // window.history.replaceState(null, '', `#${activeTab}`);
        // No, let's not do this here as it might conflict. Simpler to rely on onValueChange.
    }
  }, []); // Runs only on mount to set initial tab from hash.

  const handleTabChange = (newTabSlug: string) => {
    setActiveTab(newTabSlug);
    window.history.replaceState(null, '', `#${newTabSlug}`); // Update URL hash without page reload
  };

  const ComparisonDetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | React.ReactNode | undefined }) => (
    <div className="flex items-start space-x-3 p-2 bg-background/50 rounded-md">
      <Icon className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
      <div>
        <h5 className="font-semibold text-sm text-primary">{label}</h5>
        {typeof value === 'string' ? <p className="text-xs text-foreground/80">{value || 'N/A'}</p> : <div className="text-xs text-foreground/80">{value || 'N/A'}</div>}
      </div>
    </div>
  );
  
  const KeyInfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | React.ReactNode | undefined }) => (
    <div className="flex items-start space-x-3 p-3 bg-secondary/30 rounded-md">
      <Icon className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
      <div>
        <h4 className="font-semibold">{label}</h4>
        {typeof value === 'string' ? <p>{value || 'Information not available'}</p> : <div>{value || 'Information not available'}</div>}
      </div>
    </div>
  );


  return (
    <div className="space-y-12 md:space-y-16">
      <section ref={titleSectionRef} className={cn("transition-all duration-700 ease-out", isTitleSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle
          title="Explore Study Destinations"
          subtitle="Discover detailed guides for popular countries, including living costs, work opportunities, top universities, visa trends, salary expectations, and PR pathways. You can also compare countries side-by-side."
        />
      </section>

      <div ref={tabsContainerRef} className={cn("transition-all duration-700 ease-out", isTabsContainerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="h-auto p-0 grid w-full grid-cols-2 md:grid-cols-3 gap-2 mx-auto mb-8">
            {countryData.map((country) => (
              <TabsTrigger
                key={country.slug}
                value={country.slug}
                className="py-2.5 text-sm md:text-base whitespace-normal text-center"
              >
                <span className="mr-2 text-lg" role="img" aria-label={`${country.name} flag`}>{country.flagEmoji}</span>
                {country.name}
              </TabsTrigger>
            ))}
            <TabsTrigger
              value="compare"
              className="py-2.5 text-sm md:text-base whitespace-normal text-center"
            >
              <GitCompareArrows className="mr-2 h-5 w-5" /> Compare Countries
            </TabsTrigger>
          </TabsList>

          {countryData.map((countryInfo) => (
            <TabsContent key={countryInfo.slug} value={countryInfo.slug} className="space-y-10">
              <header className="relative h-[250px] md:h-[350px] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={countryInfo.imageUrl}
                  alt={`Studying in ${countryInfo.name}`}
                  layout="fill"
                  objectFit="cover"
                  priority
                  data-ai-hint={countryInfo.dataAiHint || 'country landmark banner'}
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <h1 className="text-3xl md:text-5xl font-headline font-bold text-white text-center">
                    Study in {countryInfo.name}
                  </h1>
                </div>
              </header>

              <p className="text-lg text-foreground/80 max-w-3xl mx-auto text-left">
                {countryInfo.description}
              </p>

              <Card className="shadow-lg bg-card">
                <CardHeader>
                  <CardTitle className="font-headline text-primary">Key Information for Students</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6 text-foreground/80">
                  <KeyInfoItem icon={DollarSign} label="Average Living Cost" value={countryInfo.averageLivingCost} />
                  <KeyInfoItem icon={Clock} label="Work Hours (Students)" value={countryInfo.workHoursStudent} />
                  <KeyInfoItem icon={FileSpreadsheet} label="Visa Info Summary" value={countryInfo.visaInfoSummary} />
                  <KeyInfoItem icon={UserCheck} label="Post-Study Work Options" value={countryInfo.postStudyWorkSummary} />
                  <KeyInfoItem icon={TrendingUp} label="Visa Approval Trends" value={countryInfo.visaApprovalTrends} />
                  <KeyInfoItem icon={DollarSign} label="Average Salary After Study" value={countryInfo.averageSalaryAfterStudy} />
                  <KeyInfoItem icon={KeyRound} label="PR Pathways" value={countryInfo.prPathways} />
                </CardContent>
              </Card>

              <section>
                <h3 className="text-2xl md:text-3xl font-headline font-semibold text-primary mb-6 text-center">Why Study in {countryInfo.name}?</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {countryInfo.facts.map((fact) => (
                    <Card key={fact.label} className="bg-background shadow-md hover:shadow-lg transition-shadow h-full">
                      <CardContent className="p-6 flex items-center space-x-4">
                        <fact.icon className="h-10 w-10 text-primary flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-primary">{fact.label}</p>
                          <p className="text-foreground/70 text-sm">{fact.value}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              <section className="bg-secondary/30 py-10 rounded-lg shadow-inner">
                <div className="container mx-auto px-4">
                  <h3 className="text-2xl md:text-3xl font-headline font-semibold text-primary mb-6 text-center">Top Universities in {countryInfo.name}</h3>
                  <Card className="shadow-xl bg-card">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="font-semibold text-primary">University</TableHead>
                              <TableHead className="font-semibold text-primary">City</TableHead>
                              <TableHead className="font-semibold text-primary">Focus Area</TableHead>
                              <TableHead className="font-semibold text-primary text-right">Website</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {countryInfo.topUniversities.map((uni: University) => (
                              <TableRow key={uni.name}>
                                <TableCell className="font-medium text-foreground">{uni.name}</TableCell>
                                <TableCell className="text-foreground/80">{uni.city}</TableCell>
                                <TableCell className="text-foreground/80">{uni.countryFocus}</TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm" asChild className="text-accent hover:text-accent-foreground">
                                    <a href={uni.website} target="_blank" rel="noopener noreferrer">
                                      Visit <ExternalLink className="ml-1 h-4 w-4" />
                                    </a>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <section className="text-center pt-6">
                <h3 className="text-xl md:text-2xl font-headline font-semibold text-primary mb-4">Ready to Explore {countryInfo.name}?</h3>
                <p className="text-foreground/80 mb-6 max-w-xl mx-auto">Find out more about your study options and get personalized advice.</p>
                <Link href="/contact">
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Speak to an Advisor
                    </Button>
                </Link>
              </section>
            </TabsContent>
          ))}

          <TabsContent value="compare" className="space-y-8">
            <Card className="shadow-lg bg-card">
              <CardHeader>
                <CardTitle className="font-headline text-primary">Compare Study Destinations</CardTitle>
                <CardDescription>Select two countries below to see a side-by-side comparison of key details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                  <div>
                    <label htmlFor="country1" className="block text-sm font-medium text-foreground mb-1">Country 1</label>
                    <Select onValueChange={setSelectedCountry1Slug} value={selectedCountry1Slug || undefined}>
                      <SelectTrigger id="country1" className="w-full">
                        <SelectValue placeholder="Select Country 1" />
                      </SelectTrigger>
                      <SelectContent>
                        {countryData.map(country => (
                          <SelectItem key={country.slug} value={country.slug} disabled={country.slug === selectedCountry2Slug}>
                            {country.flagEmoji} {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="country2" className="block text-sm font-medium text-foreground mb-1">Country 2</label>
                    <Select onValueChange={setSelectedCountry2Slug} value={selectedCountry2Slug || undefined}>
                      <SelectTrigger id="country2" className="w-full">
                        <SelectValue placeholder="Select Country 2" />
                      </SelectTrigger>
                      <SelectContent>
                        {countryData.map(country => (
                          <SelectItem key={country.slug} value={country.slug} disabled={country.slug === selectedCountry1Slug}>
                            {country.flagEmoji} {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedCountry1Data && selectedCountry2Data && selectedCountry1Slug !== selectedCountry2Slug ? (
              <div className="grid md:grid-cols-2 gap-6 items-start">
                {[selectedCountry1Data, selectedCountry2Data].map((country) => (
                  <Card key={country.slug} className="shadow-md bg-secondary/30 h-full">
                    <CardHeader className="bg-card rounded-t-lg">
                      <CardTitle className="font-headline text-2xl text-primary flex items-center">
                        <span className="text-3xl mr-3">{country.flagEmoji}</span> {country.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <p className="text-sm text-foreground/70 italic h-20 overflow-y-auto text-left">{country.description}</p>
                      <ComparisonDetailItem icon={DollarSign} label="Average Living Cost" value={country.averageLivingCost} />
                      <ComparisonDetailItem icon={Clock} label="Work Hours (Students)" value={country.workHoursStudent} />
                      <ComparisonDetailItem icon={FileSpreadsheet} label="Visa Info Summary" value={country.visaInfoSummary} />
                      <ComparisonDetailItem icon={UserCheck} label="Post-Study Work Options" value={country.postStudyWorkSummary} />
                      <ComparisonDetailItem icon={TrendingUp} label="Visa Approval Trends" value={country.visaApprovalTrends} />
                      <ComparisonDetailItem icon={DollarSign} label="Avg. Salary After Study" value={country.averageSalaryAfterStudy} />
                      <ComparisonDetailItem icon={KeyRound} label="PR Pathways" value={country.prPathways} />
                       <div className="pt-2">
                        <h5 className="font-semibold text-sm text-primary mb-1">Key Facts:</h5>
                        <ul className="list-disc list-inside pl-2 space-y-1 text-left">
                          {country.facts.slice(0, 3).map(fact => (
                             <li key={fact.label} className="text-xs text-foreground/80">
                               <span className="font-medium">{fact.label}:</span> {fact.value}
                             </li>
                          ))}
                        </ul>
                      </div>
                       <div className="pt-2">
                        <h5 className="font-semibold text-sm text-primary mb-1">Top Universities (Examples):</h5>
                        <ul className="list-disc list-inside pl-2 space-y-1 text-left">
                          {country.topUniversities.slice(0, 2).map(uni => (
                            <li key={uni.name} className="text-xs text-foreground/80">{uni.name}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : selectedCountry1Slug && selectedCountry2Slug && selectedCountry1Slug === selectedCountry2Slug ? (
                 <p className="text-center text-destructive py-10">Please select two different countries to compare.</p>
            ) : (
                 <div className="text-center py-10 text-foreground/60">
                    <GitCompareArrows className="mx-auto h-12 w-12 mb-4" />
                    <p>Please select two countries from the dropdowns above to see their comparison.</p>
                </div>
            )}
             <section className="text-center pt-6">
                <h3 className="text-xl md:text-2xl font-headline font-semibold text-primary mb-4">Need More Details?</h3>
                <p className="text-foreground/80 mb-6 max-w-xl mx-auto">Our advisors can provide in-depth comparisons and personalized guidance.</p>
                <Link href="/contact">
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Speak to an Advisor
                    </Button>
                </Link>
              </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


    
