
'use client';

import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { services } from '@/lib/data';
import type { Service } from '@/lib/data';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

export default function ServicesPage() {
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });

  return (
    <div className="space-y-12 md:space-y-16">
      <section ref={titleRef} className={cn("transition-all duration-700 ease-out", isTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle
          title="Our Comprehensive Services"
          subtitle="We provide end-to-end support to ensure your journey to studying abroad is smooth, successful, and stress-free."
        />
      </section>

      <div className="space-y-16">
        {services.map((service: Service, index: number) => {
          const [serviceRef, isServiceVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
          return (
            <section
              key={service.id}
              id={service.id}
              ref={serviceRef}
              className={cn(
                "transition-all duration-700 ease-out scroll-mt-20",
                isServiceVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Card className="overflow-hidden shadow-xl bg-card">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className={cn("flex flex-col p-6 md:p-8", index % 2 !== 0 && "md:order-2")}>
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="font-headline text-2xl text-primary flex items-center">
                        <service.icon className="mr-3 h-8 w-8 text-accent" />
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-grow">
                      <CardDescription className="text-base text-foreground/80 mb-6">
                        {service.longDescription}
                      </CardDescription>
                      {service.keyFeatures && (
                        <div>
                          <h4 className="font-semibold text-lg text-primary mb-3">Key Features:</h4>
                          <ul className="space-y-2">
                            {service.keyFeatures.map((feature, i) => (
                              <li key={i} className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-foreground/80">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="p-0 mt-6">
                      <Button asChild className="bg-primary hover:bg-primary/90">
                        <Link href={`/contact?service=${encodeURIComponent(service.title)}`}>
                          Inquire About This Service
                        </Link>
                      </Button>
                    </CardFooter>
                  </div>
                  {service.imageUrl && (
                    <div className="relative min-h-[250px] md:min-h-0">
                      <Image
                        src={service.imageUrl}
                        alt={service.title}
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint={service.dataAiHint || 'education services'}
                      />
                    </div>
                  )}
                </div>
              </Card>
            </section>
          )
        })}
      </div>
    </div>
  );
}