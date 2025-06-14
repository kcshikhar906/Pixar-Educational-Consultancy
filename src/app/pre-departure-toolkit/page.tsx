
'use client';

import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Smartphone, Coins, ShieldCheck, PlaneTakeoff, CheckSquare, Info, ExternalLink, DownloadCloud } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const toolkitSections = [
  {
    id: 'apps',
    title: 'Essential Apps to Install',
    icon: Smartphone,
    description: 'Download these apps before you fly to make your journey and initial settlement smoother.',
    items: [
      { name: 'Navigation Apps', details: 'Google Maps, Citymapper, or local public transport apps for your destination city. Download offline maps.' },
      { name: 'Communication Apps', details: 'WhatsApp, Viber, Skype, or your university\'s preferred communication platform to stay in touch with family and new contacts.' },
      { name: 'Banking Apps', details: 'Your home bank\'s app and consider setting up an account with an international-friendly bank or service like Wise, Revolut (if available/applicable).' },
      { name: 'Translation Apps', details: 'Google Translate or similar, especially if you\'re going to a country where English isn\'t the primary language.' },
      { name: 'Airline & Airport Apps', details: 'Your airline’s app for flight updates and the official app for your arrival airport.' },
      { name: 'University App', details: 'Many universities have their own apps for campus maps, schedules, and resources.' },
      { name: 'Emergency Services App', details: 'Check if your destination has a specific app for emergency alerts or contacts.' },
    ],
  },
  {
    id: 'currency',
    title: 'Currency Exchange Savvy',
    icon: Coins,
    description: 'Tips for managing your money and getting the best exchange rates.',
    items: [
      { name: 'Inform Your Bank', details: 'Notify your bank of your travel plans to avoid blocked cards. Inquire about international transaction fees.' },
      { name: 'Exchange Some Cash Beforehand', details: 'Have a small amount of local currency for immediate expenses upon arrival (e.g., taxi, snacks).' },
      { name: 'Compare Exchange Rates', details: 'Avoid exchanging large amounts at airports; rates are usually less favorable. Use ATMs or reputable exchange services in the city.' },
      { name: 'Understand ATM Fees', details: 'Be aware of fees from your bank and the local ATM provider. Consider banks with international partnerships.' },
      { name: 'Consider a Travel Card', details: 'Multi-currency travel cards can be a good option for locking in rates and managing expenses.' },
      { name: 'Keep Receipts', details: 'Keep records of major transactions and currency exchanges.' },
    ],
  },
  {
    id: 'health-insurance',
    title: 'Health Insurance Essentials',
    icon: ShieldCheck,
    description: 'Understanding and arranging your health coverage is crucial.',
    items: [
      { name: 'Mandatory Coverage', details: 'Most countries require international students to have health insurance (e.g., OSHC in Australia, provincial plans in Canada after a waiting period, university-mandated plans in the USA). Confirm requirements for your specific visa.' },
      { name: 'Understand Your Policy', details: 'Know what your insurance covers (doctor visits, hospitalization, medication, dental, vision). Check for exclusions and claim procedures.' },
      { name: 'Policy Start Date', details: 'Ensure your policy is active from the day you arrive in your destination country.' },
      { name: 'Carry Insurance Details', details: 'Keep a digital and physical copy of your insurance card or policy document with you.' },
      { name: 'Emergency Contacts', details: 'Save emergency contact numbers and the contact for your insurance provider.' },
    ],
  },
  {
    id: 'airport-pickup',
    title: 'Airport Pickup & Arrival',
    icon: PlaneTakeoff,
    description: 'Guidance for a smooth arrival at your destination airport.',
    items: [
      { name: 'University Pickup Services', details: 'Check if your university offers an airport pickup service for new international students. Book in advance if available.' },
      { name: 'Pre-Booked Transport', details: 'Consider pre-booking a shuttle or taxi service, especially if arriving late at night or with a lot of luggage.' },
      { name: 'Public Transport', details: 'Research public transport options from the airport to your accommodation. Familiarize yourself with routes and payment methods.' },
      { name: 'Arrival Information', details: 'Have your accommodation address and contact details readily accessible. Inform someone of your arrival time.' },
      { name: 'Immigration & Customs', details: 'Keep your passport, visa, offer letter, CoE/I-20/CAS, and financial proofs handy for immigration clearance.' },
      { name: 'SIM Card/Wi-Fi', details: 'Look for options to get a local SIM card or connect to airport Wi-Fi upon arrival to communicate.' },
    ],
  },
];

const finalChecklistItems = [
  "Passport & Visa: Valid and copies made (digital and physical).",
  "Offer Letter / CoE / I-20 / CAS: Original and copies.",
  "Flight Tickets: Confirmed and e-ticket printed/saved.",
  "Financial Documents: Proof of funds, scholarship letters (if any).",
  "Academic Documents: Original transcripts, certificates, and English test scores.",
  "Accommodation Details: Address and contact information confirmed.",
  "Medications: Prescription for any necessary medications (with doctor's note if required).",
  "Important Contacts: List of emergency contacts, university contacts, embassy/consulate.",
  "Adapters & Chargers: For your electronic devices suitable for the destination country.",
  "Basic Toiletries & Clothing: Pack essentials for the first few days.",
  "Inform Someone: Share your travel itinerary and arrival details with family/friends.",
];

export default function PreDepartureToolkitPage() {
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [introRef, isIntroVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
  const [checklistRef, isChecklistVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
  const [ctaRef, isCtaVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.1 });

  return (
    <div className="space-y-16 md:space-y-24">
      <section ref={titleRef} className={cn("transition-all duration-700 ease-out", isTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle
          title="Pre-Departure Survival Toolkit"
          subtitle="Essential tips and resources to ensure a smooth transition to your study destination."
        />
      </section>

      <div ref={introRef} className={cn("transition-all duration-700 ease-out delay-100", isIntroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <Alert className="bg-primary/10 border-primary/20 max-w-4xl mx-auto">
          <Info className="h-5 w-5 text-primary" />
          <AlertTitle className="font-semibold text-primary">Your Journey Begins!</AlertTitle>
          <AlertDescription className="text-foreground/80">
            Embarking on an international study adventure is exciting! This toolkit is designed to help you prepare for the practical aspects of moving abroad. Remember to also check specific guidelines from your university and the immigration authorities of your destination country.
          </AlertDescription>
        </Alert>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {toolkitSections.map((section, index) => {
          const [sectionRef, isSectionVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
          return (
            <div key={section.id} ref={sectionRef} className={cn("transition-all duration-500 ease-out", isSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{transitionDelay: `${index * 150}ms`}}>
              <Card className="shadow-xl bg-card h-full">
                <CardHeader>
                  <CardTitle className="font-headline text-primary flex items-center">
                    <section.icon className="mr-3 h-7 w-7" />
                    {section.title}
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="text-sm">
                        <strong className="text-foreground/90">{item.name}:</strong>
                        <p className="text-foreground/70 ml-1">{item.details}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      <section ref={checklistRef} className={cn("max-w-3xl mx-auto transition-all duration-700 ease-out delay-200", isChecklistVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <Card className="shadow-xl bg-card">
          <CardHeader>
            <CardTitle className="font-headline text-accent flex items-center">
              <CheckSquare className="mr-3 h-7 w-7" />
              Final Pre-Departure Checklist
            </CardTitle>
            <CardDescription>A quick rundown of crucial items to double-check before you travel.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="final-checklist">
                <AccordionTrigger className="text-lg hover:no-underline">View Checklist</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pt-2">
                    {finalChecklistItems.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckSquare className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground/80 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 text-center">
                    <Button variant="outline">
                        <DownloadCloud className="mr-2 h-4 w-4" /> Download Checklist PDF (Coming Soon)
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </section>
      
      <section ref={ctaRef} className={cn("text-center transition-all duration-700 ease-out delay-300", isCtaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
         <SectionTitle title="Have More Questions?" subtitle="Our team is here to provide personalized pre-departure support."/>
         <Link href="/contact">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6">
                Contact an Advisor
            </Button>
         </Link>
      </section>

    </div>
  );
}
