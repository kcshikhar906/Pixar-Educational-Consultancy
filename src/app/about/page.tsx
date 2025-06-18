
'use client';
import Image from 'next/image';
import Link from 'next/link'; // Added Link import
import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, Award, CheckCircle, Building, Heart, Handshake, Goal, Lightbulb, UsersRound } from 'lucide-react';
import { teamMembers, accreditations } from '@/lib/data.tsx'; 
import type { TeamMember, Accreditation } from '@/lib/data.tsx'; 
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

export default function AboutPage() {
  const whyChooseUsPoints = [
    { text: "Expertise Across Key Destinations: Our team specializes in comprehensive visa counselling for the USA, Australia, UK, Canada, and New Zealand, guiding you meticulously through each step.", icon: Award },
    { text: "Comprehensive Interview Preparation: We provide extensive visa interview preparation for all our destination countries, with specialized unlimited sessions for U.S. aspirants, ensuring you feel confident and ready.", icon: Users },
    { text: "End-to-End Assistance: From choosing the right universities to handling complex visa procedures, we are with you at every stage of your journey.", icon: Handshake },
    { text: "Proven Success: With a stellar track record, we take pride in the success stories of our students who are now thriving in prestigious universities worldwide.", icon: CheckCircle },
  ];

  const valuesPoints = [
    "To guide the students to select the best Institutions according to their ability.",
    "To provide first-hand information to the students about the institutions for effective and efficient Study.",
    "To prepare the students for a new educational environment through proper counselling.",
    "To offer our services in a transparent manner so that students and their valued parents are fully satisfied with our job undertaken.",
    "To strengthen relationship and confidence among students and our institution by getting to know each other through interaction programs on a regular basis.",
    "To function as the bridge between the students and their parents in terms of the progress made by the students so that sharing of information can be of help to future students."
  ];

  const [s1Ref, s1Visible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [s2Ref, s2Visible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [s3Ref, s3Visible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [s4Ref, s4Visible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [s5Ref, s5Visible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [s6Ref, s6Visible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });

  const firstRowTeamMembers = teamMembers.slice(0, 6);
  const secondRowTeamMembers = teamMembers.slice(6, 12);
  const lastRowTeamMember = teamMembers.length > 12 ? teamMembers[12] : null;


  const renderTeamMemberCard = (member: TeamMember) => (
    <Card className="text-center overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card h-full flex flex-col group">
      <div className="pt-4 px-4">
        <div className="relative w-24 h-24 mx-auto rounded-md overflow-hidden shadow-sm group-hover:shadow-lg transition-shadow">
          <Image
            src={member.imageUrl}
            alt={member.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 ease-out group-hover:scale-105"
            data-ai-hint={member.dataAiHint || 'professional portrait'}
          />
        </div>
      </div>
      <CardHeader className="pt-3 pb-1 flex-grow">
        <CardTitle className="font-headline text-base text-primary">{member.name}</CardTitle>
        <p className="text-xs text-accent font-medium">{member.role}</p>
      </CardHeader>
      <CardContent className="px-3 pb-3 text-xs">
        <p className="text-foreground/70 leading-snug line-clamp-3">{member.bio}</p>
      </CardContent>
    </Card>
  );

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

      {/* Why Choose Us Section */}
      <section ref={s2Ref} className={cn("bg-secondary/30 py-16 rounded-lg shadow-inner transition-all duration-700 ease-out", s2Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <div className="container mx-auto px-4">
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
        </div>
      </section>

      {/* Our Approach and Network Section */}
      <section ref={s3Ref} className={cn("transition-all duration-700 ease-out", s3Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle title="Our Approach and Network" subtitle="Providing comprehensive solutions for your global education." />
        <div className="space-y-8 max-w-3xl mx-auto text-foreground/80 text-left md:text-lg">
          <p>
            We have a broad network with national and international education providers; we are able to suggest a wide range of study options and programs to meet the students' needs. The advantages of overseas education are very high nowadays, since it facilitates better exposure in a wider horizon. Obtaining a globally accepted degree from abroad allows people to travel and live anywhere in the world with highflying careers, a truly cosmopolitan experience.
          </p>
          <p>
            We are currently in a highly lucrative market in a rapidly growing economy. Our services are positioned very carefully: they are of extremely high quality, relevant, timely and accurate, tailored to the students' needs so as to enable them to make the right decisions, in turn leading towards their career benefiting the overall future.
          </p>
          <p>
            We intend to implement a market penetration strategy that will ensure that we are well known and respected by our students and their parents. The marketing will convey the sense of quality in every picture, every promotion, and every publication. Our promotional strategies involve integrating advertising, fairs and exhibitions, personal counselling, public relations, direct marketing and Internet marketing etc.
          </p>
          <p className="font-semibold text-primary">
            In a nutshell, we don't just intend to market and sell our service, but to market and sell customized information, solutions and a total-quality environment. This will ensure we establish a reputable Educational Consultancy image.
          </p>
        </div>
      </section>

      {/* Mission and Values Section */}
      <section ref={s4Ref} className={cn("bg-primary/10 py-16 rounded-lg shadow-inner transition-all duration-700 ease-out", s4Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Goal className="h-10 w-10 text-primary" />
                <h3 className="text-3xl font-headline font-semibold text-primary">Our Mission</h3>
              </div>
              <p className="text-foreground/80">
                Pixar Educational Consultancy works with a unique mission of becoming preferred Services Provider to the Students. Sustaining the flow of students towards our organization by providing effective services with assured satisfaction is our main target. We firmly believe that further education requires proper planning to ensure that, students choose the appropriate academic pathway.
              </p>
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Heart className="h-10 w-10 text-accent" />
                <h3 className="text-3xl font-headline font-semibold text-accent">Our Values</h3>
              </div>
              <p className="text-foreground/80 mb-4">
                We recognize that needs of every students is important, and hence deserve the very best service possible. We are professional in our approach like understanding student’s interest, ethical, commitment and social responsibility. We continuously believe in providing professional services to students, parents and our institutional clients at all times.
              </p>
              <ul className="space-y-2">
                {valuesPoints.map((value, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent mr-2 mt-1 flex-shrink-0" />
                    <span className="text-foreground/70">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={s5Ref} className={cn("bg-secondary/50 py-16 rounded-lg shadow-inner transition-all duration-700 ease-out", s5Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <div className="container mx-auto px-4">
          <SectionTitle title="Meet Our Expert Team" subtitle="Dedicated professionals passionate about your educational journey." />
          
          {/* First row of 6 team members */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {firstRowTeamMembers.map((member: TeamMember, index: number) => {
               const [cardRef, cardVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
              return (
                <div key={member.id} ref={cardRef} className={cn("transition-all duration-500 ease-out", cardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{transitionDelay: `${index * 100}ms`}}>
                  {renderTeamMemberCard(member)}
                </div>
              );
            })}
          </div>

          {/* Second row of 6 team members */}
          {secondRowTeamMembers.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {secondRowTeamMembers.map((member: TeamMember, index: number) => {
                const [cardRef, cardVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
                return (
                  <div key={member.id} ref={cardRef} className={cn("transition-all duration-500 ease-out", cardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{transitionDelay: `${(index + 6) * 80}ms`}}> {/* Adjust delay for staggered effect */}
                    {renderTeamMemberCard(member)}
                  </div>
                );
              })}
            </div>
          )}

          {/* Last row with a single centered team member */}
          {lastRowTeamMember && (
            <div className="mt-8 flex justify-center">
               <div className="w-full max-w-xs"> {/* Adjust max-width as needed for the card size */}
                {(() => { // Immediately invoked function for scroll animation hook
                  const [cardRef, cardVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
                  return (
                    <div ref={cardRef} className={cn("transition-all duration-500 ease-out", cardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{transitionDelay: `${12 * 70}ms`}}>
                      {renderTeamMemberCard(lastRowTeamMember)}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Accreditations Section */}
      <section ref={s6Ref} className={cn("transition-all duration-700 ease-out", s6Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
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

