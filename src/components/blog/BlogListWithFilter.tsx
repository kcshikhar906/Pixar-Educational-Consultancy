
'use client';

import Link from 'next/link';
import { type PostData } from '@/lib/posts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, UserCircle, BookOpen, Filter as FilterIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, isAfter, subMonths, subYears, startOfDay } from 'date-fns';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface BlogListWithFilterProps {
  initialPosts: PostData[];
}

const filterOptions = [
  { value: 'all', label: 'All Time' },
  { value: '1m', label: 'Last Month' },
  { value: '3m', label: 'Last 3 Months' },
  { value: '6m', label: 'Last 6 Months' },
  { value: '1y', label: 'Last Year' },
];

export default function BlogListWithFilter({ initialPosts }: BlogListWithFilterProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [filteredPosts, setFilteredPosts] = useState<PostData[]>(initialPosts);

  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredPosts(initialPosts);
      return;
    }

    const now = new Date();
    let startDate: Date;

    switch (selectedFilter) {
      case '1m':
        startDate = subMonths(now, 1);
        break;
      case '3m':
        startDate = subMonths(now, 3);
        break;
      case '6m':
        startDate = subMonths(now, 6);
        break;
      case '1y':
        startDate = subYears(now, 1);
        break;
      default:
        setFilteredPosts(initialPosts);
        return;
    }
    
    const startOfFilterDate = startOfDay(startDate);

    const newFilteredPosts = initialPosts.filter(post => {
      try {
        const postDate = startOfDay(new Date(post.date));
        return isAfter(postDate, startOfFilterDate) || postDate.getTime() === startOfFilterDate.getTime();
      } catch (e) {
        console.error("Error parsing date for post:", post.title, post.date, e);
        return false; // Exclude posts with invalid dates
      }
    });
    setFilteredPosts(newFilteredPosts);
  }, [selectedFilter, initialPosts]);

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
          <FilterIcon className="h-5 w-5 text-primary" />
          <Label htmlFor="timeFilter" className="text-md font-medium">Filter by Date:</Label>
        </div>
        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
          <SelectTrigger id="timeFilter" className="w-full sm:w-[200px] bg-card">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post: PostData) => (
            <Card key={post.id} className="flex flex-col bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <Link href={`/blog/${post.id}`} className="hover:text-accent">
                  <CardTitle className="font-headline text-xl text-primary mb-2">{post.title}</CardTitle>
                </Link>
                <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                  <div className="flex items-center">
                    <CalendarDays className="mr-1.5 h-4 w-4" />
                    {post.date ? format(new Date(post.date), 'MMMM d, yyyy') : 'N/A'}
                  </div>
                  {post.author && (
                    <div className="flex items-center">
                      <UserCircle className="mr-1.5 h-4 w-4" />
                      {post.author}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-foreground/80 line-clamp-3">
                  {post.excerpt || 'Read more to find out...'}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild variant="link" className="text-accent p-0 hover:text-primary">
                  <Link href={`/blog/${post.id}`}>
                    Read More <BookOpen className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-foreground/70">No blog posts found for the selected filter.</p>
          <p className="text-muted-foreground mt-2">Try adjusting the filter or view all posts.</p>
        </div>
      )}
    </div>
  );
}

