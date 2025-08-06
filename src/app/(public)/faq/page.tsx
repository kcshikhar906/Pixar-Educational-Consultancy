
'use client';

import SectionTitle from '@/components/ui/section-title';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: ReactNode;
}

interface FAQCategory {
  categoryName: string;
  questions: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    categoryName: 'General & Consultation',
    questions: [
      {
        id: 'gen_q1',
        question: 'What is Pixar Educational Consultancy?',
        answer:
          'Pixar Educational Consultancy is a student-focused organization dedicated to helping Nepali students achieve their dreams of studying abroad, primarily in the USA, Australia, UK, Canada, and New Zealand. We provide comprehensive guidance and support throughout the entire process.',
      },
      {
        id: 'gen_q2',
        question: 'What services does Pixar Educational Consultancy offer?',
        answer: (
          <>
            We offer a wide range of services, including personalized academic counseling, university and course selection, application assistance (SOP/LOR guidance), visa application support (including mock interviews), pre-departure briefings, and expert English test preparation for IELTS, TOEFL, PTE, and Duolingo. You can learn more on our{' '}
            <Link href="/services" className="text-accent hover:underline">
              Services page
            </Link>
            .
          </>
        ),
      },
      {
        id: 'gen_q3',
        question: 'Which countries do you specialize in for study abroad?',
        answer: (
          <>
            We specialize in guiding students for studies in the USA, UK, Australia, Canada, and New Zealand. Our team has in-depth knowledge of the education systems and visa processes for these countries. Check out our{' '}
            <Link href="/country-guides" className="text-accent hover:underline">
              Country Guides
            </Link>{' '}
            for more details.
          </>
        ),
      },
      {
        id: 'gen_q4',
        question: 'Why should I choose Pixar Educational Consultancy?',
        answer: (
          <>
            Pixar Educational Consultancy stands out due to our student-centric approach, experienced counselors, high success rates, ethical practices, and end-to-end support. We are particularly known for our unlimited visa interview preparation for U.S. aspirants. Learn more about us on the{' '}
            <Link href="/about" className="text-accent hover:underline">
              About Us page
            </Link>
            .
          </>
        ),
      },
      {
        id: 'gen_q5',
        question: 'How do I start the consultation process?',
        answer: (
          <>
            You can start by{' '}
            <Link href="/contact" className="text-accent hover:underline">
              contacting us
            </Link>{' '}
            via phone, email, or by visiting our office in New Baneshwor, Kathmandu. You can also fill out the{' '}
            <Link href="/contact" className="text-accent hover:underline">
              contact form on our website
            </Link>
            . We typically begin with an initial counseling session to understand your needs.
          </>
        ),
      },
      {
        id: 'gen_q6',
        question: 'Is the initial consultation free?',
        answer:
          'Yes, our initial consultation session is generally free of charge. This allows us to understand your profile and aspirations, and for you to understand how we can assist you.',
      },
    ],
  },
  {
    categoryName: 'Application & University Selection',
    questions: [
      {
        id: 'app_q1',
        question: 'How do you help with choosing universities and courses?',
        answer:
          'Our counselors conduct a detailed assessment of your academic background, interests, career goals, and financial budget. Based on this, we help you shortlist suitable universities and courses that align with your profile and aspirations.',
      },
      {
        id: 'app_q2',
        question: "What if I'm unsure about my field of study?",
        answer: (
          <>
            That&apos;s perfectly normal! Our counselors are experienced in helping students explore their interests and aptitudes. We can discuss various career pathways and related fields of study to help you make an informed decision. Our{' '}
            <Link href="/ai-assistants" className="text-accent hover:underline">
              Pathway Planner tool on the Smart Tools page
            </Link>{' '}
            might also be helpful.
          </>
        ),
      },
      {
        id: 'app_q3',
        question: 'Can you help with writing SOPs (Statements of Purpose) and LORs (Letters of Recommendation)?',
        answer:
          'Yes, we provide guidance and feedback on your Statement of Purpose (SOP) and help you understand what makes a strong Letter of Recommendation (LOR). We assist in structuring your thoughts and highlighting your strengths effectively, but the core content must be yours.',
      },
      {
        id: 'app_q4',
        question: 'What documents are typically required for university applications?',
        answer: (
          <>
            Common documents include academic transcripts and certificates, English proficiency test scores (IELTS, TOEFL, etc.), SOP, LORs, passport copy, and sometimes a CV/resume or portfolio, depending on the course. Our{' '}
            <Link href="/ai-assistants" className="text-accent hover:underline">
              Document Checklist tool on the Smart Tools page
            </Link>{' '}
            can provide a more personalized list.
          </>
        ),
      },
      {
        id: 'app_q5',
        question: 'Do you help with scholarship applications?',
        answer:
          "Yes, we guide students in identifying potential scholarship opportunities offered by universities and provide advice on the application process. However, securing a scholarship depends on the student's profile and the university's criteria.",
      },
      {
        id: 'app_q6',
        question: 'How long does the application process take?',
        answer:
          'The timeline can vary greatly depending on the country, intake session (e.g., Fall, Spring), university processing times, and how prepared the student is. It can range from a few months to over a year. We recommend starting the process at least 6-12 months before your intended intake.',
      },
    ],
  },
  {
    categoryName: 'Visa Process',
    questions: [
      {
        id: 'visa_q1',
        question: 'What kind of visa support do you provide?',
        answer:
          'We provide comprehensive visa guidance, which includes assistance with filling out visa application forms, preparing financial documentation, scheduling visa appointments, and conducting mock visa interviews to prepare you for the actual interview.',
      },
      {
        id: 'visa_q2',
        question: 'Do you offer visa interview preparation? Specifically for the USA?',
        answer:
          'Yes, extensive visa interview preparation is a key part of our services. We are proud to be the only consultancy in Nepal offering unlimited visa interview preparation classes, especially for U.S. F-1 visa aspirants, ensuring you feel confident and ready.',
      },
      {
        id: 'visa_q3',
        question: 'What are the common reasons for student visa rejection?',
        answer:
          'Common reasons include insufficient financial proof, lack of clarity in study intentions (not being a "genuine student"), poor interview performance, incorrect documentation, or not meeting the specific requirements of the host country. We help you mitigate these risks.',
      },
      {
        id: 'visa_q4',
        question: 'How much money do I need to show for a student visa?',
        answer:
          'The amount varies significantly by country and the duration/cost of your program. It typically needs to cover your first year of tuition fees and living expenses. We provide specific guidance based on your chosen destination and university.',
      },
      {
        id: 'visa_q5',
        question: 'When should I apply for my student visa?',
        answer:
          "You should apply for your student visa as soon as you receive your acceptance letter (e.g., I-20 for the USA, CAS for the UK, CoE for Australia) and have all your documents in order. Visa processing times can vary, so applying early is advisable.",
      },
    ],
  },
  {
    categoryName: 'English Test Preparation (IELTS, TOEFL, PTE, Duolingo)',
    questions: [
      {
        id: 'eng_q1',
        question: 'Which English proficiency test should I take?',
        answer: (
          <>
            The choice of test (IELTS, TOEFL, PTE, Duolingo) depends on the requirements of your target universities and country. Our English Test Advisor tool on the{' '}
            <Link href="/ai-assistants" className="text-accent hover:underline">
              Smart Tools page
            </Link>{' '}
            can give an initial recommendation, and our counselors provide specific advice. You can also learn more from our{' '}
            <Link href="/book-appointment" className="text-accent hover:underline">
             English Test Guide
            </Link>
            .
          </>
        ),
      },
      {
        id: 'eng_q2',
        question: 'What scores are generally required for these tests?',
        answer: (
          <>
            Minimum scores vary widely. For example, for IELTS, many universities ask for an overall band of 6.0 to 7.0. For TOEFL iBT, scores might range from 79 to 100+. Always check the specific requirements of your chosen institutions. Our{' '}
            <Link href="/book-appointment" className="text-accent hover:underline">
              English Test Guide
            </Link>{' '}
            provides more general information.
          </>
        ),
      },
      {
        id: 'eng_q3',
        question: 'Do you offer preparation classes for these English tests?',
        answer: (
          <>
            Yes, we offer expert preparation classes for IELTS (Academic & General Training), TOEFL iBT, PTE Academic, and the Duolingo English Test. Our classes are designed to help you achieve your desired scores. You can inquire about classes via our{' '}
            <Link href="/contact" className="text-accent hover:underline">
              Contact page
            </Link>
            .
          </>
        ),
      },
      {
        id: 'eng_q4',
        question: 'How long are your test preparation courses?',
        answer: (
          <>
            Course durations vary based on the test and the student&apos;s current proficiency. We offer flexible options, including intensive courses and longer-term programs. Please{' '}
            <Link href="/contact" className="text-accent hover:underline">
              contact us
            </Link>{' '}
            for specific batch details.
          </>
        ),
      },
      {
        id: 'eng_q5',
        question: 'What is included in your English test preparation classes?',
        answer:
          'Our classes typically include comprehensive coverage of all test sections (Reading, Writing, Listening, Speaking), practice materials, mock tests, personalized feedback from experienced instructors, and strategies to tackle different question types.',
      },
    ],
  },
  {
    categoryName: 'Services & Fees',
    questions: [
      {
        id: 'fee_q1',
        question: 'What are your service charges or consultancy fees?',
        answer: (
          <>
            Our service charges vary depending on the range of services you opt for (e.g., full package vs. specific service like visa guidance only). We believe in transparency; please{' '}
            <Link href="/contact" className="text-accent hover:underline">
              contact us
            </Link>{' '}
            for a detailed breakdown relevant to your needs.
          </>
        ),
      },
      {
        id: 'fee_q2',
        question: 'Are there any hidden costs involved?',
        answer:
          'We are committed to transparency. All our service fees are clearly communicated upfront. External costs like university application fees, visa fees, test fees, and SEVIS fees are separate and paid directly to the respective authorities.',
      },
      {
        id: 'fee_q3',
        question: 'What payment methods do you accept?',
        answer:
          'We typically accept payments via bank transfer, cash, and sometimes digital wallets. Specific payment options will be discussed during your consultation.',
      },
      {
        id: 'fee_q4',
        question: 'Do you offer any packages for your services?',
        answer:
          'Yes, we often have service packages that combine various stages of the study abroad process, which can be more cost-effective. Our counselors can discuss these options with you.',
      },
    ],
  },
  {
    categoryName: 'Post-Arrival & Other Support',
    questions: [
      {
        id: 'post_q1',
        question: 'Do you provide pre-departure briefings?',
        answer:
          'Yes, we conduct comprehensive pre-departure briefings for students who have secured their visas. These sessions cover essential information about the destination country, cultural adaptation, accommodation tips, travel essentials, and initial settlement.',
      },
      {
        id: 'post_q2',
        question: 'Can you help with accommodation arrangements?',
        answer:
          "While we don't directly book accommodation, we provide guidance on finding suitable options, including university dormitories, private rentals, and homestays. We can also connect you with resources and alumni for advice.",
      },
      {
        id: 'post_q3',
        question: 'What kind of support do you offer after I arrive in the new country?',
        answer: (
          <>
            Our primary support focuses on getting you to your destination. However, we often stay in touch with our students and can provide guidance or connect you with resources if you face challenges. We also have a network of alumni in various countries. You can also{' '}
            <Link href="/connect" className="text-accent hover:underline">
              connect with us
            </Link>{' '}
            on social media.
          </>
        ),
      },
    ],
  },
];

export default function FAQPage() {
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });

  return (
    <div className="space-y-12 md:space-y-16">
      <section ref={titleRef} className={cn("transition-all duration-700 ease-out", isTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about our services and studying abroad."
        />
      </section>

      <div className="max-w-6xl mx-auto space-y-10 md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-10 md:space-y-0">
        {faqData.map((category, categoryIndex) => {
          const [categoryRef, isCategoryVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.05 });
          return (
            <section key={category.categoryName} ref={categoryRef} className={cn("transition-all duration-700 ease-out", isCategoryVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{transitionDelay: `${categoryIndex * 150}ms`}}>
              <h3 className="text-2xl md:text-3xl font-headline font-semibold text-primary mb-6 flex items-center">
                <ChevronRight className="h-7 w-7 mr-2 text-accent transform transition-transform duration-200 ease-out" />
                {category.categoryName}
              </h3>
              <Accordion type="single" collapsible className="w-full space-y-3">
                {category.questions.map((item, itemIndex) => {
                  const [itemRef, isItemVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
                  return (
                    <div key={item.id} ref={itemRef} className={cn("transition-all duration-500 ease-out", isItemVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5")} style={{transitionDelay: `${itemIndex * 70}ms`}}>
                      <AccordionItem value={item.id} className="border border-border bg-card shadow-sm rounded-lg hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-md md:text-lg font-medium text-primary hover:text-accent hover:no-underline px-4 py-3 text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-foreground/80 px-4 pt-1 pb-3 text-sm md:text-base">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </div>
                  );
                })}
              </Accordion>
            </section>
          );
        })}
      </div>
    </div>
  );
}

        
