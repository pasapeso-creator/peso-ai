import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6 md:px-4 py-8 relative overflow-hidden animate-fade-in-up">
      
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-600/5 rounded-full blur-[100px] md:blur-[120px] -z-10"></div>
      
      {/* Logo Area */}
      <div className="mb-6 md:mb-8 relative group">
        <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
        <img 
            src="/logo.png" 
            alt="PESO AI" 
            className="w-28 h-28 md:w-32 md:h-32 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        />
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-3 md:mb-4 tracking-tight font-righteous leading-tight">
        Peso <span className="text-blue-500">Ai</span> Helper
      </h1>

      {/* Arabic Subtitle */}
      <p className="text-lg sm:text-xl md:text-2xl text-slate-300 font-bold mb-4 md:mb-6 font-lalezar tracking-wide px-4" dir="rtl">
        منصتك الذكية للتميز الأكاديمي
      </p>

      {/* English Description */}
      <p className="text-slate-500 text-sm md:text-base max-w-md md:max-w-lg mx-auto mb-8 md:mb-10 tracking-wide leading-relaxed px-2">
        Generate assignments, reports, presentations & solve quizzes with AI
      </p>

      {/* CTA Button */}
      <button 
        onClick={() => navigate('/start')}
        className="group relative w-full sm:w-auto px-10 py-4 md:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] active:scale-95 md:hover:-translate-y-1 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
        
        <span className="text-lg md:text-lg">ابدأ الآن مجاناً</span>
        <Sparkles className="w-5 h-5 animate-pulse" />
      </button>

      {/* Tags */}
      <div className="mt-8 md:mt-12 flex flex-wrap justify-center gap-2 md:gap-3 px-2">
        {['سريع', 'دقيق', 'احترافي', 'آمن'].map((tag, i) => (
          <span 
            key={i} 
            className="px-4 py-2 md:py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 text-sm md:text-sm font-medium hover:border-slate-700 hover:text-white transition-colors cursor-default"
          >
            {tag}
          </span>
        ))}
      </div>

    </div>
  );
};

export default Home;
