import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'pdf' | 'form' | 'card' | 'list';
  lines?: number;
  className?: string;
}

// Skeleton line component
const SkeletonLine: React.FC<{ width?: string; height?: string; className?: string }> = ({ 
  width = '100%', 
  height = '16px',
  className = ''
}) => (
  <div 
    className={`bg-slate-700 rounded animate-pulse ${className}`}
    style={{ width, height }}
  />
);

// Skeleton circle component
const SkeletonCircle: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <div 
    className="bg-slate-700 rounded-full animate-pulse flex-shrink-0"
    style={{ width: size, height: size }}
  />
);

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'pdf',
  lines = 8,
  className = '',
}) => {
  // PDF skeleton - mimics the PDF preview layout
  if (variant === 'pdf') {
    return (
      <div className={`bg-white rounded-lg shadow-xl overflow-hidden ${className}`}>
        {/* Top border */}
        <div className="h-3 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 animate-pulse" />
        
        {/* Header section */}
        <div className="bg-gradient-to-br from-slate-200 to-slate-300 p-6 animate-pulse">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <SkeletonCircle size={70} />
              <div className="space-y-2">
                <SkeletonLine width="180px" height="24px" />
                <SkeletonLine width="120px" height="14px" />
                <SkeletonLine width="100px" height="12px" />
              </div>
            </div>
            <SkeletonCircle size={55} />
          </div>
          
          {/* Student info box */}
          <div className="mt-4 bg-white/50 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3">
              <SkeletonLine width="140px" height="14px" />
              <SkeletonLine width="120px" height="14px" />
            </div>
          </div>
        </div>

        {/* Title section */}
        <div className="bg-slate-200 p-6 text-center animate-pulse">
          <SkeletonLine width="200px" height="12px" className="mx-auto mb-3" />
          <SkeletonLine width="280px" height="28px" className="mx-auto" />
        </div>

        {/* Content section */}
        <div className="p-6 space-y-4 animate-pulse">
          <SkeletonLine width="60%" height="22px" className="mb-4" />
          
          {Array.from({ length: lines }).map((_, i) => (
            <SkeletonLine 
              key={i} 
              width={`${Math.random() * 30 + 70}%`} 
              height="14px" 
            />
          ))}
          
          <div className="mt-6">
            <SkeletonLine width="50%" height="20px" className="mb-3" />
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonLine 
                key={i} 
                width={`${Math.random() * 20 + 75}%`} 
                height="14px"
                className="mb-2" 
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 animate-pulse">
          <div className="flex justify-between items-center">
            <SkeletonLine width="150px" height="12px" />
            <SkeletonLine width="100px" height="12px" />
          </div>
        </div>

        {/* Bottom border */}
        <div className="h-3 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 animate-pulse" />
      </div>
    );
  }

  // Form skeleton
  if (variant === 'form') {
    return (
      <div className={`bg-slate-800 rounded-2xl p-6 border border-slate-700 ${className}`}>
        <div className="space-y-4 animate-pulse">
          {/* Form fields */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <SkeletonLine width="100px" height="12px" className="mb-2" />
              <div className="h-12 bg-slate-700 rounded-xl" />
            </div>
          ))}
          
          {/* Button */}
          <div className="h-14 bg-slate-600 rounded-xl mt-6" />
        </div>
      </div>
    );
  }

  // Card skeleton
  if (variant === 'card') {
    return (
      <div className={`bg-slate-800 rounded-2xl p-6 border border-slate-700 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <SkeletonCircle size={40} />
            <div className="flex-1">
              <SkeletonLine width="60%" height="18px" className="mb-2" />
              <SkeletonLine width="40%" height="12px" />
            </div>
          </div>
          <div className="space-y-2">
            <SkeletonLine width="100%" height="14px" />
            <SkeletonLine width="90%" height="14px" />
            <SkeletonLine width="70%" height="14px" />
          </div>
        </div>
      </div>
    );
  }

  // List skeleton
  if (variant === 'list') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <SkeletonCircle size={32} />
            <div className="flex-1">
              <SkeletonLine width={`${Math.random() * 30 + 60}%`} height="14px" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
