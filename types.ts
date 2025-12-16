import { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  isPage?: boolean; // New property to distinguish internal links from pages
}

export interface FeatureItem {
  title: string;
  description: string;
  Icon: LucideIcon;
}

export interface VisionItem {
  title: string;
  description: string;
  Icon: LucideIcon;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  photoUrl: string;
  rating: number;
  linkedinUrl?: string;
  category: 'FE' | 'BE' | 'UX' | 'MOBILE' | 'PM' | 'QA' | 'DATA' | 'DEVOPS';
}

export interface RegistrationFormData {
  // Step 1: Basic Info
  fullName: string;
  email: string;
  country: string;
  whatsapp: string;
  linkedin: string;
  
  // Step 2: Tech Background
  field: string;
  techStack: string[];
  experience: number;
  level: 'junior' | 'mid' | 'senior' | 'lead';
  
  // Step 3: Goals
  goals: string[];
  hasInterviewExperience: string; // 'yes' | 'no'
  upcomingInterview: string; // 'yes' | 'no' | 'soon'
  preferredTime: string;
  expectations: string;
  termsAccepted: boolean;
  
  submittedAt?: any; // Timestamp
  status?: 'pending' | 'approved' | 'completed' | 'canceled' | 'reviewing';
}