import React from 'react';
import { authService } from '../services/authService';
import { useToast } from '../components/Toast';
import { Sparkles, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const { showToast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      await authService.signInWithGoogle();
    } catch (error: any) {
      showToast('حصل مشكلة في تسجيل الدخول.. جرب تاني', 'error');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden animate-fade-in-up">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] -z-10"></div>
      
      <div className="w-full max-w-md p-8 m-4 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl relative">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700/50 w-24 h-24 rounded-2xl rotate-12 flex items-center justify-center shadow-lg shadow-purple-500/30">
           <img src="/logo.png" alt="PESO AI Logo" className="w-16 h-16 object-contain drop-shadow-lg" />
        </div>

        <div className="text-center mt-12 mb-8">
          <h1 className="text-3xl font-black text-white mb-2 font-lalezar">مرحباً بيك في PESO AI 👋</h1>
          <p className="text-slate-400">سجل عشان تبدأ رحلتك التعليمية الذكية</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white hover:bg-slate-50 text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-xl group"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
          <span>تسجيل الدخول بواسطة Google</span>
          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -mr-2" />
        </button>

        <p className="text-center text-slate-500 text-xs mt-6">
          بالتسجيل، أنت توافق على شروط الاستخدام وسياسة الخصوصية
        </p>
      </div>
    </div>
  );
};

export default Login;
