
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { RegistrationFormData, UserProfile } from '../types';
import { FIELD_OPTIONS } from '../teamData';
import { 
  Loader2, FileText, Search, ChevronLeft, ChevronRight, Edit2, X, Filter, 
  Link as LinkIcon, Video, FileCheck, Save, Eye, User, Mail, Phone, 
  Linkedin, Code, Briefcase, Target, Clock, AlertCircle, Calendar, Globe, ClipboardCheck, Award, Download, Hash, Users as UsersIcon, UserCheck, Sparkles, HelpCircle, Zap, MessageSquare
} from 'lucide-react';
import * as FirebaseAuth from 'firebase/auth';
const { onAuthStateChanged } = FirebaseAuth as any;
import Button from './Button';
import JuniorEvaluation from './evaluations/JuniorEvaluation';
import SeniorMidEvaluation from './evaluations/SeniorMidEvaluation';
import LeadEvaluation from './evaluations/LeadEvaluation';
import { sendUserStatusUpdateNotification } from '../lib/notifications';

declare var html2pdf: any;

interface RegistrationWithId extends RegistrationFormData {
  id: string;
}

const MeetingRequests: React.FC = () => {
  const [allRegistrations, setAllRegistrations] = useState<RegistrationWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [editingRegistration, setEditingRegistration] = useState<RegistrationWithId | null>(null);
  const [viewingRegistration, setViewingRegistration] = useState<RegistrationWithId | null>(null);
  const [viewingUserReferrals, setViewingUserReferrals] = useState<number>(0);
  const [viewingReport, setViewingReport] = useState<RegistrationWithId | null>(null);
  const [linkingRegistration, setLinkingRegistration] = useState<RegistrationWithId | null>(null);
  const [evaluatingRegistration, setEvaluatingRegistration] = useState<RegistrationWithId | null>(null);
  const [evaluatingSeniorRegistration, setEvaluatingSeniorRegistration] = useState<RegistrationWithId | null>(null);
  const [evaluatingLeadRegistration, setEvaluatingLeadRegistration] = useState<RegistrationWithId | null>(null);
  
  const [statusToUpdate, setStatusToUpdate] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [links, setLinks] = useState({
    meeting: '',
    report: '',
    video: '',
    date: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "registrations"));
      const querySnapshot = await getDocs(q);
      
      const results: RegistrationWithId[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        results.push({ id: doc.id, ...data } as RegistrationWithId);
      });
      
      results.sort((a, b) => {
        const timeA = a.submittedAt?.seconds || 0;
        const timeB = b.submittedAt?.seconds || 0;
        return timeB - timeA;
      });

      setAllRegistrations(results);
    } catch (err: any) {
      console.error("Error fetching registrations:", err);
      setError("فشل في استرجاع البيانات.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        }
      }
    });

    fetchData();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleEditClick = (reg: RegistrationWithId) => {
    setEditingRegistration(reg);
    setStatusToUpdate(reg.status || 'pending');
  };

  const handleViewDetails = async (reg: RegistrationWithId) => {
    setViewingRegistration(reg);
    if (reg.userId) {
      try {
        const uDoc = await getDoc(doc(db, "users", reg.userId));
        if (uDoc.exists()) {
          setViewingUserReferrals(uDoc.data().referralCount || 0);
        }
      } catch (e) {
        setViewingUserReferrals(0);
      }
    }
  };

  const handleViewReport = (reg: RegistrationWithId) => {
    setViewingReport(reg);
  };

  const handleDownloadPDF = (userName: string) => {
    const element = document.getElementById('admin-report-to-print');
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
      setIsDownloading(false);
    });
  };

  const handleLinkClick = (reg: RegistrationWithId) => {
    setLinkingRegistration(reg);
    setLinks({
      meeting: reg.meetingLink || '',
      report: reg.reportLink || '',
      video: reg.videoLink || '',
      date: reg.meetingDate || ''
    });
  };

  const handleCloseModals = () => {
    setEditingRegistration(null);
    setViewingRegistration(null);
    setViewingUserReferrals(0);
    setViewingReport(null);
    setLinkingRegistration(null);
    setEvaluatingRegistration(null);
    setEvaluatingSeniorRegistration(null);
    setEvaluatingLeadRegistration(null);
    setIsUpdating(false);
  };

  const handleSaveStatus = async () => {
    if (!editingRegistration) return;
    setIsUpdating(true);
    try {
      const regRef = doc(db, "registrations", editingRegistration.id);
      await updateDoc(regRef, { status: statusToUpdate });
      
      await sendUserStatusUpdateNotification({
        to_email: editingRegistration.email,
        user_name: editingRegistration.fullName,
        request_number: editingRegistration.requestNumber || editingRegistration.id,
        new_status: statusToUpdate
      });

      setAllRegistrations(prev => prev.map(item => item.id === editingRegistration.id ? { ...item, status: statusToUpdate as any } : item));
      handleCloseModals();
    } catch (err) {
      alert("حدث خطأ أثناء التحديث.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveLinks = async () => {
    if (!linkingRegistration) return;
    setIsUpdating(true);
    try {
      const regRef = doc(db, "registrations", linkingRegistration.id);
      await updateDoc(regRef, { 
        meetingLink: links.meeting, 
        reportLink: links.report, 
        videoLink: links.video,
        meetingDate: links.date
      });
      setAllRegistrations(prev => prev.map(item => item.id === linkingRegistration.id ? { 
        ...item, 
        meetingLink: links.meeting, 
        reportLink: links.report, 
        videoLink: links.video,
        meetingDate: links.date
      } : item));
      handleCloseModals();
    } catch (err) {
      alert("حدث خطأ أثناء الحفظ.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">مكتمل</span>;
      case 'approved': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">مقبول</span>;
      case 'canceled': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">ملغي</span>;
      case 'reviewing': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">قيد المراجعة</span>;
      default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">قيد الانتظار</span>;
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'fresh': return 'مبتدأ (fresh)';
      case 'junior': return 'مبتدأ (junior)';
      case 'mid-senior': return 'متوسط وخبير (mid/senior)';
      case 'lead-staff': return 'قيادي (lead/staff)';
      default: return level;
    }
  };

  const getPreferredTimeLabel = (val: string) => {
    switch (val) {
      case 'morning': return 'صباحاً (9ص - 12م)';
      case 'evening': return 'مساءً (4م - 9م)';
      case 'flexible': return 'مرن في أي وقت';
      default: return val || 'غير محدد';
    }
  };

  const getInterviewHistoryLabel = (val: string) => {
    return val === 'yes' ? 'نعم، لديه خبرة سابقة' : 'لا، هذه أول مرة له';
  };

  const getUpcomingInterviewLabel = (val: string) => {
    switch (val) {
      case 'yes_soon': return 'نعم، خلال هذا الأسبوع';
      case 'yes_later': return 'نعم، في موعد لاحق';
      default: return 'لا يوجد مقابلة محددة';
    }
  };

  const isAdmin = userProfile?.role === 'admin';
  const isMaintainer = userProfile?.role === 'maintainer';
  const isInterviewer = userProfile?.role === 'interviewer';
  const interviewerField = userProfile?.field;

  const interviewerFieldToLabel: Record<string, string> = FIELD_OPTIONS.reduce((acc, opt) => {
    acc[opt.id] = opt.label;
    return acc;
  }, {} as Record<string, string>);

  const filteredRegistrations = allRegistrations.filter(reg => {
    if (isInterviewer && interviewerField && !isAdmin) {
      const targetField = interviewerFieldToLabel[interviewerField] || interviewerField;
      if (reg.field !== targetField) return false;
      if (reg.status !== 'approved' && reg.status !== 'completed') return false;
    }
    const term = searchTerm.toLowerCase().trim();
    const statusMatch = statusFilter === 'ALL' || reg.status === statusFilter || (!reg.status && statusFilter === 'pending');
    if (!term && statusMatch) return true;
    const emailMatch = reg.email?.toLowerCase().includes(term) || false;
    const phoneMatch = reg.whatsapp?.includes(term) || false;
    const nameMatch = reg.fullName?.toLowerCase().includes(term) || false;
    const idMatch = reg.requestNumber?.toLowerCase().includes(term) || false;
    const interviewerMatch = reg.interviewerName?.toLowerCase().includes(term) || false;
    return (emailMatch || phoneMatch || nameMatch || idMatch || interviewerMatch) && statusMatch;
  });

  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const currentItems = filteredRegistrations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getAllowedStatuses = () => {
    if (isAdmin || isMaintainer) return ['pending', 'reviewing', 'approved', 'completed', 'canceled'];
    if (isInterviewer) return ['completed', 'canceled'];
    return [];
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50 relative text-right" dir="rtl">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
              <FileText className="w-8 h-8 text-accent" />
              طلبات التسجيل
            </h1>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-gray-600 border border-gray-200">
              العدد المفلتر: {filteredRegistrations.length}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent bg-white shadow-sm" placeholder="بحث بالاسم، المحاور، الهاتف..." />
            </div>
            <div className="relative w-full md:w-56">
               <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><Filter className="h-5 w-5 text-gray-400" /></div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent bg-white shadow-sm appearance-none text-right">
                <option value="ALL">كل الحالات المتاحة</option>
                <option value="pending">قيد الانتظار</option>
                <option value="reviewing">قيد المراجعة</option>
                <option value="approved">مقبول</option>
                <option value="completed">مكتمل</option>
                <option value="canceled">ملغي</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 text-accent animate-spin" /></div> : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap text-right">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-sm font-bold text-gray-700 text-right">رقم الطلب</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-700 text-right">الاسم</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-700 text-right">الباقة</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-700 text-right">المجال والمستوى</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-700 text-right">المحاور</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-700 text-right">الحالة</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-700 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentItems.length > 0 ? currentItems.map((reg) => (
                        <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                              {reg.requestNumber || `MQ-${reg.id.slice(0, 6).toUpperCase()}`}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">{reg.fullName}</div>
                            <div className="flex flex-col text-[10px] text-gray-400"><span className="dir-ltr text-right">{reg.email}</span></div>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black border ${reg.planName?.includes('مميزة') ? 'bg-accent/5 text-accent border-accent/20' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                               {reg.planName?.includes('مميزة') && <Sparkles className="w-3 h-3" />}
                               {reg.planName || 'باقة عادية'}
                             </div>
                          </td>
                          <td className="px-6 py-4 text-right"><div className="text-sm font-medium text-gray-700">{reg.field}</div><div className="flex items-center gap-2 mt-0.5 justify-end"><span className="text-[10px] text-gray-400">{reg.experience} سنوات خبرة</span><span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-bold">{getLevelLabel(reg.level)}</span></div></td>
                          <td className="px-6 py-4 text-right">
                             {reg.interviewerName ? (
                               <div className="flex items-center gap-2 justify-end">
                                 <span className="text-xs font-bold text-gray-600">{reg.interviewerName}</span>
                                 <div className="w-7 h-7 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                                   {reg.interviewerName.charAt(0)}
                                 </div>
                               </div>
                             ) : (
                               <span className="text-xs text-gray-400">-</span>
                             )}
                          </td>
                          <td className="px-6 py-4 text-right"><div className="flex items-center gap-2 justify-end">{getStatusBadge(reg.status)}</div></td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                               {reg.status === 'completed' && reg.evaluationReport && <button onClick={() => handleViewReport(reg)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors flex items-center gap-1 font-bold text-xs" title="عرض تقرير التقييم"><FileText className="w-5 h-5" /></button>}
                               {isInterviewer && (reg.status === 'approved' || reg.status === 'reviewing') && (
                                 <>
                                   {(reg.level === 'fresh' || reg.level === 'junior') && <button onClick={() => setEvaluatingRegistration(reg)} className="p-2 text-accent hover:bg-accent/10 rounded-full transition-colors flex items-center gap-1 font-bold text-xs" title="بدء تقييم Junior/Fresh"><ClipboardCheck className="w-5 h-5" /> تقييم Jr</button>}
                                   {reg.level === 'mid-senior' && <button onClick={() => setEvaluatingSeniorRegistration(reg)} className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors flex items-center gap-1 font-bold text-xs" title="بدء تقييم Senior/Mid"><Award className="w-5 h-5" /> تقييم Senior</button>}
                                   {reg.level === 'lead-staff' && <button onClick={() => setEvaluatingLeadRegistration(reg)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors flex items-center gap-1 font-bold text-xs" title="بدء تقييم Lead/Staff"><Award className="w-5 h-5" /> تقييم Lead</button>}
                                 </>
                               )}
                               {(reg.status === 'approved' || reg.status === 'completed') && <button onClick={() => handleLinkClick(reg)} className="p-2 text-gray-400 hover:text-accent rounded-full transition-colors" title="إدارة الروابط والبيانات"><LinkIcon className="w-5 h-5" /></button>}
                               <button onClick={() => handleViewDetails(reg)} className="p-2 text-gray-400 hover:text-blue-600 rounded-full transition-colors" title="عرض التفاصيل"><Eye className="w-5 h-5" /></button>
                              {(isAdmin || isMaintainer || isInterviewer) && <button onClick={() => handleEditClick(reg)} className="p-2 text-gray-400 hover:text-accent rounded-full transition-colors" title="تعديل الحالة"><Edit2 className="w-5 h-5" /></button>}
                            </div>
                          </td>
                        </tr>
                    )) : <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">لا توجد طلبات تطابق المعايير.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-100 transition-colors bg-white shadow-sm"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === i + 1 ? 'bg-accent text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{i + 1}</button>)}
                </div>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-100 transition-colors bg-white shadow-sm"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
              </div>
            )}
          </>
        )}
      </div>

      {evaluatingRegistration && <JuniorEvaluation registration={evaluatingRegistration} interviewerName={userProfile?.name} onComplete={() => { handleCloseModals(); fetchData(); }} onCancel={handleCloseModals} />}
      {evaluatingSeniorRegistration && <SeniorMidEvaluation registration={evaluatingSeniorRegistration} interviewerName={userProfile?.name} onComplete={() => { handleCloseModals(); fetchData(); }} onCancel={handleCloseModals} />}
      {evaluatingLeadRegistration && <LeadEvaluation registration={evaluatingLeadRegistration} interviewerName={userProfile?.name} onComplete={() => { handleCloseModals(); fetchData(); }} onCancel={handleCloseModals} />}

      {viewingReport && (
        <div className="fixed inset-0 z-[110] bg-slate-900/90 backdrop-blur-lg flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl relative animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col">
            <div className="bg-primary p-6 md:p-8 text-white flex justify-between items-center shrink-0 border-b border-white/10">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 md:w-14 md:h-14 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20">
                   <Award className="w-6 h-6 md:w-8 md:h-8" />
                 </div>
                 <div>
                   <h3 className="text-lg md:text-xl font-black text-right">تقرير التقييم النهائي</h3>
                   <p className="text-accent text-xs font-bold uppercase tracking-widest text-right">{viewingReport.fullName}</p>
                 </div>
               </div>
               <div className="flex items-center gap-2">
                 <button onClick={() => handleDownloadPDF(viewingReport.fullName)} disabled={isDownloading} className="p-2 md:p-3 bg-accent/20 hover:bg-accent/30 text-accent rounded-full transition-colors flex items-center gap-2 text-xs md:text-sm font-bold" title="تحميل PDF">{isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}<span className="hidden md:inline">تحميل PDF</span></button>
                 <button onClick={handleCloseModals} className="p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><X className="w-5 h-5 md:w-6 md:h-6" /></button>
               </div>
            </div>
            <div id="admin-report-to-print" className="p-6 md:p-10 overflow-y-auto custom-scrollbar flex-grow bg-white text-right">
               <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-center justify-between mb-8 shadow-inner"><div className="text-emerald-800 font-black text-right">الدرجة النهائية المستحقة:</div><div className="text-3xl md:text-4xl font-black text-emerald-600">%{viewingReport.finalScore || '-'}</div></div>
               <div className="prose prose-slate max-w-none dir-rtl text-right whitespace-pre-wrap leading-loose font-medium text-gray-700">{viewingReport.evaluationReport}</div>
            </div>
            <div className="p-6 md:p-8 border-t border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-center items-center gap-4 shrink-0">
               <Button variant="primary" className="px-12 py-4 w-full md:w-auto text-lg rounded-2xl shadow-xl shadow-accent/20" onClick={handleCloseModals}>إغلاق النافذة</Button>
               <button onClick={() => handleDownloadPDF(viewingReport.fullName)} disabled={isDownloading} className="flex items-center justify-center gap-2 px-10 py-4 bg-white border-2 border-accent text-accent rounded-2xl font-bold hover:bg-accent hover:text-white transition-all w-full md:w-auto shadow-sm disabled:opacity-50">{isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} حفظ نسخة PDF</button>
            </div>
          </div>
        </div>
      )}

      {editingRegistration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" dir="rtl">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden text-right">
            <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between"><h3 className="font-bold text-gray-800">تحديث حالة الطلب</h3><button onClick={handleCloseModals} className="text-gray-400 hover:text-red-500"><X className="w-6 h-6" /></button></div>
            <div className="p-6">
              <div className="space-y-3 mb-8">
                {getAllowedStatuses().map((val) => (
                  <label key={val} className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-all ${statusToUpdate === val ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <input type="radio" name="status" value={val} checked={statusToUpdate === val} onChange={(e) => setStatusToUpdate(e.target.value)} className="text-accent focus:ring-accent w-5 h-5" />
                    <span className="font-bold text-sm text-gray-700 capitalize text-right w-full">{val === 'pending' ? 'قيد الانتظار' : val === 'reviewing' ? 'قيد المراجعة' : val === 'approved' ? 'مقبول' : val === 'completed' ? 'مكتمل' : 'ملغي'}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3"><Button onClick={handleSaveStatus} disabled={isUpdating} className="flex-1 justify-center rounded-2xl">{isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تحديث الحالة'}</Button><Button variant="outline" onClick={handleCloseModals} className="rounded-2xl">إلغاء</Button></div>
            </div>
          </div>
        </div>
      )}

      {viewingRegistration && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in" dir="rtl">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 text-right">
            <div className="bg-primary px-8 py-6 text-white flex items-center justify-between shrink-0">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                       <h3 className="text-xl font-black">{viewingRegistration.fullName}</h3>
                       {viewingUserReferrals >= 10 && (
                         <span className="bg-amber-400 text-primary text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1 animate-pulse">
                           <Award className="w-3 h-3" /> مؤهل لمجانية
                         </span>
                       )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <Hash className="w-3 h-3 text-accent" />
                      الطلب: {viewingRegistration.requestNumber || viewingRegistration.id.slice(0, 8).toUpperCase()}
                    </div>
                  </div>
               </div>
               <button onClick={handleCloseModals} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                 <X className="w-6 h-6" />
               </button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar space-y-8 text-right">
              
              <div className="bg-slate-800 rounded-2xl p-6 text-white flex items-center justify-between shadow-xl">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-accent">
                       <UsersIcon className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                       <div className="text-[10px] font-bold text-white/50 uppercase">إجمالي إحالات المستخدم</div>
                       <div className="text-2xl font-black">{viewingUserReferrals} <span className="text-xs font-normal text-white/40">صديق منضم</span></div>
                    </div>
                 </div>
                 <div className="text-right">
                    <div className="text-[10px] font-bold text-white/50 uppercase">حالة الاستحقاق</div>
                    <div className={`text-sm font-black ${viewingUserReferrals >= 10 ? 'text-emerald-400' : 'text-amber-400'}`}>
                       {viewingUserReferrals >= 10 ? 'يستحق جلسة مجانية' : `باقي ${10 - viewingUserReferrals} إحالة`}
                    </div>
                 </div>
              </div>

              {/* موعد وروابط الجلسة */}
              <div className="space-y-4 text-right">
                <h4 className="font-black text-gray-900 flex items-center gap-2 text-lg border-r-4 border-indigo-500 pr-4 text-right justify-start">
                  <LinkIcon className="w-5 h-5 text-indigo-500" /> موعد وروابط الجلسة
                </h4>
                <div className="grid grid-cols-1 gap-3">
                   <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between text-right">
                     <span className="text-xs font-bold text-indigo-600">موعد الجلسة:</span>
                     <span className="font-bold text-indigo-900">{viewingRegistration.meetingDate || 'غير محدد'}</span>
                   </div>
                   <div className="flex flex-wrap gap-3 justify-start">
                      {viewingRegistration.meetingLink && <div className="text-xs bg-white border px-3 py-1 rounded-lg">رابط الجلسة موجود</div>}
                      {viewingRegistration.reportLink && <div className="text-xs bg-white border px-3 py-1 rounded-lg">رابط التقرير موجود</div>}
                      {viewingRegistration.videoLink && <div className="text-xs bg-white border px-3 py-1 rounded-lg">رابط الفيديو موجود</div>}
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 text-right">
                 <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                      <Mail className="w-3.5 h-3.5" /> البريد الإلكتروني
                    </div>
                    <div className="text-sm font-bold text-gray-700 dir-ltr text-right">{viewingRegistration.email}</div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                      <Phone className="w-3.5 h-3.5" /> رقم الواتساب
                    </div>
                    <div className="text-sm font-bold text-gray-700 dir-ltr text-right">{viewingRegistration.whatsapp}</div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                      <Globe className="w-3.5 h-3.5" /> الدولة / المدينة
                    </div>
                    <div className="text-sm font-bold text-gray-700 text-right">{viewingRegistration.country}</div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                      <Linkedin className="w-3.5 h-3.5" /> رابط LinkedIn
                    </div>
                    <div className="text-sm font-bold text-accent truncate dir-ltr text-right">
                      <a href={viewingRegistration.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">{viewingRegistration.linkedin}</a>
                    </div>
                 </div>
              </div>

              <div className="space-y-4 text-right">
                <h4 className="font-black text-gray-900 flex items-center gap-2 text-lg border-r-4 border-accent pr-4 text-right justify-start">
                  <Briefcase className="w-5 h-5 text-accent" /> الخلفية التقنية والمهنية
                </h4>
                <div className="grid grid-cols-2 gap-4 text-right">
                   <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-right"><div className="text-[10px] text-blue-500 font-bold uppercase mb-1">المجال</div><div className="font-bold text-blue-900">{viewingRegistration.field}</div></div>
                   <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl text-right"><div className="text-[10px] text-teal-500 font-bold uppercase mb-1">المستوى</div><div className="font-bold text-teal-900">{getLevelLabel(viewingRegistration.level)}</div></div>
                   <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl text-right"><div className="text-[10px] text-purple-500 font-bold uppercase mb-1">سنوات الخبرة</div><div className="font-bold text-purple-900">{viewingRegistration.experience} سنة</div></div>
                   <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-right"><div className="text-[10px] text-orange-500 font-bold uppercase mb-1">الباقة</div><div className="font-bold text-orange-900">{viewingRegistration.planName || 'باقة عادية'}</div></div>
                   <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl col-span-2 text-right">
                     <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">التقنيات التي يتقنها</div>
                     <div className="text-sm font-medium text-gray-700 whitespace-pre-wrap">{viewingRegistration.techStack}</div>
                   </div>
                </div>
              </div>

              <div className="space-y-4 text-right">
                <h4 className="font-black text-gray-900 flex items-center gap-2 text-lg border-r-4 border-blue-500 pr-4 text-right justify-start">
                  <Calendar className="w-5 h-5 text-blue-500" /> التحضير للمقابلة
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-right">
                    <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">خبرة مقابلات سابقة</div>
                    <div className="text-sm font-bold text-gray-700">{getInterviewHistoryLabel(viewingRegistration.hasInterviewExperience)}</div>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-right">
                    <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">مقابلة قادمة</div>
                    <div className="text-sm font-bold text-gray-700">{getUpcomingInterviewLabel(viewingRegistration.upcomingInterview)}</div>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-right">
                    <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">الوقت المفضل</div>
                    <div className="text-sm font-bold text-gray-700">{getPreferredTimeLabel(viewingRegistration.preferredTime)}</div>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-right">
                    <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">الأهداف المختارة</div>
                    <div className="flex flex-wrap gap-1 mt-1 justify-end">
                      {viewingRegistration.goals?.map((g, i) => (
                        <span key={i} className="bg-white px-2 py-0.5 rounded border border-gray-200 text-[10px] font-bold text-gray-600">{g}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-right">
                <h4 className="font-black text-gray-900 flex items-center gap-2 text-lg border-r-4 border-amber-500 pr-4 text-right justify-start">
                  <MessageSquare className="w-5 h-5 text-amber-500" /> توقعات المستخدم
                </h4>
                <div className="p-6 bg-amber-50/30 border-2 border-amber-100 rounded-2xl text-sm text-gray-800 leading-relaxed italic shadow-inner text-right">
                   "{viewingRegistration.expectations}"
                </div>
              </div>

              {viewingRegistration.evaluationReport && (
                <div className="space-y-4 text-right">
                  <h4 className="font-black text-gray-900 flex items-center gap-2 text-lg border-r-4 border-emerald-500 pr-4 text-right justify-start">
                    <ClipboardCheck className="w-5 h-5 text-emerald-500" /> تقرير التقييم الذكي
                  </h4>
                  <div className="p-6 bg-emerald-50/30 border-2 border-emerald-100 rounded-[2rem] text-sm text-gray-700 leading-relaxed overflow-x-auto text-right dir-rtl"><pre className="whitespace-pre-wrap font-sans text-right">{viewingRegistration.evaluationReport}</pre></div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end shrink-0 bg-gray-50"><Button onClick={handleCloseModals}>إغلاق</Button></div>
          </div>
        </div>
      )}

      {linkingRegistration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" dir="rtl">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden text-right">
            <div className="bg-accent px-6 py-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-3"><LinkIcon className="w-6 h-6" /><h3 className="font-black">روابط المقابلة</h3></div>
              <button onClick={handleCloseModals} className="hover:bg-white/10 p-2 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-8 space-y-6 text-right">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-500 mb-2 mr-1 text-right">موعد الجلسة (مثال: الأحد 10 مساءً)</label>
                  <input type="text" value={links.date} onChange={(e) => setLinks({...links, date: e.target.value})} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-accent outline-none text-sm text-right" placeholder="تاريخ ووقت الجلسة..." />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 mb-2 mr-1 text-right">رابط الجلسة (Zoom/Meet)</label>
                  <input type="url" value={links.meeting} onChange={(e) => setLinks({...links, meeting: e.target.value})} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-accent outline-none text-sm dir-ltr text-right" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 mb-2 mr-1 text-right">رابط التقرير (Drive)</label>
                  <input type="url" value={links.report} onChange={(e) => setLinks({...links, report: e.target.value})} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-accent outline-none text-sm dir-ltr text-right" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 mb-2 mr-1 text-right">رابط التسجيل (YouTube/Loom)</label>
                  <input type="url" value={links.video} onChange={(e) => setLinks({...links, video: e.target.value})} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-accent outline-none text-sm dir-ltr text-right" placeholder="https://..." />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <Button onClick={handleSaveLinks} disabled={isUpdating} className="flex-1 justify-center rounded-2xl gap-2">{isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} حفظ البيانات</Button>
                <Button variant="outline" onClick={handleCloseModals} className="flex-none rounded-2xl">إلغاء</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingRequests;
