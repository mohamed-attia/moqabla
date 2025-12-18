import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { RegistrationFormData } from '../types';
import { Loader2, AlertCircle, FileText, Calendar, User, Code, Briefcase, Search, ChevronLeft, ChevronRight, Edit2, X, Check, Filter, ExternalLink } from 'lucide-react';
import Button from './Button';

interface RegistrationWithId extends RegistrationFormData {
  id: string;
}

const MeetingRequests: React.FC = () => {
  const [allRegistrations, setAllRegistrations] = useState<RegistrationWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Edit/Update State
  const [editingRegistration, setEditingRegistration] = useState<RegistrationWithId | null>(null);
  const [statusToUpdate, setStatusToUpdate] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
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
  }, []);

  const handleEditClick = (reg: RegistrationWithId) => {
    setEditingRegistration(reg);
    setStatusToUpdate(reg.status || 'pending');
  };

  const handleCloseModal = () => {
    setEditingRegistration(null);
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

      handleCloseModal();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("حدث خطأ أثناء تحديث الحالة.");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString('ar-EG');
    }
    return new Date(timestamp).toLocaleDateString('ar-EG');
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

  const filteredRegistrations = allRegistrations.filter(reg => {
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
              العدد الكلي: {allRegistrations.length}
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
                <option value="ALL">كل الحالات</option>
                <option value="pending">قيد الانتظار</option>
                <option value="reviewing">قيد المراجعة</option>
                <option value="approved">مقبول</option>
                <option value="completed">مكتمل</option>
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
                    <th className="px-6 py-4 text-sm font-bold text-gray-700">المجال</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700">السيرة الذاتية</th>
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
                          <div className="text-xs text-gray-400">{reg.experience} سنوات خبرة</div>
                        </td>
                        <td className="px-6 py-4">
                          {reg.resumeUrl ? (
                            <a 
                              href={reg.resumeUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-accent hover:text-accentHover font-bold text-xs bg-accent/5 px-2 py-1 rounded border border-accent/10"
                            >
                              عرض الملف <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-gray-300 text-xs italic">غير متوفر</span>
                          )}
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(reg.status)}</td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => handleEditClick(reg)}
                            className="p-2 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-full transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">لا توجد بيانات.</td>
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

      {editingRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-gray-800">تحديث الحالة</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-red-500"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="space-y-2 mb-6">
                {['pending', 'reviewing', 'approved', 'completed', 'canceled'].map((val) => (
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
                <Button variant="outline" onClick={handleCloseModal} className="flex-none">إلغاء</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingRequests;