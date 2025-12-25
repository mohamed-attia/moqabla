import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import * as FirebaseAuth from 'firebase/auth';
const { onAuthStateChanged } = FirebaseAuth as any;
import * as ReactRouterDOM from 'react-router-dom';
import { 
  Loader2, Calendar, FileText, Code, Clock, Briefcase, Star, X, 
  MessageSquareQuote, CheckCircle2, Video, FileCheck, ExternalLink, 
  Link as LinkIcon, ClipboardCheck, Award, Eye, Download, Sparkles, ArrowLeft, Hash,
  MessageSquare, CalendarCheck, Zap, Linkedin, Globe, Info, User, HelpCircle,
  ChevronLeft, Mail, Phone
} from 'lucide-react';
import Button from './Button';
import { STATUS_LABELS } from '../types';

const { useNavigate } = ReactRouterDOM as any;

declare var html2pdf: any;

interface MyRequestData {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  country: string;
  linkedin: string;
  field: string;
  experience: number;
  level: 'fresh' | 'junior' | 'mid-senior' | 'lead-staff';
  status: string;
  submittedAt: any;
  techStack: string; 
  goals: string[];
  hasInterviewExperience: string;
  upcomingInterview: string;
  expectations: string;
  preferredTime: string;
  planName?: string;
  meetingLink?: string;
  meetingDate?: string;
  reportLink?: string;
  videoLink?: string;
  evaluationReport?: string;
  finalScore?: number;
  requestNumber?: string;
}

const UserRequests: React.FC = () => {
  const [requests, setRequests] = useState<MyRequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingRequestId, setReviewingRequestId] = useState<string | null>(null);
  const [viewingReportId, setViewingReportId] = useState<string | null>(null);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [feedback, setFeedback] = useState({
    interview: '',
    platform: '',
    interviewer: '',
    improvements: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        try {
          const q = query(collection(db, "registrations"), where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const results: MyRequestData[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            results.push({ id: doc.id, ...data } as MyRequestData);
          });
          
          results.sort((a, b) => {
            const timeA = a.submittedAt?.seconds || 0;
            const timeB = b.submittedAt?.seconds || 0;
            return timeB - timeA;
          });
          
          setRequests(results);
        } catch (error) {
          console.error("Error fetching requests:", error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleDownloadPDF = (userName: string) => {
    const element = document.getElementById('report-to-print');
    if (!element) return;
    
    setIsDownloading(true);
    const opt = {
      margin: 10,
      filename: `تقرير_مقابلة_${userName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      setIsDownloading(false);
    }).catch((err: any) => {
      console.error('PDF Download Error:', err);
      setIsDownloading(false);
    });
  };

  const handleSubmitReview = async (req: MyRequestData) => {
    if (!feedback.interview || !feedback.platform || !feedback.interviewer) {
        alert("يرجى تعبئة التقييمات الأساسية");
        return;
    }

    setSubmittingReview(true);
    try {
        await addDoc(collection(db, "reviews"), {
            requestId: req.id,
            userId: auth.currentUser?.uid,
            userName: req.fullName || auth.currentUser?.displayName,
            userEmail: req.email || auth.currentUser?.email,
            userPhone: req.whatsapp || '',
            interviewFeedback: feedback.interview,
            platformFeedback: feedback.platform,
            interviewerFeedback: feedback.interviewer,
            improvementIdeas: feedback.improvements,
            submittedAt: serverTimestamp()
        });
        setReviewSuccess(true);
        setTimeout(() => {
            setReviewingRequestId(null);
            setReviewSuccess(false);
            setFeedback({ interview: '', platform: '', interviewer: '', improvements: '' });
        }, 2000);
    } catch (error) {
        console.error("Error saving review:", error);
        alert("حدث خطأ أثناء حفظ التقييم");
    } finally {
        setSubmittingReview(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'غير محدد';
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString('ar-EG', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    }
    return new Date(timestamp).toLocaleDateString('ar-EG');
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-green-100 text-green-800 border-green-200",
      approved: "bg-blue-100 text-blue-800 border-blue-200",
      canceled: "bg-red-100 text-red-800 border-red-200",
      reviewing: "bg-purple-100 text-purple-800 border-purple-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200"
    };

    const label = STATUS_LABELS[status] || STATUS_LABELS.pending;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.pending}`}>
        {label}
      </span>
    );
  };

  const getInterviewHistoryLabel = (val: string) => {
    return val === 'yes' ? 'نعم، خضت مقابلات سابقة' : 'لا، هذه المرة الأولى';
  };

  const getUpcomingInterviewLabel = (val: string) => {
    switch (val) {
      case 'yes_soon': return 'نعم، خلال هذا الأسبوع';
      case 'yes_later': return 'نعم، في موعد لاحق';
      default: return 'لا يوجد مقابلة محددة حالياً';
    }
  };

  const hasActiveRequest = requests.some(req => {
     const status = req.status || 'pending';
     return ['pending', 'reviewing', 'approved'].includes(status);
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-12 flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
        <p className="text-gray-500">جاري تحميل طلباتك...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50 px-4 md:px-6" dir="rtl">
      <div className="container mx-auto max-w-4xl text-right">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 text-right">
          <div className="text-right w-full">
            <h1 className="text-3xl font-bold text-primary mb-2">طلباتي</h1>
            <p className="text-gray-500">تتبع حالة طلبات المقابلة الخاصة بك</p>
          </div>
          {!hasActiveRequest && (
            <Button onClick={() => navigate('/request-meeting')} className="whitespace-nowrap">
              طلب جديد +
            </Button>
          )}
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد طلبات حالياً</h3>
            <p className="text-gray-500 mb-6">لم تقم بإنشاء أي طلب مقابلة بعد.</p>
            <Button variant="outline" onClick={() => navigate('/request-meeting')}>
              ابدأ الآن
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map((req) => (
              <div key={req.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow text-right">
                <div className="px-6 py-4 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4 bg-gray-50/50">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                        <Hash className="w-5 h-5" />
                      </div>
                      <div className="text-right">
                        <h3 className="font-bold text-gray-900">{req.field}</h3>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5 justify-end">
                          <span className="font-bold bg-gray-200 px-1.5 py-0.5 rounded text-gray-700">
                             {req.requestNumber || `MQ-${req.id.slice(0, 6).toUpperCase()}`}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(req.submittedAt)}
                          </span>
                        </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className={`text-[10px] font-black px-2 py-1 rounded-lg border ${req.planName?.includes('مميزة') ? 'bg-accent/5 text-accent border-accent/20' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                         {req.planName || 'باقة عادية'}
                      </div>
                      {req.status === 'completed' && (
                        <button 
                            onClick={() => setReviewingRequestId(req.id)}
                            className="flex items-center gap-1 text-xs font-bold text-accent hover:text-accentHover bg-accent/5 px-3 py-1 rounded-full border border-accent/20 transition-colors"
                        >
                            <Star className="w-3 h-3" />
                            تقييم التجربة
                        </button>
                      )}
                      {getStatusBadge(req.status || 'pending')}
                   </div>
                </div>

                <div className="p-6 text-right">
                  {/* قسم موعد وروابط الجلسة */}
                  {(req.status === 'completed' || req.status === 'approved') && (req.reportLink || req.videoLink || req.meetingLink || req.meetingDate) && (
                    <div className="mb-6 p-5 bg-blue-50/30 rounded-2xl border border-blue-100 text-right">
                      <h4 className="text-xs font-black text-blue-900 mb-4 flex items-center gap-2 uppercase tracking-wider justify-start text-right">
                        <CheckCircle2 className="w-4 h-4 text-blue-500" /> تفاصيل موعد وروابط الجلسة
                      </h4>
                      
                      {req.meetingDate && (
                        <div className="mb-4 p-3 bg-white rounded-xl border border-blue-100 flex items-center gap-3 justify-start text-right">
                           <Calendar className="w-5 h-5 text-blue-500" />
                           <div className="text-right">
                              <div className="text-[10px] font-bold text-gray-400 uppercase">موعد المقابلة المعتمد</div>
                              <div className="text-sm font-black text-blue-900">{req.meetingDate}</div>
                           </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 justify-start">
                        {req.meetingLink && (
                          <a href={req.meetingLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl text-xs font-bold border border-gray-100 hover:border-accent hover:text-accent shadow-sm transition-all">
                            <LinkIcon className="w-4 h-4" /> رابط الاجتماع المباشر
                            <ExternalLink className="w-3 h-3 opacity-50" />
                          </a>
                        )}
                        {req.videoLink && (
                          <a href={req.videoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl text-xs font-bold border border-gray-100 hover:border-accent hover:text-accent shadow-sm transition-all">
                            <Video className="w-4 h-4" /> تسجيل المقابلة (فيديو)
                            <ExternalLink className="w-3 h-3 opacity-50" />
                          </a>
                        )}
                        {req.reportLink && (
                          <a href={req.reportLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl text-xs font-bold border border-gray-100 hover:border-accent hover:text-accent shadow-sm transition-all">
                            <FileCheck className="w-4 h-4" /> التقرير المرفق (PDF)
                            <ExternalLink className="w-3 h-3 opacity-50" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {(req.status === 'pending' || !req.status) && (
                    <div className="mb-10 bg-slate-50 border border-slate-100 rounded-3xl p-6 text-right">
                       <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 justify-start text-right">
                         <Zap className="w-4 h-4 text-accent" /> المراحل القادمة لطلبك
                       </h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 text-right">
                             <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                                <MessageSquare className="w-5 h-5" />
                             </div>
                             <div className="text-right">
                                <div className="text-xs font-black text-primary mb-1">1- قيد المراجعة</div>
                                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                                   مرحلة بيتم فيها التواصل مع مقدم الطلب ويتم تأكيد التحويل المالي.
                                </p>
                             </div>
                          </div>

                          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 text-right">
                             <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                <CalendarCheck className="w-5 h-5" />
                             </div>
                             <div className="text-right">
                                <div className="text-xs font-black text-primary mb-1">2- {STATUS_LABELS.approved}</div>
                                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                                   مرحلة بيتم فيها تحديد الموعد المناسب مع الخبير التقني ومقدم الطلب.
                                </p>
                             </div>
                          </div>
                       </div>
                    </div>
                  )}

                  {req.status === 'completed' && req.evaluationReport && (
                    <div className="group relative mb-10 overflow-hidden rounded-[2.5rem] bg-slate-900 p-1 shadow-2xl transition-all hover:scale-[1.01] text-right">
                       <div className="absolute inset-0 bg-gradient-to-r from-accent/40 via-emerald-500/40 to-teal-500/40 opacity-50 blur-xl group-hover:opacity-80 transition-opacity"></div>
                       <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900 px-8 py-8 rounded-[2.4rem] border border-white/10 text-right">
                          <div className="flex flex-col md:flex-row items-center gap-6 text-right">
                             <div className="relative">
                               <div className="absolute inset-0 bg-accent rounded-3xl blur-md opacity-40 animate-pulse"></div>
                               <div className="relative w-20 h-20 bg-gradient-to-br from-accent to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl">
                                  <Sparkles className="w-10 h-10 text-white animate-bounce" />
                               </div>
                             </div>
                             <div className="space-y-1 text-right w-full">
                                <h4 className="text-2xl font-black text-white flex items-center justify-start gap-2 text-right">
                                  تقرير التقييم الذكي جاهز! 
                                </h4>
                                <p className="text-gray-400 text-sm font-medium text-right">
                                  لقد حققت نتيجة مذهلة: <span className="text-emerald-400 font-black text-lg">%{req.finalScore}</span> في تقييمك التقني.
                                </p>
                             </div>
                          </div>
                          <div className="flex flex-col items-center gap-3">
                            <button 
                              onClick={() => setViewingReportId(req.id)}
                              className="group/btn relative flex items-center gap-3 bg-white px-8 py-4 rounded-2xl font-black text-slate-900 shadow-xl transition-all hover:bg-accent hover:text-white active:scale-95 whitespace-nowrap"
                            >
                              <Eye className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
                              عرض التقرير الكامل
                              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover/btn:-translate-x-1" />
                            </button>
                            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Moqabala AI Agent v3.0</span>
                          </div>
                       </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6 text-right">
                    <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 text-right">
                      <div className="flex items-center justify-between mb-4 text-right">
                        <h4 className="text-sm font-black text-gray-900 flex items-center gap-2 justify-start text-right">
                          <Info className="w-4 h-4 text-accent" /> تفاصيل الطلب المسجلة
                        </h4>
                        <button 
                          onClick={() => setExpandedRequestId(expandedRequestId === req.id ? null : req.id)}
                          className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                        >
                          {expandedRequestId === req.id ? 'طي التفاصيل' : 'عرض التفاصيل الكاملة'}
                          <ChevronLeft className={`w-3 h-3 transition-transform ${expandedRequestId === req.id ? 'rotate-[-90deg]' : ''}`} />
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm text-right">
                        <div className="flex items-center gap-2 text-gray-600 justify-start text-right">
                           <Briefcase className="w-4 h-4 text-gray-400" />
                           <span className="font-bold">المستوى:</span>
                           <span>{req.level}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 justify-start text-right">
                           <Clock className="w-4 h-4 text-gray-400" />
                           <span className="font-bold">الوقت المفضل:</span>
                           <span>{req.preferredTime === 'morning' ? 'صباحاً' : req.preferredTime === 'evening' ? 'مساءً' : 'مرن'}</span>
                        </div>
                      </div>

                      {expandedRequestId === req.id && (
                        <div className="mt-6 pt-6 border-t border-gray-200 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300 text-right">
                          <div className="grid md:grid-cols-2 gap-6 text-right">
                            <div className="space-y-4 text-right">
                              <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest text-right">المعلومات الشخصية والمهنية</h5>
                              <div className="space-y-3 text-right">
                                <div className="flex items-center gap-2 text-gray-700 justify-start text-right">
                                  <User className="w-4 h-4 text-gray-400" />
                                  <span className="font-bold">الاسم المسجل:</span> {req.fullName}
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 justify-start text-right">
                                  <Mail className="w-4 h-4 text-gray-400" />
                                  <span className="font-bold">البريد:</span> <span className="dir-ltr">{req.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 justify-start text-right">
                                  <Phone className="w-4 h-4 text-emerald-500" />
                                  <span className="font-bold">واتساب:</span> <span className="dir-ltr">{req.whatsapp}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 justify-start text-right">
                                  <Globe className="w-4 h-4 text-gray-400" />
                                  <span className="font-bold">الدولة:</span> {req.country}
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 justify-start text-right">
                                  <Linkedin className="w-4 h-4 text-[#0077b5]" />
                                  <span className="font-bold">LinkedIn:</span>
                                  <a href={req.linkedin} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline truncate max-w-[150px] dir-ltr text-right">{req.linkedin}</a>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 justify-start text-right">
                                  <Zap className="w-4 h-4 text-amber-500" />
                                  <span className="font-bold">سنوات الخبرة:</span> {req.experience} سنة
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4 text-right">
                              <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest text-right">تاريخ المقابلات</h5>
                              <div className="space-y-2 text-right">
                                <div className="flex items-center gap-2 text-gray-700 justify-start text-right">
                                  <HelpCircle className="w-4 h-4 text-gray-400" />
                                  <span className="font-bold">مقابلات سابقة:</span> {getInterviewHistoryLabel(req.hasInterviewExperience)}
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 justify-start text-right">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  <span className="font-bold">مقابلة قادمة:</span> {getUpcomingInterviewLabel(req.upcomingInterview)}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4 text-right">
                            <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest text-right">الخلفية التقنية والمهنية (Stack)</h5>
                            <div className="p-3 bg-white rounded-xl border border-gray-100 text-gray-700 font-mono text-xs text-right">
                              {req.techStack}
                            </div>
                          </div>

                          <div className="space-y-4 text-right">
                            <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest text-right">الأهداف من الجلسة</h5>
                            <div className="flex flex-wrap gap-2 justify-start text-right">
                              {req.goals?.map((goal, idx) => (
                                <span key={idx} className="px-3 py-1 bg-accent/5 text-accent rounded-full text-[10px] font-bold border border-accent/10 text-right">
                                  {goal}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4 text-right">
                            <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest text-right">توقعات المستخدم من الجلسة</h5>
                            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 text-gray-700 text-sm leading-relaxed italic text-right">
                              "{req.expectations}"
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {viewingReportId === req.id && (
                  <div className="fixed inset-0 z-[110] bg-slate-900/90 backdrop-blur-lg flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl relative animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col text-right">
                      <div className="bg-primary p-6 md:p-8 text-white flex justify-between items-center shrink-0 border-b border-white/10 text-right">
                         <div className="flex items-center gap-4 text-right">
                           <div className="w-12 h-12 md:w-14 md:h-14 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20">
                             <Award className="w-6 h-6 md:w-8 md:h-8" />
                           </div>
                           <div className="text-right">
                             <h3 className="text-lg md:text-xl font-black">تقرير التقييم النهائي</h3>
                             <p className="text-accent text-xs font-bold uppercase tracking-widest">{req.fullName}</p>
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <button 
                             onClick={() => handleDownloadPDF(req.fullName)} 
                             disabled={isDownloading}
                             className="p-2 md:p-3 bg-accent/20 hover:bg-accent/30 text-accent rounded-full transition-colors flex items-center gap-2 text-xs md:text-sm font-bold"
                             title="تحميل PDF"
                           >
                             {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                             <span className="hidden md:inline">تحميل PDF</span>
                           </button>
                           <button onClick={() => setViewingReportId(null)} className="p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                             <X className="w-5 h-5 md:w-6 md:h-6" />
                           </button>
                         </div>
                      </div>
                      
                      <div id="report-to-print" className="p-6 md:p-10 overflow-y-auto custom-scrollbar flex-grow bg-white text-right">
                         <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-center justify-between mb-8 shadow-inner text-right">
                            <div className="text-emerald-800 font-black text-right">الدرجة النهائية المستحقة:</div>
                            <div className="text-3xl md:text-4xl font-black text-emerald-600">{req.finalScore}%</div>
                         </div>
                         <div className="prose prose-slate max-w-none dir-rtl text-right whitespace-pre-wrap leading-loose font-medium text-gray-700 text-right">
                           {req.evaluationReport}
                         </div>
                      </div>

                      <div className="p-6 md:p-8 border-t border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-center items-center gap-4 shrink-0 text-right">
                         <Button variant="primary" className="px-12 py-4 w-full md:w-auto text-lg rounded-2xl shadow-xl shadow-accent/20" onClick={() => setViewingReportId(null)}>فهمت ذلك، شكراً لكم!</Button>
                         <button onClick={() => handleDownloadPDF(req.fullName)} disabled={isDownloading} className="flex items-center justify-center gap-2 px-10 py-4 bg-white border-2 border-accent text-accent rounded-2xl font-bold hover:bg-accent hover:text-white transition-all w-full md:w-auto shadow-sm disabled:opacity-50">{isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} حفظ التقرير (PDF)</button>
                      </div>
                    </div>
                  </div>
                )}

                {reviewingRequestId === req.id && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                        <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 text-right">
                            <div className="bg-accent px-6 py-4 flex items-center justify-between text-white text-right">
                                <h3 className="font-bold text-lg flex items-center gap-2 text-right">
                                    <MessageSquareQuote className="w-5 h-5" />
                                    تقييم تجربتك للمقابلة
                                </h3>
                                <button onClick={() => setReviewingRequestId(null)} className="hover:rotate-90 transition-transform">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar text-right">
                                {reviewSuccess ? (
                                    <div className="py-12 text-center space-y-4">
                                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
                                        <p className="text-xl font-bold text-gray-800">شكراً لك! تم استلام تقييمك بنجاح</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-right">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">تقييمك للمقابلة بشكل عام</label>
                                            <textarea value={feedback.interview} onChange={(e) => setFeedback({...feedback, interview: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-accent focus:border-accent min-h-[80px] text-right" placeholder="كيف كانت الأسئلة? هل استفدت؟" />
                                        </div>
                                        <div className="text-right">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">تقييمك للمنصة وسهولة الاستخدام</label>
                                            <textarea value={feedback.platform} onChange={(e) => setFeedback({...feedback, platform: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-accent focus:border-accent min-h-[80px] text-right" placeholder="تجربة الموقع، الحجز، التواصل..." />
                                        </div>
                                        <div className="text-right">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">تقييمك للمقيم (المحاور)</label>
                                            <textarea value={feedback.interviewer} onChange={(e) => setFeedback({...feedback, interviewer: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-accent focus:border-accent min-h-[80px] text-right" placeholder="أسلوب الشرح، التغذية الراجعة، الالتزام بالوقت..." />
                                        </div>
                                        <div className="text-right">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">أفكار لتحسين المنصة (اختياري)</label>
                                            <textarea value={feedback.improvements} onChange={(e) => setFeedback({...feedback, improvements: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-accent focus:border-accent min-h-[80px] text-right" placeholder="ما الذي تود رؤيته مستقبلاً؟" />
                                        </div>
                                        <div className="pt-4">
                                            {/* Fix: Pass req to handleSubmitReview inside an arrow function to match Button's onClick type and provide required argument */}
                                            <Button onClick={() => handleSubmitReview(req)} disabled={submittingReview} className="w-full justify-center text-lg">{submittingReview ? <Loader2 className="w-6 h-6 animate-spin" /> : 'إرسال التقييم'}</Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRequests;