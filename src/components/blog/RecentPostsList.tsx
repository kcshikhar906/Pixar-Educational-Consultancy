
'use client';

import Link from 'next/link';
import { type PostData } from '@/lib/posts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { BookOpen } from 'lucide-react'; // Using BookOpen or similar for read more

interface RecentPostsListProps {
  posts: PostData[];
  title?: string;
}

export default function RecentPostsList({ posts, title = "Recent Posts" }: RecentPostsListProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <Card className="bg-card shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {posts.map(post => (
            <li key={post.id} className="border-b border-border/70 pb-3 last:border-b-0 last:pb-0">
              <Link href={`/blog/${post.id}`} className="group block">
                <h4 className="font-semibold text-md text-foreground/90 group-hover:text-accent transition-colors mb-1">
                  {post.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {post.date ? format(new Date(post.date), 'MMMM d, yyyy') : 'N/A'}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
