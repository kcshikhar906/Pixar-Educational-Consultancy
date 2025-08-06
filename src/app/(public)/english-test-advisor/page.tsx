
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Info } from 'lucide-react';

export default function EnglishTestAdvisorMovedPage() {
  return (
    <div className="space-y-12 flex flex-col items-center justify-center min-h-[calc(100vh-20rem)] py-8">
      <SectionTitle
        title="Feature Moved"
        subtitle="The English Test Advisor has been integrated into our Smart Tools page."
      />
      <Card className="max-w-lg w-full text-center shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-primary flex items-center justify-center">
            <Info className="mr-2 h-6 w-6" />
            English Test Advisor Update
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80 mb-6">
            This standalone English Test Advisor has been updated and moved.
            You can find the latest version, now using efficient rule-based logic, on our "Smart Tools" page.
          </p>
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/ai-assistants">
              Go to Smart Tools <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
