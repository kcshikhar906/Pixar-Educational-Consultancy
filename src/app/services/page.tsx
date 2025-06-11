
'use client';
import Image from 'next/image';
import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { services } from '@/lib/data';
import type { Service } from '@/lib/data';
import { CheckCircle } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

export default function ServicesPage() {
  const [titleSectionRef, isTitleSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [ctaSectionRef, isCtaSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.2 });

  return (
    <div className="space-y-16 md:space-y-24">
      <div ref={titleSectionRef} className={cn("transition-all duration-700 ease-out", isTitleSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle 
          title="Our Comprehensive Services" 
          subtitle="We offer a wide range of services designed to support you at every step of your journey to studying abroad. From initial counseling to pre-departure assistance, we've got you covered." 
        />
      </div>

      {services.map((service: Service, index: number) => {
        const [serviceSectionRef, isServiceSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.1 });
        return (
          <section 
            key={service.id} 
            id={service.id} 
            ref={serviceSectionRef}
            className={cn(
              "py-12 transition-all duration-700 ease-out", 
              isServiceSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
              index % 2 === 1 ? 'bg-secondary/50 rounded-lg shadow-inner' : ''
            )}
          >
            <div className="container mx-auto px-4">
              <div className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div 
                  className={cn(
                    "relative aspect-video rounded-lg shadow-xl overflow-hidden transition-all duration-500 ease-out",
                    isServiceSectionVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
                    index % 2 === 1 ? 'md:order-last' : ''
                  )}
                  style={{transitionDelay: isServiceSectionVisible ? '100ms' : '0ms'}}
                >
                  {service.imageUrl && (
                    <Image 
                      src={service.imageUrl} 
                      alt={service.title} 
                      layout="fill" 
                      objectFit="cover" 
                      data-ai-hint={service.dataAiHint || 'education support'}
                    />
                  )}
                </div>
                <div 
                  className={cn(
                    "space-y-4 transition-all duration-500 ease-out",
                     isServiceSectionVisible ? "opacity-100 translate-x-0" : "opacity-0 " + (index % 2 === 1 ? "-translate-x-10" : "translate-x-10")
                  )}
                  style={{transitionDelay: isServiceSectionVisible ? '200ms' : '0ms'}}
                >
                  <div className="flex items-center space-x-3">
                    <service.icon className="h-10 w-10 text-primary" />
                    <h2 className="text-3xl font-headline font-bold text-primary">{service.title}</h2>
                  </div>
                  <p className="text-lg text-foreground/80">
                    {service.longDescription || service.description}
                  </p>
                  <ul className="space-y-2 text-foreground/70">
                    {/* Example bullet points, customize per service */}
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-accent mr-2" /> Personalized consultation</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-accent mr-2" /> Step-by-step guidance</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-accent mr-2" /> Access to expert resources</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        );
      })}
      
      {/* Call to Action Section */}
      <section 
        ref={ctaSectionRef}
        className={cn(
          "text-center py-16 bg-gradient-to-r from-primary to-accent rounded-lg shadow-xl transition-all duration-700 ease-out",
          isCtaSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-headline font-bold text-primary-foreground mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-xl mx-auto">
            Let our experts help you navigate the path to your dream university.
          </p>
          <a href="/contact">
            <button className="bg-background text-primary font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-background/90 transition-colors duration-300 text-lg">
              Get in Touch
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}
