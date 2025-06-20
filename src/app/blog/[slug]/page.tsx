
import { getAllPostIds, getPostData, type PostData, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import SectionTitle from '@/components/ui/section-title';
import { CalendarDays, UserCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import RecentPostsList from '@/components/blog/RecentPostsList'; // New component

interface PostPageProps {
  params: {
    slug: string;
  };
}

// Generate static paths for all posts at build time
export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths;
}

export async function generateMetadata({ params }: PostPageProps) {
  const postData = await getPostData(params.slug);
  if (!postData || postData.title === 'Post Not Found') {
    return {
      title: 'Post Not Found',
    };
  }
  return {
    title: postData.title,
    description: postData.excerpt || 'Blog post from Pixar Educational Consultancy',
    authors: [{ name: postData.author || 'Pixar Edu Team' }],
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const postData: PostData = await getPostData(params.slug);

  if (!postData || postData.title === 'Post Not Found' || !postData.contentHtml) {
    notFound(); // This will render the not-found.tsx file or a default Next.js 404 page
  }

  const allPosts = getAllPosts();
  const recentPosts = allPosts
    .filter(p => p.id !== postData.id) // Exclude current post
    .slice(0, 5); // Get top 5 most recent other posts

  return (
    <div className="py-8"> {/* Main page container with padding */}
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12"> {/* Grid for main content and sidebar */}
        {/* Main Blog Post Content */}
        <article className="lg:col-span-8">
          <header className="mb-8 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-3">
              {postData.title}
            </h1>
            <div className="text-sm text-muted-foreground flex items-center justify-center lg:justify-start space-x-4">
              <div className="flex items-center">
                <CalendarDays className="mr-1.5 h-4 w-4" />
                {postData.date ? format(new Date(postData.date), 'MMMM d, yyyy') : 'N/A'}
              </div>
              {postData.author && (
                <div className="flex items-center">
                  <UserCircle className="mr-1.5 h-4 w-4" />
                  {postData.author}
                </div>
              )}
            </div>
          </header>

          {/* Apply Tailwind Typography prose styling for markdown content */}
          <div
            className="prose dark:prose-invert 
                       prose-lg 
                       max-w-none
                       prose-headings:font-headline 
                       prose-headings:text-primary dark:prose-headings:text-primary
                       prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl 
                       prose-a:text-accent hover:prose-a:text-accent/80 dark:prose-a:text-accent dark:hover:prose-a:text-accent/80
                       prose-strong:text-foreground/90 dark:prose-strong:text-foreground/90
                       prose-em:text-foreground/80 dark:prose-em:text-foreground/80
                       prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-foreground/80
                       prose-ul:list-disc prose-ul:pl-5
                       prose-ol:list-decimal prose-ol:pl-5
                       prose-li:my-1 prose-li:marker:text-accent
                       prose-code:font-code prose-code:bg-muted prose-code:text-foreground/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm
                       prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-md prose-pre:overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }}
          />

          <div className="mt-12 text-center lg:text-left">
            <Button asChild variant="outline">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Link>
            </Button>
          </div>
        </article>

        {/* Sidebar for Recent Posts (Desktop) */}
        <aside className="lg:col-span-4 lg:block hidden sticky top-28 self-start"> {/* sticky top adjusted for header */}
          <RecentPostsList posts={recentPosts} title="Recent Posts" />
        </aside>
      </div>

      {/* Recent Posts for Mobile (appears below main content) */}
      <div className="mt-16 lg:hidden">
        <RecentPostsList posts={recentPosts} title="You Might Also Like" />
      </div>
    </div>
  );
}
