
'use client';

import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2 } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { socialPlatforms } from '@/lib/data';

export default function ConnectPage() {
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [contentRef, isContentVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });

  return (
    <div className="space-y-12 md:space-y-16">
      <section ref={titleRef} className={cn("transition-all duration-700 ease-out", isTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle
          title="Connect With Us"
          subtitle="Stay updated and engage with us on our social media platforms."
        />
      </section>

      <section ref={contentRef} className={cn("transition-all duration-700 ease-out", isContentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <Card className="max-w-4xl mx-auto shadow-xl bg-card">
          <CardHeader>
            <CardTitle className="font-headline text-primary flex items-center">
              <Share2 className="mr-3 h-7 w-7" />
              Follow Our Channels
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {socialPlatforms.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                {socialPlatforms.map((platform, index) => {
                  const [itemRef, itemVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.2 });
                  return (
                  <div key={platform.name} ref={itemRef} className={cn("transition-all duration-500 ease-out", itemVisible ? "opacity-100 scale-100" : "opacity-0 scale-90")} style={{transitionDelay: `${index * 100}ms`}}>
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "group flex flex-col items-center justify-center p-6 bg-background/70 dark:bg-secondary/30 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-transparent hover:border-primary/30",
                        platform.colorClass
                      )}
                    >
                      <platform.icon className="h-12 w-12 mb-3 text-primary transition-colors duration-300 group-hover:opacity-80" />
                      <span className="text-lg font-semibold text-foreground transition-colors duration-300">{platform.name}</span>
                       <p className="text-xs text-muted-foreground mt-1 text-center">Follow us on {platform.name}</p>
                    </a>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Share2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-xl text-muted-foreground mb-2">
                  Our social media links will be showcased here soon!
                </p>
                <p className="text-foreground/70">
                  We're preparing a unique and creative way to display our channels. Please check back later.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
