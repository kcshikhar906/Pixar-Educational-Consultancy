
'use client';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { countryData } from '@/lib/data.tsx';
import type { CountryInfo, University } from '@/lib/data.tsx';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import React from 'react'; // Import React

interface CountryPageProps {
  params: {
    country: string;
  };
}

// export async function generateStaticParams() { // Needs to be client component for hooks
//   return countryData.map((country) => ({
//     country: country.slug,
//   }));
// }

export default function CountryPage({ params }: { params: { country: string } }) {

  const [headerRef, isHeaderVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.05 });
  const [whySectionRef, isWhySectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.1 });
  const [universitiesSectionRef, isUniversitiesSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.1 });
  const [ctaSectionRef, isCtaSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.1 });

  const countryInfo = countryData.find((c) => c.slug === params.country);

  if (!countryInfo) {
    notFound();
  }

  return (
    <div className="space-y-12 md:space-y-16">
      <header 
        ref={headerRef}
        className={cn(
          "relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl transition-all duration-700 ease-out",
          isHeaderVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <Image
          src={countryInfo.imageUrl}
          alt={`Studying in ${countryInfo.name}`}
          layout="fill"
          objectFit="cover"
          priority
          data-ai-hint={countryInfo.dataAiHint || 'country landscape'}
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-white text-center">
            Study in {countryInfo.name}
          </h1>
        </div>
      </header>

      <section 
        ref={whySectionRef}
        className={cn(
          "transition-all duration-700 ease-out",
          isWhySectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <SectionTitle title={`Why ${countryInfo.name}?`} />
        <p className="text-lg text-foreground/80 max-w-3xl mx-auto text-left mb-12">
          {countryInfo.description}
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {countryInfo.facts.map((fact, index) => {
             const [factCardRef, isFactCardVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.2 });
            return (
            <div key={fact.label} ref={factCardRef} className={cn("transition-all duration-500 ease-out", isFactCardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{transitionDelay: `${index * 100}ms`}}>
              <Card className="bg-card shadow-lg h-full">
                <CardContent className="p-6 flex items-center space-x-4">
                  <fact.icon className="h-10 w-10 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-primary">{fact.label}</p>
                    <p className="text-foreground/70">{fact.value}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            );
          })}
        </div>
      </section>

      <section 
        ref={universitiesSectionRef}
        className={cn(
          "bg-secondary/50 py-16 rounded-lg shadow-inner transition-all duration-700 ease-out",
          isUniversitiesSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
         <div className="container mx-auto px-4">
            <SectionTitle title={`Top Universities in ${countryInfo.name}`} />
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

      <section 
        ref={ctaSectionRef}
        className={cn(
          "text-center transition-all duration-700 ease-out",
          isCtaSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <SectionTitle title="Ready to Explore?" subtitle={`Find out more about your study options in ${countryInfo.name}.`} />
        <a href="/contact">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Speak to an Advisor
            </Button>
        </a>
      </section>
    </div>
  );
}
