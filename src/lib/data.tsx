
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
  Activity 
} from 'lucide-react';

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  studyDestination: string;
  avatarUrl?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah L.',
    text: "Pixar Edu made my dream of studying in Australia a reality. Their guidance was invaluable!",
    studyDestination: 'University of Melbourne, Australia',
    avatarUrl: 'https://placehold.co/100x100.png',
  },
  {
    id: '2',
    name: 'John B.',
    text: "The team at Pixar Edu is extremely knowledgeable and supportive. They helped me navigate the complex US visa process seamlessly.",
    studyDestination: 'Stanford University, USA',
    avatarUrl: 'https://placehold.co/100x100.png',
  },
  {
    id: '3',
    name: 'Priya K.',
    text: "I highly recommend Pixar Edu for anyone looking to study in Europe. Their country guides and university suggestions were spot on.",
    studyDestination: 'ETH Zurich, Switzerland',
    avatarUrl: 'https://placehold.co/100x100.png',
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
    id: '1',
    name: 'Pradeep Khadka',
    role: 'Founder & CEO',
    bio: 'With over 15 years of experience in international education, Dr. Carter is passionate about helping students achieve their academic dreams.',
    imageUrl: '/co.jpg',
    dataAiHint: 'professional woman',
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Senior Advisor - North America',
    bio: 'Michael specializes in US and Canadian university admissions, holding a Master\'s in Education Counseling.',
    imageUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'professional man',
  },
  {
    id: '3',
    name: 'Sophia Rossi',
    role: 'Lead Consultant - Europe & Australia',
    bio: 'Sophia has extensive knowledge of European and Australian education systems, guiding students with expertise.',
    imageUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'consultant advisor',
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
  "Accounting",
  "Aerospace Engineering",
  "Agriculture",
  "Anthropology",
  "Architecture",
  "Art History",
  "Artificial Intelligence",
  "Astronomy",
  "Astrophysics",
  "Biochemistry",
  "Bioengineering",
  "Biology",
  "Biomedical Engineering",
  "Biotechnology",
  "Business Administration",
  "Chemical Engineering",
  "Chemistry",
  "Civil Engineering",
  "Cognitive Science",
  "Communications",
  "Computer Engineering",
  "Computer Science",
  "Creative Writing",
  "Criminology",
  "Cybersecurity",
  "Data Science",
  "Dentistry",
  "Design (Graphic, Industrial, etc.)",
  "Drama and Theatre Arts",
  "Earth Sciences",
  "Economics",
  "Education",
  "Electrical Engineering",
  "English Literature",
  "Environmental Science",
  "Fashion Design",
  "Film Studies",
  "Finance",
  "Fine Arts",
  "Food Science",
  "Forensic Science",
  "Genetics",
  "Geography",
  "Geology",
  "Health Sciences",
  "History",
  "Hospitality Management",
  "Human Resources Management",
  "Industrial Engineering",
  "Information Technology",
  "International Relations",
  "Journalism",
  "Kinesiology",
  "Languages and Linguistics",
  "Law",
  "Liberal Arts",
  "Library Science",
  "Marine Biology",
  "Marketing",
  "Materials Science",
  "Mathematics",
  "Mechanical Engineering",
  "Mechatronics",
  "Media Studies",
  "Medicine",
  "Microbiology",
  "Music",
  "Nanotechnology",
  "Neuroscience",
  "Nuclear Engineering",
  "Nursing",
  "Nutrition and Dietetics",
  "Oceanography",
  "Petroleum Engineering",
  "Pharmacy",
  "Philosophy",
  "Physics",
  "Physiology",
  "Political Science",
  "Psychology",
  "Public Health",
  "Robotics",
  "Social Work",
  "Sociology",
  "Software Engineering",
  "Space Science",
  "Sports Science",
  "Statistics",
  "Supply Chain Management",
  "Sustainable Development",
  "Telecommunications Engineering",
  "Tourism Management",
  "Urban Planning",
  "Veterinary Medicine",
  "Zoology",
];

export const sopCountries = [
  { name: 'USA', value: 'USA' },
  { name: 'Australia', value: 'Australia' },
  { name: 'UK', value: 'UK' },
  { name: 'Canada', value: 'Canada' },
  { name: 'New Zealand', value: 'New Zealand' },
  { name: 'Germany', value: 'Germany' },
  { name: 'France', value: 'France' },
  { name: 'Ireland', value: 'Ireland' },
  { name: 'Netherlands', value: 'Netherlands' },
];

export const allEducationLevels = [
  { name: "High School Diploma or Equivalent (e.g., +2, A-Levels)", value: "High School Diploma or Equivalent" },
  { name: "Diploma", value: "Diploma" },
  { name: "Associate Degree", value: "Associate Degree" },
  { name: "Bachelor's Degree", value: "Bachelor's Degree" },
  { name: "Postgraduate Diploma", value: "Postgraduate Diploma" },
  { name: "Master's Degree", value: "Master's Degree" },
  { name: "Doctorate (PhD)", value: "Doctorate (PhD)" },
];


// Data for Appointment Booking
export const appointmentServices = [
  { value: 'ielts_class_inquiry', label: 'IELTS Class Inquiry' },
  { value: 'pte_class_inquiry', label: 'PTE Class Inquiry' },
  { value: 'general_consultation', label: 'General Education Consultation' },
  { value: 'university_application_assistance', label: 'University Application Assistance' },
  { value: 'visa_counseling_usa', label: 'Visa Counseling (USA)' },
  { value: 'visa_counseling_australia', label: 'Visa Counseling (Australia)' },
  { value: 'visa_counseling_uk', label: 'Visa Counseling (UK)' },
  { value: 'visa_counseling_europe', label: 'Visa Counseling (Europe)' },
  { value: 'visa_counseling_new_zealand', label: 'Visa Counseling (New Zealand)' },
  { value: 'pre_departure_briefing', label: 'Pre-Departure Briefing' },
  { value: 'career_counseling', label: 'Career Counseling' },
  { value: 'other', label: 'Other (Please specify in notes)' },
];

export const appointmentStaff = [
  { value: 'pradeep_khadka', label: 'Pradeep Khadka (CEO)' },
  { value: 'pawan_acharye', label: 'Pawan Acharye' },
  { value: 'any_available', label: 'Any Available Advisor' },
];

export const appointmentTimeSlots = [
  '09:00 AM - 09:30 AM',
  '09:30 AM - 10:00 AM',
  '10:00 AM - 10:30 AM',
  '10:30 AM - 11:00 AM',
  '11:00 AM - 11:30 AM',
  '11:30 AM - 12:00 PM',
  '12:00 PM - 12:30 PM',
  '12:30 PM - 01:00 PM',
  '01:00 PM - 01:30 PM',
  '01:30 PM - 02:00 PM',
  '02:00 PM - 02:30 PM',
  '02:30 PM - 03:00 PM',
  '03:00 PM - 03:30 PM',
  '03:30 PM - 04:00 PM',
  '04:00 PM - 04:30 PM',
  '04:30 PM - 05:00 PM',
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

export const educationLevelOptions = [ // Used for homepage pathway planner
  { value: "Associate Degree", label: "Seeking Associate Degree" },
  { value: "Bachelor's Degree", label: "Seeking Bachelor's Degree" },
  { value: "Postgraduate Diploma", label: "Seeking Postgraduate Diploma" },
  { value: "Master's Degree", label: "Seeking Master's Degree" },
];
