
'use client';

import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Facebook, Twitter, Instagram, Linkedin, Youtube, MessageCircle } from 'lucide-react'; // Added more potential icons
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

// Placeholder for social links - user will provide these later
const socialPlatforms = [
  // { name: 'Facebook', icon: Facebook, url: '#', color: 'hover:text-blue-600', dataAiHint: 'facebook logo' },
  // { name: 'Twitter', icon: Twitter, url: '#', color: 'hover:text-sky-500', dataAiHint: 'twitter logo' },
  // { name: 'Instagram', icon: Instagram, url: '#', color: 'hover:text-pink-500', dataAiHint: 'instagram logo' },
  // { name: 'LinkedIn', icon: Linkedin, url: '#', color: 'hover:text-blue-700', dataAiHint: 'linkedin logo' },
  // { name: 'YouTube', icon: Youtube, url: '#', color: 'hover:text-red-600', dataAiHint: 'youtube logo' },
  // { name: 'WhatsApp', icon: MessageCircle, url: '#', color: 'hover:text-green-500', dataAiHint: 'whatsapp logo' },
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
              Our Social Channels
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {socialPlatforms.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder for creative display - to be implemented when links are provided */}
                {socialPlatforms.map((platform, index) => {
                  const [itemRef, itemVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.2 });
                  return (
                  <div key={platform.name} ref={itemRef} className={cn("transition-all duration-500 ease-out", itemVisible ? "opacity-100 scale-100" : "opacity-0 scale-90")} style={{transitionDelay: `${index * 100}ms`}}>
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex flex-col items-center justify-center p-6 bg-secondary/30 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 ${platform.color}`}
                    >
                      <platform.icon className="h-12 w-12 mb-3" />
                      <span className="text-lg font-medium text-foreground">{platform.name}</span>
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
