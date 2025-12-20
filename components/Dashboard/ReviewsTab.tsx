
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ReviewData } from '../../types';
import { Loader2, MessageSquareQuote, User, Mail, Phone, Calendar, Star, Lightbulb, Search, Briefcase, ChevronRight, ChevronLeft } from 'lucide-react';

const ReviewsTab: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, "reviews"), orderBy("submittedAt", "desc"));
        const querySnapshot = await getDocs(q);
        const results: ReviewData[] = [];
        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() } as ReviewData);
        });
        setReviews(results);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString('ar-EG');
    }
    return new Date(timestamp).toLocaleDateString('ar-EG');
  };

  const filteredReviews = reviews.filter(rev => 
    rev.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rev.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rev.userPhone?.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredReviews.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <MessageSquareQuote className="w-5 h-5 text-accent" />
          تقييمات المستخدمين ({filteredReviews.length})
        </h2>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="بحث بالاسم، البريد أو الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {currentItems.length > 0 ? (
          currentItems.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{review.userName}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="dir-ltr">{review.userEmail}</span>
                      </div>
                      {review.userPhone && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Phone className="w-3.5 h-3.5" />
                          <span className="dir-ltr">{review.userPhone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(review.submittedAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                    <Star className="w-4 h-4 text-yellow-500" />
                    تقييم المقابلة
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100 min-h-[60px]">
                    {review.interviewFeedback}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                    <Briefcase className="w-4 h-4 text-accent" />
                    تقييم المنصة
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100 min-h-[60px]">
                    {review.platformFeedback}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                    <User className="w-4 h-4 text-blue-500" />
                    تقييم المقيم
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100 min-h-[60px]">
                    {review.interviewerFeedback}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                    <Lightbulb className="w-4 h-4 text-emerald-500" />
                    أفكار للتحسين
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed bg-emerald-50/30 p-3 rounded-xl border border-emerald-100 min-h-[60px]">
                    {review.improvementIdeas || "لا توجد أفكار مقدمة"}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border border-dashed border-gray-300">
            <p className="text-gray-500">لا توجد تقييمات مطابقة لعملية البحث.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-100 transition-colors bg-white shadow-sm"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  currentPage === i + 1 
                  ? 'bg-accent text-white shadow-md' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-100 transition-colors bg-white shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;
