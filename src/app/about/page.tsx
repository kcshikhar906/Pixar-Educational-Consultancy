import Image from 'next/image';
import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, Award, CheckCircle, Building, Heart, Handshake, Goal, Lightbulb } from 'lucide-react';
import { teamMembers, certifications } from '@/lib/data';
import type { TeamMember, Certification } from '@/lib/data';

export default function AboutPage() {
  const whyChooseUsPoints = [
    { text: "Expertise in U.S.A Education: Our team specializes in U.S. student visa counselling, guiding you through every step of the application process with precision and care.", icon: Award },
    { text: "Unlimited Interview Preparation: We are proud to be the only consultancy in Nepal offering unlimited visa interview preparation classes, ensuring you feel confident and ready for your big day.", icon: Users },
    { text: "End-to-End Assistance: From choosing the right universities to handling complex visa procedures, we are with you at every stage of your journey.", icon: Handshake },
    { text: "Proven Success: With a stellar track record, we take pride in the success stories of our students who are now thriving in prestigious U.S. universities.", icon: CheckCircle },
  ];

  const valuesPoints = [
    "To guide the students to select the best Institutions according to their ability.",
    "To provide first-hand information to the students about the institutions for effective and efficient Study.",
    "To prepare the students for a new educational environment through proper counselling.",
    "To offer our services in a transparent manner so that students and their valued parents are fully satisfied with our job undertaken.",
    "To strengthen relationship and confidence among students and our institution by getting to know each other through interaction programs on a regular basis.",
    "To function as the bridge between the students and their parents in terms of the progress made by the students so that sharing of information can be of help to future students."
  ];

  return (
    <div className="space-y-16 md:space-y-24">
      {/* About Pixar Education Section */}
      <section>
        <SectionTitle title="About Pixar Educational Consultancy" />
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/3] rounded-lg shadow-xl overflow-hidden">
            <Image 
              src="https://placehold.co/600x450.png" 
              alt="Pixar Educational Consultancy Office or Team" 
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
              data-ai-hint="modern office students" 
            />
          </div>
          <div className="space-y-6">
            <p className="text-lg text-foreground/80">
              Pixar Educational Consultancy, Nepal’s trusted guide to fulfilling your dreams of studying in the United States of America 🇺🇸. Established in 2013, we have been at the forefront of student visa counselling for over a decade, helping countless Nepali students unlock life-changing opportunities in the USA 🇺🇸.
            </p>
            <p className="text-foreground/70">
              Located in the heart of Nepal, Pixar Educational Consultancy is more than just a consultancy—we are your partners in turning your dreams into reality. With a decade of experience and an unwavering commitment to excellence, we are dedicated to helping you navigate the complexities of studying in The U.S.A 🇺🇸 with ease.
            </p>
            <p className="text-foreground/70">
              Whether you're at the start of your journey or preparing for your visa interview, we are here to guide, support, and inspire. Together, let’s make your U.S.A 🇺🇸 education dreams come true!
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-secondary/30 py-16 rounded-lg shadow-inner">
        <div className="container mx-auto px-4">
          <SectionTitle title="Why Choose Pixar Edu?" subtitle="Dedicated to your success in U.S. education." />
          <div className="grid md:grid-cols-2 gap-8">
            {whyChooseUsPoints.map((point, index) => (
              <Card key={index} className="bg-card shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <point.icon className="h-10 w-10 text-primary flex-shrink-0" />
                  <CardTitle className="text-xl font-headline text-primary">{point.text.split(':')[0]}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">{point.text.split(':').slice(1).join(':').trim()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Our Approach and Network Section */}
      <section>
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
      <section className="bg-primary/10 py-16 rounded-lg shadow-inner">
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
      <section className="bg-secondary/50 py-16 rounded-lg shadow-inner">
        <div className="container mx-auto px-4">
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
        </div>
      </section>

      {/* Certifications Section */}
      <section>
        <div className="container mx-auto px-4">
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
        </div>
      </section>
    </div>
  );
}
