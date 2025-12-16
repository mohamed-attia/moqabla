import React, { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { RegistrationFormData } from '../types';
import { Loader2, AlertCircle, FileText, Calendar, User, Code, Briefcase, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface RegistrationWithId extends RegistrationFormData {
  id: string;
}

const RegistrationsList: React.FC = () => {
  const [allRegistrations, setAllRegistrations] = useState<RegistrationWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Filter Logic
  const filteredRegistrations = allRegistrations.filter(reg => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    
    // Check email and whatsapp
    const emailMatch = reg.email?.toLowerCase().includes(term) || false;
    const phoneMatch = reg.whatsapp?.includes(term) || false;
    // Also include name for better UX
    const nameMatch = reg.fullName?.toLowerCase().includes(term) || false;

    return emailMatch || phoneMatch || nameMatch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredRegistrations.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
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

          {/* Search Bar */}
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent bg-white shadow-sm"
              placeholder="بحث برقم الهاتف أو البريد الإلكتروني..."
            />
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
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap text-right">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700">الاسم</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700">التواصل</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700">المجال التقني</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700">الخبرة</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700">تاريخ الطلب</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700">الحالة</th>
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
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            reg.status === 'completed' ? 'bg-green-100 text-green-800' :
                            reg.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {reg.status === 'completed' ? 'مكتمل' :
                             reg.status === 'approved' ? 'مقبول' : 'قيد الانتظار'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        {searchTerm ? 'لا توجد نتائج تطابق بحثك.' : 'لا توجد طلبات تسجيل حتى الآن.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredRegistrations.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 gap-4">
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
    </div>
  );
};

export default RegistrationsList;