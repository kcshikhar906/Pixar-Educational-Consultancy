'use client';

import Image from 'next/image';
import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, Filter, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { testimonials, visaSuccesses } from '@/lib/data';
import type { Testimonial, VisaSuccess } from '@/lib/data';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// Combine Testimonial and VisaSuccess into a single type for display
type SuccessStory = {
  id: string;
  name: string;
  studyDestination: string;
  text?: string;
  avatarUrl?: string;
  dataAiHint?: string;
};

// This new component correctly encapsulates the hook logic for a single card.
const SuccessStoryCard = ({ story }: { story: SuccessStory }) => {
  const [cardRef, isCardVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });

  return (
    <div ref={cardRef} className={cn("transition-all duration-500 ease-out", isCardVisible ? "opacity-100 scale-100" : "opacity-0 scale-95")}>
      <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
        <CardHeader className="flex flex-row items-center space-x-4 pb-4">
          {story.avatarUrl && (
            <Image
              src={story.avatarUrl}
              alt={story.name}
              width={60}
              height={60}
              className="rounded-full object-cover"
              data-ai-hint={story.dataAiHint || "student portrait"}
            />
          )}
          {!story.avatarUrl && (
            <div className="h-[60px] w-[60px] bg-muted rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-primary">{story.name.charAt(0)}</span>
            </div>
          )}
          <div className="flex-1">
            <CardTitle className="font-headline text-lg text-primary">{story.name}</CardTitle>
            <CardDescription className="text-xs text-accent line-clamp-2">{story.studyDestination}</CardDescription>
          </div>
        </CardHeader>
        {story.text && (
          <CardContent className="flex-grow">
            <div className="flex mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />)}
            </div>
            <p className="text-foreground/80 italic text-sm">&quot;{story.text}&quot;</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default function SuccessStoriesPage() {
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  
  const [shuffledStories, setShuffledStories] = useState<SuccessStory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [storiesPerPage, setStoriesPerPage] = useState(12);
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  useEffect(() => {
    // This effect runs only on the client side after hydration
    const allVisaSuccesses: SuccessStory[] = Object.values(visaSuccesses)
      .flat()
      .map((student: VisaSuccess, index: number) => ({
        id: `vs-${index}`,
        name: student.name,
        studyDestination: student.destination,
      }));

    const allTestimonials: SuccessStory[] = testimonials.map(t => ({
      ...t,
      studyDestination: t.studyDestination,
    }));
    
    const combinedStories = [...allTestimonials, ...allVisaSuccesses];

    // Fisher-Yates shuffle algorithm
    for (let i = combinedStories.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combinedStories[i], combinedStories[j]] = [combinedStories[j], combinedStories[i]];
    }

    setShuffledStories(combinedStories);
    setIsClientLoaded(true);
  }, []);

  const totalPages = Math.ceil(shuffledStories.length / storiesPerPage);
  const startIndex = (currentPage - 1) * storiesPerPage;
  const currentStories = shuffledStories.slice(startIndex, startIndex + storiesPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleStoriesPerPageChange = (value: string) => {
    setStoriesPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="space-y-12">
      <section ref={titleRef} className={cn("transition-all duration-700 ease-out", isTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle
          title="Our Student Success Stories"
          subtitle="We are proud to have guided hundreds of students to achieve their global education dreams. Here are some of them."
        />
      </section>

      {/* Controls */}
      <Card className="p-4 shadow-sm bg-card/80 sticky top-20 z-40">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">
                    Showing <span className="font-bold text-primary">{shuffledStories.length}</span> total success stories.
                </p>
            </div>
            <div className="flex items-center space-x-2">
                <Label htmlFor="stories-per-page" className="text-sm font-medium">Show per page:</Label>
                <Select
                    value={String(storiesPerPage)}
                    onValueChange={handleStoriesPerPageChange}
                    disabled={!isClientLoaded}
                >
                    <SelectTrigger id="stories-per-page" className="w-[80px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {[12, 24, 48, 96].map(num => (
                            <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
      </Card>
      
      {!isClientLoaded ? (
         <div className="text-center py-16 flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-lg text-muted-foreground">Loading success stories...</p>
         </div>
      ) : currentStories.length > 0 ? (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentStories.map((story: SuccessStory) => (
              <SuccessStoryCard key={story.id} story={story} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <span className="text-sm font-medium text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </section>
      ) : (
        <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No success stories found.</p>
        </div>
      )}
    </div>
  );
}
