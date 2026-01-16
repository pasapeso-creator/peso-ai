import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Award, Presentation, PenTool, FileSpreadsheet, Sparkles, Crown } from 'lucide-react';
import { AppRoute } from '../types';
import { useToast } from '../components/Toast';

interface ServicesSelectorProps {
  isSubscribed?: boolean;
}

const ServicesSelector: React.FC<ServicesSelectorProps> = ({ isSubscribed = false }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const services = [
    {
      id: AppRoute.ASSIGNMENT,
      title: 'توليد Assignment',
      description: 'اصنع واجبات احترافية كاملة مع التنسيق والمراجع',
      icon: <FileText size={32} />,
      color: 'from-blue-500 to-cyan-500',
      path: '/assignment'
    },
    {
      id: AppRoute.REPORT,
      title: 'توليد Report',
      description: 'تقارير أكاديمية مفصلة مع هيكلية علمية دقيقة',
      icon: <Award size={32} />,
      color: 'from-purple-500 to-pink-500',
      path: '/report'
    },
    {
      id: AppRoute.PRESENTATION,
      title: 'توليد Presentation',
      description: 'عروض تقديمية جذابة جاهزة للعرض فوراً',
      icon: <Presentation size={32} />,
      color: 'from-orange-500 to-red-500',
      path: '/presentation'
    },
    {
      id: AppRoute.QUIZ,
      title: 'حل Quiz',
      description: 'بنك أسئلة ذكي مع إجابات نموذجية وشرح',
      icon: <PenTool size={32} />,
      color: 'from-emerald-500 to-teal-500',
      path: '/quiz'
    },
    {
      id: AppRoute.SHEET,
      title: 'حل Sheet',
      description: 'حلول شيتات ومسائل مع الخطوات التفصيلية',
      icon: <FileSpreadsheet size={32} />,
      color: 'from-indigo-500 to-violet-500',
      path: '/sheet'
    }
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 pt-16 md:pt-4 animate-fade-in-up">
      
      {/* Header */}
      <div className="text-center mb-8 md:mb-12 px-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 md:mb-6 font-lalezar leading-relaxed">
          عاوز تعمل ايه النهاردة؟ <span className="inline-block animate-wave">👋</span>
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto px-4">
          اختر الخدمة اللي محتاجها وسيب الباقي على <span className="text-blue-400 font-bold">PESO AI</span>
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full max-w-6xl px-2">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => {
              if ((service.id === AppRoute.SHEET || service.id === AppRoute.PRESENTATION) && !isSubscribed) {
                showToast("عفواً، هذه الميزة للمشتركين فقط 👑", "error");
                return;
              }
              navigate(service.path);
            }}
            className="group relative bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800 hover:border-slate-600 rounded-2xl md:rounded-3xl p-6 md:p-8 text-right transition-all duration-300 active:scale-[0.98] md:hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
          >
            {/* Premium Badge */}
            {(service.id === AppRoute.SHEET || service.id === AppRoute.PRESENTATION) && (
               <div className="absolute top-4 left-4 z-20 bg-amber-500/20 text-amber-400 p-2 rounded-lg border border-amber-500/30">
                 <Crown size={20} />
               </div>
            )}
            {/* Gradient Background on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
            
            <div className="relative z-10 flex flex-col items-end">
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white shadow-lg mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {service.icon}
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-blue-200 transition-colors">
                {service.title}
              </h3>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-4 md:mb-6 pl-4 md:pl-8">
                {service.description}
              </p>
              
              <div className="flex items-center gap-2 text-sm font-bold text-white/50 group-hover:text-white transition-colors mt-auto">
                <Sparkles size={16} />
                <span>ابـدأ الآن</span>
              </div>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
};

export default ServicesSelector;
