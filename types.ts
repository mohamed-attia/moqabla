
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

export type EvaluationScore = 1 | 2 | 3 | 4 | 5;

export interface EvaluationDetail {
  skill: string;
  score: EvaluationScore;
  notes: string;
}

export interface EvaluationSection {
  id: string;
  title: string;
  weight: number;
  items: EvaluationDetail[];
  summary: string;
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
  level: 'fresh' | 'junior' | 'mid-senior' | 'lead-staff';
  goals: string[];
  hasInterviewExperience: string;
  upcomingInterview: string;
  preferredTime: string;
  expectations: string;
  termsAccepted: boolean;
  userId?: string;
  submittedAt?: any;
  status?: 'pending' | 'approved' | 'completed' | 'canceled' | 'reviewing';
  meetingLink?: string;
  reportLink?: string;
  videoLink?: string;
  evaluationReport?: string; // AI Generated Report Content
  requestNumber?: string; // Unique human-readable ID
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  country?: string;
  role: 'user' | 'admin' | 'interviewer' | 'maintainer';
  field?: 'UX' | 'FE' | 'BE' | 'mobile';
  level?: 'fresh' | 'junior' | 'mid-senior' | 'lead-staff';
  isEmailVerified: boolean;
  referralCode: string;
  referralCount: number;
  referredUsers?: string[]; 
  referredBy?: string;
  referralProcessed?: boolean;
  createdAt: any;
  updatedAt?: any;
}

export interface ReviewData {
  id: string;
  requestId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  interviewFeedback: string;
  platformFeedback: string;
  interviewerFeedback: string;
  improvementIdeas?: string;
  submittedAt: any;
}
