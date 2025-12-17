import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import * as firebaseAuth from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Loader2, Calendar, FileText, Code, Clock, Briefcase } from 'lucide-react';
import Button from './Button';

interface MyRequestData {
  id: string;
  field: string;
  level: string;
  status: string;
  submittedAt: any;
  techStack: string[];
  goals: string[];
  preferredTime: string;
}

const UserRequests: React.FC = () => {
  const [requests, setRequests] = useState<MyRequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const q = query(collection(db, "registrations"), where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const results: MyRequestData[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            results.push({ id: doc.id, ...data } as MyRequestData);
          });
          
          // Sort client side (newest first)
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

  // Determine if there is an active request (Pending or Reviewing)
  // Also handle undefined status as pending
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
                {/* Header */}
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
                   {getStatusBadge(req.status)}
                </div>

                {/* Body */}
                <div className="p-6 grid md:grid-cols-2 gap-6">
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRequests;