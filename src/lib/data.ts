import { Award, Briefcase, Lightbulb, Users, MapPin, Landmark, TrendingUp, Globe } from 'lucide-react';
import type { ReactElement } from 'react';

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
  icon: React.ElementType;
  imageUrl?: string;
  dataAiHint?: string;
}

export const services: Service[] = [
  {
    id: '1',
    title: 'Documentation Assistance',
    description: 'Comprehensive support for all your application paperwork.',
    longDescription: 'Navigating the complex documentation requirements for international university applications can be daunting. We provide meticulous assistance with preparing, organizing, and reviewing all necessary documents, including transcripts, recommendation letters, statements of purpose, and financial proofs. Our goal is to ensure your application is complete, accurate, and compelling.',
    icon: Briefcase,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'documents application',
  },
  {
    id: '2',
    title: 'Personalized Guidance',
    description: 'Tailored advice to match your academic goals and preferences.',
    longDescription: 'Every student is unique, with different aspirations and academic backgrounds. We offer personalized guidance sessions to understand your specific needs, help you choose the right courses and universities, and develop a strategic application plan. Our experienced counselors provide insights into various education systems and career pathways.',
    icon: Lightbulb,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'student guidance',
  },
  {
    id: '3',
    title: 'Visa & Pre-Departure Support',
    description: 'Expert help with visa applications and pre-departure preparations.',
    longDescription: 'Securing a student visa and preparing for life in a new country are crucial steps. We offer expert assistance with visa applications, including mock interviews and document checklists. Additionally, we provide comprehensive pre-departure briefings covering accommodation, cultural adaptation, and essential travel tips to ensure a smooth transition.',
    icon: Users,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'travel preparation',
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
    name: 'Dr. Emily Carter',
    role: 'Founder & Chief Consultant',
    bio: 'With over 15 years of experience in international education, Dr. Carter is passionate about helping students achieve their academic dreams.',
    imageUrl: 'https://placehold.co/300x300.png',
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
  countryFocus: string; // e.g., "Engineering", "Arts"
  website: string;
}

export interface CountryInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  dataAiHint?: string;
  facts: {
    icon: React.ElementType;
    label: string;
    value: string;
  }[];
  topUniversities: University[];
}

export const countryData: CountryInfo[] = [
  {
    id: 'europe',
    name: 'Europe',
    slug: 'europe',
    description: 'Discover world-class education and rich cultural experiences across diverse European countries. Europe offers a wide range of programs in historic and modern universities.',
    imageUrl: 'https://placehold.co/800x500.png',
    dataAiHint: 'europe landmark',
    facts: [
      { icon: Landmark, label: 'Key Regions', value: 'UK, Germany, France, Netherlands, etc.' },
      { icon: Globe, label: 'Languages', value: 'English, German, French, and many more' },
      { icon: TrendingUp, label: 'Known For', value: 'Research, Engineering, Arts, Humanities' },
    ],
    topUniversities: [
      { name: 'University of Oxford', city: 'Oxford, UK', countryFocus: 'Various', website: 'https://www.ox.ac.uk' },
      { name: 'ETH Zurich', city: 'Zurich, Switzerland', countryFocus: 'Science & Technology', website: 'https://ethz.ch' },
      { name: 'Sorbonne University', city: 'Paris, France', countryFocus: 'Arts & Humanities', website: 'https://www.sorbonne-universite.fr' },
      { name: 'Technical University of Munich', city: 'Munich, Germany', countryFocus: 'Engineering', website: 'https://www.tum.de' },
    ],
  },
  {
    id: 'australia',
    name: 'Australia',
    slug: 'australia',
    description: 'Experience a high-quality education system in a vibrant, multicultural environment. Australian universities are known for their research and innovation.',
    imageUrl: 'https://placehold.co/800x500.png',
    dataAiHint: 'australia landmark',
    facts: [
      { icon: Landmark, label: 'Capital', value: 'Canberra' },
      { icon: Globe, label: 'Language', value: 'English' },
      { icon: TrendingUp, label: 'Known For', value: 'STEM, Business, Health Sciences' },
    ],
    topUniversities: [
      { name: 'Australian National University', city: 'Canberra', countryFocus: 'Various', website: 'https://www.anu.edu.au' },
      { name: 'University of Melbourne', city: 'Melbourne', countryFocus: 'Various', website: 'https://www.unimelb.edu.au' },
      { name: 'University of Sydney', city: 'Sydney', countryFocus: 'Various', website: 'https://www.sydney.edu.au' },
      { name: 'University of Queensland', city: 'Brisbane', countryFocus: 'Various', website: 'https://www.uq.edu.au' },
    ],
  },
  {
    id: 'usa',
    name: 'USA',
    slug: 'usa',
    description: 'Home to many of the world\'s top universities, the USA offers unparalleled educational opportunities across all fields of study.',
    imageUrl: 'https://placehold.co/800x500.png',
    dataAiHint: 'usa landmark',
    facts: [
      { icon: Landmark, label: 'Capital', value: 'Washington D.C.' },
      { icon: Globe, label: 'Language', value: 'English' },
      { icon: TrendingUp, label: 'Known For', value: 'Technology, Business, Research, Arts' },
    ],
    topUniversities: [
      { name: 'Massachusetts Institute of Technology (MIT)', city: 'Cambridge', countryFocus: 'Technology & Engineering', website: 'https://web.mit.edu' },
      { name: 'Stanford University', city: 'Stanford', countryFocus: 'Various', website: 'https://www.stanford.edu' },
      { name: 'Harvard University', city: 'Cambridge', countryFocus: 'Various', website: 'https://www.harvard.edu' },
      { name: 'California Institute of Technology (Caltech)', city: 'Pasadena', countryFocus: 'Science & Engineering', website: 'https://www.caltech.edu' },
    ],
  },
  {
    id: 'new-zealand',
    name: 'New Zealand',
    slug: 'new-zealand',
    description: 'Study in a safe and welcoming country with a world-class education system and stunning natural landscapes. New Zealand offers unique programs and research opportunities.',
    imageUrl: 'https://placehold.co/800x500.png',
    dataAiHint: 'new zealand landscape',
    facts: [
      { icon: Landmark, label: 'Capital', value: 'Wellington' },
      { icon: Globe, label: 'Language', value: 'English, Māori' },
      { icon: TrendingUp, label: 'Known For', value: 'Agriculture, Environmental Science, Film' },
    ],
    topUniversities: [
      { name: 'University of Auckland', city: 'Auckland', countryFocus: 'Various', website: 'https://www.auckland.ac.nz' },
      { name: 'University of Otago', city: 'Dunedin', countryFocus: 'Health Sciences, Humanities', website: 'https://www.otago.ac.nz' },
      { name: 'Victoria University of Wellington', city: 'Wellington', countryFocus: 'Law, Public Policy, Design', website: 'https://www.wgtn.ac.nz' },
      { name: 'University of Canterbury', city: 'Christchurch', countryFocus: 'Engineering, Science', website: 'https://www.canterbury.ac.nz' },
    ],
  },
];
