import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SectionTitle from '@/components/ui/section-title';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';
import { testimonials, services } from '@/lib/data';
import type { Testimonial, Service } from '@/lib/data';

export default function HomePage() {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary to-accent/80 rounded-lg shadow-xl overflow-hidden">
        <div className="absolute inset-0 opacity-10 SvgHeroPattern">
            {/* Placeholder for a subtle background pattern if desired */}
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary-foreground mb-6">
            Unlock Your Global Education Journey
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-10">
            Pixar Educational Consultancy guides you to the best universities worldwide. Start your adventure today!
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild className="bg-background text-primary hover:bg-background/90 shadow-lg">
              <Link href="/services">Explore Services <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 shadow-lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section>
        <SectionTitle title="Why Choose Pixar Edu?" subtitle="Your success is our priority. We offer unparalleled support and expertise." />
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Expert Guidance", description: "Experienced counselors providing personalized advice.", icon: <CheckCircle className="h-10 w-10 text-accent mb-4" /> },
            { title: "Global Network", description: "Access to a wide range of universities and programs.", icon: <CheckCircle className="h-10 w-10 text-accent mb-4" /> },
            { title: "Proven Success", description: "High success rates in admissions and visa applications.", icon: <CheckCircle className="h-10 w-10 text-accent mb-4" /> },
          ].map(item => (
            <Card key={item.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
              <CardContent className="p-6 pt-8">
                {item.icon}
                <h3 className="text-xl font-headline font-semibold text-primary mb-2">{item.title}</h3>
                <p className="text-foreground/80">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Services Overview Section */}
      <section>
        <SectionTitle title="Our Core Services" subtitle="Comprehensive support to navigate your educational path." />
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {services.slice(0,3).map((service: Service) => (
            <Card key={service.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
              {service.imageUrl && (
                <div className="relative h-48 w-full">
                  <Image src={service.imageUrl} alt={service.title} layout="fill" objectFit="cover" data-ai-hint={service.dataAiHint || 'education service'} />
                </div>
              )}
              <CardHeader>
                <CardTitle className="font-headline text-primary flex items-center"><service.icon className="mr-2 h-6 w-6 text-accent" />{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">{service.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="link" className="text-accent p-0">
                  <Link href={`/services#${service.id}`}>Learn More <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center mt-10">
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/services">View All Services</Link>
            </Button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-secondary/50 py-16 rounded-lg shadow-inner">
        <SectionTitle title="Success Stories" subtitle="Hear from students who achieved their dreams with us." />
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial: Testimonial) => (
            <Card key={testimonial.id} className="bg-card shadow-lg">
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                {testimonial.avatarUrl && <Image src={testimonial.avatarUrl} alt={testimonial.name} width={60} height={60} className="rounded-full" data-ai-hint="person student" />}
                <div>
                  <CardTitle className="font-headline text-primary">{testimonial.name}</CardTitle>
                  <p className="text-sm text-accent">{testimonial.studyDestination}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-foreground/80 italic">&quot;{testimonial.text}&quot;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
