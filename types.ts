
import { LucideIcon } from 'lucide-react';
import { FIELD_OPTIONS } from './teamData';

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

// استخراج النوع من مصفوفة التخصصات المركزية
export type FieldId = typeof FIELD_OPTIONS[number]['id'];

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  photoUrl: string;
  rating: number;
  linkedinUrl?: string;
  category: FieldId | string;
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

export const STATUS_LABELS: Record<string, string> = {
  pending: 'طلب جديد',
  reviewing: 'قيد المراجعة',
  approved: 'في انتظار المقابلة',
  completed: 'مكتمل',
  canceled: 'ملغي'
};

export interface RegistrationFormData {
  fullName: string;
  email: string;
  country: string;
  whatsapp: string;
  linkedin: string;
  field: string;
  techStack: string; 
  experience: number;
  level: 'fresh' | 'junior' | 'mid-senior' | 'lead-staff';
  goals: string[];
  hasInterviewExperience: string;
  upcomingInterview: string;
  preferredTime: string;
  expectations: string;
  termsAccepted: boolean;
  planName: string; 
  userId?: string;
  submittedAt?: any;
  status?: 'pending' | 'approved' | 'completed' | 'canceled' | 'reviewing';
  meetingLink?: string;
  meetingDate?: string; 
  reportLink?: string;
  videoLink?: string;
  evaluationReport?: string; 
  finalScore?: number;
  requestNumber?: string; 
  interviewerId?: string; 
  interviewerName?: string; 
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  country?: string;
  role: 'user' | 'admin' | 'interviewer' | 'maintainer';
  field?: FieldId | string;
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
