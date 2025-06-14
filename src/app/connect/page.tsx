
'use client';

import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Facebook, Instagram, Youtube } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

// Custom TikTok Icon Component
const TikTokIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 28 32" // Using a common viewBox for this path
    fill="currentColor"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M20.656.001H24.4c.115 2.148.882 4.322 2.447 5.836 1.566 1.555 3.782 2.27 5.932 2.1.07.923.084 1.847.084 2.773-.014 1.858-.028 3.708-.028 5.566s.014 3.708.028 5.566c-.028 2.127-.868 4.273-2.42 5.787-1.553 1.51-3.727 2.21-5.892 2.07-.07.923-.084 1.847-.084 2.773-.014 1.858-.028 3.708-.028 5.566s.014 3.708.028 5.566c-1.647.042-3.294.042-4.94.042-1.48 0-2.968.028-4.45.028-.168-2.155-.868-4.28-2.433-5.82-1.58-1.556-3.78-2.24-5.92-2.1-.07-.923-.084-1.847-.084-2.773-.014-1.858-.028-3.708-.028-5.566s.014-3.708.028-5.566c.028-2.127.868-4.273 2.42-5.787 1.553-1.51 3.727-2.21 5.892-2.07.07-.923.084-1.847.084-2.773.014-1.858-.028-3.708-.028-5.566s-.014-3.708-.028-5.566c1.68-.056 3.358-.056 5.037-.056.112-.882.112-1.778.098-2.664.0-0.125.0-0.252.014-0.378H20.656zM23.186 26.09c-1.663 0-3.014 1.35-3.014 3.014s1.35 3.014 3.014 3.014 3.014-1.35 3.014-3.014-1.35-3.014-3.014-3.014zm0-14.84c-1.663 0-3.014 1.35-3.014 3.014s1.35 3.014 3.014 3.014 3.014-1.35 3.014-3.014-1.35-3.014-3.014-3.014z"/>
  </svg>
);


const socialPlatforms = [
  { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/pixaredu', colorClass: 'hover:text-blue-600', dataAiHint: 'facebook logo' },
  { name: 'TikTok', icon: TikTokIcon, url: 'https://www.tiktok.com/@pixareducation?_t=ZS-8xBncYemVFt&_r=1', colorClass: 'hover:text-black dark:hover:text-white', dataAiHint: 'tiktok logo' },
  { name: 'YouTube', icon: Youtube, url: 'https://www.youtube.com/@pixareducation', colorClass: 'hover:text-red-600', dataAiHint: 'youtube logo' },
  { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/pixar.education?igsh=MXE5ZWJhZ2tmNTMybQ==', colorClass: 'hover:text-pink-500', dataAiHint: 'instagram logo' },
];

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
