import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { RegistrationFormData } from '../types';
import { Loader2, AlertCircle, FileText, Calendar, User, Code, Briefcase, Search, ChevronLeft, ChevronRight, Edit2, X, Check, Filter } from 'lucide-react';
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
        // Fetch all documents without server-side ordering to avoid index requirements
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
        
        // Sort client-side (Newest first)
        results.sort((a, b) => {
          const timeA = a.submittedAt?.seconds || 0;
          const timeB = b.submittedAt?.seconds || 0;
          return timeB - timeA;
        });

        setAllRegistrations(results);
      } catch (err: any) {
        console.error("Error fetching registrations:", err);
        const errorMessage = err.message && err.message.includes("permission") 
          ? "غير مصرح لك بالوصول للبيانات (تأكد من إعدادات قواعد البيانات)." 
          : "فشل في استرجاع البيانات. يرجى التأكد من الاتصال بالإنترنت.";
        setError(errorMessage);
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
      
      // Update Firestore
      await updateDoc(regRef, {
        status: statusToUpdate
      });

      // Optimistic Update Local State
      setAllRegistrations(prev => prev.map(item => 
        item.id === editingRegistration.id 
          ? { ...item, status: statusToUpdate as any } 
          : item
      ));

      handleCloseModal();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("حدث خطأ أثناء تحديث الحالة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString('ar-EG');
    }
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('ar-EG');
    }
    return new Date(timestamp).toLocaleDateString('ar-EG');
  };

  // Status Badge Helper
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed': // Done
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">مكتمل</span>;
      case 'approved': 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">مقبول</span>;
      case 'canceled': 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">ملغي</span>;
      case 'reviewing': // Under Review
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">قيد المراجعة</span>;
      default: // Pending
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">قيد الانتظار</span>;
    }
  };

  // Filter Logic
  const filteredRegistrations = allRegistrations.filter(reg => {
    const term = searchTerm.toLowerCase().trim();
    const statusMatch = statusFilter === 'ALL' || reg.status === statusFilter || (!reg.status && statusFilter === 'pending');
    
    if (!term && statusMatch) return true;
    
    // Check email and whatsapp
    const emailMatch = reg.email?.toLowerCase().includes(term) || false;
    const phoneMatch = reg.whatsapp?.includes(term) || false;
    // Also include name for better UX
    const nameMatch = reg.fullName?.toLowerCase().includes(term) || false;

    return (emailMatch || phoneMatch || nameMatch) && statusMatch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredRegistrations.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
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
              العدد الكلي: {allRegistrations.length}
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent bg-white shadow-sm"
                placeholder="بحث برقم الهاتف أو البريد..."
              />
            </div>

            {/* Status Filter */}
            <div className="relative w-full md:w-56">
               <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent bg-white shadow-sm appearance-none"
              >
                <option value="ALL">كل الحالات</option>
                <option value="pending">قيد الانتظار</option>
                <option value="reviewing">قيد المراجعة</option>
                <option value="approved">مقبول</option>
                <option value="completed">مكتمل</option>
                <option value="canceled">ملغي</option>
              </select>
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ChevronLeft className="h-4 w-4 text-gray-400 rotate-[-90deg]" />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
              <p className="text-gray-500">جاري تحميل البيانات...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full whitespace-nowrap text-right">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700">الاسم</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700">التواصل</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700">المجال التقني</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700">الخبرة</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700">تاريخ الطلب</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700">الحالة</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentItems.length > 0 ? (
                    currentItems.map((reg) => (
                      <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{reg.fullName}</div>
                              <div className="text-xs text-gray-500">{reg.country}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm text-gray-700 dir-ltr text-right">{reg.email}</span>
                            <span className="text-xs text-gray-500 dir-ltr text-right">{reg.whatsapp}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Code className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">{reg.field}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 max-w-[150px] truncate">
                            {reg.techStack?.join(', ')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">
                              {reg.level === 'junior' && 'مبتدئ'}
                              {reg.level === 'mid' && 'متوسط'}
                              {reg.level === 'senior' && 'خبير'}
                              {reg.level === 'lead' && 'قيادي'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{reg.experience} سنوات</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formatDate(reg.submittedAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(reg.status)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => handleEditClick(reg)}
                            className="p-2 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                            title="تعديل الحالة"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        {searchTerm || statusFilter !== 'ALL' ? 'لا توجد نتائج تطابق بحثك.' : 'لا توجد طلبات تسجيل حتى الآن.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredRegistrations.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 gap-4 mt-auto">
                <div className="text-sm text-gray-600">
                  عرض <span className="font-medium text-gray-900">{Math.min(filteredRegistrations.length, startIndex + 1)}</span> إلى <span className="font-medium text-gray-900">{Math.min(startIndex + itemsPerPage, filteredRegistrations.length)}</span> من أصل <span className="font-medium text-gray-900">{filteredRegistrations.length}</span> نتيجة
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
                    {currentPage} / {totalPages || 1}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 border border-gray-300 rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Status Modal */}
      {editingRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">تحديث حالة الطلب</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">صاحب الطلب</p>
                <p className="font-bold text-gray-900 text-lg">{editingRegistration.fullName}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">اختر الحالة الجديدة</label>
                <div className="space-y-2">
                  {[
                    { val: 'pending', label: 'قيد الانتظار', color: 'bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-100' },
                    { val: 'reviewing', label: 'قيد المراجعة (Under Review)', color: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100' },
                    { val: 'approved', label: 'مقبول (Approved)', color: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100' },
                    { val: 'completed', label: 'مكتمل (Done)', color: 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100' },
                    { val: 'canceled', label: 'ملغي (Canceled)', color: 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100' },
                  ].map((option) => (
                    <label 
                      key={option.val}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                        statusToUpdate === option.val 
                          ? `${option.color} ring-1 ring-current` 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="status" 
                          value={option.val}
                          checked={statusToUpdate === option.val}
                          onChange={(e) => setStatusToUpdate(e.target.value)}
                          className="text-accent focus:ring-accent"
                        />
                        <span className="font-medium">{option.label}</span>
                      </div>
                      {statusToUpdate === option.val && <Check className="w-4 h-4" />}
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  onClick={handleSaveStatus} 
                  disabled={isUpdating}
                  className="flex-1 justify-center"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : 'حفظ التغييرات'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCloseModal}
                  disabled={isUpdating}
                  className="flex-none"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingRequests;