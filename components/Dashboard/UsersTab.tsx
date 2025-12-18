
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, where, writeBatch, doc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { UserProfile } from '../../types';
import { Search, User, Mail, Calendar, Loader2, Shield, Phone, Briefcase, Globe, Users, CheckCircle2, XCircle, Trash2, AlertTriangle, Filter, X, Info } from 'lucide-react';
import Button from '../Button';

const UsersTab: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<'ALL' | 'VERIFIED' | 'UNVERIFIED'>('ALL');
  const [deletingUid, setDeletingUid] = useState<string | null>(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userPendingDelete, setUserPendingDelete] = useState<UserProfile | null>(null);

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const results: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data() as UserProfile);
      });
      setUsers(results);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const initiateDelete = (user: UserProfile) => {
    if (user.uid === auth.currentUser?.uid) {
      alert("لا يمكنك حذف حسابك الخاص من هنا.");
      return;
    }
    setUserPendingDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userPendingDelete) return;

    setDeletingUid(userPendingDelete.uid);
    setShowDeleteModal(false);

    try {
      const batch = writeBatch(db);

      const regsQuery = query(collection(db, "registrations"), where("userId", "==", userPendingDelete.uid));
      const regsSnapshot = await getDocs(regsQuery);
      regsSnapshot.forEach((regDoc) => {
        batch.delete(doc(db, "registrations", regDoc.id));
      });

      const reviewsQuery = query(collection(db, "reviews"), where("userId", "==", userPendingDelete.uid));
      const reviewsSnapshot = await getDocs(reviewsQuery);
      reviewsSnapshot.forEach((reviewDoc) => {
        batch.delete(doc(db, "reviews", reviewDoc.id));
      });

      batch.delete(doc(db, "users", userPendingDelete.uid));

      await batch.commit();

      setUsers(prev => prev.filter(u => u.uid !== userPendingDelete.uid));
    } catch (error) {
      console.error("Error deleting user data:", error);
      alert("حدث خطأ أثناء محاولة الحذف.");
    } finally {
      setDeletingUid(null);
      setUserPendingDelete(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const termMatch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     user.phone?.includes(searchTerm);
    const verificationMatch = verificationFilter === 'ALL' ||
                             (verificationFilter === 'VERIFIED' && user.isEmailVerified) ||
                             (verificationFilter === 'UNVERIFIED' && !user.isEmailVerified);
    return termMatch && verificationMatch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <User className="w-5 h-5 text-accent" />
            المستخدمين المسجلين ({filteredUsers.length})
          </h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative min-w-[140px]">
            <Filter className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value as any)}
              className="w-full pr-9 pl-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm bg-white cursor-pointer"
            >
              <option value="ALL">كل الحالات</option>
              <option value="VERIFIED">مفعل</option>
              <option value="UNVERIFIED">غير مفعل</option>
            </select>
          </div>

          <div className="relative flex-grow sm:w-64">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="بحث بالاسم أو البريد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">المستخدم</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">الحالة</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">التواصل</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">الإحالات</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {(user.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.isEmailVerified ? (
                        <span className="text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-1 rounded-full">مفعل</span>
                      ) : (
                        <span className="text-amber-600 text-[10px] font-bold bg-amber-50 px-2 py-1 rounded-full">غير مفعل</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600 dir-ltr text-right">{user.email}</td>
                    <td className="px-6 py-4 font-bold text-gray-700">{user.referralCount || 0}</td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => initiateDelete(user)}
                        disabled={deletingUid === user.uid}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        {deletingUid === user.uid ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">لا توجد نتائج.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-in zoom-in-95 border border-gray-100">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">تأكيد حذف المستخدم</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              هل أنت متأكد من حذف المستخدم <span className="font-black text-red-600">"{userPendingDelete?.name}"</span>؟ سيتم حذف جميع طلباته وتقييماته وبياناته نهائياً.
            </p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-right flex gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 leading-relaxed">
                <span className="font-bold block mb-1">ملاحظة فنية:</span>
                هذا الإجراء يحذف البيانات فقط. لإتاحة التسجيل بنفس البريد مرة أخرى، يجب حذف الحساب يدوياً من <b>Firebase Console &gt; Authentication</b>.
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="primary" className="flex-1 bg-red-600 hover:bg-red-700" onClick={confirmDelete}>تأكيد الحذف</Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)}>إلغاء</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTab;
