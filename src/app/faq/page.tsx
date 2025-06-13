
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

const faqData = [
  {
    id: 'q1',
    question: 'What services does Pixar Educational Consultancy offer?',
    answer:
      'We offer a comprehensive range of services including personalized academic counseling, university and course selection, application assistance (SOP/LOR guidance), visa application support (including mock interviews), pre-departure briefings, and expert English test preparation for IELTS, TOEFL, PTE, and Duolingo.',
  },
  {
    id: 'q2',
    question: 'Which countries do you specialize in for study abroad?',
    answer:
      'We primarily specialize in guiding students for studies in the USA, UK, Australia, Canada, and New Zealand. We provide detailed information and support for applications to these countries.',
  },
  {
    id: 'q3',
    question: 'How much does it cost to use your consultancy services?',
    answer:
      'Our initial consultation is often free. For detailed service packages (like application processing, visa guidance), fees can vary. We encourage you to contact us for a personalized quote based on your needs.',
  },
  {
    id: 'q4',
    question: 'Can you help with scholarship applications?',
    answer:
      'Yes, as part of our personalized guidance, we help students identify potential scholarship opportunities and provide advice on the application process for scholarships offered by universities.',
  },
  {
    id: 'q5',
    question: 'What English proficiency tests do I need?',
    answer:
      'The required English test (IELTS, TOEFL, PTE, Duolingo) and minimum scores vary by country, university, and program. Our AI Test Advisor can give you an initial recommendation, and our counselors can provide specific guidance. We also offer preparation classes for all major tests.',
  },
  {
    id: 'q6',
    question: 'How long does the entire process take, from counseling to getting a visa?',
    answer:
      'The timeline can vary greatly depending on the country, intake session, university processing times, and individual student preparation. It can range from a few months to over a year. We recommend starting the process at least 6-12 months before your intended intake.',
  },
  {
    id: 'q7',
    question: 'Do you offer visa interview preparation?',
    answer:
      'Yes, we provide extensive visa interview preparation, including mock interviews and guidance on common questions and best practices to help you feel confident.',
  },
  {
    id: 'q8',
    question: 'What if I am unsure about my field of study?',
    answer:
      'Our counselors are experienced in helping students explore their interests, aptitudes, and career goals to identify suitable fields of study and corresponding academic pathways.',
  },
];

export default function FAQPage() {
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [accordionRef, isAccordionVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.05 });

  return (
    <div className="space-y-12 md:space-y-16">
      <section ref={titleRef} className={cn("transition-all duration-700 ease-out", isTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about our services and studying abroad."
        />
      </section>

      <section ref={accordionRef} className={cn("max-w-3xl mx-auto transition-all duration-700 ease-out", isAccordionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((item, index) => {
            const [itemRef, isItemVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
            return (
              <div key={item.id} ref={itemRef} className={cn("transition-all duration-500 ease-out", isItemVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5")} style={{transitionDelay: `${index * 100}ms`}}>
                <AccordionItem value={item.id} className="border-b border-border last:border-b-0 bg-card shadow-sm rounded-lg mb-3 p-2">
                  <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline px-4 text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 px-4 pt-2 pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </div>
            );
          })}
        </Accordion>
      </section>
    </div>
  );
}
