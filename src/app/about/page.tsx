
'use client';
import Image from 'next/image';
import Link from 'next/link'; 
import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Users, Handshake, CheckCircle } from 'lucide-react';
import { teamMembers, accreditations } from '@/lib/data.tsx'; 
import type { TeamMember, Accreditation } from '@/lib/data.tsx'; 
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import InteractiveTimeline from '@/components/about/InteractiveTimeline';

export default function AboutPage() {
  const whyChooseUsPoints = [
    { text: "Expertise Across Key Destinations: Our team specializes in comprehensive visa counselling for the USA, Australia, UK, Canada, and New Zealand, guiding you meticulously through each step.", icon: Award },
    { text: "Comprehensive Interview Preparation: We provide extensive visa interview preparation for all our destination countries, with specialized unlimited sessions for U.S. aspirants, ensuring you feel confident and ready.", icon: Users },
    { text: "End-to-End Assistance: From choosing the right universities to handling complex visa procedures, we are with you at every stage of your journey.", icon: Handshake },
    { text: "Proven Success: With a stellar track record, we take pride in the success stories of our students who are now thriving in prestigious universities worldwide.", icon: CheckCircle },
  ];

  const [s1Ref, s1Visible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [s2Ref, s2Visible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [s3Ref, s3Visible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [s4Ref, s4Visible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [s5Ref, s5Visible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });

  const firstRowTeamMembers = teamMembers.slice(0, 6);
  const secondRowTeamMembers = teamMembers.slice(6, 12);
  const lastRowTeamMember = teamMembers.length > 12 ? teamMembers[12] : null;


  const renderTeamMemberCard = (member: TeamMember, index: number) => {
    const isPradeep = member.id === 'team-13'; 
    const imageSizeClass = isPradeep ? "w-24 h-24" : "w-28 h-28 sm:w-32 sm:h-32"; 
    const bioLineClampClass = isPradeep ? "line-clamp-3" : "line-clamp-2"; 

    const animatedBorderContainerBaseClasses = "relative mx-auto shadow-sm transition-all duration-300 ease-out group-hover:shadow-lg group-hover:scale-105";
    const imageDisplayClasses = "";


    return (
      <Card className="text-center overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card h-full flex flex-col group">
        <div className="pt-4 px-4">
          <div className={cn(
            animatedBorderContainerBaseClasses,
            "team-image-animated-border-container", 
            imageSizeClass 
          )} style={{ '--animation-index': index } as React.CSSProperties} >
            <div className="team-image-content-wrapper"> 
              <Image
                src={member.imageUrl}
                alt={member.name}
                layout="fill"
                objectFit="cover"
                className={imageDisplayClasses}
                data-ai-hint={member.dataAiHint || 'professional portrait'}
              />
            </div>
          </div>
        </div>
        <CardHeader className="pt-3 pb-1 flex-grow">
          <CardTitle className="font-headline text-base text-primary">{member.name}</CardTitle>
          <p className="text-xs text-accent font-medium">{member.role}</p>
        </CardHeader>
        <CardContent className="px-3 pb-3 text-xs">
          <p className={cn(
            "text-foreground/70 leading-snug",
            bioLineClampClass
          )}>{member.bio}</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-16 md:space-y-24">
      {/* About Pixar Education Section */}
      <section ref={s1Ref} className={cn("transition-all duration-700 ease-out", s1Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle title="About Pixar Educational Consultancy" />
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/3] rounded-lg shadow-xl overflow-hidden">
            <Image
              src="/pixar.webp"
              alt="Pixar Educational Consultancy Office or Team"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
              data-ai-hint="modern office students"
            />
          </div>
          <div className="space-y-6">
            <p className="text-lg text-foreground/80">
              Pixar Educational Consultancy, Nepal’s trusted guide to fulfilling your dreams of studying in premier destinations including the{' '}
              <Link href="/country-guides#usa" className="hover:underline text-accent">USA 🇺🇸</Link>,{' '}
              <Link href="/country-guides#australia" className="hover:underline text-accent">Australia 🇦🇺</Link>,{' '}
              <Link href="/country-guides#uk" className="hover:underline text-accent">UK 🇬🇧</Link>,{' '}
              <Link href="/country-guides#canada" className="hover:underline text-accent">Canada 🇨🇦</Link>, and{' '}
              <Link href="/country-guides#new-zealand" className="hover:underline text-accent">New Zealand 🇳🇿</Link>. 
              Established in 2013, we have been at the forefront of student visa counselling for over a decade, helping countless Nepali students unlock life-changing opportunities in these leading study destinations.
            </p>
            <p className="text-foreground/70">
              Located in the heart of Nepal, Pixar Educational Consultancy is more than just a consultancy—we are your partners in turning your dreams into reality. With a decade of experience and an unwavering commitment to excellence, we are dedicated to helping you navigate the complexities of studying abroad with ease.
            </p>
            <p className="text-foreground/70">
              Whether you're at the start of your journey or preparing for your visa interview, we are here to guide, support, and inspire. Together, let’s make your international education dreams come true!
            </p>
          </div>
        </div>
      </section>

      {/* Our Journey Timeline Section */}
      <section ref={s2Ref} className={cn("bg-secondary/30 py-16 rounded-lg shadow-inner transition-all duration-700 ease-out", s2Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <div className="container mx-auto px-4">
            <SectionTitle title="Our Journey Since 2013" subtitle="A timeline of our commitment to student success." />
            <InteractiveTimeline />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section ref={s3Ref} className={cn("transition-all duration-700 ease-out", s3Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle title="Why Choose Pixar Edu?" subtitle="Dedicated to your success in global education." />
        <div className="grid md:grid-cols-2 gap-8">
            {whyChooseUsPoints.map((point, index) => {
              const [cardRef, cardVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.2 });
              return (
                <div key={index} ref={cardRef} className={cn("transition-all duration-500 ease-out", cardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{transitionDelay: `${index * 100}ms`}}>
                  <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow h-full">
                    <CardHeader className="flex flex-row items-center space-x-4">
                      <point.icon className="h-10 w-10 text-primary flex-shrink-0" />
                      <CardTitle className="text-xl font-headline text-primary">{point.text.split(':')[0]}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/80">{point.text.split(':').slice(1).join(':').trim()}</p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
      </section>
      
      {/* Team Section */}
      <section ref={s4Ref} className={cn("bg-primary/10 py-16 rounded-lg shadow-inner transition-all duration-700 ease-out", s4Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <div className="container mx-auto px-4">
          <SectionTitle title="Meet Our Expert Team" subtitle="Dedicated professionals passionate about your educational journey." />
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {firstRowTeamMembers.map((member: TeamMember, index: number) => {
               const [cardRef, cardVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
              return (
                <div key={member.id} ref={cardRef} className={cn("transition-all duration-500 ease-out", cardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{transitionDelay: `${index * 100}ms`}}>
                  {renderTeamMemberCard(member, index)}
                </div>
              );
            })}
          </div>

          {secondRowTeamMembers.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {secondRowTeamMembers.map((member: TeamMember, index: number) => {
                const [cardRef, cardVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
                return (
                  <div key={member.id} ref={cardRef} className={cn("transition-all duration-500 ease-out", cardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{transitionDelay: `${(index + 6) * 80}ms`}}>
                    {renderTeamMemberCard(member, index + 6)}
                  </div>
                );
              })}
            </div>
          )}

          {lastRowTeamMember && (
            <div className="mt-8 flex justify-center">
               <div className="w-full max-w-xs">
                {(() => {
                  const [cardRef, cardVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
                  return (
                    <div ref={cardRef} className={cn("transition-all duration-500 ease-out", cardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{transitionDelay: `${12 * 70}ms`}}>
                      {renderTeamMemberCard(lastRowTeamMember, 12)}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Accreditations Section */}
      <section ref={s5Ref} className={cn("transition-all duration-700 ease-out", s5Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <div className="container mx-auto px-4">
          <SectionTitle title="Our Accreditations" subtitle="Recognized for excellence and professionalism in educational consultancy." />
          {accreditations.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-stretch">
              {accreditations.map((accred: Accreditation, index: number) => {
                const [itemRef, itemVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
                return (
                  <div key={accred.id} ref={itemRef} className={cn("transition-all duration-500 ease-out", itemVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{transitionDelay: `${index * 70}ms`}}>
                    <div className="text-center p-4 rounded-lg bg-card shadow-md hover:shadow-lg transition-shadow h-full flex flex-col items-center justify-start group"> 
                      <div className="relative w-full h-32 mb-4"> 
                        <Image
                          src={accred.logoUrl} 
                          alt={accred.name}
                          layout="fill"
                          objectFit="contain" 
                          data-ai-hint={accred.dataAiHint || 'accreditation logo'}
                          className="transition-transform duration-300 ease-out group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-auto w-full"> 
                        <h4 className="font-semibold text-primary text-sm">{accred.name}</h4>
                        <p className="text-xs text-foreground/70">{accred.issuingBody}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-foreground/70">Details about our accreditations will be updated soon.</p>
          )}
        </div>
      </section>
    </div>
  );
}
