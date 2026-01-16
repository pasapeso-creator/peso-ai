import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { authService, UserProfile } from '../services/authService';
import { 
  User, CreditCard, Clock, Activity, Calendar, Award, 
  FileText, Presentation, PenTool, FileSpreadsheet, 
  Crown, LogOut, ChevronLeft, Zap, Star, Shield
} from 'lucide-react';
import { useToast } from '../components/Toast';

interface ActivityLog {
  id: string;
  action_type: string;
  details: any;
  created_at: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userProfile = await authService.getCurrentProfile();
      setProfile(userProfile);

      if (userProfile) {
        const { data } = await supabase
          .from('activity_logs')
          .select('*')
          .eq('user_id', userProfile.id)
          .order('created_at', { ascending: false })
          .limit(10);
          
        setLogs(data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      window.location.href = '/login';
    } catch (error) {
      showToast("حصل مشكلة وأنت خارج، حاول تاني", "error");
    }
  };

  const activityIcons: Record<string, React.ReactNode> = {
    'assignment': <FileText size={18} className="text-blue-400" />,
    'report': <Award size={18} className="text-purple-400" />,
    'presentation': <Presentation size={18} className="text-pink-400" />,
    'quiz': <PenTool size={18} className="text-emerald-400" />,
    'sheet': <FileSpreadsheet size={18} className="text-indigo-400" />
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 gap-4">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="font-medium animate-pulse">جاري تحضير ملفك الشخصي...</p>
    </div>
  );
  
  if (!profile) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-10 px-4">
      
      {/* Header Section with Logout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
           <div className="relative group">
             <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
             <div className="relative w-20 h-20 bg-slate-900 rounded-2xl border border-slate-700/50 flex items-center justify-center text-3xl font-black text-white shadow-2xl transition-transform group-hover:scale-110 duration-500">
                {profile.full_name?.charAt(0).toUpperCase()}
             </div>
             {profile.is_subscribed && (
               <div className="absolute -top-2 -right-2 bg-yellow-500 text-slate-950 p-1.5 rounded-lg shadow-lg rotate-12">
                 <Crown size={14} fill="currentColor" />
               </div>
             )}
           </div>
           <div className="text-right">
             <h1 className="text-4xl font-black text-white font-lalezar mb-1">
               {profile.full_name}
             </h1>
             <p className="text-slate-500 font-medium text-sm flex items-center gap-2 justify-end">
               {profile.email} <User size={14} />
             </p>
           </div>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 transition-all duration-300 font-bold group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>تسجيل الخروج</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Credits Card */}
        <div className="bg-slate-900/50 rounded-3xl p-6 border border-slate-800 relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
          <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20">
               <Zap size={24} fill="currentColor" />
             </div>
             <span className="text-slate-400 font-bold text-sm">الرصيد المتاح</span>
          </div>
          <div className="flex items-baseline gap-2">
             <span className="text-5xl font-black text-white tracking-tighter">{profile.credits}</span>
             <span className="text-slate-500 font-bold">نقطة</span>
          </div>
        </div>

        {/* Subscription Card */}
        <div className="bg-slate-900/50 rounded-3xl p-6 border border-slate-800 relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors"></div>
          <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20">
               <Crown size={24} fill="currentColor" />
             </div>
             <span className="text-slate-400 font-bold text-sm">نوع الحساب</span>
          </div>
          <div className="flex flex-col gap-1">
             <span className={`text-2xl font-black ${profile.is_subscribed ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400' : 'text-white'}`}>
               {profile.is_subscribed ? (profile.subscription_plan === 'quarterly' ? 'احترافي (3 شهور)' : 'احترافي ممتاز') : 'حساب عادي'}
             </span>
             <span className="text-slate-500 text-xs font-medium">
               {profile.is_subscribed ? 'تاريخ الانتهاء: ' + (profile.subscription_end_date ? new Date(profile.subscription_end_date).toLocaleDateString('ar-EG') : 'غير محدد') : 'اشحن دلوقتي وفك القيود!'}
             </span>
          </div>
        </div>

        {/* Joining Card */}
        <div className="bg-slate-900/50 rounded-3xl p-6 border border-slate-800 relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
          <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20">
               <Star size={24} fill="currentColor" />
             </div>
             <span className="text-slate-400 font-bold text-sm">تاريخ الانضمام</span>
          </div>
          <div className="flex flex-col gap-1">
             <span className="text-2xl font-black text-white">
               {new Date(profile.created_at!).toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}
             </span>
             <span className="text-slate-500 text-xs font-medium flex items-center gap-1 justify-end">
                بطل جديد انضم لعيلتنا <Activity size={12} />
             </span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Activity Feed (Left 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
             <h2 className="text-2xl font-black text-white flex items-center gap-3">
               <Activity className="text-blue-500" /> سجلك الأكاديمي
             </h2>
             <span className="text-slate-500 text-sm font-bold">آخر 10 عمليات</span>
          </div>

          <div className="space-y-4">
            {logs.length === 0 ? (
              <div className="bg-slate-900/30 rounded-3xl p-16 text-center border border-slate-800 border-dashed">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600">
                  <FileText size={40} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">لسه معملتش أي نشاط!</h3>
                <p className="text-slate-500">ابدأ دلوقتي واستخدم أدوات الـ AI عشان تسهل مذاكرتك</p>
              </div>
            ) : (
              logs.map((log) => (
                <div 
                  key={log.id} 
                  className="bg-slate-900/40 hover:bg-slate-800/60 p-5 rounded-2xl border border-slate-800/50 flex items-center gap-5 transition-all duration-300 group hover:translate-x-1"
                >
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 shadow-inner group-hover:scale-110 transition-transform">
                     {activityIcons[log.action_type] || <Activity size={18} className="text-slate-500" />}
                  </div>
                  <div className="flex-1 text-right">
                     <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-1 block">
                        {log.action_type}
                     </span>
                     <h4 className="text-white font-bold mb-1 group-hover:text-blue-400 transition-colors">
                        {log.details?.topic || log.details?.subject || 'عملية ناجحة'}
                     </h4>
                     <div className="flex items-center gap-3 justify-end text-[10px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1">{new Date(log.created_at).toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'})} <Clock size={10} /></span>
                        <span className="bg-slate-800 w-1 h-1 rounded-full"></span>
                        <span className="flex items-center gap-1">{new Date(log.created_at).toLocaleDateString('ar-EG')} <Calendar size={10} /></span>
                     </div>
                  </div>
                  <ChevronLeft size={16} className="text-slate-700 group-hover:text-slate-400 transition-colors lg:block hidden" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Info & Settings (Right 1/3) */}
        <div className="space-y-6">
           <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-500/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <Activity size={48} className="text-white/20 mb-6" />
              <h3 className="text-2xl font-black mb-3 font-lalezar">محتاج مساعدة؟</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6 font-medium">
                لو رصيدك خلص أو عندك مشكلة في التفعيل، تقدر تتواصل معانا دايماً من صفحة الاشتراكات.
              </p>
              <button 
                onClick={() => window.location.href = '/subscription'}
                className="w-full bg-white text-blue-600 font-black py-4 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2"
              >
                تواصل معنا <Zap size={18} fill="currentColor" />
              </button>
           </div>

           <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-800/50 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors"></div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2 relative z-10">
                 معلومات الأمان <Shield size={18} className="text-emerald-500" />
              </h4>
              <div className="space-y-4 relative z-10">
                 <div className="flex justify-between items-center text-sm border-b border-slate-800/30 pb-4">
                    <span className="text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded">نشط</span>
                    <span className="text-slate-400 font-medium">حالة الحساب</span>
                 </div>
                 <div className="flex justify-between items-center text-sm border-b border-slate-800/30 pb-4">
                    <span className="text-white font-bold">Google Auth</span>
                    <span className="text-slate-400 font-medium">طريقة الدخول</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-400 font-bold">PESO-v2.1</span>
                    <span className="text-slate-400 font-medium">الإصدار</span>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
