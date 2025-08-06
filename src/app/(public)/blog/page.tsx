
import { getAllPosts, type PostData } from '@/lib/posts';
import SectionTitle from '@/components/ui/section-title';
import BlogListWithFilter from '@/components/blog/BlogListWithFilter'; // New client component

export default function BlogPage() {
  const allPosts: PostData[] = getAllPosts();

  return (
    <div className="space-y-12">
      <SectionTitle 
        title="Our Blog" 
        subtitle="Stay updated with the latest news and insights from Pixar Educational Consultancy." 
      />
      <BlogListWithFilter initialPosts={allPosts} />
    </div>
  );
}
