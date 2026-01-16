import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { UserProfile } from '../services/authService';
import { useToast } from '../components/Toast';
import { CheckCircle, XCircle, Clock, Search, Shield, User } from 'lucide-react';

interface SubscriptionRequest {
  id: string;
  user_id: string;
  phone_number: string;
  plan_type: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  profiles: {
    email: string;
    full_name: string;
  };
}

const AdminDashboard: React.FC = () => {
  const [requests, setRequests] = useState<SubscriptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_requests')
        .select('*, profiles(email, full_name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data as any);
    } catch (error) {
      console.error('Error fetching requests:', error);
      showToast('مشكلة في تحميل الطلبات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId: string, userId: string, action: 'approve' | 'reject', planType: string) => {
    try {
      if (action === 'approve') {
        const credits = planType === 'monthly' ? 100 : 300;
        const months = planType === 'monthly' ? 1 : 3;
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + months);

        // Update Profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            is_subscribed: true,
            subscription_plan: planType,
            credits: credits, // Set credits (or add to existing?) Let's set for now as per plan
            subscription_end_date: endDate.toISOString()
          })
          .eq('id', userId);

        if (profileError) throw profileError;
      }

      // Update Request Status
      const { error: reqError } = await supabase
        .from('subscription_requests')
        .update({ status: action === 'approve' ? 'approved' : 'rejected' })
        .eq('id', requestId);

      if (reqError) throw reqError;

      showToast(`تم ${action === 'approve' ? 'الموافقة' : 'الرفض'} بنجاح`, 'success');
      fetchRequests(); // Refresh
    } catch (error) {
      console.error(error);
      showToast('حصل خطأ أثناء تنفيذ العملية', 'error');
    }
  };

  if (loading) return <div className="text-center p-10 text-white">Loading Admin Dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Shield className="text-purple-500" />
          لوحة تحكم الأدمن
        </h1>
        <div className="bg-slate-800 px-4 py-2 rounded-lg text-slate-300">
          Super Admin Access
        </div>
      </div>

      {/* Stats Cards could go here */}

      {/* Requests Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="text-yellow-500" />
            طلبات الاشتراك ({requests.filter(r => r.status === 'pending').length} معلق)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="p-4">المستخدم</th>
                <th className="p-4">الباقة</th>
                <th className="p-4">رقم التحويل</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">التاريخ</th>
                <th className="p-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-white font-bold">{req.profiles?.full_name || 'Unknown'}</span>
                      <span className="text-xs text-slate-500">{req.profiles?.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      req.plan_type === 'quarterly' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {req.plan_type === 'quarterly' ? 'ربع سنوية' : 'شهرية'}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-300">{req.phone_number}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      req.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                      req.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                      'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-sm">
                    {new Date(req.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {req.status === 'pending' && (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleAction(req.id, req.user_id, 'approve', req.plan_type)}
                          className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition-all"
                          title="موافقة"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleAction(req.id, req.user_id, 'reject', req.plan_type)}
                          className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                          title="رفض"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    لا توجد طلبات حالياً
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
