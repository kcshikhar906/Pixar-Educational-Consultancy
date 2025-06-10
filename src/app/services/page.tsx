import Image from 'next/image';
import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { services } from '@/lib/data';
import type { Service } from '@/lib/data';
import { CheckCircle } from 'lucide-react';

export default function ServicesPage() {
  return (
    <div className="space-y-16 md:space-y-24">
      <SectionTitle 
        title="Our Comprehensive Services" 
        subtitle="We offer a wide range of services designed to support you at every step of your journey to studying abroad. From initial counseling to pre-departure assistance, we've got you covered." 
      />

      {services.map((service: Service, index: number) => (
        <section key={service.id} id={service.id} className={`py-12 ${index % 2 === 1 ? 'bg-secondary/50 rounded-lg shadow-inner' : ''}`}>
          <div className="container mx-auto px-4">
            <div className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className={`relative aspect-video rounded-lg shadow-xl overflow-hidden ${index % 2 === 1 ? 'md:order-last' : ''}`}>
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
              <div className="space-y-4">
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
      ))}
      
      {/* Call to Action Section */}
      <section className="text-center py-16 bg-gradient-to-r from-primary to-accent rounded-lg shadow-xl">
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
