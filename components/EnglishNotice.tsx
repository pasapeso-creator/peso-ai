import React from 'react';
import { Globe } from 'lucide-react';

const EnglishNotice: React.FC = () => {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-6 flex items-center gap-4">
      <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <Globe className="text-blue-400" size={20} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">English Only</span>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-slate-500">الإنجليزية فقط</span>
        </div>
        <p className="text-slate-400 text-sm">
          Please enter all data in <span className="text-white font-medium">English</span> for best results
        </p>
      </div>
    </div>
  );
};

export default EnglishNotice;
