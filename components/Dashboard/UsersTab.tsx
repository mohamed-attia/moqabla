import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, writeBatch, doc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { UserProfile } from '../../types';
import { Search, User, Mail, Loader2, Trash2, Filter, Briefcase, ShieldCheck, Phone } from 'lucide-react';
import Button from '../Button';

const UsersTab: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [fieldFilter, setFieldFilter] = useState<string>('ALL');
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
      alert("لا يمكنك حذف حسابك الخاص.");
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
      batch.delete(doc(db, "users", userPendingDelete.uid));
      await batch.commit();
      setUsers(prev => prev.filter(u => u.uid !== userPendingDelete.uid));
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setDeletingUid(null);
      setUserPendingDelete(null);
    }
  };

  const getLevelLabel = (level?: string) => {
    switch (level) {
      case 'fresh': return 'مبتدأ (fresh)';
      case 'junior': return 'مبتدأ (junior)';
      case 'mid-senior': return 'متوسط وخبير (mid/senior)';
      case 'lead-staff': return 'قيادي (lead/staff)';
      default: return level || '-';
    }
  };

  const filteredUsers = users.filter(user => {
    const termMatch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     user.phone?.includes(searchTerm);
    
    const roleMatch = roleFilter === 'ALL' || user.role === roleFilter;
    const fieldMatch = fieldFilter === 'ALL' || user.field === fieldFilter;

    return termMatch && roleMatch && fieldMatch;
  });

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 text-accent animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <User className="w-5 h-5 text-accent" />
          إدارة المستخدمين والكادر ({filteredUsers.length})
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="بحث بالاسم، البريد أو الهاتف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent/50 text-sm outline-none"
            />
          </div>

          <div className="relative">
            <ShieldCheck className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg text-sm outline-none bg-white appearance-none"
            >
              <option value="ALL">كل الصلاحيات</option>
              <option value="admin">admin</option>
              <option value="interviewer">interviewer</option>
              <option value="maintainer">maintainer</option>
              <option value="user">user</option>
            </select>
          </div>

          <div className="relative">
            <Briefcase className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            <select
              value={fieldFilter}
              onChange={(e) => setFieldFilter(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg text-sm outline-none bg-white appearance-none"
            >
              <option value="ALL">كل التخصصات</option>
              <option value="UX">UX</option>
              <option value="FE">FE</option>
              <option value="BE">BE</option>
              <option value="mobile">mobile</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">المستخدم</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">التواصل</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">الصلاحية</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">التخصص</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">المستوى</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${user.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                          {(user.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{user.name}</span>
                          <span className="text-[10px] text-gray-400 dir-ltr text-right">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.phone ? (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium dir-ltr justify-end">
                           <Phone className="w-3 h-3 text-accent" />
                           {user.phone}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        user.role === 'admin' ? 'bg-red-50 text-red-600' :
                        user.role === 'interviewer' ? 'bg-teal-50 text-teal-600' :
                        user.role === 'maintainer' ? 'bg-purple-50 text-purple-600' : 'bg-gray-50 text-gray-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.field || '-'}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">{getLevelLabel(user.level)}</td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => initiateDelete(user)}
                        disabled={deletingUid === user.uid}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                      >
                        {deletingUid === user.uid ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">لا توجد نتائج.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-black text-gray-900 mb-2">تأكيد الحذف</h3>
            <p className="text-gray-600 mb-6">هل أنت متأكد من حذف الحساب "{userPendingDelete?.email}"؟</p>
            <div className="flex gap-4">
              <Button variant="primary" className="flex-1 bg-red-600 hover:bg-red-700" onClick={confirmDelete}>حذف</Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)}>إلغاء</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTab;