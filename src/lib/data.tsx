
import React, { Fragment, type ReactNode, type ElementType } from 'react';
import { 
  Award as AwardIconLucide,
  Briefcase, 
  Lightbulb, 
  Users, 
  MapPin, 
  Landmark, 
  TrendingUp, 
  Globe, 
  CalendarPlus, 
  FileText, 
  BookOpen, 
  University as UniversityIcon, 
  CheckCircle, 
  Building, 
  Heart, 
  Handshake, 
  Goal, 
  MessageSquare, 
  Search, 
  Wand2, 
  ExternalLink, 
  Home, 
  Info, 
  GraduationCap, 
  DollarSign, 
  Clock, 
  UserCheck, 
  FileSpreadsheet as FileSpreadsheetIcon,
  BookMarked, 
  KeyRound, 
  Activity,
  CalendarDays 
} from 'lucide-react';

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  studyDestination: string;
  avatarUrl?: string;
  dataAiHint?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    name: 'Bhawana Paneru',
    studyDestination: 'University of Central Arkansas, USA',
    text: "Pixar Edu provided excellent support throughout my application process to the USA. Highly recommended for their professionalism!",
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'student portrait',
  },
  {
    id: 'testimonial-2',
    name: 'Pratik B K',
    studyDestination: 'Georgian College, Canada',
    text: "My journey to Canada was made much smoother thanks to the Pixar Edu team. Their guidance on visa and college selection was top-notch.",
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'student smiling',
  },
  {
    id: 'testimonial-3',
    name: 'Prashana Thapa Magar',
    studyDestination: 'Cardiff Metropolitan University, UK',
    text: "The counselors at Pixar Edu were incredibly helpful in securing my admission and visa for the UK. A truly professional service!",
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'happy student',
  },
  {
    id: 'testimonial-4',
    name: 'Arju Pokhrel',
    studyDestination: 'University of New Castle, Australia',
    text: "I'm grateful to Pixar Edu for their expert advice on studying in Australia. They made a complex process seem easy.",
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'graduate student',
  },
  {
    id: 'testimonial-5',
    name: 'Srijana Rana',
    studyDestination: 'Eastern Institute of Technology, New Zealand',
    text: "Choosing Pixar Edu was the best decision for my New Zealand study plans. Their support was exceptional from start to finish.",
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'student excited',
  },
  {
    id: 'testimonial-6',
    name: 'Bivusha Gautam',
    studyDestination: 'Arkansas State University, USA',
    text: "Thanks to Pixar Edu, I am now pursuing my dream course in the USA. Their visa guidance was particularly helpful.",
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'focused student',
  },
];

export interface Service {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  icon: ElementType;
  imageUrl?: string;
  dataAiHint?: string;
  keyFeatures?: string[];
}

export const services: Service[] = [
  {
    id: 'documentation-assistance',
    title: 'Documentation Assistance',
    description: 'Comprehensive support for all your application paperwork.',
    longDescription: 'Navigating the complex documentation requirements for international university applications can be daunting. We provide meticulous assistance with preparing, organizing, and reviewing all necessary documents, including transcripts, recommendation letters, statements of purpose, and financial proofs. Our goal is to ensure your application is complete, accurate, and compelling.',
    icon: Briefcase,
    imageUrl: '/da.png',
    dataAiHint: 'documents application',
    keyFeatures: [
      "Application form completion strategy",
      "Statement of Purpose (SOP/Essay) review & feedback",
      "Financial document checklist & guidance",
      "Letter of Recommendation (LOR) advice"
    ]
  },
  {
    id: 'personalized-guidance',
    title: 'Personalized Guidance',
    description: 'Tailored advice to match your academic goals and preferences.',
    longDescription: 'Every student is unique, with different aspirations and academic backgrounds. We offer personalized guidance sessions to understand your specific needs, help you choose the right courses and universities, and develop a strategic application plan. Our experienced counselors provide insights into various education systems and career pathways.',
    icon: Lightbulb,
    imageUrl: '/pg.jpg',
    dataAiHint: 'student guidance',
    keyFeatures: [
      "One-on-one counseling sessions",
      "Course and university shortlisting based on profile",
      "Career pathway mapping and advice",
      "Scholarship & funding opportunity guidance"
    ]
  },
  {
    id: 'visa-support',
    title: 'Visa & Pre-Departure Support',
    description: 'Expert help with visa applications and pre-departure preparations.',
    longDescription: 'Securing a student visa and preparing for life in a new country are crucial steps. We offer expert assistance with visa applications, including mock interviews and document checklists. Additionally, we provide comprehensive pre-departure briefings covering accommodation, cultural adaptation, and essential travel tips to ensure a smooth transition.',
    icon: Users, 
    imageUrl: '/vsa.jpg',
    dataAiHint: 'travel preparation',
    keyFeatures: [
      "Student visa application assistance for various countries",
      "Mock visa interview preparation",
      "Pre-departure briefings and checklist",
      "Guidance on accommodation and travel arrangements"
    ]
  },
  {
    id: 'english-prep',
    title: 'Expert English Test Preparation',
    description: 'Ace IELTS, TOEFL, PTE & Duolingo with our tailored coaching.',
    longDescription: "Our comprehensive English test preparation programs are designed to equip you with the skills and strategies needed to achieve your target scores. We offer specialized coaching for IELTS, TOEFL iBT, PTE Academic, and the Duolingo English Test. Our experienced instructors provide personalized feedback, mock tests, and focused training on all test sections – Reading, Writing, Listening, and Speaking. Join us to build your confidence and master the exam.",
    icon: BookMarked,
    imageUrl: '/english-prep-class.jpg',
    dataAiHint: "classroom students learning",
    keyFeatures: [
      "Tailored coaching for IELTS, TOEFL, PTE, Duolingo",
      "Experienced instructors & personalized feedback",
      "Comprehensive mock tests and practice materials",
      "Small class sizes for focused attention"
    ]
  },
];

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  dataAiHint?: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Saubhana Bhandari',
    role: 'Front Desk Officer',
    bio: 'Manages front office operations and assists students with initial inquiries, ensuring a welcoming experience.',
    imageUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'professional woman',
  },
  {
    id: 'team-2',
    name: 'Shyam Babu Ojha',
    role: 'New Zealand Counselor',
    bio: 'Specializes in New Zealand university admissions and visa processes, providing expert guidance.',
    imageUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'counselor man',
  },
  {
    id: 'team-3',
    name: 'Mujal Amatya',
    role: 'USA Counselor',
    bio: 'Expert in U.S. university applications, scholarships, and F-1 visa procedures.',
    imageUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'advisor man',
  },
  {
    id: 'team-4',
    name: 'Sonima Rijal',
    role: 'Application Officer',
    bio: 'Assists students with the university application process, ensuring all documents are perfectly prepared.',
    imageUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'officer woman',
  },
  {
    id: 'team-5',
    name: 'Sujata Nepal',
    role: 'Application Officer',
    bio: 'Dedicated to helping students meticulously complete their applications for various universities.',
    imageUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'professional portrait',
  },
  {
    id: 'team-6',
    name: 'Mamata Chapagain',
    role: 'Documents Officer',
    bio: 'Expert in managing and verifying student documentation for smooth application submissions.',
    imageUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'woman team',
  },
  {
    id: 'team-7',
    name: 'Sunita Khadka',
    role: 'Office Caretaker',
    bio: 'Ensures a clean, organized, and welcoming office environment for students and staff.',
    imageUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'office staff',
  },
  {
    id: 'team-8',
    name: 'Pawan Acharya',
    role: 'Managing Director',
    bio: 'Oversees the operational and strategic direction of Pixar Educational Consultancy, ensuring service excellence.',
    imageUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'director man',
  },
  {
    id: 'team-9',
    name: 'Sabina Thapa',
    role: 'Australia Counselor',
    bio: 'Provides specialized counseling for students aspiring to study in Australia, focusing on admissions and visas.',
    imageUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'counselor woman',
  },
  {
    id: 'team-10',
    name: 'Anisha Thapa',
    role: 'Prep Class Head',
    bio: 'Leads our English language test preparation programs (IELTS, PTE, TOEFL, Duolingo), ensuring high-quality coaching.',
    imageUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'teacher woman',
  },
  {
    id: 'team-11',
    name: 'Ram Babu Ojha',
    role: 'Video Editor',
    bio: 'Creates engaging video content for our promotional and informational materials.',
    imageUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'creative man',
  },
  {
    id: 'team-12',
    name: 'Shikhar KC',
    role: 'IT Head',
    bio: 'Manages our IT infrastructure and digital platforms, ensuring smooth technological operations.',
    imageUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'tech professional',
  },
  {
    id: 'team-13', // Previously '1'
    name: 'Pradeep Khadka',
    role: 'Founder & CEO',
    bio: 'With over 15 years of experience in international education, Pradeep is passionate about helping students achieve their academic dreams.',
    imageUrl: '/co.jpg', // Kept existing local image
    dataAiHint: 'ceo man',
  },
];


export interface Certification {
  id: string;
  name: string;
  issuingBody: string;
  logoUrl: string;
  dataAiHint?: string;
}

export const certifications: Certification[] = [
  {
    id: '1',
    name: 'Certified Education Consultant',
    issuingBody: 'Global Education Council',
    logoUrl: 'https://placehold.co/150x100.png',
    dataAiHint: 'certificate award',
  },
  {
    id: '2',
    name: 'International Student Advisor',
    issuingBody: 'Association of International Educators',
    logoUrl: 'https://placehold.co/150x100.png',
    dataAiHint: 'badge education',
  },
];

export interface University {
  name: string;
  city: string;
  countryFocus: string;
  website: string;
}

export interface CountryInfo {
  id: string;
  name: string;
  slug: string;
  flagEmoji: string;
  description: string;
  imageUrl: string;
  dataAiHint?: string;
  averageLivingCost: string;
  workHoursStudent: string;
  visaInfoSummary: string | ReactNode;
  postStudyWorkSummary: string | ReactNode;
  visaApprovalTrends?: string | ReactNode;
  averageSalaryAfterStudy?: string | ReactNode;
  prPathways?: string | ReactNode;
  facts: {
    icon: ElementType;
    label: string;
    value: string;
  }[];
  topUniversities: University[];
}

const linkClass = "text-accent hover:underline";

export const countryData: CountryInfo[] = [
  {
    id: 'australia',
    name: 'Australia',
    slug: 'australia',
    flagEmoji: '🇦🇺',
    description: 'Experience a high-quality education system in a vibrant, multicultural environment. Australian universities are known for their research and innovation.',
    imageUrl: 'https://placehold.co/1200x400.png',
    dataAiHint: 'australia landmark',
    averageLivingCost: 'AUD $21,000 - $29,000 per year',
    workHoursStudent: 'Up to 48 hours per fortnight during academic sessions, unlimited during scheduled breaks.',
    visaInfoSummary: <Fragment>Student visa (<a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500" target="_blank" rel="noopener noreferrer" className={linkClass}>subclass 500</a>). Requires Confirmation of Enrolment (<a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500/confirmation-of-enrolment" target="_blank" rel="noopener noreferrer" className={linkClass}>CoE</a>), <a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500/genuine-temporary-entrant" target="_blank" rel="noopener noreferrer" className={linkClass}>Genuine Temporary Entrant (GTE)</a> statement, financial proof, <a href="https://www.privatehealth.gov.au/health_insurance/overseas_students/" target="_blank" rel="noopener noreferrer" className={linkClass}>Overseas Student Health Cover (OSHC)</a>.</Fragment>,
    postStudyWorkSummary: <Fragment>Temporary Graduate visa (<a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485" target="_blank" rel="noopener noreferrer" className={linkClass}>subclass 485</a>) allows eligible students to stay and work for 2-4 years, depending on qualification.</Fragment>,
    visaApprovalTrends: <Fragment>Generally positive for genuine students. Success rates can vary. Always consult <a href="https://immi.homeaffairs.gov.au/" target="_blank" rel="noopener noreferrer" className={linkClass}>official government sources</a> for current statistics.</Fragment>,
    averageSalaryAfterStudy: "AUD $55,000 - $75,000 per year for recent graduates, varying by field. STEM and healthcare often command higher salaries.",
    prPathways: <Fragment>Pathways exist via <a href="https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect/general-skilled-migration" target="_blank" rel="noopener noreferrer" className={linkClass}>General Skilled Migration</a> (e.g., subclass 189, 190, 491) and employer sponsorship post-work experience. Criteria are points-based.</Fragment>,
    facts: [
      { icon: Landmark, label: 'Major Cities', value: 'Sydney, Melbourne, Brisbane, Perth, Adelaide' },
      { icon: Globe, label: 'Language', value: 'English' },
      { icon: TrendingUp, label: 'Known For', value: 'STEM, Business, Health Sciences, Environmental Studies' },
    ],
    topUniversities: [
      { name: 'Australian National University', city: 'Canberra', countryFocus: 'Various', website: 'https://www.anu.edu.au' },
      { name: 'University of Melbourne', city: 'Melbourne', countryFocus: 'Various', website: 'https://www.unimelb.edu.au' },
      { name: 'University of Sydney', city: 'Sydney', countryFocus: 'Various', website: 'https://www.sydney.edu.au' },
    ],
  },
  {
    id: 'canada',
    name: 'Canada',
    slug: 'canada',
    flagEmoji: '🇨🇦',
    description: 'Canada offers a high standard of living, diverse culture, and excellent educational institutions. It is a popular choice for international students due to its welcoming policies.',
    imageUrl: 'https://placehold.co/1200x400.png',
    dataAiHint: 'canada landmark toronto',
    averageLivingCost: 'CAD $15,000 - $25,000 per year (excluding tuition)',
    workHoursStudent: 'Up to 20 hours/week during regular academic sessions, full-time during scheduled breaks (if eligible).',
    visaInfoSummary: <Fragment>A <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html" target="_blank" rel="noopener noreferrer" className={linkClass}>Study Permit</a> is required. Need an acceptance letter from a <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare/designated-learning-institutions-list.html" target="_blank" rel="noopener noreferrer" className={linkClass}>Designated Learning Institution (DLI)</a>, proof of financial support, and may require biometrics and medical exam.</Fragment>,
    postStudyWorkSummary: <Fragment><a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/about.html" target="_blank" rel="noopener noreferrer" className={linkClass}>Post-Graduation Work Permit (PGWP)</a> allows graduates to gain Canadian work experience for up to 3 years, depending on program length.</Fragment>,
    visaApprovalTrends: <Fragment>High approval rates for complete applications from genuine students. <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/student-direct-stream.html" target="_blank" rel="noopener noreferrer" className={linkClass}>SDS (Student Direct Stream)</a> available for faster processing for eligible countries.</Fragment>,
    averageSalaryAfterStudy: "CAD $45,000 - $65,000 per year for entry-level positions. Varies by province and specialization.",
    prPathways: <Fragment>Multiple pathways including <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html" target="_blank" rel="noopener noreferrer" className={linkClass}>Express Entry</a> (e.g., Canadian Experience Class, Federal Skilled Worker Program) and <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees.html" target="_blank" rel="noopener noreferrer" className={linkClass}>Provincial Nominee Programs (PNPs)</a>.</Fragment>,
    facts: [
      { icon: Landmark, label: 'Major Cities', value: 'Toronto, Montreal, Vancouver, Calgary, Ottawa' },
      { icon: Globe, label: 'Languages', value: 'English, French' },
      { icon: TrendingUp, label: 'Known For', value: 'Technology, Engineering, Business, Health Sciences, AI' },
    ],
    topUniversities: [
      { name: 'University of Toronto', city: 'Toronto', countryFocus: 'Various', website: 'https://www.utoronto.ca' },
      { name: 'McGill University', city: 'Montreal', countryFocus: 'Various', website: 'https://www.mcgill.ca' },
      { name: 'University of British Columbia', city: 'Vancouver', countryFocus: 'Various', website: 'https://www.ubc.ca' },
    ],
  },
  {
    id: 'usa',
    name: 'USA',
    slug: 'usa',
    flagEmoji: '🇺🇸',
    description: 'Home to many of the world\'s top universities, the USA offers unparalleled educational opportunities across all fields of study and vibrant campus life.',
    imageUrl: 'https://placehold.co/1200x400.png',
    dataAiHint: 'usa landmark new york',
    averageLivingCost: 'USD $12,000 - $18,000 per year (highly variable by city and lifestyle)',
    workHoursStudent: 'Up to 20 hours/week on-campus during term; Curricular Practical Training (CPT) or Optional Practical Training (OPT) for off-campus work.',
    visaInfoSummary: <Fragment><a href="https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html" target="_blank" rel="noopener noreferrer" className={linkClass}>F-1 visa</a> for academic studies. Requires <a href="https://studyinthestates.dhs.gov/students/prepare/student-forms/form-i-20" target="_blank" rel="noopener noreferrer" className={linkClass}>I-20 form</a> from an SEVP-certified school, <a href="https://www.fmjfee.com/i901fee/index.html" target="_blank" rel="noopener noreferrer" className={linkClass}>SEVIS fee</a> payment, proof of funds, and a visa interview. Interview performance is key.</Fragment>,
    postStudyWorkSummary: <Fragment><a href="https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-opt-for-f-1-students" target="_blank" rel="noopener noreferrer" className={linkClass}>Optional Practical Training (OPT)</a> allows up to 12 months of work experience (extendable by 24 months for STEM fields). <a href="https://www.uscis.gov/working-in-the-united-states/temporary-workers/h-1b-specialty-occupations-and-fashion-models" target="_blank" rel="noopener noreferrer" className={linkClass}>H-1B visa</a> for long-term employment.</Fragment>,
    visaApprovalTrends: <Fragment>Approval depends heavily on the visa interview and demonstrating non-immigrant intent. Thorough preparation is crucial. Refer to <a href="https://travel.state.gov/content/travel/en/us-visas.html" target="_blank" rel="noopener noreferrer" className={linkClass}>official visa statistics</a>.</Fragment>,
    averageSalaryAfterStudy: "USD $60,000 - $80,000+ per year for bachelor's degree holders, significantly higher for master's/PhD, especially in STEM/Business.",
    prPathways: <Fragment>PR (<a href="https://www.uscis.gov/green-card" target="_blank" rel="noopener noreferrer" className={linkClass}>Green Card</a>) typically obtained through employer sponsorship (e.g., EB-2, EB-3 visas) or family-based petitions. Long and competitive process.</Fragment>,
    facts: [
      { icon: Landmark, label: 'Key States', value: 'California, New York, Massachusetts, Texas, Illinois' },
      { icon: Globe, label: 'Language', value: 'English' },
      { icon: TrendingUp, label: 'Known For', value: 'Technology, Business, Research, Arts, Engineering' },
    ],
    topUniversities: [
      { name: 'Massachusetts Institute of Technology (MIT)', city: 'Cambridge, MA', countryFocus: 'Technology & Engineering', website: 'https://web.mit.edu' },
      { name: 'Stanford University', city: 'Stanford, CA', countryFocus: 'Various', website: 'https://www.stanford.edu' },
      { name: 'Harvard University', city: 'Cambridge, MA', countryFocus: 'Various', website: 'https://www.harvard.edu' },
    ],
  },
  {
    id: 'uk',
    name: 'UK',
    slug: 'uk',
    flagEmoji: '🇬🇧',
    description: 'The United Kingdom boasts a rich academic heritage with world-renowned universities, offering a diverse range of courses and a vibrant student life in historic cities.',
    imageUrl: 'https://placehold.co/1200x400.png',
    dataAiHint: 'uk landmark london',
    averageLivingCost: 'GBP £12,000 - £15,000 per year (London significantly higher)',
    workHoursStudent: 'Up to 20 hours/week during term-time for degree students at degree-awarding institutions.',
    visaInfoSummary: <Fragment><a href="https://www.gov.uk/student-visa" target="_blank" rel="noopener noreferrer" className={linkClass}>Student visa</a>. Requires <a href="https://www.gov.uk/student-visa/cas" target="_blank" rel="noopener noreferrer" className={linkClass}>Confirmation of Acceptance for Studies (CAS)</a> from a licensed sponsor, proof of funds, English proficiency (e.g., <a href="https://www.gov.uk/ielts-ukvi" target="_blank" rel="noopener noreferrer" className={linkClass}>IELTS UKVI</a>). Points-based system.</Fragment>,
    postStudyWorkSummary: <Fragment><a href="https://www.gov.uk/graduate-visa" target="_blank" rel="noopener noreferrer" className={linkClass}>Graduate Route</a> allows eligible graduates to stay and work, or look for work, for 2 years (3 years for PhD graduates) after course completion.</Fragment>,
    visaApprovalTrends: <Fragment>Generally good for applicants meeting all requirements. Financial documentation and CAS validity are crucial. Check <a href="https://www.gov.uk/government/statistics/immigration-system-statistics-year-ending-december-2023" target="_blank" rel="noopener noreferrer" className={linkClass}>official statistics</a>.</Fragment>,
    averageSalaryAfterStudy: "GBP £25,000 - £35,000 per year for new graduates. Higher in fields like finance, tech in London.",
    prPathways: <Fragment>Pathways to <a href="https://www.gov.uk/indefinite-leave-to-remain" target="_blank" rel="noopener noreferrer" className={linkClass}>Indefinite Leave to Remain (ILR)</a> typically involve long-term work visas (e.g., <a href="https://www.gov.uk/skilled-worker-visa" target="_blank" rel="noopener noreferrer" className={linkClass}>Skilled Worker visa</a>) after several years of residence and meeting specific criteria.</Fragment>,
    facts: [
      { icon: Landmark, label: 'Major Cities', value: 'London, Manchester, Birmingham, Edinburgh, Glasgow' },
      { icon: Globe, label: 'Language', value: 'English' },
      { icon: TrendingUp, label: 'Known For', value: 'Finance, Law, Arts & Humanities, Science, Engineering' },
    ],
    topUniversities: [
      { name: 'University of Oxford', city: 'Oxford', countryFocus: 'Various', website: 'https://www.ox.ac.uk' },
      { name: 'University of Cambridge', city: 'Cambridge', countryFocus: 'Various', website: 'https://www.cam.ac.uk' },
      { name: 'Imperial College London', city: 'London', countryFocus: 'Science, Engineering, Medicine', website: 'https://www.imperial.ac.uk' },
    ],
  },
  {
    id: 'new-zealand',
    name: 'New Zealand',
    slug: 'new-zealand',
    flagEmoji: '🇳🇿',
    description: 'Study in a safe, welcoming country with a world-class education system and stunning natural landscapes. Offers unique programs and excellent research opportunities.',
    imageUrl: 'https://placehold.co/1200x400.png',
    dataAiHint: 'new zealand landscape mountains',
    averageLivingCost: 'NZD $20,000 - $25,000 per year',
    workHoursStudent: 'Up to 20 hours/week during studies if your course meets requirements, full-time during scheduled holidays.',
    visaInfoSummary: <Fragment><a href="https://www.immigration.govt.nz/new-zealand-visas/visas/visa/student-visa" target="_blank" rel="noopener noreferrer" className={linkClass}>Student Visa</a> (Fee Paying Student Visa). Requires <a href="https://www.immigration.govt.nz/new-zealand-visas/visas/visa/student-visa#offer-of-place" target="_blank" rel="noopener noreferrer" className={linkClass}>Offer of Place</a> from an approved education provider, proof of funds to cover tuition and living costs, health & character checks.</Fragment>,
    postStudyWorkSummary: <Fragment><a href="https://www.immigration.govt.nz/new-zealand-visas/visas/visa/post-study-work-visa" target="_blank" rel="noopener noreferrer" className={linkClass}>Post-Study Work Visa</a> available for 1-3 years for eligible graduates, depending on qualification and where you studied.</Fragment>,
    visaApprovalTrends: <Fragment>Good approval rates for well-prepared applications demonstrating genuine student intent and sufficient funds. See <a href="https://www.immigration.govt.nz/about-us/research-and-statistics" target="_blank" rel="noopener noreferrer" className={linkClass}>official statistics</a>.</Fragment>,
    averageSalaryAfterStudy: "NZD $50,000 - $65,000 per year for graduates. Depends on industry and location.",
    prPathways: <Fragment>Points-based <a href="https://www.immigration.govt.nz/new-zealand-visas/visas/visa/skilled-migrant-category-resident-visa" target="_blank" rel="noopener noreferrer" className={linkClass}>Skilled Migrant Category Resident Visa</a> is a common pathway after gaining skilled work experience in New Zealand.</Fragment>,
    facts: [
      { icon: Landmark, label: 'Main Cities', value: 'Auckland, Wellington, Christchurch, Dunedin, Hamilton' },
      { icon: Globe, label: 'Language', value: 'English, Māori' },
      { icon: TrendingUp, label: 'Known For', value: 'Agriculture, Environmental Science, Film, Adventure Tourism, Geothermal Research' },
    ],
    topUniversities: [
      { name: 'University of Auckland', city: 'Auckland', countryFocus: 'Various', website: 'https://www.auckland.ac.nz' },
      { name: 'University of Otago', city: 'Dunedin', countryFocus: 'Health Sciences, Humanities', website: 'https://www.otago.ac.nz' },
      { name: 'Victoria University of Wellington', city: 'Wellington', countryFocus: 'Law, Public Policy, Design', website: 'https://www.wgtn.ac.nz' },
    ],
  },
];

export const fieldsOfStudy: string[] = [
  "Accounting", "Aerospace Engineering", "Agriculture", "Anthropology", "Architecture", "Art History", 
  "Artificial Intelligence", "Astronomy", "Astrophysics", "Biochemistry", "Bioengineering", "Biology", 
  "Biomedical Engineering", "Biotechnology", "Business Administration", "Chemical Engineering", "Chemistry", 
  "Civil Engineering", "Cognitive Science", "Communications", "Computer Engineering", "Computer Science", 
  "Creative Writing", "Criminology", "Cybersecurity", "Data Science", "Dentistry", 
  "Design (Graphic, Industrial, etc.)", "Diploma", "Drama and Theatre Arts", "Earth Sciences", "Economics", 
  "Education", "Electrical Engineering", "English Literature", "Environmental Science", "Fashion Design", 
  "Film Studies", "Finance", "Fine Arts", "Food Science", "Forensic Science", "Genetics", "Geography", 
  "Geology", "Health Sciences", "History", "Hospitality Management", "Human Resources Management", 
  "Industrial Engineering", "Information Technology", "International Relations", "Journalism", "Kinesiology", 
  "Languages and Linguistics", "Law", "Liberal Arts", "Library Science", "Marine Biology", "Marketing", 
  "Materials Science", "Mathematics", "Mechanical Engineering", "Mechatronics", "Media Studies", "Medicine", 
  "Microbiology", "Music", "Nanotechnology", "Neuroscience", "Nuclear Engineering", "Nursing", 
  "Nutrition and Dietetics", "Oceanography", "Petroleum Engineering", "Pharmacy", "Philosophy", "Physics", 
  "Physiology", "Political Science", "Postgraduate Diploma", "Psychology", "Public Health", "Robotics", 
  "Social Services", "Social Work", "Sociology", "Software Engineering", "Space Science", "Sports Science", 
  "Statistics", "Supply Chain Management", "Sustainable Development", "Telecommunications Engineering", 
  "Tourism Management", "Urban Planning", "Veterinary Medicine", "Zoology",
];

export const allEducationLevels = [ 
  { name: "10+2", value: "10+2" },
  { name: "Diploma", value: "Diploma" },
  { name: "Bachelor's Degree", value: "Bachelor's Degree" },
  { name: "Master's Degree", value: "Master's Degree" },
];

export const educationLevelOptions = [ 
  { value: "Associate Degree", label: "Seeking Associate Degree" },
  { value: "Bachelor's Degree", label: "Seeking Bachelor's Degree" },
  { value: "Postgraduate Diploma", label: "Seeking Postgraduate Diploma" },
  { value: "Master's Degree", label: "Seeking Master's Degree" },
];

export const englishTestOptions = [
  { value: "IELTS", label: "IELTS" },
  { value: "PTE", label: "PTE" },
  { value: "TOEFL", label: "TOEFL" },
  { value: "DUOLINGO", label: "DUOLINGO" },
  { value: "Not Taken Yet", label: "Not Taken Yet" },
];

export const testPreparationOptions = [
  { value: "IELTS Prep", label: "IELTS Prep" },
  { value: "PTE Prep", label: "PTE Prep" },
  { value: "TOEFL Prep", label: "TOEFL Prep" },
  { value: "Duolingo Prep", label: "Duolingo Prep" },
  { value: "USA Visa Prep", label: "USA Visa Prep (Unlimited)" },
  { value: "General English", label: "General English" },
];


const getFlagEmoji = (countryCode: string): string => {
  if (!countryCode || countryCode.length !== 2) return '🏳️'; // Default flag
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export const studyDestinationOptions = [
  { value: "USA", label: `${getFlagEmoji("US")} USA` },
  { value: "New Zealand", label: `${getFlagEmoji("NZ")} New Zealand` },
  { value: "Australia", label: `${getFlagEmoji("AU")} Australia` },
  { value: "Canada", label: `${getFlagEmoji("CA")} Canada` },
  { value: "UK", label: `${getFlagEmoji("GB")} UK` },
];

export const gpaScaleOptions = [
  { value: "4.0", label: "4.0 (or equivalent)" },
  { value: "3.7-3.9", label: "3.7 - 3.9 (or equivalent)" },
  { value: "3.3-3.6", label: "3.3 - 3.6 (or equivalent)" },
  { value: "3.0-3.2", label: "3.0 - 3.2 (or equivalent)" },
  { value: "2.5-2.9", label: "2.5 - 2.9 (or equivalent)" },
  { value: "Below 2.5", label: "Below 2.5 (or equivalent)" },
  { value: "N/A", label: "Not Applicable / Varies" },
];


export interface IntakeInfo {
  countrySlug: string;
  countryName: string;
  flagEmoji: string;
  nextIntakeDate: string; // YYYY-MM-DD format
  intakeNote: string; // E.g., "Fall 2025 Intake", "Major Intake: February"
  icon: ElementType;
}

export const upcomingIntakeData: IntakeInfo[] = [
  {
    countrySlug: 'usa',
    countryName: 'USA',
    flagEmoji: getFlagEmoji("US"),
    nextIntakeDate: '2025-09-01', 
    intakeNote: 'Fall 2025 Intake',
    icon: CalendarDays,
  },
  {
    countrySlug: 'australia',
    countryName: 'Australia',
    flagEmoji: getFlagEmoji("AU"),
    nextIntakeDate: '2025-02-15',
    intakeNote: 'Major Intake: Feb 2025',
    icon: CalendarDays,
  },
  {
    countrySlug: 'canada',
    countryName: 'Canada',
    flagEmoji: getFlagEmoji("CA"),
    nextIntakeDate: '2025-01-10',
    intakeNote: 'Winter 2025 Intake',
    icon: CalendarDays,
  },
  {
    countrySlug: 'uk',
    countryName: 'UK',
    flagEmoji: getFlagEmoji("GB"),
    nextIntakeDate: '2025-01-20',
    intakeNote: 'Spring 2025 Intake',
    icon: CalendarDays,
  },
  {
    countrySlug: 'new-zealand',
    countryName: 'New Zealand',
    flagEmoji: getFlagEmoji("NZ"),
    nextIntakeDate: '2025-02-20',
    intakeNote: 'Semester 1, 2025 Intake',
    icon: CalendarDays,
  },
];

    