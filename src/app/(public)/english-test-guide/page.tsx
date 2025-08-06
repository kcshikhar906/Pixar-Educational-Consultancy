
'use client';

import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExternalLink, CheckSquare, Clock, DollarSign, Award, BarChart3 } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

const testComparisonData = [
  { 
    name: "IELTS Academic", 
    cost: "~$245-275 USD / ~रु ३२,५००-३६,५००", 
    typicalDuration: "Approx. 2h 45m", 
    acceptance: "Very High (Academia, Immigration globally)", 
    format: "Paper or Computer; Face-to-face speaking option", 
    resultTime: "3-5 days (computer), 13 days (paper)",
    scoring: "Band 0-9",
    keyFeatures: ["Widely accepted globally", "Speaking test with a human examiner"] 
  },
  { 
    name: "TOEFL iBT", 
    cost: "~$255 USD / ~रु ३४,०००", 
    typicalDuration: "Under 2 hours", 
    acceptance: "Very High (Especially US Academia)", 
    format: "Computer-based at test center", 
    resultTime: "4-8 days (official), unofficial reading/listening scores immediate",
    scoring: "0-120 (30 per section)",
    keyFeatures: ["Strong academic focus", "Integrated tasks simulating university environment"] 
  },
  { 
    name: "PTE Academic", 
    cost: "~$220-250 USD / ~रु २९,०००-३३,०००", 
    typicalDuration: "Approx. 2 hours", 
    acceptance: "High (Academia, Immigration in Australia, NZ, UK, growing elsewhere)", 
    format: "Computer-based, AI scored", 
    resultTime: "Typically 2 days (can be up to 5)",
    scoring: "10-90 (Global Scale of English)",
    keyFeatures: ["Fast results", "Fully computer-scored including speaking"] 
  },
  { 
    name: "Duolingo English Test", 
    cost: "~$59 USD / ~रु ७,८००", 
    typicalDuration: "Approx. 1 hour (including setup & interview)", 
    acceptance: "Growing (Many US universities, some others)", 
    format: "Computer-adaptive, at-home online proctoring", 
    resultTime: "Within 2 days",
    scoring: "10-160 (Overall & subscores)",
    keyFeatures: ["Affordable and accessible", "Can be taken online anytime, adaptive difficulty"] 
  }
];

const testStructures = [
  {
    name: "IELTS Academic",
    icon: BarChart3,
    sections: [
      { name: "Listening", duration: "30 minutes (+10 mins transfer time for paper-based)", description: "4 sections, 40 questions. Variety of question types." },
      { name: "Reading", duration: "60 minutes", description: "3 long passages, 40 questions. Texts are academic." },
      { name: "Writing", duration: "60 minutes", description: "2 tasks: Task 1 (describe visual info, 150 words), Task 2 (essay, 250 words)." },
      { name: "Speaking", duration: "11-14 minutes", description: "3 parts: Introduction & interview, individual long turn, discussion." },
    ],
    totalTime: "Approx. 2 hours 45 minutes"
  },
  {
    name: "TOEFL iBT",
    icon: BarChart3,
    sections: [
      { name: "Reading", duration: "35 minutes", description: "2 passages, 20 questions. Academic texts." },
      { name: "Listening", duration: "36 minutes", description: "3 lectures, 2 conversations; 28 questions. Academic context." },
      { name: "Speaking", duration: "16 minutes", description: "4 tasks: 1 independent, 3 integrated (reading/listening + speaking)." },
      { name: "Writing", duration: "29 minutes", description: "2 tasks: 1 integrated (reading/listening + writing, 20 mins), 1 academic discussion task (10 mins)." },
    ],
    totalTime: "Under 2 hours"
  },
  {
    name: "PTE Academic",
    icon: BarChart3,
    sections: [
      { name: "Speaking & Writing (Part 1)", duration: "54-67 minutes", description: "Personal introduction, read aloud, repeat sentence, describe image, re-tell lecture, answer short question, summarize written text, essay." },
      { name: "Reading (Part 2)", duration: "29-30 minutes", description: "Fill in the blanks (multiple choice), multiple choice questions (single/multiple answer), re-order paragraphs." },
      { name: "Listening (Part 3)", duration: "30-43 minutes", description: "Summarize spoken text, multiple choice questions, fill in the blanks, highlight correct summary, select missing word, highlight incorrect words, write from dictation." },
    ],
    totalTime: "Approx. 2 hours"
  },
  {
    name: "Duolingo English Test",
    icon: BarChart3,
    sections: [
      { name: "Adaptive Section", duration: "Approx. 45 minutes", description: "Computer-adaptive test with a variety of question types assessing reading, writing, speaking, and listening skills. Questions include read and complete, listen and type, read aloud, speak about a topic, write about a topic, interactive reading, and interactive listening." },
      { name: "Video Interview & Writing Sample", duration: "Approx. 10 minutes", description: "Ungraded speaking and writing samples sent to institutions along with your score. Allows you to showcase your abilities." },
    ],
    totalTime: "Approx. 1 hour (including 5-minute setup)"
  }
];

const officialSites = [
  { name: "IELTS Official Site", url: "https://www.ielts.org/", icon: ExternalLink },
  { name: "PTE Official Site", url: "https://www.pearsonpte.com/", icon: ExternalLink },
  { name: "TOEFL Official Site", url: "https://www.toefl.org/", icon: ExternalLink },
  { name: "Duolingo Official Site", url: "https://englishtest.duolingo.com/", icon: ExternalLink },
];

export default function EnglishTestGuidePage() {
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [comparisonTableRef, isComparisonTableVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.1 });
  const [testStructuresSectionRef, isTestStructuresSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.05 });
  const [scoreReqsRef, isScoreReqsVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.1 });
  const [officialSitesRef, isOfficialSitesVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.1 });
  const [ctaRef, isCtaVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.1 });

  return (
    <div className="space-y-16 md:space-y-24">
      <section ref={titleRef} className={cn("transition-all duration-700 ease-out", isTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle
          title="English Proficiency Test Guide"
          subtitle="Navigate the world of English tests. Find the right one for your goals and learn how to prepare."
        />
      </section>

      <section ref={comparisonTableRef} className={cn("transition-all duration-700 ease-out", isComparisonTableVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <Card className="shadow-xl bg-card">
          <CardHeader>
            <CardTitle className="font-headline text-primary flex items-center"><CheckSquare className="mr-2 h-6 w-6"/>Comparison of Popular English Tests</CardTitle>
            <CardDescription>Quick overview of key features to help you choose.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Name</TableHead>
                    <TableHead><DollarSign className="inline mr-1 h-4 w-4"/>Typical Cost (NPR)</TableHead>
                    <TableHead><Clock className="inline mr-1 h-4 w-4"/>Duration</TableHead>
                    <TableHead><Award className="inline mr-1 h-4 w-4"/>Acceptance</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Result Time</TableHead>
                    <TableHead>Scoring</TableHead>
                    <TableHead>Key Features</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testComparisonData.map((test, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{test.name}</TableCell>
                      <TableCell>{test.cost}</TableCell>
                      <TableCell>{test.typicalDuration}</TableCell>
                      <TableCell>{test.acceptance}</TableCell>
                      <TableCell>{test.format}</TableCell>
                      <TableCell>{test.resultTime}</TableCell>
                      <TableCell>{test.scoring}</TableCell>
                      <TableCell className="text-xs">{test.keyFeatures.join(', ')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
             <p className="text-xs text-muted-foreground mt-4">* Costs are approximate and subject to change. Please check official websites for current fees in your region.</p>
          </CardContent>
        </Card>
      </section>

      <section ref={testStructuresSectionRef} className={cn("bg-secondary/30 py-12 rounded-lg shadow-inner transition-all duration-700 ease-out", isTestStructuresSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <div className="container mx-auto px-4">
          <SectionTitle title="Detailed Test Structures" subtitle="Understand the sections and timings for each major test." />
          <div className="grid md:grid-cols-2 gap-8">
            {testStructures.map((test, index) => {
              const [cardRef, cardVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
              return (
                <div key={test.name} ref={cardRef} className={cn("transition-all duration-500 ease-out", cardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{transitionDelay: `${index * 100}ms`}}>
                  <Card className="bg-card shadow-lg h-full">
                    <CardHeader>
                      <CardTitle className="font-headline text-primary flex items-center"><test.icon className="mr-2 h-6 w-6"/>{test.name}</CardTitle>
                      <CardDescription>Total Time: {test.totalTime}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {test.sections.map((section, sIndex) => (
                        <div key={sIndex} className="border-l-2 border-accent pl-3">
                          <h4 className="font-semibold text-foreground/90">{section.name}</h4>
                          <p className="text-sm text-muted-foreground"><Clock className="inline mr-1 h-3 w-3"/>{section.duration}</p>
                          <p className="text-sm text-foreground/80 mt-1">{section.description}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section ref={scoreReqsRef} className={cn("transition-all duration-700 ease-out", isScoreReqsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle title="Minimum Score Requirements" />
        <Card className="max-w-3xl mx-auto shadow-lg bg-card">
          <CardContent className="p-6">
            <p className="text-center text-foreground/80">
              Minimum score requirements for English proficiency tests vary significantly based on the country, institution (university/college), and specific program you are applying to. 
              There is no single "universal" minimum score.
            </p>
            <ul className="list-disc list-inside mt-4 text-foreground/70 space-y-1 text-sm">
              <li>Always check the official admissions website of each university and program you are interested in for their specific English language proficiency requirements.</li>
              <li>Requirements can also differ for undergraduate, postgraduate, and Ph.D. programs.</li>
              <li>Some institutions might accept multiple tests (e.g., IELTS or TOEFL or PTE), while others may prefer a specific one.</li>
              <li>Visa requirements for study permits may also have separate minimum language score criteria set by the country's immigration department.</li>
            </ul>
            <p className="text-center text-primary font-semibold mt-4">
              Our AI Test Advisor can give you a general idea, but for precise requirements, direct university/program research is essential.
            </p>
          </CardContent>
        </Card>
      </section>

      <section ref={officialSitesRef} className={cn("bg-primary/10 py-12 rounded-lg shadow-inner transition-all duration-700 ease-out", isOfficialSitesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <div className="container mx-auto px-4">
          <SectionTitle title="Official Test Websites" subtitle="Visit the official sources for the most accurate and up-to-date information." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 justify-items-center">
            {officialSites.map((site, index) => {
               const [siteRef, siteVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
              return (
                <div key={site.name} ref={siteRef} className={cn("w-full transition-all duration-500 ease-out", siteVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{transitionDelay: `${index * 100}ms`}}>
                  <Button asChild variant="outline" className="w-full bg-card hover:bg-accent/10 border-border py-6 text-base">
                    <a href={site.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center space-y-1">
                      <site.icon className="h-6 w-6 text-primary mb-1" />
                      <span className="text-center">{site.name}</span>
                    </a>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section ref={ctaRef} className={cn("text-center transition-all duration-700 ease-out", isCtaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
         <SectionTitle title="Ready to Prepare?" subtitle="Ace your English test with our expert guidance and comprehensive classes."/>
         <Link href="/contact">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6">
                Join Our English Preparation Class Today!
            </Button>
         </Link>
      </section>
    </div>
  );
}

  
