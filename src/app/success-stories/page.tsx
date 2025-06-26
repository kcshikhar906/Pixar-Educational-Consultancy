'use client';

import Image from 'next/image';
import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { testimonials, visaSuccesses } from '@/lib/data';
import type { Testimonial, VisaSuccessesByCountry } from '@/lib/data';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

export default function SuccessStoriesPage() {
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const countryOrder = ["USA", "Australia", "Canada", "UK", "New Zealand"];

  const sortedVisaSuccesses = Object.entries(visaSuccesses).sort(([countryA], [countryB]) => {
    return countryOrder.indexOf(countryA) - countryOrder.indexOf(countryB);
  });

  return (
    <div className="space-y-16">
      <section ref={titleRef} className={cn("transition-all duration-700 ease-out", isTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle
          title="Our Success Stories"
          subtitle="Hear from students who have achieved their global education dreams with our guidance."
        />
      </section>

      <section>
        <h3 className="text-3xl font-headline font-semibold text-primary mb-8 text-center">Featured Testimonials</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial: Testimonial, index: number) => {
            const [cardRef, isCardVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
            return (
              <div key={testimonial.id} ref={cardRef} className={cn("transition-all duration-500 ease-out", isCardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{ transitionDelay: `${index * 100}ms` }}>
                <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
                  <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    {testimonial.avatarUrl && (
                      <Image
                        src={testimonial.avatarUrl}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full"
                        data-ai-hint={testimonial.dataAiHint || "student portrait"}
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
            );
          })}
        </div>
      </section>
      
      <section>
        <h3 className="text-3xl font-headline font-semibold text-primary mb-8 text-center">Comprehensive Visa Success List</h3>
        <div className="space-y-8">
          {sortedVisaSuccesses.map(([country, students], index) => {
            const [cardRef, isCardVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.05 });
            return (
              <div key={country} ref={cardRef} className={cn("transition-all duration-500 ease-out", isCardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{ transitionDelay: `${index * 100}ms` }}>
                <Card className="shadow-lg bg-card border-l-4 border-accent">
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl text-accent">{country}</CardTitle>
                    <CardDescription>A list of students who successfully received their visas for {country} through our consultancy.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                      {students.map((student, studentIdx) => (
                        <li key={studentIdx} className="text-sm text-foreground/90 border-b border-border/50 pb-2">
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.destination}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </section>

    </div>
  );
}
