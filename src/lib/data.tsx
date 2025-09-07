

import React, { Fragment, type ReactNode, type ElementType, type SVGProps } from 'react';
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
  CalendarDays,
  Facebook,
  Instagram,
  Youtube,
} from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

export interface Student {
  id: string;
  timestamp: Timestamp;
  fullName: string;
  email: string;
  mobileNumber: string;
  visaStatus: 'Pending' | 'Approved' | 'Rejected' | 'Not Applied';
  serviceFeeStatus: 'Paid' | 'Unpaid';
  assignedTo: string;
  // Optional fields from contact form and admin panel
  lastCompletedEducation?: string;
  englishProficiencyTest?: string;
  preferredStudyDestination?: string;
  additionalNotes?: string;
  // New fields from admin panel
  serviceFeePaidDate?: Timestamp | null;
  visaStatusUpdateDate?: Timestamp | null;
  emergencyContact?: string;
  collegeUniversityName?: string;
  // Fields for remote inquiries
  appointmentDate?: Timestamp | null;
  inquiryType?: 'office_walk_in' | 'visit' | 'phone';
}

export const counselorNames = [
  'Unassigned',
  'Pawan Acharya',
  'Mujal Amatya',
  'Sabina Thapa',
  'Shyam Babu Ojha',
  'Mamata Chapagain',
  'Pradeep Khadka'
];

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
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxzdHVkZW50JTIwcG9ydHJhaXR8ZW58MHx8fHwxNzUxNTQ3MjI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'student portrait',
  },
  {
    id: 'testimonial-2',
    name: 'Pratik B K',
    studyDestination: 'Georgian College, Canada',
    text: "My journey to Canada was made much smoother thanks to the Pixar Edu team. Their guidance on visa and college selection was top-notch.",
    avatarUrl: 'https://images.unsplash.com/photo-1584012961506-b6fc4c9f3105?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8c3R1ZGVudCUyMHNtaWxpbmd8ZW58MHx8fHwxNzUxNTQ3MjI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'student smiling',
  },
  {
    id: 'testimonial-3',
    name: 'Prashana Thapa Magar',
    studyDestination: 'Cardiff Metropolitan University, UK',
    text: "The counselors at Pixar Edu were incredibly helpful in securing my admission and visa for the UK. A truly professional service!",
    avatarUrl: 'https://images.unsplash.com/photo-1560439450-57df7ac6dbef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxoYXBweSUyMHN0dWRlbnR8ZW58MHx8fHwxNzUxNTQ3MjI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'happy student',
  },
  {
    id: 'testimonial-4',
    name: 'Arju Pokhrel',
    studyDestination: 'University of New Castle, Australia',
    text: "I'm grateful to Pixar Edu for their expert advice on studying in Australia. They made a complex process seem easy.",
    avatarUrl: 'https://images.unsplash.com/photo-1644091792174-bb6f90e04dbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8Z3JhZHVhdGUlMjBzdHVkZW50fGVufDB8fHx8MTc1MTU0NzIyOHww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'graduate student',
  },
  {
    id: 'testimonial-5',
    name: 'Srijana Rana',
    studyDestination: 'Eastern Institute of Technology, New Zealand',
    text: "Choosing Pixar Edu was the best decision for my New Zealand study plans. Their support was exceptional from start to finish.",
    avatarUrl: 'https://images.unsplash.com/photo-1591218214141-45545921d2d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxzdHVkZW50JTIwZXhjaXRlZHxlbnwwfHx8fDE3NTE1NDcyMjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'student excited',
  },
  {
    id: 'testimonial-6',
    name: 'Bivusha Gautam',
    studyDestination: 'Arkansas State University, USA',
    text: "Thanks to Pixar Edu, I am now pursuing my dream course in the USA. Their visa guidance was particularly helpful.",
    avatarUrl: 'https://images.unsplash.com/photo-1522951657911-1d13d070d883?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxmb2N1c2VkJTIwc3R1ZGVudHxlbnwwfHx8fDE3NTE1NDcyMjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'focused student',
  },
];

export interface VisaSuccess {
  name: string;
  destination: string;
  text: string;
}

export interface VisaSuccessesByCountry {
  [country: string]: VisaSuccess[];
}

export const visaSuccesses: VisaSuccessesByCountry = {
  "USA": [
    { name: "Bhawana Paneru", destination: "University of Central Arkansas, USA", text: "PixarEdu's guidance was invaluable for my US visa. Highly recommended!" },
    { name: "Bivusha Gautam", destination: "Arkansas State University, USA", text: "Thanks to Pixar, I'm studying in the USA. Their visa support is excellent." },
    { name: "Rajan Yadav", destination: "University of Central Missouri, USA", text: "The team at PixarEdu made my US study dream a reality. Very professional." },
    { name: "Indra Bahadur Air", destination: "Murray State University, USA", text: "A smooth and successful visa process for the USA. Thank you, PixarEdu!" },
    { name: "Aryan Raj Pokhrel", destination: "Harrisburg University, USA", text: "Excellent counseling and visa preparation for the United States." },
    { name: "Safal Tamang Pakhrin", destination: "Washington University Of Science And Technology, USA", text: "Grateful for the step-by-step guidance which led to my US visa approval." },
    { name: "Anish Khadka", destination: "Wright State University, USA", text: "I highly recommend PixarEdu for their expertise in US university admissions." },
    { name: "Roshi Pandey", destination: "NorthWest Missouri State University, USA", text: "My US student visa was approved smoothly. The mock interviews were very helpful." },
    { name: "Pooja Nepali", destination: "Webster University, USA", text: "A truly professional consultancy that helped me get to the USA." },
    { name: "Sunil Prakash Yadav", destination: "Webster University, USA", text: "My dream of studying in the USA came true thanks to the amazing team at PixarEdu." },
    { name: "Sulab Bhandari", destination: "Louisiana Tech University, USA", text: "The entire process was seamless. Thank you PixarEdu for the US visa success." },
    { name: "Sadikshya Tiwari", destination: "University Of Central Arkansas, USA", text: "From college selection to visa approval, PixarEdu was with me every step of the way." },
    { name: "Meera Koirala", destination: "St.Cloud State University, USA", text: "I am thrilled to be studying in the USA, all thanks to PixarEdu's support." },
    { name: "Biprashna Gochhe Shrestha", destination: "University Of Central Arkansas, USA", text: "A big thank you to PixarEdu for their expert advice and assistance." },
    { name: "Ujwal Thapa", destination: "Westcliff University, USA", text: "Their professional approach made the complex US visa process simple." },
    { name: "Rojina Shrestha", destination: "Washington University Of Science And Technology, USA", text: "Highly recommend PixarEdu for any student aspiring to study in the USA." },
    { name: "Binod Khatri", destination: "Arkansas State University, USA", text: "The visa guidance was top-notch. So glad I chose PixarEdu for my US studies." },
    { name: "Kushum Bhattrai", destination: "Washington University Of Science And Technology, USA", text: "Achieved my dream of studying in the USA. PixarEdu's team is fantastic." },
    { name: "Nabaraj Singh", destination: "Washington University Of Science And Technology, USA", text: "PixarEdu provided excellent support for my US visa application." },
    { name: "Sanjip Ghalan", destination: "Washington University Of Science And Technology, USA", text: "Professional, reliable, and supportive. Thank you for the visa success!" },
    { name: "Samir Gurung", destination: "Washington University Of Science And Technology, USA", text: "My US study journey started with PixarEdu, and I couldn't be happier." },
    { name: "Karuna Chettri", destination: "University OF South Dakota, USA", text: "The team is knowledgeable and guided me perfectly for my US student visa." },
    { name: "Shuprava Pandey", destination: "Louisiana Tech University, USA", text: "I'm grateful for the personalized attention that led to my visa approval." },
    { name: "Binita Karki", destination: "Washington University Of Science And Technology, USA", text: "A seamless experience from application to visa. Highly recommended." },
    { name: "Laxmi Kumari Teli", destination: "Washington University Of Science And Technology, USA", text: "PixarEdu's expertise was key to my successful US visa application." },
    { name: "Bikash Yadav", destination: "Washington University Of Science And Technology, USA", text: "Thank you PixarEdu for making my American dream possible." },
    { name: "Sabina Khatri", destination: "Washington University Of Science And Technology, USA", text: "Their mock interview sessions were incredibly helpful for my US visa." },
    { name: "Kamana Dhital", destination: "Washington University Of Science And Technology, USA", text: "Professional guidance and a successful outcome. Very happy with the service." },
    { name: "Nobel Regmi", destination: "Washington University Of Science And Technology, USA", text: "Chose the right consultancy for my US studies. Thank you, PixarEdu!" },
    { name: "Kritika Khati", destination: "Washington University Of Science And Technology, USA", text: "The support I received from PixarEdu was exceptional. Now I'm in the USA!" },
    { name: "Swastika Shrestha", destination: "Southeast Missouri State University, USA", text: "An efficient and trustworthy consultancy that delivered on their promise." },
    { name: "Anjila Shahi", destination: "Wright State University, USA", text: "The process was made simple and clear. Very grateful for their help." },
    { name: "Manav Adhikari", destination: "Wichita State University, USA", text: "My US visa success is a testament to their hard work and expertise." },
    { name: "Vikash Kumar", destination: "Montana State University, USA", text: "I'm glad I trusted PixarEdu with my US study plans. It paid off!" },
    { name: "Asif Mohammad", destination: "Midwestern State University, USA", text: "From start to finish, the support was amazing. Highly recommend." },
    { name: "Suvanga Rawal", destination: "University Of Central Arkansas, USA", text: "Thank you for the excellent guidance and for helping me get my US visa." },
    { name: "Aayushma Thapa", destination: "Wright State University, USA", text: "The counselors are knowledgeable and genuinely helpful. Great experience." },
    { name: "Saroj Oli", destination: "University Of Central Arkansas , USA", text: "A smooth journey to the USA, all thanks to the dedicated team at PixarEdu." },
    { name: "Jhakku Prasad Chalaune", destination: "University of Central Arkansas, USA", text: "Their visa interview preparation is the best. It made all the difference." },
    { name: "Nabin Rana", destination: "Arkansas State University , USA", text: "Achieved my goal of studying in the US with PixarEdu's fantastic support." },
    { name: "Aruna Thapa", destination: "Westcliff University , USA", text: "I am grateful for their professional services which led to my visa approval." },
    { name: "Janam Paijo Gurung", destination: "Southeast Missouri, USA", text: "A reliable consultancy that I would recommend to anyone planning for US studies." },
    { name: "Purnima Dulal", destination: "Southeast Missouri, USA", text: "So happy to have received my visa for the USA. Thank you PixarEdu team!" }
  ],
  "Australia": [
    { name: "Arju Pokhrel", destination: "University of New Castle, Australia", text: "Grateful for the expert advice on studying in Australia. A smooth process!" },
    { name: "Sushruti Sharma", destination: "University of Wollongong, Australia", text: "PixarEdu's guidance on the GTE was crucial for my Australian visa success." },
    { name: "Rohit Sha Kanu", destination: "Flinders University, Australia", text: "A professional service that made my dream of studying in Australia come true." },
    { name: "Rajan Gharti", destination: "Victoria University, Australia", text: "Highly recommend for Australian university applications. Great support." },
    { name: "Rahul Rumba", destination: "Flinders University, Australia", text: "The team is knowledgeable about Australian education and visa policies." },
    { name: "Bejil Shrestha", destination: "University of Wollongong, Australia", text: "My journey to Australia was seamless thanks to their expert guidance." },
    { name: "Hari Sharan Puri", destination: "La Trobe University, Australia", text: "Thank you PixarEdu for helping me secure my visa for Australia." },
    { name: "Janak Budhathoki", destination: "La Trobe University, Australia", text: "Excellent support and very transparent process. Happy to be in Australia." },
    { name: "Aanchal Thapa", destination: "Victoria University, Australia", text: "Their assistance with documentation was top-notch. Highly professional." },
    { name: "Abhineet Sah", destination: "University of Wollongong, Australia", text: "I'm thankful for the personalized counseling and support I received." },
    { name: "Bikash Shrestha", destination: "TIIS, Australia", text: "A great consultancy that genuinely cares about student success in Australia." }
  ],
  "Canada": [
    { name: "Pratik B K", destination: "Georgian College, Canada", text: "My journey to Canada was made much smoother with PixarEdu. Their guidance on the visa process was excellent." }
  ],
  "UK": [
    { name: "Prashana Thapa Magar", destination: "Cardiff Metropolitan University, UK", text: "The counselors at PixarEdu were incredibly helpful in securing my admission and visa for the UK." }
  ],
  "New Zealand": [
    { name: "Srijana Rana", destination: "Eastern Institute of Technology, New Zealand", text: "Choosing PixarEdu was the best decision for my New Zealand study plans. Exceptional support!" },
    { name: "Shulav Dangi", destination: "Otago Polytechnic, New Zealand", text: "The process for New Zealand was straightforward with their help." },
    { name: "Puja Chaudhary", destination: "Auckland Institute Of Studies, New Zealand", text: "Very happy with the outcome. Now studying in beautiful New Zealand." },
    { name: "Prasuna Sapkota", destination: "Auckland Institute Of Studies, New Zealand", text: "Thank you for the guidance and for making my NZ dream a reality." },
    { name: "Kailash Bhatta", destination: "Auckland Institute Of Studies, New Zealand", text: "Professional team that provides excellent support for New Zealand applicants." }
  ]
};

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
    id: 'english-prep',
    title: 'Expert English Test Preparation',
    description: 'Ace IELTS, TOEFL, PTE & Duolingo with our tailored coaching.',
    longDescription: "Our comprehensive English test preparation programs are designed to equip you with the skills and strategies needed to achieve your target scores. We offer specialized coaching for IELTS, TOEFL iBT, PTE Academic, and the Duolingo English Test. Our experienced instructors provide personalized feedback, mock tests, and focused training on all test sections – Reading, Writing, Listening, and Speaking. Join us to build your confidence and master the exam.",
    icon: BookMarked,
    imageUrl: '/services/pixarclasses.jpg',
    dataAiHint: "classroom students learning",
    keyFeatures: [
      "Tailored coaching for IELTS, TOEFL, PTE, Duolingo",
      "Experienced instructors & personalized feedback",
      "Comprehensive mock tests and practice materials",
      "Small class sizes for focused attention"
    ]
  },
  {
    id: 'personalized-guidance',
    title: 'Personalized Guidance',
    description: 'Tailored advice to match your academic goals and preferences.',
    longDescription: 'Every student is unique, with different aspirations and academic backgrounds. We offer personalized guidance sessions to understand your specific needs, help you choose the right courses and universities, and develop a strategic application plan. Our experienced counselors provide insights into various education systems and career pathways.',
    icon: Lightbulb,
    imageUrl: '/services/pg.jpg',
    dataAiHint: 'student guidance',
    keyFeatures: [
      "One-on-one counseling sessions",
      "Course and university shortlisting based on profile",
      "Career pathway mapping and advice",
      "Scholarship & funding opportunity guidance"
    ]
  },
  {
    id: 'documentation-assistance',
    title: 'Documentation Assistance',
    description: 'Comprehensive support for all your application paperwork.',
    longDescription: 'Navigating the complex documentation requirements for international university applications can be daunting. We provide meticulous assistance with preparing, organizing, and reviewing all necessary documents, including transcripts, recommendation letters, statements of purpose, and financial proofs. Our goal is to ensure your application is complete, accurate, and compelling.',
    icon: Briefcase,
    imageUrl: '/services/da.png',
    dataAiHint: 'documents application',
    keyFeatures: [
      "Application form completion strategy",
      "Statement of Purpose (SOP/Essay) review & feedback",
      "Financial document checklist & guidance",
      "Letter of Recommendation (LOR) advice"
    ]
  },
  {
    id: 'visa-support',
    title: 'Visa & Pre-Departure Support',
    description: 'Expert help with visa applications and pre-departure preparations.',
    longDescription: 'Securing a student visa and preparing for life in a new country are crucial steps. We offer expert assistance with visa applications, including mock interviews and document checklists. Additionally, we provide comprehensive pre-departure briefings covering accommodation, cultural adaptation, and essential travel tips to ensure a smooth transition.',
    icon: Users, 
    imageUrl: '/services/vsa.jpg',
    dataAiHint: 'travel preparation',
    keyFeatures: [
      "Student visa application assistance for various countries",
      "Mock visa interview preparation",
      "Pre-departure briefings and checklist",
      "Guidance on accommodation and travel arrangements"
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

// Reordered and roles updated as per user request, preserving existing IDs, bios, imageUrls, dataAiHints
export const teamMembers: TeamMember[] = [
  {
    id: 'team-8', 
    name: 'Pawan Acharya',
    role: 'Managing Director',
    bio: 'Oversees the operational and strategic direction of Pixar Educational Consultancy, ensuring service excellence.',
    imageUrl: '/teams/pawan.jpeg',
    dataAiHint: 'director man',
  },
  {
    id: 'team-3', 
    name: 'Mujal Amatya',
    role: 'USA Counselor',
    bio: 'Expert in U.S. university applications, scholarships, and F-1 visa procedures.',
    imageUrl: '/teams/mujal.jpeg', 
    dataAiHint: 'advisor man',
  },
  {
    id: 'team-2', 
    name: 'Shyam Babu Ojha',
    role: 'New Zealand Counselor',
    bio: 'Specializes in New Zealand university admissions and visa processes, providing expert guidance.',
    imageUrl: '/teams/shyam.jpeg', 
    dataAiHint: 'counselor man',
  },
  {
    id: 'team-9', 
    name: 'Sabina Thapa',
    role: 'Australia Counselor',
    bio: 'Provides specialized counseling for students aspiring to study in Australia, focusing on admissions and visas.',
    imageUrl: '/teams/sabina.jpeg',
    dataAiHint: 'counselor woman',
  },
  {
    id: 'team-4', 
    name: 'Sonima Rijal',
    role: 'Application Officer',
    bio: 'Assists students with the university application process, ensuring all documents are perfectly prepared.',
    imageUrl: '/teams/sonima.jpeg', 
    dataAiHint: 'officer woman',
  },
  {
    id: 'team-5', 
    name: 'Sujata Nepal',
    role: 'Application Officer',
    bio: 'Dedicated to helping students meticulously complete their applications for various universities.',
    imageUrl: '/teams/sujata.jpeg', 
    dataAiHint: 'professional portrait',
  },
  {
    id: 'team-10', 
    name: 'Anisha Thapa',
    role: 'Academic Head - IELTS & PTE', // Role updated
    bio: 'Leads our English language test preparation programs (IELTS, PTE, TOEFL, Duolingo), ensuring high-quality coaching.',
    imageUrl: '/teams/anisha.jpeg', 
    dataAiHint: 'teacher woman',
  },
  {
    id: 'team-1', 
    name: 'Saubhana Bhandari',
    role: 'Frontdesk Officer', // Role updated
    bio: 'Manages front office operations and assists students with initial inquiries, ensuring a welcoming experience.',
    imageUrl: '/teams/saubhana.jpeg', 
    dataAiHint: 'professional woman',
  },
  {
    id: 'team-6', 
    name: 'Mamata Chapagain',
    role: 'Documents Officer',
    bio: 'Expert in managing and verifying student documentation for smooth application submissions.',
    imageUrl: '/teams/mamata.jpeg', 
    dataAiHint: 'woman team',
  },
  {
    id: 'team-7', 
    name: 'Sunita Khadka',
    role: 'Office Caretaker',
    bio: 'Ensures a clean, organized, and welcoming office environment for students and staff.',
    imageUrl: '/teams/sunita.JPG', 
    dataAiHint: 'office staff',
  },
  {
    id: 'team-12', 
    name: 'Shikhar KC',
    role: 'IT Head',
    bio: 'Manages our IT infrastructure and digital platforms, ensuring smooth technological operations.',
    imageUrl: '/teams/shikhar.jpg',
    dataAiHint: 'tech professional',
  },
  {
    id: 'team-11', 
    name: 'Ram Babu Ojha',
    role: 'Video Editor',
    bio: 'Creates engaging video content for our promotional and informational materials.',
    imageUrl: '/teams/rambabu.jpg', 
    dataAiHint: 'creative man',
  },
  {
    id: 'team-13', 
    name: 'Pradeep Khadka',
    role: 'Chief Executive Officer', // Role updated
    bio: 'With over 15 years of experience in international education, Pradeep is passionate about helping students achieve their academic dreams.',
    imageUrl: '/teams/pradeep.jpeg', 
    dataAiHint: 'ceo man',
  },
];


export interface Accreditation {
  id: string;
  name: string;
  issuingBody: string;
  logoUrl: string;
  dataAiHint?: string;
}

export const accreditations: Accreditation[] = [
  { id: 'acc-1', name: 'ICEF Trained Agent Counsellor', issuingBody: 'The ICEF', logoUrl: '/accreditations/ICEF.jpg', dataAiHint: 'logo badge' },
  { id: 'acc-2', name: 'National Code Online Tutorial - ESOS', issuingBody: 'ISANA', logoUrl: '/accreditations/isana.jpg', dataAiHint: 'logo certificate' },
  { id: 'acc-3', name: 'License', issuingBody: 'Ministry of Education, Science & Technology', logoUrl: '/accreditations/license.jpg', dataAiHint: 'award seal' },
  { id: 'acc-4', name: 'Educational Counselor Training', issuingBody: 'Training Institue for Technical Instruction (TITI)', logoUrl: '/accreditations/pktiti.jpg', dataAiHint: 'official logo' },
  { id: 'acc-5', name: 'Record of Achievement', issuingBody: 'ThinkNew', logoUrl: '/accreditations/recordofachievment.jpg', dataAiHint: 'recognition badge' },
  { id: 'acc-6', name: 'Qualified Education Agent Counsellor', issuingBody: 'PIER', logoUrl: '/accreditations/Pradeep_M670.jpg', dataAiHint: 'certification mark' },
  { id: 'acc-7', name: 'Study UK: Guide for Education Agents & Counsellors', issuingBody: 'British Council', logoUrl: '/accreditations/studyuk.jpg', dataAiHint: 'partner logo' },
  { id: 'acc-8', name: 'Educational Counsellor Training', issuingBody: 'Training Institute for Technical Instruction (TITI)', logoUrl: '/accreditations/titi.jpg', dataAiHint: 'approval logo' },
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
    imageUrl: '/countries/australia.png',
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
    imageUrl: '/countries/canada.png',
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
    imageUrl: '/countries/usa.png',
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
    imageUrl: '/countries/uk.png',
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
    imageUrl: '/countries/new-zealand.png',
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
  { value: "IELTS Prep", label: "IELTS" },
  { value: "PTE Prep", label: "PTE" },
  { value: "TOEFL Prep", label: "TOEFL" },
  { value: "Duolingo Prep", label: "Duolingo" },
  { value: "USA Visa Prep", label: "Unlimited USA Visa Prep" },
  { value: "General English", label: "General English" },
];

export const studyDestinationOptions = [
  { value: "USA", label: "USA" },
  { value: "New Zealand", label: "New Zealand" },
  { value: "Australia", label: "Australia" },
  { value: "Canada", label: "Canada" },
  { value: "UK", label: "UK" },
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
  nextIntakeDate: string; 
  intakeNote: string; 
  icon: ElementType;
}

export const upcomingIntakeData: IntakeInfo[] = [
  {
    countrySlug: 'usa',
    countryName: 'USA',
    flagEmoji: '🇺🇸',
    nextIntakeDate: '2026-01-15',
    intakeNote: 'Spring 2026 Intake',
    icon: CalendarDays,
  },
  {
    countrySlug: 'australia',
    countryName: 'Australia',
    flagEmoji: '🇦🇺',
    nextIntakeDate: '2026-02-20',
    intakeNote: 'Major Intake: Feb 2026',
    icon: CalendarDays,
  },
  {
    countrySlug: 'canada',
    countryName: 'Canada',
    flagEmoji: '🇨🇦',
    nextIntakeDate: '2026-01-10',
    intakeNote: 'Winter 2026 Intake',
    icon: CalendarDays,
  },
  {
    countrySlug: 'uk',
    countryName: 'UK',
    flagEmoji: '🇬🇧',
    nextIntakeDate: '2025-09-20',
    intakeNote: 'Fall 2025 Intake',
    icon: CalendarDays,
  },
  {
    countrySlug: 'new-zealand',
    countryName: 'New Zealand',
    flagEmoji: '🇳🇿',
    nextIntakeDate: '2026-02-25',
    intakeNote: 'Semester 1, 2026 Intake',
    icon: CalendarDays,
  },
];

export const TikTokIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 28 32"
    fill="currentColor"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M20.656.001H24.4c.115 2.148.882 4.322 2.447 5.836 1.566 1.555 3.782 2.27 5.932 2.1.07.923.084 1.847.084 2.773-.014 1.858-.028 3.708-.028 5.566s.014 3.708.028 5.566c-.028 2.127-.868 4.273-2.42 5.787-1.553 1.51-3.727 2.21-5.892 2.07-.07.923-.084 1.847-.084 2.773-.014 1.858-.028 3.708-.028-5.566s.014 3.708.028 5.566c-1.647.042-3.294.042-4.94.042-1.48 0-2.968.028-4.45.028-.168-2.155-.868-4.28-2.433-5.82-1.58-1.556-3.78-2.24-5.92-2.1-.07-.923-.084-1.847-.084-2.773-.014-1.858-.028-3.708-.028-5.566s.014-3.708.028-5.566c.028-2.127.868-4.273 2.42-5.787 1.553-1.51 3.727-2.21 5.892-2.07.07-.923.084-1.847.084-2.773.014-1.858-.028-3.708-.028-5.566s-.014-3.708-.028-5.566c1.68-.056 3.358-.056 5.037-.056.112-.882.112-1.778.098-2.664.0-0.125.0-0.252.014-0.378H20.656zM23.186 26.09c-1.663 0-3.014 1.35-3.014 3.014s1.35 3.014 3.014 3.014 3.014-1.35 3.014-3.014-1.35-3.014-3.014-3.014zm0-14.84c-1.663 0-3.014 1.35-3.014 3.014s1.35 3.014 3.014 3.014 3.014-1.35 3.014-3.014-1.35-3.014-3.014-3.014z"/>
  </svg>
);

export const socialPlatforms = [
  { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/pixaredu', colorClass: 'hover:text-blue-600', dataAiHint: 'facebook logo' },
  { name: 'TikTok', icon: TikTokIcon, url: 'https://www.tiktok.com/@pixareducation?_t=ZS-8xBncYemVFt&_r=1', colorClass: 'hover:text-black dark:hover:text-white', dataAiHint: 'tiktok logo' },
  { name: 'YouTube', icon: Youtube, url: 'https://www.youtube.com/@pixareducation', colorClass: 'hover:text-red-600', dataAiHint: 'youtube logo' },
  { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/pixar.education?igsh=MXE5ZWJhZ2tmNTMybQ==', colorClass: 'hover:text-pink-500', dataAiHint: 'instagram logo' },
];

export const universityList = [
  // USA
  { value: 'Arkansas State University', label: 'Arkansas State University', country: 'USA' },
  { value: 'Cardiff Metropolitan University', label: 'Cardiff Metropolitan University', country: 'UK' },
  { value: 'Eastern Institute of Technology', label: 'Eastern Institute of Technology', country: 'New Zealand' },
  { value: 'Flinders University', label: 'Flinders University', country: 'Australia' },
  { value: 'Georgian College', label: 'Georgian College', country: 'Canada' },
  { value: 'Harrisburg University', label: 'Harrisburg University', country: 'USA' },
  { value: 'Louisiana Tech University', label: 'Louisiana Tech University', country: 'USA' },
  { value: 'Midwestern State University', label: 'Midwestern State University', country: 'USA' },
  { value: 'Montana State University', label: 'Montana State University', country: 'USA' },
  { value: 'Murray State University', label: 'Murray State University', country: 'USA' },
  { value: 'NorthWest Missouri State University', label: 'NorthWest Missouri State University', country: 'USA' },
  { value: 'Otago Polytechnic', label: 'Otago Polytechnic', country: 'New Zealand' },
  { value: 'Southeast Missouri State University', label: 'Southeast Missouri State University', country: 'USA' },
  { value: 'St.Cloud State University', label: 'St.Cloud State University', country: 'USA' },
  { value: 'University of Central Arkansas', label: 'University of Central Arkansas', country: 'USA' },
  { value: 'University of Central Missouri', label: 'University of Central Missouri', country: 'USA' },
  { value: 'University Of South Dakota', label: 'University Of South Dakota', country: 'USA' },
  { value: 'Washington University Of Science And Technology', label: 'Washington University Of Science And Technology', country: 'USA' },
  { value: 'Webster University', label: 'Webster University', country: 'USA' },
  { value: 'Westcliff University', label: 'Westcliff University', country: 'USA' },
  { value: 'Wichita State University', label: 'Wichita State University', country: 'USA' },
  { value: 'Wright State University', label: 'Wright State University', country: 'USA' },
  { value: 'Massachusetts Institute of Technology (MIT)', label: 'Massachusetts Institute of Technology (MIT)', country: 'USA' },
  { value: 'Stanford University', label: 'Stanford University', country: 'USA' },
  { value: 'Harvard University', label: 'Harvard University', country: 'USA' },
  { value: 'California Institute of Technology (Caltech)', label: 'California Institute of Technology (Caltech)', country: 'USA' },
  { value: 'University of Chicago', label: 'University of Chicago', country: 'USA' },
  { value: 'University of Pennsylvania', label: 'University of Pennsylvania', country: 'USA' },
  { value: 'Cornell University', label: 'Cornell University', country: 'USA' },
  { value: 'Yale University', label: 'Yale University', country: 'USA' },
  { value: 'Columbia University', label: 'Columbia University', country: 'USA' },
  { value: 'University of California, Berkeley', label: 'University of California, Berkeley', country: 'USA' },
  { value: 'University of California, Los Angeles (UCLA)', label: 'University of California, Los Angeles (UCLA)', country: 'USA' },
  { value: 'University of Michigan–Ann Arbor', label: 'University of Michigan–Ann Arbor', country: 'USA' },
  { value: 'Johns Hopkins University', label: 'Johns Hopkins University', country: 'USA' },
  { value: 'Carnegie Mellon University', label: 'Carnegie Mellon University', country: 'USA' },
  { value: 'University of Washington', label: 'University of Washington', country: 'USA' },
  { value: 'Duke University', label: 'Duke University', country: 'USA' },
  { value: 'Northwestern University', label: 'Northwestern University', country: 'USA' },
  { value: 'New York University (NYU)', label: 'New York University (NYU)', country: 'USA' },
  { value: 'University of California, San Diego (UCSD)', label: 'University of California, San Diego (UCSD)', country: 'USA' },
  { value: 'University of Illinois at Urbana–Champaign', label: 'University of Illinois at Urbana–Champaign', country: 'USA' },

  // Australia
  { value: 'University of New Castle', label: 'University of New Castle', country: 'Australia' },
  { value: 'Victoria University', label: 'Victoria University', country: 'Australia' },
  { value: 'University of Melbourne', label: 'University of Melbourne', country: 'Australia' },
  { value: 'Monash University', label: 'Monash University', country: 'Australia' },
  { value: 'University of Sydney', label: 'University of Sydney', country: 'Australia' },
  { value: 'Australian National University', label: 'Australian National University', country: 'Australia' },
  { value: 'University of Queensland', label: 'University of Queensland', country: 'Australia' },
  { value: 'UNSW Sydney', label: 'UNSW Sydney', country: 'Australia' },
  { value: 'University of Adelaide', label: 'University of Adelaide', country: 'Australia' },
  { value: 'University of Western Australia', label: 'University of Western Australia', country: 'Australia' },
  { value: 'University of Technology Sydney', label: 'University of Technology Sydney', country: 'Australia' },
  { value: 'Macquarie University', label: 'Macquarie University', country: 'Australia' },
  { value: 'Deakin University', label: 'Deakin University', country: 'Australia' },
  { value: 'Queensland University of Technology', label: 'Queensland University of Technology', country: 'Australia' },
  { value: 'University of Wollongong', label: 'University of Wollongong', country: 'Australia' },
  { value: 'Curtin University', label: 'Curtin University', country: 'Australia' },
  { value: 'RMIT University', label: 'RMIT University', country: 'Australia' },
  { value: 'Swinburne University of Technology', label: 'Swinburne University of Technology', country: 'Australia' },
  { value: 'La Trobe University', label: 'La Trobe University', country: 'Australia' },
  { value: 'Griffith University', label: 'Griffith University', country: 'Australia' },
  { value: 'University of Tasmania', label: 'University of Tasmania', country: 'Australia' },
  
  // Canada
  { value: 'University of Toronto', label: 'University of Toronto', country: 'Canada' },
  { value: 'McGill University', label: 'McGill University', country: 'Canada' },
  { value: 'University of British Columbia', label: 'University of British Columbia', country: 'Canada' },
  { value: 'University of Alberta', label: 'University of Alberta', country: 'Canada' },
  { value: 'University of Waterloo', label: 'University of Waterloo', country: 'Canada' },

  // New Zealand
  { value: 'University of Auckland', label: 'University of Auckland', country: 'New Zealand' },
  { value: 'University of Otago', label: 'University of Otago', country: 'New Zealand' },
  { value: 'University of Waikato', label: 'University of Waikato', country: 'New Zealand' },
  { value: 'Massey University', label: 'Massey University', country: 'New Zealand' },
  { value: 'Victoria University of Wellington', label: 'Victoria University of Wellington', country: 'New Zealand' },
  { value: 'University of Canterbury', label: 'University of Canterbury', country: 'New Zealand' },

  // United Kingdom
  { value: 'University of Oxford', label: 'University of Oxford', country: 'UK' },
  { value: 'University of Cambridge', label: 'University of Cambridge', country: 'UK' },
  { value: 'Imperial College London', label: 'Imperial College London', country: 'UK' },
  { value: 'University College London (UCL)', label: 'University College London (UCL)', country: 'UK' },
  { value: 'London School of Economics and Political Science (LSE)', label: 'London School of Economics and Political Science (LSE)', country: 'UK' },
  { value: 'University of Edinburgh', label: 'University of Edinburgh', country: 'UK' },
  { value: 'University of Manchester', label: 'University of Manchester', country: 'UK' },
  { value: 'King’s College London', label: 'King’s College London', country: 'UK' },
  { value: 'University of Birmingham', label: 'University of Birmingham', country: 'UK' },
  { value: 'University of Warwick', label: 'University of Warwick', country: 'UK' },
  { value: 'University of Glasgow', label: 'University of Glasgow', country: 'UK' },
  { value: 'University of Bristol', label: 'University of Bristol', country: 'UK' },
  { value: 'University of Southampton', label: 'University of Southampton', country: 'UK' },
  { value: 'University of Sheffield', label: 'University of Sheffield', country: 'UK' },
  { value: 'Durham University', label: 'Durham University', country: 'UK' },
];
