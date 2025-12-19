import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { RegistrationFormData, UserProfile } from '../types';
import { 
  Loader2, FileText, Search, ChevronLeft, ChevronRight, Edit2, X, Filter, 
  Link as LinkIcon, Video, FileCheck, Save, Eye, User, Mail, Phone, 
  Linkedin, Code, Briefcase, Target, Clock, AlertCircle, Calendar, Globe
} from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import Button from './Button';

interface RegistrationWithId extends RegistrationFormData {
  id: string;
}

const MeetingRequests: React.FC = () => {
  const [allRegistrations, setAllRegistrations] = useState<RegistrationWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filter & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals State
  const [editingRegistration, setEditingRegistration] = useState<RegistrationWithId | null>(null);
  const [viewingRegistration, setViewingRegistration] = useState<RegistrationWithId | null>(null);
  const [linkingRegistration, setLinkingRegistration] = useState<RegistrationWithId | null>(null);
  
  const [statusToUpdate, setStatusToUpdate] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [links, setLinks] = useState({
    meeting: '',
    report: '',
    video: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        }
      }
    });

    const fetchData = async () => {
      try {
        const q = query(collection(db, "registrations"));
        const querySnapshot = await getDocs(q);
        
        const results: RegistrationWithId[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          results.push({ 
            id: doc.id, 
            ...data 
          } as RegistrationWithId);
        });
        
        results.sort((a, b) => {
          const timeA = a.submittedAt?.seconds || 0;
          const timeB = b.submittedAt?.seconds || 0;
          return timeB - timeA;
        });

        setAllRegistrations(results);
      } catch (err: any) {
        console.error("Error fetching registrations:", err);
        setError("فشل في استرجاع البيانات. يرجى التأكد من الاتصال بالإنترنت.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => unsubscribe();
  }, []);

  const handleEditClick = (reg: RegistrationWithId) => {
    setEditingRegistration(reg);
    setStatusToUpdate(reg.status || 'pending');
  };

  const handleViewDetails = (reg: RegistrationWithId) => {
    setViewingRegistration(reg);
  };

  const handleLinkClick = (reg: RegistrationWithId) => {
    setLinkingRegistration(reg);
    setLinks({
      meeting: reg.meetingLink || '',
      report: reg.reportLink || '',
      video: reg.videoLink || ''
    });
  };

  const handleCloseModals = () => {
    setEditingRegistration(null);
    setViewingRegistration(null);
    setLinkingRegistration(null);
    setIsUpdating(false);
  };

  const handleSaveStatus = async () => {
    if (!editingRegistration) return;

    setIsUpdating(true);
    try {
      const regRef = doc(db, "registrations", editingRegistration.id);
      await updateDoc(regRef, {
        status: statusToUpdate
      });

      setAllRegistrations(prev => prev.map(item => 
        item.id === editingRegistration.id 
          ? { ...item, status: statusToUpdate as any } 
          : item
      ));

      handleCloseModals();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("حدث خطأ أثناء تحديث الحالة.");
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
        videoLink: links.video
      });

      setAllRegistrations(prev => prev.map(item => 
        item.id === linkingRegistration.id 
          ? { ...item, meetingLink: links.meeting, reportLink: links.report, videoLink: links.video } 
          : item
      ));

      handleCloseModals();
    } catch (err) {
      console.error("Error updating links:", err);
      alert("حدث خطأ أثناء حفظ الروابط.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">مكتمل</span>;
      case 'approved': 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">مقبول</span>;
      case 'canceled': 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">ملغي</span>;
      case 'reviewing':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">قيد المراجعة</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">قيد الانتظار</span>;
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

  const isInterviewer = userProfile?.role === 'interviewer';
  const interviewerField = userProfile?.field;

  const fieldMapping: Record<string, string> = {
    'FE': 'Frontend',
    'BE': 'Backend',
    'UX': 'UX Design',
    'mobile': 'Mobile App'
  };

  const filteredRegistrations = allRegistrations.filter(reg => {
    if (isInterviewer && interviewerField) {
      const targetField = fieldMapping[interviewerField];
      if (reg.field !== targetField) return false;
      if (reg.status !== 'approved') return false;
    }

    const term = searchTerm.toLowerCase().trim();
    const statusMatch = statusFilter === 'ALL' || reg.status === statusFilter || (!reg.status && statusFilter === 'pending');
    
    if (!term && statusMatch) return true;
    
    const emailMatch = reg.email?.toLowerCase().includes(term) || false;
    const phoneMatch = reg.whatsapp?.includes(term) || false;
    const nameMatch = reg.fullName?.toLowerCase().includes(term) || false;

    return (emailMatch || phoneMatch || nameMatch) && statusMatch;
  });

  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredRegistrations.slice(startIndex, startIndex + itemsPerPage);

  const availableStatuses = isInterviewer 
    ? ['completed', 'canceled'] 
    : ['pending', 'reviewing', 'approved', 'completed', 'canceled'];

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toLocaleDateString('ar-EG');
    return new Date(timestamp).toLocaleDateString('ar-EG');
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
              <FileText className="w-8 h-8 text-accent" />
              طلبات التسجيل
            </h1>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-gray-600 border border-gray-200">
              {isInterviewer ? `طلبات ${fieldMapping[interviewerField || ''] || ''} المقبولة:` : 'العدد الكلي:'} {filteredRegistrations.length}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent bg-white shadow-sm"
                placeholder="بحث بالاسم أو الهاتف أو البريد..."
              />
            </div>

            <div className="relative w-full md:w-56">
               <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent bg-white shadow-sm appearance-none"
              >
                <option value="ALL">كل الحالات المتاحة</option>
                {!isInterviewer && <option value="pending">قيد الانتظار</option>}
                {!isInterviewer && <option value="reviewing">قيد المراجعة</option>}
                <option value="approved">مقبول</option>
                {!isInterviewer && <option value="completed">مكتمل</option>}
                <option value="canceled">ملغي</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap text-right">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700">الاسم</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700">التواصل</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700">المجال والمستوى</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700">الحالة</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentItems.length > 0 ? (
                    currentItems.map((reg) => (
                      <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{reg.fullName}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col text-xs text-gray-600">
                             <span className="dir-ltr text-right">{reg.email}</span>
                             <span className="dir-ltr text-right">{reg.whatsapp}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-700">{reg.field}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-bold">{getLevelLabel(reg.level)}</span>
                            <span className="text-[10px] text-gray-400">{reg.experience} سنوات خبرة</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                             {getStatusBadge(reg.status)}
                             {(reg.status === 'approved' || reg.status === 'completed') && (
                               <button 
                                 onClick={() => handleLinkClick(reg)}
                                 className="p-1.5 bg-accent/5 text-accent rounded-lg hover:bg-accent/10 transition-colors"
                                 title="إدارة الروابط"
                               >
                                 <LinkIcon className="w-3.5 h-3.5" />
                               </button>
                             )}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                             <button 
                              onClick={() => handleViewDetails(reg)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                              title="عرض ملخص الطلب"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditClick(reg)}
                              className="p-2 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-full transition-colors"
                              title="تحديث الحالة"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        {isInterviewer 
                          ? `لا توجد طلبات جديدة حالياً في تخصص ${fieldMapping[interviewerField || ''] || ''}.` 
                          : 'لا توجد بيانات.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredRegistrations.length > itemsPerPage && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                <div className="text-sm text-gray-600">صفحة {currentPage} من {totalPages}</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border rounded hover:bg-white disabled:opacity-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border rounded hover:bg-white disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Status Modal */}
      {editingRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-gray-800">تحديث الحالة</h3>
              <button onClick={handleCloseModals} className="text-gray-400 hover:text-red-500"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="space-y-2 mb-6">
                {availableStatuses.map((val) => (
                  <label key={val} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${statusToUpdate === val ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                      type="radio" 
                      name="status" 
                      value={val} 
                      checked={statusToUpdate === val} 
                      onChange={(e) => setStatusToUpdate(e.target.value)} 
                      className="text-accent focus:ring-accent"
                    />
                    <span className="font-bold text-sm text-gray-700">
                      {val === 'pending' && 'قيد الانتظار'}
                      {val === 'reviewing' && 'قيد المراجعة'}
                      {val === 'approved' && 'مقبول'}
                      {val === 'completed' && 'مكتمل'}
                      {val === 'canceled' && 'ملغي'}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <Button onClick={handleSaveStatus} disabled={isUpdating} className="flex-1 justify-center">
                  {isUpdating ? 'جاري الحفظ...' : 'حفظ'}
                </Button>
                <Button variant="outline" onClick={handleCloseModals} className="flex-none">إلغاء</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewingRegistration && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95">
            {/* Header */}
            <div className="bg-primary px-8 py-6 text-white flex items-center justify-between shrink-0">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">{viewingRegistration.fullName}</h3>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <Calendar className="w-3 h-3" />
                      بتاريخ: {formatDate(viewingRegistration.submittedAt)}
                    </div>
                  </div>
               </div>
               <button onClick={handleCloseModals} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                 <X className="w-6 h-6" />
               </button>
            </div>

            {/* Content - Scrollable */}
            <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
              {/* Personal & Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                 <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <Mail className="w-3.5 h-3.5" /> البريد الإلكتروني
                    </div>
                    <div className="text-sm font-bold text-gray-700 dir-ltr text-right">{viewingRegistration.email}</div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <Phone className="w-3.5 h-3.5" /> رقم الواتساب
                    </div>
                    <div className="text-sm font-bold text-gray-700 dir-ltr text-right">{viewingRegistration.whatsapp}</div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <Globe className="w-3.5 h-3.5" /> الدولة / المدينة
                    </div>
                    <div className="text-sm font-bold text-gray-700">{viewingRegistration.country}</div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <Linkedin className="w-3.5 h-3.5" /> رابط LinkedIn
                    </div>
                    <a href={viewingRegistration.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-accent hover:underline flex items-center gap-1 dir-ltr justify-end">
                      {viewingRegistration.linkedin}
                    </a>
                 </div>
              </div>

              {/* Technical Background */}
              <div className="space-y-4">
                <h4 className="font-black text-gray-900 flex items-center gap-2 text-lg">
                  <Briefcase className="w-5 h-5 text-accent" /> الخلفية التقنية والخبرة
                </h4>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                      <div className="text-[10px] text-blue-500 font-bold uppercase mb-1">المجال</div>
                      <div className="font-bold text-blue-900">{viewingRegistration.field}</div>
                   </div>
                   <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl">
                      <div className="text-[10px] text-teal-500 font-bold uppercase mb-1">المستوى</div>
                      <div className="font-bold text-teal-900">{getLevelLabel(viewingRegistration.level)}</div>
                   </div>
                   <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
                      <div className="text-[10px] text-purple-500 font-bold uppercase mb-1">سنوات الخبرة</div>
                      <div className="font-bold text-purple-900">{viewingRegistration.experience} سنة</div>
                   </div>
                   <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                      <div className="text-[10px] text-amber-500 font-bold uppercase mb-1">وقت المقابلة المفضل</div>
                      <div className="font-bold text-amber-900">
                        {viewingRegistration.preferredTime === 'morning' && 'صباحاً (9ص - 12م)'}
                        {viewingRegistration.preferredTime === 'evening' && 'مساءً (4م - 9م)'}
                        {viewingRegistration.preferredTime === 'flexible' && 'مرن في أي وقت'}
                      </div>
                   </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                  <Code className="w-4 h-4" /> التقنيات المستخدمة
                </div>
                <div className="flex flex-wrap gap-2">
                  {viewingRegistration.techStack.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg shadow-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Goals */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                  <Target className="w-4 h-4" /> الأهداف من المقابلة
                </div>
                <div className="flex flex-wrap gap-2">
                  {viewingRegistration.goals.map((goal, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-accent/5 border border-accent/20 text-accent text-xs font-bold rounded-xl">
                      {goal}
                    </span>
                  ))}
                </div>
              </div>

              {/* Expectations */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                  <AlertCircle className="w-4 h-4" /> التوقعات من الجلسة
                </div>
                <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-700 leading-relaxed italic">
                  "{viewingRegistration.expectations}"
                </div>
              </div>

              {/* Interview Status Check */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                 <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                   <div className={`w-2 h-2 rounded-full ${viewingRegistration.hasInterviewExperience === 'yes' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                   لديه خبرة سابقة في المقابلات: {viewingRegistration.hasInterviewExperience === 'yes' ? 'نعم' : 'لا'}
                 </div>
                 <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                   <div className={`w-2 h-2 rounded-full ${viewingRegistration.upcomingInterview !== 'no' ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                   لديه مقابلة قادمة قريباً: {viewingRegistration.upcomingInterview !== 'no' ? 'نعم' : 'لا'}
                 </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-end shrink-0 bg-gray-50">
               <Button onClick={handleCloseModals}>إغلاق</Button>
            </div>
          </div>
        </div>
      )}

      {/* Links Modal */}
      {linkingRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-accent px-6 py-4 flex items-center justify-between text-white">
              <h3 className="font-bold">إدارة روابط المقابلة</h3>
              <button onClick={handleCloseModals} className="hover:bg-white/10 p-1 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1.5">
                    <LinkIcon className="w-3 h-3" /> رابط المقابلة (Zoom/Meet)
                  </label>
                  <input 
                    type="url"
                    value={links.meeting}
                    onChange={(e) => setLinks({...links, meeting: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none text-sm dir-ltr"
                    placeholder="https://meet.google.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1.5">
                    <FileCheck className="w-3 h-3" /> رابط التقرير النهائي
                  </label>
                  <input 
                    type="url"
                    value={links.report}
                    onChange={(e) => setLinks({...links, report: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none text-sm dir-ltr"
                    placeholder="https://drive.google.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1.5">
                    <Video className="w-3 h-3" /> رابط تسجيل المقابلة
                  </label>
                  <input 
                    type="url"
                    value={links.video}
                    onChange={(e) => setLinks({...links, video: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none text-sm dir-ltr"
                    placeholder="https://youtu.be/..."
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button onClick={handleSaveLinks} disabled={isUpdating} className="flex-1 justify-center gap-2">
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  حفظ الروابط
                </Button>
                <Button variant="outline" onClick={handleCloseModals} className="flex-none">إلغاء</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingRequests;