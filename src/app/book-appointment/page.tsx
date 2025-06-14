
'use client';

import { useState } from 'react';
import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExternalLink, Clock, DollarSign, Award, BarChart3, ListChecks, Replace as ReplaceIcon } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';

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

// Score Converter Data and Logic
const testOptionsForConverter = [
  { value: 'ielts', label: 'IELTS Academic', scale: { min: 0, max: 9, step: 0.5 } },
  { value: 'toefl', label: 'TOEFL iBT', scale: { min: 0, max: 120, step: 1 } },
  { value: 'pte', label: 'PTE Academic', scale: { min: 10, max: 90, step: 1 } },
  { value: 'duolingo', label: 'Duolingo English Test', scale: { min: 10, max: 160, step: 5 } },
];

// Simplified, approximate conversion ranges.
// Based on publicly available comparison charts (e.g. ETS, Pearson, IELTS).
// THIS IS AN ESTIMATION and should be treated as such.
const approximateConversions: Record<string, Record<string, (score: number) => string>> = {
  ielts: {
    toefl: (s) => {
      if (s === 9) return "118-120"; if (s === 8.5) return "115-117"; if (s === 8) return "110-114";
      if (s === 7.5) return "102-109"; if (s === 7) return "94-101"; if (s === 6.5) return "79-93";
      if (s === 6) return "60-78"; if (s === 5.5) return "46-59"; if (s === 5) return "35-45";
      if (s === 4.5) return "32-34"; if (s <= 4) return "0-31"; return "N/A";
    },
    pte: (s) => {
      if (s === 9) return "89-90"; if (s === 8.5) return "83-85"; if (s === 8) return "76-82";
      if (s === 7.5) return "66-75"; if (s === 7) return "59-65"; if (s === 6.5) return "51-58";
      if (s === 6) return "43-50"; if (s === 5.5) return "35-42"; if (s === 5) return "29-34";
      if (s === 4.5) return "23-28"; if (s <= 4) return "<23"; return "N/A";
    },
    duolingo: (s) => {
      if (s === 9) return "155-160"; if (s === 8.5) return "150"; if (s === 8) return "140-145";
      if (s === 7.5) return "130-135"; if (s === 7) return "120-125"; if (s === 6.5) return "110-115";
      if (s === 6) return "100-105"; if (s === 5.5) return "90-95"; if (s === 5) return "80-85";
      if (s === 4.5) return "70-75"; if (s <= 4) return "10-65"; return "N/A";
    },
  },
  toefl: {
    ielts: (s) => {
      if (s >= 118) return "9.0"; if (s >= 115) return "8.5"; if (s >= 110) return "8.0";
      if (s >= 102) return "7.5"; if (s >= 94) return "7.0"; if (s >= 79) return "6.5";
      if (s >= 60) return "6.0"; if (s >= 46) return "5.5"; if (s >= 35) return "5.0";
      if (s >= 32) return "4.5"; if (s <= 31) return "0-4.0"; return "N/A";
    },
    pte: (s) => { // TOEFL to PTE
      if (s >= 118) return "89-90"; if (s >= 115) return "83-85"; if (s >= 110) return "76-82";
      if (s >= 102) return "66-75"; if (s >= 94) return "59-65"; if (s >= 79) return "51-58";
      if (s >= 60) return "43-50"; if (s >= 46) return "35-42"; return "<35";
    },
    duolingo: (s) => { // TOEFL to Duolingo
      if (s >= 118) return "155-160"; if (s >= 115) return "150"; if (s >= 110) return "140-145";
      if (s >= 102) return "130-135"; if (s >= 94) return "120-125"; if (s >= 79) return "110-115";
      if (s >= 60) return "100-105"; if (s >= 46) return "90-95"; return "<90";
    },
  },
  pte: {
    ielts: (s) => {
      if (s >= 89) return "9.0"; if (s >= 83) return "8.5"; if (s >= 76) return "8.0";
      if (s >= 66) return "7.5"; if (s >= 59) return "7.0"; if (s >= 51) return "6.5";
      if (s >= 43) return "6.0"; if (s >= 35) return "5.5"; if (s >= 29) return "5.0";
      if (s >= 23) return "4.5"; if (s < 23) return "<4.5"; return "N/A";
    },
    toefl: (s) => { // PTE to TOEFL
      if (s >= 89) return "118-120"; if (s >= 83) return "115-117"; if (s >= 76) return "110-114";
      if (s >= 66) return "102-109"; if (s >= 59) return "94-101"; if (s >= 51) return "79-93";
      if (s >= 43) return "60-78"; if (s >= 35) return "46-59"; return "<46";
    },
    duolingo: (s) => { // PTE to Duolingo
      if (s >= 89) return "155-160"; if (s >= 83) return "150"; if (s >= 76) return "140-145";
      if (s >= 66) return "130-135"; if (s >= 59) return "120-125"; if (s >= 51) return "110-115";
      if (s >= 43) return "100-105"; if (s >= 35) return "90-95"; return "<90";
    },
  },
  duolingo: {
    ielts: (s) => {
      if (s >= 155) return "9.0"; if (s >= 150) return "8.5"; if (s >= 140) return "8.0";
      if (s >= 130) return "7.5"; if (s >= 120) return "7.0"; if (s >= 110) return "6.5";
      if (s >= 100) return "6.0"; if (s >= 90) return "5.5"; if (s >= 80) return "5.0";
      if (s >= 70) return "4.5"; if (s <= 65) return "<4.5"; return "N/A";
    },
     toefl: (s) => { // Duolingo to TOEFL
      if (s >= 155) return "118-120"; if (s >= 150) return "115-117"; if (s >= 140) return "110-114";
      if (s >= 130) return "102-109"; if (s >= 120) return "94-101"; if (s >= 110) return "79-93";
      if (s >= 100) return "60-78"; if (s >= 90) return "46-59"; return "<46";
    },
    pte: (s) => { // Duolingo to PTE
      if (s >= 155) return "89-90"; if (s >= 150) return "83-85"; if (s >= 140) return "76-82";
      if (s >= 130) return "66-75"; if (s >= 120) return "59-65"; if (s >= 110) return "51-58";
      if (s >= 100) return "43-50"; if (s >= 90) return "35-42"; return "<35";
    },
  },
};


export default function EnglishTestGuidePage() {
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [tabsContainerRef, isTabsContainerVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.05 });
  const [ctaRef, isCtaVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.1 });

  // State for Score Converter
  const [inputScore, setInputScore] = useState('');
  const [fromTest, setFromTest] = useState('');
  const [toTest, setToTest] = useState('');
  const [convertedScoreResult, setConvertedScoreResult] = useState<string | null>(null);
  const [conversionError, setConversionError] = useState<string | null>(null);

  const handleConvertScore = () => {
    setConversionError(null);
    setConvertedScoreResult(null);

    if (!fromTest || !toTest || !inputScore) {
      setConversionError("Please select both tests and enter a score.");
      return;
    }

    const selectedFromTestDetails = testOptionsForConverter.find(t => t.value === fromTest);
    if (!selectedFromTestDetails) {
      setConversionError("Invalid 'Test Taken' selected.");
      return;
    }

    const scoreValue = parseFloat(inputScore);
    if (isNaN(scoreValue) || scoreValue < selectedFromTestDetails.scale.min || scoreValue > selectedFromTestDetails.scale.max) {
      setConversionError(`Score for ${selectedFromTestDetails.label} must be between ${selectedFromTestDetails.scale.min} and ${selectedFromTestDetails.scale.max}.`);
      return;
    }
    // Validate step for IELTS
    if (fromTest === 'ielts' && scoreValue % 0.5 !== 0) {
        setConversionError(`IELTS score must be in increments of 0.5 (e.g., 6.0, 6.5).`);
        return;
    }
    // Validate step for Duolingo
    if (fromTest === 'duolingo' && scoreValue % 5 !== 0) {
        setConversionError(`Duolingo score must be in increments of 5 (e.g., 110, 115).`);
        return;
    }


    if (fromTest === toTest) {
      setConvertedScoreResult(`Equivalent ${selectedFromTestDetails.label} score: ${scoreValue}`);
      return;
    }

    const conversionFunction = approximateConversions[fromTest]?.[toTest];
    if (conversionFunction) {
      const result = conversionFunction(scoreValue);
      const toTestLabel = testOptionsForConverter.find(t => t.value === toTest)?.label || toTest;
      setConvertedScoreResult(`Approx. equivalent ${toTestLabel} score: ${result}`);
    } else {
      setConvertedScoreResult("Direct conversion for this pair is not commonly provided. Results may be less precise or N/A.");
      // Try indirect conversion if possible (e.g. From -> IELTS -> To) - more complex, for future enhancement
    }
  };


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
            <TabsTrigger value="comparison-guide" className="py-2.5 whitespace-normal text-center">
              <ListChecks className="mr-2 h-5 w-5" /> Comparison Guide
            </TabsTrigger>
            <TabsTrigger value="test-structures" className="py-2.5 whitespace-normal text-center">
              <BarChart3 className="mr-2 h-5 w-5" /> Test Structures
            </TabsTrigger>
            <TabsTrigger value="score-converter" className="py-2.5 whitespace-normal text-center">
              <ReplaceIcon className="mr-2 h-5 w-5" /> Score Converter
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

          <TabsContent value="score-converter">
            <Card className="max-w-2xl mx-auto shadow-lg bg-card">
              <CardHeader>
                 <CardTitle className="font-headline text-primary flex items-center"><ReplaceIcon className="mr-2 h-6 w-6"/>English Test Score Converter</CardTitle>
                 <CardDescription>Get an approximate conversion between major English proficiency tests. This is for general guidance only.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  <div>
                    <Label htmlFor="inputScore" className="text-sm font-medium text-foreground/90">Your Score</Label>
                    <Input 
                      id="inputScore" 
                      type="number" 
                      placeholder="e.g., 7.0 or 95" 
                      value={inputScore}
                      onChange={(e) => setInputScore(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fromTest" className="text-sm font-medium text-foreground/90">Test Taken</Label>
                    <Select value={fromTest} onValueChange={setFromTest}>
                      <SelectTrigger id="fromTest" className="w-full mt-1">
                        <SelectValue placeholder="Select your test" />
                      </SelectTrigger>
                      <SelectContent>
                        {testOptionsForConverter.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="toTest" className="text-sm font-medium text-foreground/90">Convert To Test</Label>
                  <Select value={toTest} onValueChange={setToTest}>
                    <SelectTrigger id="toTest" className="w-full mt-1">
                      <SelectValue placeholder="Select target test" />
                    </SelectTrigger>
                    <SelectContent>
                      {testOptionsForConverter.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleConvertScore} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <ReplaceIcon className="mr-2 h-4 w-4" /> Convert Score
                </Button>

                {conversionError && (
                  <Alert variant="destructive">
                    <AlertTitle>Input Error</AlertTitle>
                    <AlertDescription>{conversionError}</AlertDescription>
                  </Alert>
                )}
                {convertedScoreResult && !conversionError && (
                  <Alert variant="default" className="bg-secondary/50 border-secondary">
                    <AlertTitle className="text-primary font-semibold">Conversion Result</AlertTitle>
                    <AlertDescription className="text-lg text-foreground/90">{convertedScoreResult}</AlertDescription>
                  </Alert>
                )}
                <Alert variant="default" className="mt-4">
                    <Award className="h-4 w-4" />
                    <AlertTitle>Important Disclaimer</AlertTitle>
                    <AlertDescription className="text-xs">
                        This score converter provides an **estimation** based on generally available comparison charts. Score equivalencies can vary by institution and are subject to change. Always refer to the specific requirements of the universities or organizations you are applying to and consult official score comparison resources from test providers (ETS, IELTS.org, Pearson, Duolingo). Pixar Educational Consultancy is not liable for decisions made based on this estimation.
                    </AlertDescription>
                </Alert>
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

    