import React, { useState } from 'react';
import { UserCredits } from '../types';
import { PAYMENT_PHONE, SUBSCRIPTION_PRICE } from '../constants';
import { CheckCircle, Smartphone, Lock, Copy, CreditCard, Sparkles, Zap, Shield, Crown, TrendingDown } from 'lucide-react';
import { useToast } from '../components/Toast';

interface Props {
  userCredits: UserCredits;
  onRequestSub: (phone: string, plan: 'monthly' | 'quarterly') => void;
}

const Subscription: React.FC<Props> = ({ userCredits, onRequestSub }) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'quarterly'>('quarterly');
  const [phone, setPhone] = useState('');
  const { showToast } = useToast();

  const plans = {
    monthly: {
      price: 50,
      originalPrice: 100,
      period: 'شهرياً',
      label: 'باقة الشهر',
      features: ['100 نقطة رصيد شهرياً', 'وصول للمميزات الأساسية', 'وفر 50% من السعر الأصلي']
    },
    quarterly: {
      price: 150,
      originalPrice: 300,
      period: '3 شهور',
      label: 'الباقة الربع سنوية',
      features: ['300 نقطة رصيد كاملة', 'أولوية قصوى في المعالجة', 'دعم فني شخصي 24/7', 'وفر 50% لمدة 3 شهور']
    }
  };

  const currentPlan = plans[selectedPlan];

  const handleSubmit = () => {
    if (phone.length < 11) {
      showToast("يا ريس، الرقم ناقص.. اتأكد كدا واكتبه صح!", "error");
      return;
    }
    onRequestSub(phone, selectedPlan);
    showToast("زي الفل، طلبك وصل وهنراجعه فوراً!", "success", 4000, "/logo.png");
  };

  if (userCredits.pendingRequest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in-up">
        <div className="relative">
          <div className="absolute -inset-4 bg-yellow-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-8 rounded-full mb-8 relative border border-yellow-500/30">
            <Lock className="w-20 h-20 text-yellow-500" />
          </div>
        </div>
        <h2 className="text-4xl font-black text-white mb-4">طلبك قيد المراجعة</h2>
        <p className="text-slate-400 max-w-lg text-lg leading-relaxed bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
          شكراً للاشتراك! جاري مراجعة طلبك لتفعيل باقة 
          <span className="text-yellow-400 font-bold mx-1">{selectedPlan === 'monthly' ? 'الشهر' : 'الـ 3 شهور'}</span>
          سيتم التفعيل خلال دقائق.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-12 animate-fade-in-up">
      {/* Hero Section */}
      <div className="text-center mb-10 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -z-10"></div>
        <span className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-slate-800/80 border border-slate-700 text-purple-400 font-medium text-sm mb-6 backdrop-blur-sm">
           <Sparkles className="w-4 h-4" /> استثمر في مستقبلك الأكاديمي
        </span>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
          خطط الاشتراك <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Premium</span>
        </h2>
        
        {/* Limited Time Offer Banner */}
        <div className="max-w-xl mx-auto bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-xl p-3 mb-8 animate-pulse">
           <p className="text-red-400 font-bold flex items-center justify-center gap-2 text-sm md:text-base">
             <Zap size={18} fill="currentColor" />
             العروض دي متاحة لمدة أسبوعين فقط! الحق الخصم
             <Zap size={18} fill="currentColor" />
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Plans Selection - Premium UI */}
        <div className="space-y-8">
          {/* Monthly Plan - REFINED DESIGN */}
          <div 
            onClick={() => setSelectedPlan('monthly')}
            className={`cursor-pointer group relative overflow-hidden rounded-3xl transition-all duration-300 border-2 ${
              selectedPlan === 'monthly' 
                ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-[1.02]' 
                : 'bg-slate-900/40 border-slate-700/50 hover:border-blue-400/50 hover:bg-slate-800/80'
            }`}
          >
            {/* Background Accents */}
            <div className={`absolute -right-20 -top-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl transition-opacity duration-500 ${selectedPlan === 'monthly' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}></div>
            
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CreditCard size={120} />
            </div>
            
            <div className="relative p-6 md:p-8 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div>
                   <h3 className={`text-2xl font-bold mb-2 ${selectedPlan === 'monthly' ? 'text-white' : 'text-slate-300'}`}>باقة البداية</h3>
                   <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-black text-blue-400">50</span>
                     <span className="text-xl text-slate-500 line-through">100 ج.م</span>
                   </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shadow-lg ${
                  selectedPlan === 'monthly' ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
                }`}>
                  {selectedPlan === 'monthly' && <CheckCircle size={14} className="text-white" />}
                </div>
              </div>
              
              <ul className="space-y-4 mb-6">
                {plans.monthly.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <div className="p-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <CheckCircle size={12} />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto pt-4 border-t border-slate-700/50 text-center">
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
                   <Zap size={12} className="text-yellow-500" />
                   صلاحية لمدة شهر
                 </span>
              </div>
            </div>
          </div>

          {/* Quarterly Plan - PREMIUM DESIGN */}
          <div 
            onClick={() => setSelectedPlan('quarterly')}
            className={`cursor-pointer group relative overflow-hidden rounded-3xl transition-all duration-500 border-2 ${
              selectedPlan === 'quarterly' 
                ? 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.4)] scale-105 z-10' 
                : 'bg-slate-900/40 border-slate-700/50 hover:border-purple-400/50 hover:bg-slate-800/80'
            }`}
          >
             {/* Glow Effects */}
             {selectedPlan === 'quarterly' && (
               <>
                 <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                 <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
                 <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-20"></div>
               </>
             )}

             {/* Best Value Badge */}
             <div className="absolute top-0 left-0 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-black px-6 py-2 rounded-br-2xl shadow-lg z-20 flex items-center gap-2">
               <Crown size={14} fill="currentColor" />
               الأكثر طلباً
             </div>
             
            <div className="relative p-8 md:p-10 flex flex-col h-full z-10">
              <div className="flex justify-between items-start mb-8 mt-4">
                <div>
                   <div className="flex items-center gap-2 mb-2">
                     <h3 className={`text-3xl font-black ${selectedPlan === 'quarterly' ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200' : 'text-slate-300'}`}>الباقة الاحترافية</h3>
                     <Sparkles className="text-purple-400 animate-pulse" size={20} />
                   </div>
                   <div className="flex items-baseline gap-3">
                     <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">150</span>
                     <div className="flex flex-col items-start leading-none">
                       <span className="text-lg text-slate-500 line-through mb-1">300 ج.م</span>
                       <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20">توفير 50%</span>
                     </div>
                   </div>
                </div>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shadow-lg ${
                  selectedPlan === 'quarterly' ? 'border-purple-500 bg-purple-500 scale-110' : 'border-slate-600'
                }`}>
                  {selectedPlan === 'quarterly' && <CheckCircle size={18} className="text-white" />}
                </div>
              </div>
              
              <div className="bg-slate-950/50 rounded-2xl p-6 border border-white/5 backdrop-blur-md mb-6">
                <ul className="space-y-4">
                  {plans.quarterly.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-white font-medium">
                      <div className="p-1.5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg text-white">
                        <CheckCircle size={14} />
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-auto text-center relative overflow-hidden rounded-xl p-3 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20">
                 <div className="absolute inset-0 bg-white/5 animate-shimmer"></div>
                 <span className="relative z-10 text-sm font-bold text-purple-300 flex items-center justify-center gap-2">
                   <Zap size={16} />
                   صلاحية لمدة 3 أشهر كاملة
                 </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="flex flex-col gap-6">
           {/* Payment Method Card */}
           <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
                <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                   <Smartphone className="text-purple-500 w-6 h-6" />
                </div>
                بيانات التحويل
              </h3>
              
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 mb-8 backdrop-blur-sm relative group hover:border-purple-500/30 transition-all duration-300">
                <div className="flex flex-col items-center mb-6">
                   <div className="bg-white p-4 rounded-2xl shadow-lg mb-4 transform group-hover:scale-105 transition-transform duration-300 w-full max-w-[200px] flex items-center justify-center">
                      <img src="/etisalat-cash.png" alt="Etisalat Cash" className="w-full h-auto object-contain max-h-[80px]" />
                   </div>
                   <p className="text-slate-400 text-sm font-medium">تحويل فودافون كاش / اتصالات كاش / أورانج كاش</p>
                </div>

                <div className="flex justify-between items-center bg-slate-950/80 p-4 rounded-xl border border-slate-800 group-hover:border-purple-500/30 transition-colors">
                   <div className="flex flex-col">
                      <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">رقم التحويل</span>
                      <span className="text-2xl font-mono text-white tracking-widest font-bold">{PAYMENT_PHONE}</span>
                   </div>
                   <button 
                     onClick={() => {
                        navigator.clipboard.writeText(PAYMENT_PHONE);
                        showToast("الرقم اتنسخ يا بطل، حول عليه دلوقتي", "info");
                     }}
                     className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl transition-colors shadow-lg shadow-purple-600/20"
                     title="نسخ الرقم"
                   >
                     <Copy size={20}/>
                   </button>
                </div>
              </div>

              <div className="space-y-5">
                <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-blue-300">المبلغ المطلوب تحويله:</span>
                    <span className="text-xl font-bold text-white">{currentPlan.price} ج.م</span>
                  </div>
                  <p className="text-xs text-blue-400/60 text-left dir-ltr">Plan: {currentPlan.label}</p>
                </div>

                <div>
                    <label className="block text-slate-300 text-sm font-semibold mb-2 ml-1">رقم المحفظة المُحـول منها</label>
                    <input 
                      type="text" 
                      placeholder="أدخل رقم هاتفك الذي قمت بالتحويل منه"
                      className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl p-4 text-white placeholder:text-slate-600 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all text-left"
                      dir="ltr"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                
                <button 
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all text-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  تأكيد الدفع ({currentPlan.price} ج.م)
                </button>
                
                <p className="text-center text-slate-500 text-sm mt-4">
                  * سيتم مراجعة طلبك وتفعيله خلال 15 دقيقة
                </p>
              </div>
           </div>
           
           {/* Security Badge */}
           <div className="flex items-center justify-center gap-2 text-slate-500 text-sm bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
             <Lock size={16} />
             <span>جميع المعاملات آمنة ومشفرة 100%</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
