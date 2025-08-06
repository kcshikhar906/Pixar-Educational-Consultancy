
'use client';

import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircleQuestion, HelpCircle, Lightbulb, ShieldCheck, Users, Smile, Eye, GraduationCap, Banknote, Briefcase as BriefcaseIcon, Home as HomeIcon, UserCheck } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface QnAItem {
  question: string;
  answer: string; // Example answer
  tips?: string[]; // Tips for answering this specific question
}

interface CountryQnA {
  countryName: string;
  countrySlug: string;
  intro: string;
  questionCategories: {
    categoryTitle: string;
    icon: React.ElementType;
    questions: QnAItem[];
  }[];
  countrySpecificTips: string[];
}

const interviewData: CountryQnA[] = [
  {
    countryName: 'USA',
    countrySlug: 'usa',
    intro: 'US visa interviews (typically for F-1 visa) focus heavily on your intent to return to your home country after studies, your financial capacity, and your specific study plans. Be prepared to answer questions confidently and honestly.',
    questionCategories: [
      {
        categoryTitle: 'About Your Study Plans',
        icon: GraduationCap,
        questions: [
          {
            question: "Why do you want to study in the USA?",
            answer: "I want to study in the USA because of its world-renowned education system, particularly in [Your Field of Study]. American universities offer cutting-edge research opportunities, diverse perspectives, and a practical learning approach that I believe will best equip me for my career goals in [Your Field] back in Nepal. For example, [Specific University] offers a unique program in [Specific Program Aspect] which is not available in my home country at this level.",
            tips: ["Be specific. Mention unique aspects of the US education system or your chosen field.", "Connect it to your career goals.", "Avoid generic answers like 'it's a great country'."]
          },
          {
            question: "Why did you choose this specific university?",
            answer: "I chose [Specific University] after extensive research. Its [Specific Program Name] program is highly ranked and aligns perfectly with my interest in [Specific Area within your Field]. I was particularly impressed by the work of Professor [Professor's Name] in [Professor's Research Area], and the university's [Specific Facility/Lab/Resource, e.g., state-of-the-art labs, unique research center]. Additionally, the university's location in [City/State] offers opportunities related to [Your Field], and I appreciate its diverse student body.",
            tips: ["Show you've done thorough research. Name specific programs, professors, or facilities.", "Explain how the university uniquely meets your academic and career needs.", "Mentioning alumni success or university partnerships can also be good."]
          },
          {
            question: "What course are you going to study and why?",
            answer: "I will be pursuing a Master's degree in [Your Course Name]. I chose this course because it provides advanced knowledge and practical skills in [Key Areas of the Course], which are directly applicable to my goal of becoming a [Your Future Job Title] in Nepal. My undergraduate studies in [Your Undergraduate Major] provided a strong foundation, and this Master's program will allow me to specialize further.",
            tips: ["Clearly state the full course name and level.", "Explain how it builds upon your previous education or experience.", "Connect it to your future career aspirations."]
          },
          {
            question: "Can you tell me about your university and where it is located?",
            answer: "[Specific University] is located in [City, State]. It's a [public/private] research university known for its strong programs in [Mention 1-2 key fields, including yours]. The campus is situated [Brief description of location, e.g., in a vibrant urban setting, near a tech hub, in a scenic college town].",
            tips: ["Demonstrate basic knowledge about the university and its location.", "Show you're prepared for living in that specific area."]
          },
        ],
      },
      {
        categoryTitle: 'Financial Capacity',
        icon: Banknote,
        questions: [
          {
            question: "How will you finance your education? Who is sponsoring you?",
            answer: "My education will be sponsored by my parents, Mr. [Father's Name] and Mrs. [Mother's Name]. My father works as a [Father's Occupation] at [Father's Company] and my mother is a [Mother's Occupation]. They have saved approximately [Amount] USD for my education, and we also have [Mention other assets like property, fixed deposits if applicable]. I have all the necessary financial documents, including bank statements and affidavits of support, to demonstrate their capacity.",
            tips: ["Be clear, confident, and specific about funding sources.", "Mention the sponsor's relationship and occupation.", "Have all financial documents well-organized and ready to present if asked."]
          },
          {
            question: "What is your sponsor's annual income?",
            answer: "My father's annual income is approximately [Amount] [Currency], and my mother's annual income is [Amount] [Currency]. Their combined annual income is [Total Amount] [Currency], which is more than sufficient to cover my tuition fees of [Tuition Fee Amount] and estimated living expenses of [Living Expense Amount] per year.",
            tips: ["Know the figures accurately.", "Convert to USD if possible, but state in local currency if more familiar.", "Relate income to the costs to show affordability."]
          },
          {
            question: "Do you have any scholarships?",
            answer: "Yes, I have received the [Scholarship Name] from [Awarding Body/University] for [Amount/Percentage] which will cover [Portion of fees/living expenses]. / No, I have not received any scholarships at this time, but my family has sufficient funds to cover all my expenses.",
            tips: ["Be honest. If you have a scholarship, mention it proudly with details.", "If not, confidently state your family's ability to fund."]
          },
        ],
      },
      {
        categoryTitle: 'Post-Graduation Plans & Ties to Home Country',
        icon: HomeIcon,
        questions: [
          {
            question: "What are your plans after graduation?",
            answer: "After completing my Master's degree, I plan to return to Nepal. I aim to work as a [Your Future Job Title] in the [Specific Industry, e.g., growing IT sector, renewable energy field] in Nepal. My US education will provide me with valuable skills and international exposure that are highly sought after by companies like [Mention 1-2 example companies in Nepal if possible] or even to start my own venture in [Your Field].",
            tips: ["Strongly emphasize your intent to return to your home country.", "Be specific about your career plans in your home country.", "Avoid expressing intentions to stay in the US or apply for a Green Card."]
          },
          {
            question: "Do you intend to work in the US after your studies?",
            answer: "My primary goal is to complete my studies and return to Nepal to apply my knowledge. While I am aware of the Optional Practical Training (OPT) opportunity, which would allow me to gain some practical experience related to my field, my long-term plan is firmly rooted in building my career in Nepal.",
            tips: ["Acknowledge OPT if relevant, but always bring it back to returning home.", "Focus on gaining skills to benefit your home country."]
          },
          {
            question: "What ties do you have to your home country?",
            answer: "I have strong ties to Nepal. My entire family, including my parents and siblings, resides there. We own property, and I have a strong social network. Professionally, I see significant opportunities in [Your Field] in Nepal, and I am committed to contributing to its development.",
            tips: ["Mention family, financial assets, job prospects, or social commitments.", "The goal is to convince the officer you have strong reasons to return."]
          },
        ],
      },
    ],
    countrySpecificTips: [
      "Dress formally and professionally. First impressions count.",
      "Arrive on time for your interview.",
      "Maintain good eye contact with the visa officer.",
      "Answer questions confidently, clearly, and honestly. Do not provide false information or documents.",
      "Be prepared for a relatively short interview (often 5-10 minutes). Make your answers concise and to the point.",
      "Thoroughly understand your I-20 form and the SEVIS fee payment.",
      "Keep all your original documents neatly organized and ready to present if requested.",
      "Practice your English and be prepared to converse fluently.",
      "Be polite and respectful throughout the interview."
    ],
  },
  {
    countryName: 'Australia',
    countrySlug: 'australia',
    intro: 'Australian student visa interviews often assess the Genuine Temporary Entrant (GTE) requirement. You need to convince the officer that you intend to study temporarily in Australia and return home afterwards.',
    questionCategories: [
      {
        categoryTitle: 'Genuine Temporary Entrant (GTE) & Study Plans',
        icon: UserCheck,
        questions: [
          {
            question: "Why have you chosen Australia for your studies?",
            answer: "Australia offers a world-class education system and high living standards. I'm particularly drawn to the [Specific Course Name] at [University Name] because of its focus on [Specific Aspect, e.g., practical research, industry connections] in [Your Field]. The multicultural environment and the post-study work opportunities are also appealing for gaining initial experience before returning to Nepal.",
            tips: ["Highlight specific academic reasons.", "Mention unique features of Australian education or your chosen institution.", "Relate it to your career goals."]
          },
          {
            question: "What is your understanding of the GTE requirement?",
            answer: "My understanding is that the GTE requirement means I must genuinely intend to stay in Australia temporarily for the purpose of my studies and that I will return to my home country after completing my course. It involves demonstrating that my circumstances in Nepal, such as family ties and future career prospects, support this intention.",
            tips: ["Show you understand the core principle of GTE.", "Be prepared to elaborate on your circumstances if asked."]
          },
          {
            question: "How will this course help your career in Nepal?",
            answer: "The [Specific Course Name] will provide me with advanced skills in [Key Skills] and knowledge of [Key Subjects] that are currently in high demand in Nepal's [Specific Industry]. Upon my return, I plan to seek a position as a [Job Title] at a company like [Example Company in Nepal] or contribute to [Specific Project/Initiative in Nepal].",
            tips: ["Be specific about job roles and industries in your home country.", "Show how the Australian qualification gives you an edge."]
          },
        ],
      },
      {
        categoryTitle: 'Financial Details',
        icon: Banknote,
        questions: [
          {
            question: "How will you cover your tuition fees and living expenses in Australia?",
            answer: "My parents, [Parents' Names], will be sponsoring my studies and living expenses. They have [Amount] AUD in savings, and my father works as [Occupation] with an annual income of [Income]. We also have [other assets, e.g., an education loan approval for X amount]. I have prepared all necessary bank statements and financial documents.",
            tips: ["Clearly state source of funds.", "Provide figures and be ready with documentation.", "Mention OSHC (Overseas Student Health Cover)."]
          },
          {
            question: "Are you aware of the cost of living in [City of Study]?",
            answer: "Yes, I have researched the cost of living in [City]. I estimate my annual living expenses to be around [Amount] AUD, covering accommodation, food, transport, and personal expenses. My financial plan accounts for this.",
            tips: ["Show you've done your research on living costs.", "Have a realistic budget in mind."]
          },
        ],
      },
       {
        categoryTitle: 'Post-Study Intentions',
        icon: HomeIcon,
        questions: [
          {
            question: "What are your plans after completing your studies in Australia?",
            answer: "My primary plan is to return to Nepal after completing my [Course Name]. I aim to use the skills and knowledge gained to contribute to the [Field/Industry] in Nepal. While I am aware of the Temporary Graduate visa (subclass 485), any work experience gained would be to enhance my profile for my career back home.",
            tips: ["Reiterate your intent to return.", "If mentioning post-study work, frame it as experience-gaining for your home country career."]
          },
        ],
      },
    ],
    countrySpecificTips: [
      "Be very familiar with your GTE statement; your interview answers should align with it.",
      "Understand the conditions of your student visa (e.g., work limitations, OSHC).",
      "Research your chosen university, course modules, and the city you'll be living in.",
      "Be prepared to discuss your family's financial situation in detail if asked.",
      "Clearly articulate your reasons for not choosing to study in Nepal or other countries.",
      "Maintain a polite and confident demeanor."
    ],
  },
  {
    countryName: 'UK',
    countrySlug: 'uk',
    intro: 'UK student visa interviews (often called credibility interviews) aim to assess if you are a genuine student, can afford your studies, and intend to follow the immigration rules. Understanding your CAS (Confirmation of Acceptance for Studies) is vital.',
    questionCategories: [
      {
        categoryTitle: 'Reasons for Choosing UK & Course',
        icon: GraduationCap,
        questions: [
          {
            question: "Why did you choose to study in the UK rather than your home country or other countries?",
            answer: "The UK has a long-standing reputation for academic excellence, and its universities are globally recognized. For my chosen field of [Your Field], UK institutions like [Your University] offer specialized programs and research facilities that are not as readily available in Nepal. The shorter duration of Master's programs in the UK is also an advantage, allowing me to enter the workforce sooner.",
            tips: ["Highlight UK's academic strengths.", "Compare specific advantages over your home country or other destinations.", "Mention course structure or duration if relevant."]
          },
          {
            question: "Why this particular university and course?",
            answer: "I selected [Your University] because its [Course Name] program has specific modules like [Module 1] and [Module 2] that are directly relevant to my interest in [Specific Area]. The research conducted by [Professor's Name or Research Group] in [Area of Research] also aligns with my academic interests. Furthermore, the university has strong industry links in [Your Field], which I believe will be beneficial.",
            tips: ["Demonstrate in-depth research about the university and course.", "Mention specific modules, faculty, or unique features.", "Connect it to your interests and future goals."]
          },
          {
            question: "What are the benefits of studying this course in the UK?",
            answer: "Studying [Course Name] in the UK will provide me with a globally recognized qualification, exposure to international best practices in [Your Field], and an opportunity to learn from leading academics. The critical thinking and analytical skills developed in UK universities are highly valued, and I believe this will significantly enhance my career prospects in Nepal.",
            tips: ["Focus on academic and professional benefits.", "Mention transferable skills and international recognition."]
          },
        ],
      },
      {
        categoryTitle: 'Financial & Accommodation Plans',
        icon: Banknote,
        questions: [
          {
            question: "How will you fund your studies and living expenses in the UK?",
            answer: "My studies and living expenses will be fully funded by my parents. They have allocated [Amount] GBP for my education from their savings and [Father's/Sponsor's Occupation] income. We have the required funds as per UKVI guidelines maintained in the bank for the necessary period, and I have the bank statements ready.",
            tips: ["Be precise about the source and amount of funds.", "Mention that funds meet UKVI requirements (e.g., held for 28 days).", "Have documents organized."]
          },
          {
            question: "What are your accommodation plans in the UK?",
            answer: "I have applied for university-managed accommodation at [Hall Name/Location if known]. If that is not available, I have researched private student accommodation options in [City] such as [Example area or provider type], and I'm prepared to secure a place once my visa is approved.",
            tips: ["Show you have a plan, even if not finalized.", "Mentioning university accommodation first is often good.", "Indicate awareness of options."]
          },
        ],
      },
      {
        categoryTitle: 'Future Intentions',
        icon: HomeIcon,
        questions: [
          {
            question: "What are your plans after completing your studies?",
            answer: "After completing my [Course Name], I intend to return to Nepal. I plan to apply the knowledge and skills gained in the UK to develop my career in [Your Field] in Nepal. There are growing opportunities in [Specific Sector in Nepal], and I am eager to contribute.",
            tips: ["Clearly state your intention to return.", "Link your UK education to your career in your home country."]
          },
          {
            question: "Are you aware of the Graduate Route visa?",
            answer: "Yes, I am aware of the Graduate Route visa, which allows eligible students to stay and work in the UK for a period after graduation. While this is a good opportunity to gain international work experience, my long-term career goal is to establish myself in Nepal. Any experience gained would be to enhance my prospects back home.",
            tips: ["Show awareness but reiterate your primary goal is to return home.", "Frame post-study work as beneficial for your home country career."]
          },
        ],
      },
    ],
    countrySpecificTips: [
      "Thoroughly read and understand your CAS (Confirmation of Acceptance for Studies) statement. Your answers must be consistent with it.",
      "Be prepared to discuss your previous education and explain any study gaps clearly.",
      "Research the location of your university and general living in the UK.",
      "Ensure your financial documents strictly meet UKVI requirements (e.g., funds held for 28 days, acceptable financial institutions).",
      "Practice speaking clearly and confidently. The interview might be conducted via video call.",
      "Understand the conditions of your student visa, including work rights and attendance requirements."
    ],
  },
  {
    countryName: 'Canada',
    countrySlug: 'canada',
    intro: 'Canadian visa interviews (if requested, as not all applicants are interviewed) focus on your study plan, financial stability, and ties to your home country ensuring you will leave Canada after your studies.',
    questionCategories: [
      {
        categoryTitle: 'Study Plan & Choice of Canada',
        icon: GraduationCap,
        questions: [
          {
            question: "Why do you wish to study in Canada?",
            answer: "I've chosen Canada because of its high-quality education system, welcoming multicultural environment, and focus on research and innovation in fields like [Your Field]. Canadian qualifications are globally recognized, and the country offers a safe and supportive environment for international students. The prospect of experiencing Canada's diverse culture is also very appealing.",
            tips: ["Mention specific aspects of Canadian education or society that appeal to you.", "Link your choice to academic and personal development."]
          },
          {
            question: "Why this particular program and Designated Learning Institution (DLI)?",
            answer: "I selected the [Program Name] at [DLI Name] because its curriculum is comprehensive, covering [mention 1-2 key areas]. I was also impressed by [mention specific DLI feature, e.g., research facilities, co-op opportunities, faculty expertise in your area]. This DLI has a strong reputation for [DLI's strength], which aligns with my academic goals.",
            tips: ["Show you've researched both the program and the institution (DLI).", "Explain how they are a good fit for you."]
          },
          {
            question: "How will this program enhance your career prospects in Nepal?",
            answer: "This program will equip me with specialized skills in [mention skills] and a global perspective, which are highly valued in Nepal's [Your Industry] sector. Upon returning, I aim to work as a [Job Title], and this Canadian qualification will give me a competitive edge and enable me to contribute more effectively.",
            tips: ["Be specific about how the Canadian education will benefit your career back home.", "Mention target roles or industries in Nepal."]
          },
        ],
      },
      {
        categoryTitle: 'Financial Support',
        icon: Banknote,
        questions: [
          {
            question: "Who will be supporting you financially during your studies in Canada?",
            answer: "My studies will be financed by my parents. They have a combined annual income of [Amount] [Currency] from [Sources of Income], and they have set aside [Amount] CAD for my tuition and living expenses. I have also purchased a Guaranteed Investment Certificate (GIC) of [Amount, if applicable, e.g., 10,000 CAD] as per the SDS requirements.",
            tips: ["Clearly identify your sponsors and their financial capacity.", "Mention GIC if you are applying via Student Direct Stream (SDS).", "Have all financial documents ready."]
          },
          {
            question: "What is your budget for studying and living in Canada?",
            answer: "My estimated annual tuition fee is [Amount] CAD. For living expenses, I have budgeted approximately [Amount] CAD per year, covering accommodation, food, transportation, and other personal expenses. My sponsors have sufficient funds to cover these costs for the duration of my program.",
            tips: ["Show you have a realistic understanding of costs.", "Confirm your funds cover both tuition and living expenses."]
          },
        ],
      },
      {
        categoryTitle: 'Intent to Return & Future Plans',
        icon: HomeIcon,
        questions: [
          {
            question: "Do you intend to return to your home country after your studies?",
            answer: "Yes, definitely. My long-term career goals are in Nepal. I have strong family ties there, and I am committed to utilizing the education and experience gained in Canada to contribute to [Your Field/Industry] in Nepal.",
            tips: ["Be firm and clear about your intention to return.", "Mention specific ties (family, property, job prospects)."]
          },
          {
            question: "Are you aware of the Post-Graduation Work Permit (PGWP)?",
            answer: "Yes, I am aware that eligible graduates can apply for a PGWP to gain Canadian work experience. If I choose to apply for it, the experience would be invaluable for my career development before I return to Nepal to pursue my long-term goals.",
            tips: ["Acknowledge PGWP but frame it as a means to enhance your career in your home country.", "Always emphasize your ultimate plan to return."]
          },
        ],
      },
    ],
    countrySpecificTips: [
      "If applying through the Student Direct Stream (SDS), ensure all specific requirements are met (e.g., GIC, upfront medical, IELTS score).",
      "Be clear about your study plan and how it's a logical progression from your previous education. Explain any study gaps.",
      "Have a good understanding of the province and city where you plan to study.",
      "Ensure your Statement of Purpose (if submitted) and interview answers are consistent.",
      "Be prepared to answer questions about your previous travel history, if any.",
      "Honesty and clarity are crucial in your responses."
    ],
  },
  {
    countryName: 'New Zealand',
    countrySlug: 'new-zealand',
    intro: 'New Zealand visa interviews focus on ensuring you are a genuine student with sufficient funds and a clear intention to return home after your studies. Understanding your Offer of Place is key.',
    questionCategories: [
      {
        categoryTitle: 'Reasons for Choosing NZ & Program',
        icon: GraduationCap,
        questions: [
          {
            question: "Why have you chosen New Zealand for your higher education?",
            answer: "I chose New Zealand because of its excellent education quality, safe and welcoming environment, and innovative approach in fields like [Your Field]. The [Program Name] at [University Name] is particularly appealing due to its [Specific feature, e.g., practical focus, research opportunities]. I also admire New Zealand's focus on work-life balance and its beautiful natural environment.",
            tips: ["Highlight New Zealand's unique educational or lifestyle aspects.", "Connect it to your specific academic interests."]
          },
          {
            question: "Tell me about your chosen course and institution.",
            answer: "I will be studying [Course Name] at [Institution Name]. This program covers [Key subjects/modules] which are vital for my career goal of becoming a [Job Title]. [Institution Name] is well-regarded for its [Strength of institution, e.g., research in your field, student support services], and I was impressed by its [Specific facility/aspect].",
            tips: ["Show detailed knowledge of your course and why you chose that specific institution.", "Relate it to your future ambitions."]
          },
        ],
      },
      {
        categoryTitle: 'Financial & Living Arrangements',
        icon: Banknote,
        questions: [
          {
            question: "How do you plan to finance your tuition fees and living costs in New Zealand?",
            answer: "My parents will be sponsoring my education. They have [Amount] NZD available from their savings and [Source of Income]. We have met the financial requirements set by Immigration New Zealand, including having sufficient funds to cover my first year's tuition and [e.g., NZD 20,000] for living expenses. I have all the supporting documents.",
            tips: ["Be clear about the source and amount of funds.", "Mention meeting specific INZ financial requirements.", "Have documents ready."]
          },
          {
            question: "What do you know about the cost of living in New Zealand?",
            answer: "I've researched that the average cost of living for a student in [City of Study] is approximately [Amount] NZD per year. This includes accommodation, food, transport, and other essentials. My financial plan adequately covers these projected expenses.",
            tips: ["Demonstrate you've researched and have a realistic budget."]
          },
        ],
      },
      {
        categoryTitle: 'Post-Study Intentions & Ties to Home',
        icon: HomeIcon,
        questions: [
          {
            question: "What are your intentions after completing your studies in New Zealand?",
            answer: "After I complete my studies, my firm intention is to return to Nepal. I plan to use the international qualification and experience gained in New Zealand to build a career in [Your Field] in Nepal. The skills I acquire will be highly beneficial for the [Specific Sector] there.",
            tips: ["Emphasize your plan to return home.", "Link your NZ education to career goals in Nepal."]
          },
          {
            question: "What ties do you have to your home country that ensure your return?",
            answer: "I have strong family ties in Nepal, as my parents, siblings, and extended family all live there. We also have family assets and property. Furthermore, I am committed to contributing to the [Field/Sector] in Nepal, where I see good career opportunities for someone with my intended qualification.",
            tips: ["Mention family, financial, and professional ties to your home country."]
          },
        ],
      },
    ],
    countrySpecificTips: [
      "Be thoroughly familiar with your Offer of Place from the New Zealand institution.",
      "Ensure your funds meet the specific requirements of Immigration New Zealand and are from an acceptable source.",
      "Demonstrate a clear understanding of your chosen course and how it fits your career path.",
      "Be prepared to discuss why you are not pursuing similar studies in Nepal or other countries.",
      "Highlight your English language proficiency.",
      "Emphasize your commitment to abiding by New Zealand's visa conditions."
    ],
  },
];

const generalInterviewTips = [
  "Research Thoroughly: Know everything about the country, your chosen city, the university, and your specific course. Understand the visa requirements inside out.",
  "Be Punctual: Whether your interview is in-person or online, punctuality is key. For online interviews, test your equipment beforehand.",
  "Dress Professionally: Opt for formal or smart business casual attire. A neat appearance creates a positive first impression.",
  "Stay Calm and Confident: It's normal to be nervous, but try to remain calm. Speak clearly, maintain good eye contact (with the camera if online), and project confidence.",
  "Be Honest and Consistent: Never provide false information or documents. Ensure your answers are consistent with your application and supporting documents.",
  "Listen Carefully: Pay close attention to each question. If you don't understand something, politely ask for clarification. Don't rush your answers.",
  "Keep Answers Concise and Relevant: Be direct and to the point. Provide sufficient detail but avoid rambling or giving unnecessary information.",
  "Organize Your Documents: Have all original documents (and copies) neatly organized and easily accessible, even if not explicitly asked for during the interview.",
  "Practice Common Questions: Rehearse answers to common interview questions, but avoid sounding robotic or memorized. Your answers should feel natural.",
  "Show Enthusiasm: Demonstrate genuine interest and passion for your chosen field of study and the opportunity to study in that specific country and institution.",
  "Understand Your 'Why': Be very clear on why you chose this specific country, university, and course, and how it aligns with your future goals.",
  "Strong Ties to Home Country: Be prepared to articulate strong reasons for returning to your home country after completing your studies (family, career prospects, assets, etc.).",
  "Know Your Financials: Be intimately familiar with your financial documents and how your education is being funded. Be able to explain it clearly.",
  "Ask Questions (If Appropriate): If the interviewer gives you an opportunity to ask questions at the end, have one or two thoughtful (non-basic) questions ready. This shows engagement.",
  "Thank the Interviewer: At the end of the interview, politely thank the visa officer for their time and consideration.",
  "Review Your Application: Before the interview, thoroughly review your entire visa application and all supporting documents you submitted.",
  "Be Aware of Your Body Language: Sit upright, avoid fidgeting, and use appropriate gestures. Positive body language can convey confidence."
];


export default function InterviewQAPage() {
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [tabsContainerRef, isTabsContainerVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.05 });

  return (
    <div className="space-y-12 md:space-y-16">
      <section ref={titleRef} className={cn("transition-all duration-700 ease-out", isTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle
          title="Student Visa Interview Q&A"
          subtitle="Prepare for your visa interview with common questions, example answers, and tips for popular study destinations."
        />
      </section>

      <div ref={tabsContainerRef} className={cn("transition-all duration-700 ease-out", isTabsContainerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <Tabs defaultValue={interviewData[0].countrySlug} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mx-auto mb-8">
            {interviewData.map((country) => (
              <TabsTrigger key={country.countrySlug} value={country.countrySlug} className="py-2.5 text-sm md:text-base">
                {country.countryName}
              </TabsTrigger>
            ))}
          </TabsList>

          {interviewData.map((country) => (
            <TabsContent key={country.countrySlug} value={country.countrySlug} className="space-y-8">
              <Card className="shadow-lg bg-card">
                <CardHeader>
                  <CardTitle className="font-headline text-primary flex items-center">
                    <MessageCircleQuestion className="mr-2 h-6 w-6" /> Visa Interview Guide: {country.countryName}
                  </CardTitle>
                  <CardDescription>{country.intro}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="w-full space-y-4">
                    {country.questionCategories.map((category, catIndex) => (
                       <AccordionItem key={`${country.countrySlug}-cat-${catIndex}`} value={`${country.countrySlug}-cat-${catIndex}`} className="border border-border bg-background/30 shadow-sm rounded-lg hover:shadow-md">
                        <AccordionTrigger className="text-lg font-medium text-primary hover:text-accent px-4 py-3 text-left">
                          <category.icon className="mr-2 h-5 w-5" /> {category.categoryTitle}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-1 pb-3 space-y-4">
                          {category.questions.map((qna, index) => (
                            <div key={index} className="py-2 border-b border-border/50 last:border-b-0">
                              <h4 className="font-semibold text-foreground/90 text-md">{index + 1}. {qna.question}</h4>
                              <p className="text-sm text-foreground/80 mt-1 pl-4 italic"><strong>Example Answer:</strong> {qna.answer}</p>
                              {qna.tips && qna.tips.length > 0 && (
                                <div className="mt-2 pl-4">
                                  <h5 className="text-xs font-semibold text-accent flex items-center"><Lightbulb className="h-3 w-3 mr-1"/>Tips:</h5>
                                  <ul className="list-disc list-inside space-y-0.5 text-xs text-foreground/70 ml-4">
                                    {qna.tips.map((tip, tipIdx) => (
                                      <li key={tipIdx}>{tip}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}

                    <AccordionItem value={`${country.countrySlug}-specific-tips`} className="border border-border bg-background/30 shadow-sm rounded-lg hover:shadow-md">
                      <AccordionTrigger className="text-lg font-medium text-primary hover:text-accent px-4 py-3 text-left">
                        <Smile className="mr-2 h-5 w-5" /> {country.countryName} Specific Tips
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-1 pb-3">
                        <ul className="list-disc list-inside space-y-1 text-sm text-foreground/70">
                          {country.countrySpecificTips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
        
        <Card className="mt-12 shadow-lg bg-card">
          <CardHeader>
            <CardTitle className="font-headline text-accent flex items-center">
              <ShieldCheck className="mr-2 h-6 w-6" /> General Interview Best Practices
            </CardTitle>
            <CardDescription>These tips apply to most student visa interviews, regardless of the country.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-foreground/80 text-sm">
              {generalInterviewTips.map((tip, index) => (
                <li key={index} className="flex items-start">
                    <Eye className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0"/>
                    <span>{tip}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 text-center">
                <Button asChild variant="solid" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/contact?service=visa_interview_preparation">
                        Book Unlimited Mock Interview Sessions <Users className="ml-2 h-4 w-4"/>
                    </Link>
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Pixar Educational Consultancy is proud to be the only consultancy in Nepal offering unlimited visa interview preparation for U.S. aspirants!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    
