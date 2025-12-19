import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import * as ReactRouterDOM from 'react-router-dom';
import { Loader2, Calendar, FileText, Code, Clock, Briefcase, Star, X, MessageSquareQuote, CheckCircle2, Video, FileCheck, ExternalLink, Link as LinkIcon } from 'lucide-react';
import Button from './Button';

const { useNavigate } = ReactRouterDOM as any;

interface MyRequestData {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  field: string;
  level: string;
  status: string;
  submittedAt: any;
  techStack: string[];
  goals: string[];
  preferredTime: string;
  meetingLink?: string;
  reportLink?: string;
  videoLink?: string;
}

const UserRequests: React.FC = () => {
  const [requests, setRequests] = useState<MyRequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingRequestId, setReviewingRequestId] = useState<string | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  
  const [feedback, setFeedback] = useState({
    interview: '',
    platform: '',
    interviewer: '',
    improvements: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
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

    const labels: Record<string, string> = {
      completed: "مكتمل",
      approved: "تم القبول",
      canceled: "ملغي",
      reviewing: "قيد المراجعة",
      pending: "قيد الانتظار"
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.pending}`}>
        {labels[status] || "قيد الانتظار"}
      </span>
    );
  };

  const hasActiveRequest = requests.some(req => {
     const status = req.status || 'pending';
     return ['pending', 'reviewing'].includes(status);
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
    <div className="min-h-screen pt-32 pb-20 bg-gray-50 px-4 md:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">طلباتي</h1>
            <p className="text-gray-500">تتبع حالة طلبات المقابلة الخاصة بك</p>
          </div>
          {!hasActiveRequest && (
            <Button onClick={() => navigate('/request-meeting')}>
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
              <div key={req.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="px-6 py-4 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4 bg-gray-50/50">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                        <Code className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{req.field}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {formatDate(req.submittedAt)}
                        </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      {req.status === 'completed' && (
                        <button 
                            onClick={() => setReviewingRequestId(req.id)}
                            className="flex items-center gap-1 text-xs font-bold text-accent hover:text-accentHover bg-accent/5 px-3 py-1 rounded-full border border-accent/20 transition-colors"
                        >
                            <Star className="w-3 h-3" />
                            تقييم التجربة
                        </button>
                      )}
                      {getStatusBadge(req.status)}
                   </div>
                </div>

                <div className="p-6">
                  {/* Meeting Results Links - Only if Completed */}
                  {req.status === 'completed' && (req.reportLink || req.videoLink || req.meetingLink) && (
                    <div className="mb-8 p-5 bg-accent/5 rounded-2xl border border-accent/10">
                      <h4 className="text-sm font-black text-accent mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> مخرجات المقابلة النهائية
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {req.reportLink && (
                          <a 
                            href={req.reportLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl text-xs font-bold border border-gray-100 hover:border-accent hover:text-accent shadow-sm transition-all"
                          >
                            <FileCheck className="w-4 h-4" /> التقرير النهائي
                            <ExternalLink className="w-3 h-3 opacity-50" />
                          </a>
                        )}
                        {req.videoLink && (
                          <a 
                            href={req.videoLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl text-xs font-bold border border-gray-100 hover:border-accent hover:text-accent shadow-sm transition-all"
                          >
                            <Video className="w-4 h-4" /> تسجيل المقابلة
                            <ExternalLink className="w-3 h-3 opacity-50" />
                          </a>
                        )}
                        {req.meetingLink && (
                          <a 
                            href={req.meetingLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl text-xs font-bold border border-gray-100 hover:border-accent hover:text-accent shadow-sm transition-all"
                          >
                            <LinkIcon className="w-4 h-4" /> رابط الاجتماع
                            <ExternalLink className="w-3 h-3 opacity-50" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                          <Briefcase className="w-4 h-4" /> المستوى والتقنيات
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
                             {req.level === 'junior' && 'مبتدئ'}
                             {req.level === 'mid' && 'متوسط'}
                             {req.level === 'senior' && 'خبير'}
                             {req.level === 'lead' && 'قيادي'}
                          </span>
                          {req.techStack?.map((tech, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm border border-blue-100">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                          <Clock className="w-4 h-4" /> الوقت المفضل
                        </h4>
                        <p className="text-sm text-gray-700">
                          {req.preferredTime === 'morning' && 'صباحاً (9ص - 12م)'}
                          {req.preferredTime === 'evening' && 'مساءً (4م - 9م)'}
                          {req.preferredTime === 'flexible' && 'مرن في أي وقت'}
                          {!req.preferredTime && 'غير محدد'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">الأهداف من المقابلة</h4>
                      <ul className="space-y-2">
                        {req.goals?.map((goal, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0"></span>
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {reviewingRequestId === req.id && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                        <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95">
                            <div className="bg-accent px-6 py-4 flex items-center justify-between text-white">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <MessageSquareQuote className="w-5 h-5" />
                                    تقييم تجربتك للمقابلة
                                </h3>
                                <button onClick={() => setReviewingRequestId(null)} className="hover:rotate-90 transition-transform">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                {reviewSuccess ? (
                                    <div className="py-12 text-center space-y-4">
                                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
                                        <p className="text-xl font-bold text-gray-800">شكراً لك! تم استلام تقييمك بنجاح</p>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">تقييمك للمقابلة بشكل عام</label>
                                            <textarea 
                                                value={feedback.interview}
                                                onChange={(e) => setFeedback({...feedback, interview: e.target.value})}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-accent focus:border-accent min-h-[80px]"
                                                placeholder="كيف كانت الأسئلة؟ هل استفدت؟"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">تقييمك للمنصة وسهولة الاستخدام</label>
                                            <textarea 
                                                value={feedback.platform}
                                                onChange={(e) => setFeedback({...feedback, platform: e.target.value})}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-accent focus:border-accent min-h-[80px]"
                                                placeholder="تجربة الموقع، الحجز، التواصل..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">تقييمك للمقيم (المحاور)</label>
                                            <textarea 
                                                value={feedback.interviewer}
                                                onChange={(e) => setFeedback({...feedback, interviewer: e.target.value})}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-accent focus:border-accent min-h-[80px]"
                                                placeholder="أسلوب الشرح، التغذية الراجعة، الالتزام بالوقت..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">أفكار لتحسين المنصة (اختياري)</label>
                                            <textarea 
                                                value={feedback.improvements}
                                                onChange={(e) => setFeedback({...feedback, improvements: e.target.value})}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-accent focus:border-accent min-h-[80px]"
                                                placeholder="ما الذي تود رؤيته مستقبلاً؟"
                                            />
                                        </div>
                                        <div className="pt-4">
                                            <Button 
                                                onClick={() => handleSubmitReview(req)} 
                                                disabled={submittingReview}
                                                className="w-full justify-center text-lg"
                                            >
                                                {submittingReview ? <Loader2 className="w-6 h-6 animate-spin" /> : 'إرسال التقييم'}
                                            </Button>
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