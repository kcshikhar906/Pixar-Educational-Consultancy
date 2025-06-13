
'use client';

import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExternalLink, Clock, DollarSign, Award, BarChart3, ListChecks, ClipboardType } from 'lucide-react'; // Updated icons
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const testComparisonData = [
  {
    name: "IELTS Academic",
    cost: "~$245-275 USD / ~Rs. 32,500-36,500",
    typicalDuration: "Approx. 2h 45m",
    acceptance: "Very High (Academia, Immigration globally)",
    format: "Paper or Computer; Face-to-face speaking option",
    resultTime: "3-5 days (computer), 13 days (paper)",
    scoring: "Band 0-9",
    keyFeatures: ["Widely accepted globally", "Speaking test with a human examiner"],
    officialSiteUrl: "https://www.ielts.org/"
  },
  {
    name: "TOEFL iBT",
    cost: "~$255 USD / ~Rs. 34,000",
    typicalDuration: "Under 2 hours",
    acceptance: "Very High (Especially US Academia)",
    format: "Computer-based at test center",
    resultTime: "4-8 days (official), unofficial reading/listening scores immediate",
    scoring: "0-120 (30 per section)",
    keyFeatures: ["Strong academic focus", "Integrated tasks simulating university environment"],
    officialSiteUrl: "https://www.toefl.org/"
  },
  {
    name: "PTE Academic",
    cost: "~$220-250 USD / ~Rs. 29,000-33,000",
    typicalDuration: "Approx. 2 hours",
    acceptance: "High (Academia, Immigration in Australia, NZ, UK, growing elsewhere)",
    format: "Computer-based, AI scored",
    resultTime: "Typically 2 days (can be up to 5)",
    scoring: "10-90 (Global Scale of English)",
    keyFeatures: ["Fast results", "Fully computer-scored including speaking"],
    officialSiteUrl: "https://www.pearsonpte.com/"
  },
  {
    name: "Duolingo English Test",
    cost: "~$59 USD / ~Rs. 7,800",
    typicalDuration: "Approx. 1 hour (including setup & interview)",
    acceptance: "Growing (Many US universities, some others)",
    format: "Computer-adaptive, at-home online proctoring",
    resultTime: "Within 2 days",
    scoring: "10-160 (Overall & subscores)",
    keyFeatures: ["Affordable and accessible", "Can be taken online anytime, adaptive difficulty"],
    officialSiteUrl: "https://englishtest.duolingo.com/"
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

export default function EnglishTestGuidePage() {
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [tabsContainerRef, isTabsContainerVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.05 });
  const [ctaRef, isCtaVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.1 });

  return (
    <div className="space-y-16 md:space-y-24">
      <section ref={titleRef} className={cn("transition-all duration-700 ease-out", isTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle
          title="English Proficiency Test Guide"
          subtitle="Navigate the world of English tests. Find the right one for your goals and learn how to prepare."
        />
      </section>

      <div ref={tabsContainerRef} className={cn("transition-all duration-700 ease-out", isTabsContainerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <Tabs defaultValue="comparison-guide" className="w-full">
          <TabsList className="h-auto p-0 grid w-full grid-cols-2 sm:grid-cols-3 md:w-fit mx-auto mb-8">
            <TabsTrigger 
              value="comparison-guide" 
              className="py-2.5 whitespace-normal text-center"
            >
              <ListChecks className="mr-2 h-5 w-5" /> Comparison Guide
            </TabsTrigger>
            <TabsTrigger 
              value="test-structures" 
              className="py-2.5 whitespace-normal text-center"
            >
              <BarChart3 className="mr-2 h-5 w-5" /> Test Structures
            </TabsTrigger>
            <TabsTrigger 
              value="score-requirements" 
              className="py-2.5 whitespace-normal text-center"
            >
              <ClipboardType className="mr-2 h-5 w-5" /> Score Requirements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comparison-guide">
            <Card className="shadow-xl bg-card">
              <CardHeader>
                <CardTitle className="font-headline text-primary">Test Comparison Overview</CardTitle>
                <CardDescription>Quick overview of key features to help you choose. Test names link to official sites.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test Name</TableHead>
                        <TableHead><DollarSign className="inline mr-1 h-4 w-4"/>Typical Cost (Rs.)</TableHead>
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
                          <TableCell className="font-medium">
                            <a href={test.officialSiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline text-primary">
                              {test.name} <ExternalLink className="ml-1.5 h-4 w-4" />
                            </a>
                          </TableCell>
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
          </TabsContent>

          <TabsContent value="test-structures">
            <div className="grid md:grid-cols-2 gap-8">
              {testStructures.map((test) => (
                <div key={test.name}>
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
              ))}
            </div>
          </TabsContent>

          <TabsContent value="score-requirements">
            <Card className="max-w-3xl mx-auto shadow-lg bg-card">
              <CardHeader>
                 <CardTitle className="font-headline text-primary">Minimum Score Requirements</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-foreground/80">
                  Minimum score requirements for English proficiency tests vary significantly based on the country, institution (university/college), and specific program you are applying to.
                  There is no single "universal" minimum score.
                </p>
                <ul className="list-disc list-inside mt-4 text-foreground/70 space-y-1 text-sm">
                  <li>Always check the official admissions website of each university and program you are interested in for their specific English language proficiency requirements.</li>
                  <li>Requirements can also differ for undergraduate, postgraduate, and Ph.D. programs.</li>
                  <li>Some institutions might accept multiple tests (e.g., IELTS or TOEFL or PTE), while others may prefer a specific one.</li>
                  <li>Visa requirements for study permits may also have separate minimum language score criteria set by the country's immigration department.</li>
                </ul>
                <p className="text-primary font-semibold mt-4">
                  Our AI Test Advisor can give you a general idea, but for precise requirements, direct university/program research is essential.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

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

    