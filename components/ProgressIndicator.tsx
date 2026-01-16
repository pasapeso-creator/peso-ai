import React from 'react';
import { Check, Loader2, Sparkles, FileText, Wand2, Download } from 'lucide-react';

export interface ProgressStage {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface ProgressIndicatorProps {
  stages: ProgressStage[];
  currentStage: number;
  estimatedTime?: number; // in seconds
  elapsedTime?: number; // in seconds
  isComplete?: boolean;
}

const defaultStages: ProgressStage[] = [
  { id: 'analyzing', label: 'تحليل الطلب', icon: <Wand2 size={16} /> },
  { id: 'generating', label: 'توليد المحتوى', icon: <Sparkles size={16} /> },
  { id: 'formatting', label: 'تنسيق النتائج', icon: <FileText size={16} /> },
  { id: 'finalizing', label: 'إنهاء العملية', icon: <Download size={16} /> },
];

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  stages = defaultStages,
  currentStage,
  estimatedTime = 30,
  elapsedTime = 0,
  isComplete = false,
}) => {
  const progress = isComplete ? 100 : Math.min(((currentStage + 0.5) / stages.length) * 100, 95);
  const remainingTime = Math.max(estimatedTime - elapsedTime, 0);
  
  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds} ثانية`;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} دقيقة ${secs > 0 ? `و ${secs} ثانية` : ''}`;
  };

  return (
    <div className="w-full bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Loader2 className="animate-spin text-blue-500" size={20} />
            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
          </div>
          <span className="text-white font-semibold">جاري العمل...</span>
        </div>
        {!isComplete && remainingTime > 0 && (
          <span className="text-sm text-slate-400">
            الوقت المتبقي: <span className="text-blue-400 font-medium">{formatTime(remainingTime)}</span>
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden mb-6">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white drop-shadow-lg">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Stages */}
      <div className="flex justify-between relative">
        {/* Connection Line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-700" />
        <div 
          className="absolute top-4 left-6 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
          style={{ width: `${Math.max(0, ((currentStage) / (stages.length - 1)) * 100)}%`, maxWidth: 'calc(100% - 48px)' }}
        />
        
        {stages.map((stage, index) => {
          const isCompleted = index < currentStage || isComplete;
          const isCurrent = index === currentStage && !isComplete;
          const isPending = index > currentStage && !isComplete;

          return (
            <div 
              key={stage.id} 
              className="flex flex-col items-center z-10"
              style={{ flex: 1 }}
            >
              {/* Stage Circle */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2
                  ${isCompleted 
                    ? 'bg-green-500 border-green-400 text-white shadow-lg shadow-green-500/30' 
                    : isCurrent 
                      ? 'bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/40 animate-pulse' 
                      : 'bg-slate-700 border-slate-600 text-slate-400'}
                `}
              >
                {isCompleted ? (
                  <Check size={16} className="animate-scale-in" />
                ) : isCurrent ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  stage.icon || <span className="text-xs">{index + 1}</span>
                )}
              </div>
              
              {/* Stage Label */}
              <span
                className={`
                  mt-2 text-xs font-medium text-center transition-colors duration-300
                  ${isCompleted ? 'text-green-400' : isCurrent ? 'text-blue-400' : 'text-slate-500'}
                `}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current Stage Message */}
      {!isComplete && currentStage < stages.length && (
        <div className="mt-4 text-center">
          <p className="text-sm text-slate-400">
            <span className="text-blue-400">{stages[currentStage]?.label}</span>
            {' '}... الرجاء الانتظار
          </p>
        </div>
      )}

      {/* Complete Message */}
      {isComplete && (
        <div className="mt-4 text-center animate-fade-in">
          <p className="text-sm text-green-400 font-medium flex items-center justify-center gap-2">
            <Check size={16} />
            تمت العملية بنجاح! 🎉
          </p>
        </div>
      )}

      {/* Add shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        @keyframes scale-in {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProgressIndicator;
