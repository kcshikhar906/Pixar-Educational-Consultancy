
'use client';

import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { FileText, DollarSign, Briefcase, Heart, Plane, Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ChecklistItem {
  text: string;
  subItems?: string[];
  link?: { href: string; text: string };
}

interface ToolkitSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  checklist: ChecklistItem[];
}

const toolkitData: ToolkitSection[] = [
  {
    id: 'documents',
    title: 'Essential Documents',
    icon: FileText,
    description: 'Keep these safe and accessible in your carry-on. Have both physical and digital copies.',
    checklist: [
      { text: 'Passport & Visa' },
      { text: 'University Admission Documents (Offer Letter, CoE/I-20/CAS)' , link: { href: '/blog/how-to-read-and-understand-a-coe-or-offer-letter', text: 'Understand your offer letter' } },
      { text: 'Academic Credentials (Transcripts, Certificates)' },
      { text: 'Financial Proof (Copies of visa submission docs)' },
      { text: 'Travel & Accommodation Details' },
    ],
  },
  {
    id: 'finances',
    title: 'Financial Preparations',
    icon: DollarSign,
    description: 'Managing your money from day one is crucial for a stress-free experience.',
    checklist: [
      { text: 'Exchange some cash into local currency for immediate needs.' },
      { text: 'Inform your Nepali bank and enable cards for international use.' },
      { text: 'Research and plan to open a local bank account upon arrival.' },
      { text: 'Create a detailed monthly budget.' , link: { href: '/blog/student-budget-calculator-–-free-tool-for-planning', text: 'See our budgeting guide' } },
    ],
  },
  {
    id: 'packing',
    title: 'Smart Packing Guide',
    icon: Briefcase,
    description: 'Pack smart, not heavy. Prioritize essentials and check customs rules for your destination.',
    checklist: [
      { text: 'Carry-On: All documents, laptop, valuables, medications, and a change of clothes.' },
      { text: 'Checked Luggage: Climate-appropriate clothing, universal adapter, and personal items.' },
      { text: 'Avoid overpacking books or stationery; you can buy most things there.' },
    ],
  },
  {
    id: 'health',
    title: 'Health & Insurance',
    icon: Heart,
    description: 'Your health is a top priority. Ensure you are well-prepared for any medical needs.',
    checklist: [
      { text: 'Confirm your Overseas Student Health Cover (OSHC/equivalent) is active.' , link: { href: '/blog/what-is-oshc-why-overseas-health-cover-matters', text: 'What is OSHC?' } },
      { text: 'Complete a full health and dental check-up before you leave Nepal.' },
      { text: 'Carry a sufficient supply of any prescription medication with the prescription.' },
      { text: 'Ensure all vaccinations are up-to-date and carry the records.' },
    ],
  },
  {
    id: 'arrival',
    title: 'Arrival & First Few Days',
    icon: Plane,
    description: 'A smooth arrival sets a positive tone for your entire journey. Know what to expect.',
    checklist: [
      { text: 'Have passport, visa, and university offer letter ready for immigration.' },
      { text: 'Pre-plan your transport from the airport to your accommodation.' },
      { text: 'Get a local SIM card for immediate connectivity.' },
      { text: 'Attend all university orientation sessions – they are crucial!' },
      { text: 'Explore your neighborhood to find local grocery stores and transport links.' },
    ],
  },
];

export default function PreDepartureToolkitPage() {
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [gridRef, isGridVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.05 });


  return (
    <div className="space-y-12 md:space-y-16">
      <section ref={titleRef} className={cn("transition-all duration-700 ease-out", isTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle
          title="Pre-Departure Toolkit"
          subtitle="Your comprehensive checklist for a smooth and successful transition to studying abroad. Be prepared, confident, and ready for your adventure!"
        />
      </section>

      <section 
        ref={gridRef}
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto transition-all duration-700 ease-out",
          isGridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        {toolkitData.map((section, index) => {
           const [itemRef, isItemVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
          return (
            <div 
                key={section.id} 
                ref={itemRef} 
                className={cn(
                    "transition-all duration-500 ease-out",
                    isItemVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
                    // Make the last item span both columns if it's an odd number
                    toolkitData.length % 2 !== 0 && index === toolkitData.length - 1 ? 'md:col-span-2' : ''
                )} 
                style={{transitionDelay: `${index * 100}ms`}}
            >
              <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline text-primary flex items-center text-xl">
                     <section.icon className="h-8 w-8 mr-3 text-accent" />
                     {section.title}
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {section.checklist.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="text-foreground/80">{item.text}</span>
                           {item.link && (
                              <Button variant="link" asChild className="p-0 h-auto ml-1 text-accent text-sm leading-tight">
                                <Link href={item.link.href}>
                                  ({item.link.text})
                                </Link>
                              </Button>
                            )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </section>

       <section className="text-center">
        <h3 className="text-xl md:text-2xl font-headline font-semibold text-primary mb-4">Feeling Overwhelmed? We're Here to Help.</h3>
        <p className="text-foreground/80 mb-6 max-w-xl mx-auto">
          PixarEdu provides comprehensive pre-departure briefings to all our students to ensure you are fully prepared.
        </p>
        <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/contact">
                Contact an Advisor
            </Link>
        </Button>
      </section>
    </div>
  );
}
