import { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  isPage?: boolean;
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
  fullName: string;
  email: string;
  country: string;
  whatsapp: string;
  linkedin: string;
  field: string;
  techStack: string[];
  experience: number;
  level: 'junior' | 'mid' | 'senior' | 'lead';
  goals: string[];
  hasInterviewExperience: string;
  upcomingInterview: string;
  preferredTime: string;
  expectations: string;
  termsAccepted: boolean;
  userId?: string;
  submittedAt?: any;
  status?: 'pending' | 'approved' | 'completed' | 'canceled' | 'reviewing';
}

export interface ReviewData {
  id?: string;
  requestId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  interviewFeedback: string;
  platformFeedback: string;
  interviewerFeedback: string;
  improvementIdeas: string;
  submittedAt: any;
}