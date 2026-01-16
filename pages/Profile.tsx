import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { authService, UserProfile } from '../services/authService';
import { User, CreditCard, Clock, Activity, Calendar, Award, FileText, Presentation, PenTool, FileSpreadsheet, Crown } from 'lucide-react';

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
          .limit(20);
          
        setLogs(data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const activityIcons: Record<string, React.ReactNode> = {
    'assignment': <FileText className="text-blue-400" />,
    'report': <Award className="text-purple-400" />,
    'presentation': <Presentation className="text-pink-400" />,
    'quiz': <PenTool className="text-emerald-400" />,
    'sheet': <FileSpreadsheet className="text-indigo-400" />
  };

  if (loading) return <div className="text-white text-center p-10">تحميل بيانات الملف الشخصي...</div>;
  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      {/* Welcome & Stats */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 mb-8 border border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -ml-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-xl">
             {profile.full_name?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-right flex-1">
             <h1 className="text-3xl font-black text-white mb-2 font-lalezar">
               أهلاً بيك يا {profile.full_name?.split(' ')[0]} 👋
             </h1>
             <div className="flex flex-wrap gap-3 justify-center md:justify-start">
               {profile.is_subscribed && (
                 <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                   <Crown size={12} fill="currentColor" /> Premium Member
                 </span>
               )}
               <span className="bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                 <Clock size={12} /> انضممت {new Date(profile.created_at!).toLocaleDateString('ar-EG')}
               </span>
             </div>
          </div>
          
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-700/50 min-w-[150px] text-center">
             <span className="text-slate-400 text-xs block mb-1">رصيد النقاط</span>
             <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
               {profile.credits}
             </span>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Activity className="text-blue-500" />
          سجل نشاطك الأخير
        </h2>

        <div className="space-y-4">
          {logs.length === 0 ? (
            <div className="text-center text-slate-500 py-10">
              لسه معملتش أي نشاط.. يالا ابدأ! 🚀
            </div>
          ) : (
            logs.map((log) => (
               <div key={log.id} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 flex items-center gap-4 hover:bg-slate-800/80 transition-colors">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
                     {/* Icon logic placeholder */}
                     <Activity size={20} className="text-slate-400" />
                  </div>
                  <div className="flex-1">
                     <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">{log.action_type}</h4>
                     <p className="text-slate-400 text-xs">
                        {log.details?.topic || log.details?.subject || 'تم العملية بنجاح'}
                     </p>
                  </div>
                  <div className="text-slate-500 text-xs flex flex-col items-end gap-1">
                     <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(log.created_at).toLocaleDateString('ar-EG')}</span>
                     <span className="flex items-center gap-1"><Clock size={10} /> {new Date(log.created_at).toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
               </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
