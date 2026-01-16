import React from 'react';
import { motion } from 'framer-motion';
import { PptDesignTemplate } from '../services/pptDesigns';

interface Props {
  design: PptDesignTemplate;
  className?: string;
}

const DesignPreviewCard: React.FC<Props> = ({ design, className = '' }) => {
  const { colors, shapeStyle, layoutStyle } = design;

  // Render decorative shapes based on shapeStyle
  const renderShapes = () => {
    switch (shapeStyle) {
      case 'circles':
      case 'dots':
        return (
          <>
            <div 
              className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-30"
              style={{ backgroundColor: colors.secondary }}
            />
            <div 
              className="absolute -bottom-3 -left-3 w-12 h-12 rounded-full opacity-25"
              style={{ backgroundColor: colors.accent }}
            />
            {shapeStyle === 'dots' && (
              <div className="absolute bottom-2 left-2 flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.accent }} />
                ))}
              </div>
            )}
          </>
        );
      
      case 'triangles':
        return (
          <>
            <div 
              className="absolute -top-2 -right-2 w-0 h-0 opacity-40"
              style={{ 
                borderLeft: '20px solid transparent',
                borderRight: '20px solid transparent',
                borderBottom: `35px solid ${colors.secondary}`,
              }}
            />
            <div 
              className="absolute -bottom-2 -left-2 w-0 h-0 opacity-30 rotate-180"
              style={{ 
                borderLeft: '15px solid transparent',
                borderRight: '15px solid transparent',
                borderBottom: `25px solid ${colors.primary}`,
              }}
            />
          </>
        );
      
      case 'hexagons':
      case 'tech_grid':
        return (
          <>
            <div 
              className="absolute top-0 right-0 w-2 h-full opacity-20"
              style={{ backgroundColor: colors.secondary }}
            />
            <div className="absolute right-1 top-1/4 flex flex-col gap-2">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-3 h-3 rotate-45 border opacity-60"
                  style={{ borderColor: colors.accent, backgroundColor: colors.background }}
                />
              ))}
            </div>
            {layoutStyle === 'tech' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: colors.accent }} />
            )}
          </>
        );
      
      case 'diamonds':
        return (
          <>
            <div 
              className="absolute -top-2 -right-2 w-8 h-8 rotate-45 opacity-30"
              style={{ backgroundColor: colors.secondary }}
            />
            <div 
              className="absolute -bottom-2 -left-2 w-6 h-6 rotate-45 opacity-25"
              style={{ backgroundColor: colors.accent }}
            />
          </>
        );
      
      case 'lines':
        return (
          <>
            <div className="absolute top-2 left-4 right-4 h-0.5 opacity-30" style={{ backgroundColor: colors.secondary }} />
            <div className="absolute bottom-2 left-4 right-4 h-0.5 opacity-30" style={{ backgroundColor: colors.secondary }} />
          </>
        );
      
      case 'waves':
        return (
          <>
            <svg className="absolute -bottom-2 left-0 w-full h-8 opacity-40" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path 
                d="M0 10 Q25 0 50 10 T100 10 V20 H0 Z" 
                fill={colors.secondary}
              />
            </svg>
            <svg className="absolute -bottom-1 left-0 w-full h-6 opacity-30" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path 
                d="M0 15 Q25 5 50 15 T100 15 V20 H0 Z" 
                fill={colors.accent}
              />
            </svg>
          </>
        );
      
      case 'squares':
        return (
          <>
            <div className="absolute top-0 left-0 w-6 h-full opacity-15" style={{ backgroundColor: colors.primary }} />
            <div className="absolute top-2 left-1 w-3 h-3" style={{ backgroundColor: colors.accent }} />
          </>
        );
      
      case 'organic':
        return (
          <>
            <div 
              className="absolute -top-4 -right-4 w-14 h-14 rounded-full opacity-25"
              style={{ backgroundColor: colors.secondary }}
            />
            <div 
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full opacity-35"
              style={{ backgroundColor: colors.primary }}
            />
          </>
        );
      
      default:
        return null;
    }
  };

  const isDarkBg = isDarkColor(colors.titleBg);
  const textColor = isDarkBg ? '#FFFFFF' : colors.textColor;
  const subColor = isDarkBg ? '#E0E0E0' : colors.subtitleColor;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ duration: 0.2 }}
      className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-3 z-50 pointer-events-none md:block hidden ${className}`}
    >
      {/* Preview Card Container */}
      <div 
        className="w-full h-full rounded-xl shadow-2xl overflow-hidden border-2 relative bg-white"
        style={{ 
          backgroundColor: colors.titleBg,
          borderColor: colors.accent 
        }}
      >
        {/* Decorative Shapes */}
        {renderShapes()}
        
        {/* Content Preview */}
        <div className="relative z-10 p-4 h-full flex flex-col justify-center items-center">
          {/* Team Accent Line */}
          <div 
            className="w-20 h-0.5 mb-2"
            style={{ backgroundColor: colors.accent }}
          />
          
          {/* Sample Title */}
          <h3 
            className="font-bold text-sm text-center mb-1 line-clamp-1"
            style={{ color: textColor }}
          >
            Presentation Title
          </h3>
          
          {/* Sample Subtitle */}
          <p 
            className="text-xs text-center mb-2 opacity-80"
            style={{ color: subColor }}
          >
            Subject Name
          </p>
          
          {/* Sample Content Box */}
          <div 
            className="w-full px-3 py-1.5 rounded-lg mt-auto"
            style={{ 
              backgroundColor: colors.primary,
              opacity: 0.15 
            }}
          />
          
          {/* Sample Bullets Preview */}
          <div className="w-full mt-2 space-y-1">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div 
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: colors.accent }}
                />
                <div 
                  className="h-1.5 rounded-full flex-1 opacity-40"
                  style={{ backgroundColor: textColor, maxWidth: `${60 - i * 15}%` }}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Design Name Badge */}
        <div 
          className="absolute bottom-1 right-1 px-2 py-0.5 rounded text-[8px] font-bold"
          style={{ 
            backgroundColor: colors.accent,
            color: isDarkColor(colors.accent) ? '#FFFFFF' : '#000000'
          }}
        >
          {design.name}
        </div>
      </div>
      
      {/* Arrow */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 rotate-45"
        style={{ backgroundColor: colors.titleBg, borderColor: colors.accent }}
      />
    </motion.div>
  );
};

// Helper to determine if text should be light or dark based on background
const isDarkColor = (color: string): boolean => {
  const c = color.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq < 128;
};

export default DesignPreviewCard;
