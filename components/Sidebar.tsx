import React from 'react';
import { AppRoute } from '../types';
import { useToast } from './Toast'; // Assuming Toast is in same folder or ../components/Toast. Sidebar is in components. so ./Toast or ../components/Toast? 
// File path is components/Sidebar.tsx. Toast is components/Toast.tsx. So ./Toast is correct.
import { FileText, Award, PenTool, CreditCard, LayoutDashboard, Menu, X, HelpCircle, FileSpreadsheet, Presentation as PresentationIcon, Crown, User } from 'lucide-react';

interface SidebarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  credits: number;
  isSubscribed?: boolean;
  userName?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentRoute, onNavigate, isOpen, setIsOpen, credits, isSubscribed = false, userName = 'Student' }) => {
  const { showToast } = useToast();
  const menuItems = [
    { id: AppRoute.HOME, label: 'الرئيسية', icon: <LayoutDashboard size={18} /> },
    { id: AppRoute.PROFILE, label: 'ملفي الشخصي', icon: <User size={18} /> },
    { id: AppRoute.ASSIGNMENT, label: 'توليد Assignment', icon: <FileText size={18} /> },
    { id: AppRoute.REPORT, label: 'توليد Report', icon: <Award size={18} /> },
    { id: AppRoute.PRESENTATION, label: 'توليد Presentation', icon: <PresentationIcon size={18} /> },
    { id: AppRoute.QUIZ, label: 'حل Quiz', icon: <PenTool size={18} /> },
    { id: AppRoute.SHEET, label: 'حل Sheet', icon: <FileSpreadsheet size={18} /> },
    { id: AppRoute.SETTINGS, label: 'الاعدادات والمساعدة', icon: <HelpCircle size={18} /> },
    { id: AppRoute.SUBSCRIPTION, label: 'الاشتراك', icon: <CreditCard size={18} /> },
  ];

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`
            p-3 rounded-2xl text-white shadow-xl transition-all duration-300
            ${isOpen 
              ? 'bg-red-500/90 hover:bg-red-600 rotate-90' 
              : 'bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'}
          `}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 right-0 h-full w-72 md:w-64 bg-slate-900/98 backdrop-blur-xl border-l border-slate-800/50 z-40 transform transition-all duration-300 ease-in-out shadow-2xl
        ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        <div className="p-5 flex flex-col h-full">
          
          {/* Logo - Simple */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-800/50">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/logo.png" alt="PESO AI" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                PESO <span className="text-blue-400">Ai</span>
              </h1>
              <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">Helper</span>
            </div>
          </div>

          {/* Menu - Clean */}
          <div className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if ((item.id === AppRoute.SHEET || item.id === AppRoute.PRESENTATION) && !isSubscribed) {
                    showToast("عفواً، هذه الميزة للمشتركين فقط 👑", "error");
                    if (window.innerWidth < 768) setIsOpen(false); // Close sidebar so they see toast? Or keep it open? Close is better.
                    return;
                  }
                  onNavigate(item.id);
                  if (window.innerWidth < 768) setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${currentRoute === item.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}
                `}
              >
                <span className={currentRoute === item.id ? 'text-white' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium font-lalezar tracking-wide flex-1 text-right">{item.label}</span>
                
                {/* Premium Badge */}
                {(item.id === AppRoute.SHEET || item.id === AppRoute.PRESENTATION) && (
                  <Crown size={14} className="text-amber-400" />
                )}
              </button>
            ))}
          </div>

          {/* Credits Widget - Clean */}
          <div className="mt-auto pt-4 border-t border-slate-800/50">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex flex-col">
                  <span className="text-white font-bold text-xs truncate max-w-[100px]">{userName}</span>
                  <span className="text-slate-500 text-[10px]">رصيدك الحالي</span>
                </div>
                <span className="text-amber-400 font-bold text-sm drop-shadow-sm">{credits} نقطة</span>
              </div>
              <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((credits / 100) * 100, 100)}%` }}
                ></div>
              </div>
              <button 
                onClick={() => onNavigate(AppRoute.SUBSCRIPTION)}
                className="w-full mt-3 text-xs font-bold text-white py-2.5 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 group relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                }}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                <CreditCard size={14} className="relative z-10" />
                <span className="relative z-10">شحن الرصيد</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Sidebar;
