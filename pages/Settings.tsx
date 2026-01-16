import React from 'react';
import { 
  HelpCircle, 
  MessageCircle, 
  FileText, 
  Award, 
  PenTool, 
  ChevronRight,
  ExternalLink,
  FileSpreadsheet
} from 'lucide-react';

const Settings: React.FC = () => {
  const guideItems = [
    {
      title: 'توليد الواجبات (Assignment)',
      icon: <FileText className="text-blue-400" size={24} />,
      steps: [
        'اختر "Assignment" من القائمة الجانبية',
        'املأ بياناتك (الاسم، المادة، اسم الدكتور)',
        'اكتب سؤال الواجب أو قم برفع صورة للسؤال',
        'اختر تصميم ملف PDF المناسب (مثل Academic Blue أو Emerald Scholar)',
        'اضغط على "Generate Assignment" وانتظر قليلاً',
        'حمل الملف بصيغة PDF جاهز للطباعة'
      ]
    },
    {
      title: 'إنشاء التقارير (Report)',
      icon: <Award className="text-emerald-400" size={24} />,
      steps: [
        'اختر "Report" من القائمة',
        'اكتب عنوان الموضوع (بالإنجليزية) وحدد عدد الصفحات المطلوبة',
        'يمكنك إضافة صور من جوجل لدعم التقرير',
        'اختر التنسيق المناسب للتقرير',
        'اضغط "Generate Report" وسيقوم الذكاء الاصطناعي بكتابة تقرير شامل',
        'حمل التقرير كملف PDF منظم ومنسق'
      ]
    },

    {
      title: 'حل الكويزات (Quiz)',
      icon: <PenTool className="text-rose-400" size={24} />,
      steps: [
        'اختر "Quiz Solver"',
        'اكتب نص السؤال أو ارفع صورة واضحة للسؤال',
        'سيقوم الذكاء الاصطناعي بتحليل السؤال وتقديم حل مفصل',
        'الحل يشمل المعادلات الرياضية والشرح خطوة بخطوة',
        'يمكنك تحميل الحل كملف PDF للاحتفاظ به'
      ]
    },
    {
      title: 'حل الشيتات (Sheet)',
      icon: <FileSpreadsheet className="text-orange-400" size={24} />,
      steps: [
        'اختر "Sheet Solver" من القائمة الجانبية',
        'املأ بياناتك الأساسية (الاسم، الرقم الجامعي، المادة)',
        'ارفع صورة الشيت أو ملف PDF للورقة المطلوب حلها',
        'اكتب أي تعليمات إضافية إذا لزم الأمر',
        'سيقوم الذكاء الاصطناعي بتحليل جميع الأسئلة وحلها بالتفصيل',
        'الحل يشمل الشرح خطوة بخطوة والمعادلات الرياضية',
        'حمل الحل النهائي كملف PDF أو Word'
      ]
    },
    {
      title: 'توليد Presentation',
      icon: <Award className="text-purple-400" size={24} />,
      steps: [
        'اختر "Presentation Generator" من القائمة الجانبية',
        'املأ بيانات المشروع (الموضوع، المادة، الكلية)',
        'أضف أعضاء الفريق (عدد غير محدود) - كل عضو باسمه و ID',
        'ارفع صور من جهازك (حتى 8 صور) أو ابحث عن صور من الإنترنت',
        'اختر تصميم PowerPoint من بين 5 تصميمات مبهرة',
        'اضغط على "توليد المحتوى" وانتظر الذكاء الاصطناعي',
        'راجع الشرائح المولدة ثم حمل ملف PowerPoint جاهز!'
      ]
    }
  ];

  const handleWhatsappSupport = () => {
    window.open('https://wa.me/201225582421', '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-700/50 rounded-xl border border-slate-600">
            <HelpCircle className="text-slate-200" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">مركز المساعدة والدعم</h2>
            <p className="text-slate-400 text-sm">شرح استخدام البرنامج والتواصل مع الدعم الفني</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Guide Section */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">
            دليل استخدام البرنامج
          </h3>
          
          <div className="space-y-4">
            {guideItems.map((item, index) => (
              <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-all duration-300">
                <div className="p-4 bg-slate-800/80 border-b border-slate-700/50 flex items-center gap-3">
                  <div className="p-2 bg-slate-900 rounded-lg shadow-sm">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-lg text-slate-100">{item.title}</h4>
                </div>
                <div className="p-5">
                  <ul className="space-y-3">
                    {item.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-500 flex-shrink-0"></span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">
              الدعم الفني
            </h3>
            
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-green-500/20 transition-all duration-500"></div>
              
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="text-green-500" size={32} />
                </div>
                
                <h4 className="text-xl font-bold text-white mb-2">تواجه مشكلة؟</h4>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  فريق الدعم الفني جاهز لمساعدتك في أي وقت. تواصل معنا مباشرة عبر الواتساب.
                </p>
                
                <button 
                  onClick={handleWhatsappSupport}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  <span>تواصل عبر واتساب</span>
                  <ExternalLink size={16} className="opacity-70" />
                </button>
                
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <p className="text-slate-500 text-xs">
                    رقم الدعم: <span className="text-slate-300 font-mono dir-ltr select-all">01225582421</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
              <h5 className="font-bold text-slate-200 mb-2 text-sm flex items-center gap-2">
                <HelpCircle size={14} className="text-blue-400" />
                نصائح سريعة
              </h5>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <ChevronRight size={12} className="text-slate-600" />
                  تأكد من شحن رصيدك لاستخدام المميزات
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight size={12} className="text-slate-600" />
                  اكتب البيانات باللغة الإنجليزية لأفضل نتائج
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight size={12} className="text-slate-600" />
                  استخدم صور واضحة عند حل الكويزات
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
