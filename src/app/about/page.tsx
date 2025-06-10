import Image from 'next/image';
import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, Award } from 'lucide-react';
import { teamMembers, certifications } from '@/lib/data';
import type { TeamMember, Certification } from '@/lib/data';

export default function AboutPage() {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Mission Section */}
      <section>
        <SectionTitle title="Our Mission & Vision" subtitle="Empowering students to achieve their global academic aspirations through expert guidance and unwavering support." />
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="Our Mission" 
              width={600} 
              height={400} 
              className="rounded-lg shadow-xl"
              data-ai-hint="students studying" 
            />
          </div>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Target className="h-12 w-12 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-headline font-semibold text-primary mb-2">Our Mission</h3>
                <p className="text-foreground/80">
                  To provide ethical, comprehensive, and personalized educational consultancy services that empower students to make informed decisions about their international education and future careers.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Award className="h-12 w-12 text-accent mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-headline font-semibold text-primary mb-2">Our Vision</h3>
                <p className="text-foreground/80">
                  To be the leading educational consultancy recognized for our commitment to student success, integrity, and innovation in guiding the next generation of global leaders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-secondary/50 py-16 rounded-lg shadow-inner">
        <SectionTitle title="Meet Our Expert Team" subtitle="Dedicated professionals passionate about your educational journey." />
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member: TeamMember) => (
            <Card key={member.id} className="text-center overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
              <div className="relative h-56 w-full">
                <Image 
                  src={member.imageUrl} 
                  alt={member.name} 
                  layout="fill" 
                  objectFit="cover" 
                  data-ai-hint={member.dataAiHint || 'professional portrait'}
                />
              </div>
              <CardHeader className="pt-6">
                <CardTitle className="font-headline text-xl text-primary">{member.name}</CardTitle>
                <p className="text-sm text-accent font-medium">{member.role}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/70">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Certifications Section */}
      <section>
        <SectionTitle title="Our Accreditations" subtitle="Recognized for excellence and professionalism in educational consultancy." />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {certifications.map((cert: Certification) => (
            <div key={cert.id} className="text-center p-4 rounded-lg bg-card shadow-md hover:shadow-lg transition-shadow">
              <Image 
                src={cert.logoUrl} 
                alt={cert.name} 
                width={120} 
                height={80} 
                className="mx-auto mb-3 object-contain" 
                data-ai-hint={cert.dataAiHint || 'logo badge'}
              />
              <h4 className="font-semibold text-primary text-sm md:text-base">{cert.name}</h4>
              <p className="text-xs text-foreground/70">{cert.issuingBody}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
