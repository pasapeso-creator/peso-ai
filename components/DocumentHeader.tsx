import React from 'react';
import { StudentData } from '../types';
import { DesignTemplate } from '../utils/designTemplates';
import { GraduationCap, User, BadgeInfo, School, FileText, Building } from 'lucide-react';

interface DocumentHeaderProps {
  data: StudentData;
  design: DesignTemplate;
  universityLogoUrl: string | null;
  collegeLogoUrl?: string | null;
}

const DocumentHeader: React.FC<DocumentHeaderProps> = ({ data, design, universityLogoUrl, collegeLogoUrl }) => {
  const { colors, headerLayout } = design;

  // --- Helper Components ---

  // 1. Logos Section
  // Renders University Logo (Right) and College Logo (Left) - or vice versa depending on preference
  // User requested: One Left, One Right.
  const renderLogos = (logoStyle: React.CSSProperties = {}, containerStyle: React.CSSProperties = {}) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '16px', ...containerStyle }} dir="ltr">
        {/* Left Logo (College) */}
        <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {collegeLogoUrl ? (
            <img src={collegeLogoUrl} alt="College Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', ...logoStyle }} />
          ) : (
            null 
          )}
        </div>

        {/* Right Logo (University) */}
        <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {universityLogoUrl ? (
            <img src={universityLogoUrl} alt="University Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', ...logoStyle }} />
          ) : (
            // Placeholder only if no logos at all, or just to balance
            (!collegeLogoUrl && !universityLogoUrl) ? <GraduationCap size={40} color={colors.primary} /> : null
          )}
        </div>
      </div>
    );
  };

  // 2. Topic Section (Centered)
  const renderTopic = (style: React.CSSProperties = {}) => {
    return (
      <div style={{ textAlign: 'center', marginBottom: '12px', ...style }}>
         <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px', color: 'inherit' }}>{data.subject}</h2>
         <div style={{ height: '3px', width: '60px', background: colors.accent, margin: '0 auto', opacity: 0.8 }}></div>
      </div>
    );
  };

  // 3. Student Data Section (Centered Bottom)
  const renderStudentData = (containerStyle: React.CSSProperties = {}, textStyle: React.CSSProperties = {}) => {
    return (
      <div style={{ textAlign: 'center', ...containerStyle }} dir="ltr">
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px', color: 'inherit', ...textStyle }}>{data.college}</h3>
        {data.department && <p style={{ fontSize: '15px', margin: '0 0 12px', opacity: 0.9, ...textStyle }}>{data.department}</p>}
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', fontSize: '14px', marginTop: '8px', ...textStyle }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={14} style={{ opacity: 0.8 }} /> {data.name}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BadgeInfo size={14} style={{ opacity: 0.8 }} /> {data.studentId}
          </span>
          {data.drName && (
             <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
               <School size={14} style={{ opacity: 0.8 }} /> {data.drName}
             </span>
          )}
        </div>
      </div>
    );
  };


  // --- Layout Implementations --- 
  // All layouts now strictly follow: Logos -> Topic -> Student Data
  // But they retain their unique background/border/shadow styles.

  switch (headerLayout) {
    case 'classic':
      return (
        <div style={{ background: colors.headerBg, padding: '24px 32px', borderBottom: `4px solid ${colors.accent}`, color: 'white' }}>
           {renderLogos({ background: 'white', padding: '4px', borderRadius: '8px' })}
           {renderTopic()}
           {renderStudentData()}
        </div>
      );

    case 'centered':
      return (
        <div style={{ background: colors.headerBg, padding: '32px', textAlign: 'center', color: 'white' }}>
           {renderLogos({ borderRadius: '12px', border: '2px solid rgba(255,255,255,0.2)', padding: '6px', background: 'white' })}
           {renderTopic()}
           {renderStudentData()}
        </div>
      );

    case 'modern':
      return (
        <div style={{ background: colors.headerBg, padding: '32px', position: 'relative', overflow: 'hidden', color: 'white' }}>
          {/* Decorative Circles */}
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '180px', height: '180px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            {renderLogos({ borderRadius: '16px', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', background: 'white', padding: '6px' })}
            {renderTopic()}
            {renderStudentData()}
          </div>
        </div>
      );

    case 'minimal':
      return (
        <div style={{ background: 'white', padding: '28px 32px', borderBottom: `3px solid ${colors.primary}`, color: colors.textPrimary }}>
           {renderLogos({ height: '60px', width: '60px' })} {/* Logos darker or natural here */}
           {renderTopic({ color: colors.primary })}
           {renderStudentData({ color: colors.textPrimary })}
        </div>
      );

    case 'corporate':
      return (
        <div style={{ display: 'flex', background: 'white', borderBottom: `1px solid ${colors.accent}40` }}>
          <div style={{ width: '12px', background: colors.headerBg }}></div>
          <div style={{ flex: 1, padding: '24px 32px' }}>
             {renderLogos({ border: `1px solid ${colors.accent}40`, padding: '4px', borderRadius: '4px' })}
             
             {/* Corporate specific styling override */}
             <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <span style={{ background: colors.primary, color: 'white', padding: '6px 16px', borderRadius: '4px', fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                  {data.subject}
                </span>
             </div>

             {renderStudentData({}, { color: colors.secondary })}
          </div>
        </div>
      );

    case 'elegant':
      return (
        <div style={{ background: colors.headerBg, padding: '32px', position: 'relative', color: 'white' }}>
          {/* Corner borders */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', width: '30px', height: '30px', borderTop: `2px solid ${colors.accent}`, borderLeft: `2px solid ${colors.accent}` }}></div>
          <div style={{ position: 'absolute', top: '12px', right: '12px', width: '30px', height: '30px', borderTop: `2px solid ${colors.accent}`, borderRight: `2px solid ${colors.accent}` }}></div>
          <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '30px', height: '30px', borderBottom: `2px solid ${colors.accent}`, borderLeft: `2px solid ${colors.accent}` }}></div>
          <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '30px', height: '30px', borderBottom: `2px solid ${colors.accent}`, borderRight: `2px solid ${colors.accent}` }}></div>

          {renderLogos({ borderRadius: '50%', border: '4px solid rgba(255,255,255,0.3)', background: 'white', padding: '8px' })}
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'serif', fontSize: '28px', letterSpacing: '2px', margin: '0 0 10px', fontStyle: 'italic' }}>{data.subject}</h2>
            <div style={{ width: '40px', height: '2px', background: colors.accent, margin: '0 auto' }}></div>
          </div>

          {renderStudentData()}
        </div>
      );

    case 'tech':
      return (
        <div style={{ background: colors.headerBg, padding: '28px 32px', position: 'relative', overflow: 'hidden', color: 'white', fontFamily: 'monospace' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${colors.accent}15 1px, transparent 1px), linear-gradient(90deg, ${colors.accent}15 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
             {renderLogos({ border: `1px dashed ${colors.accent}`, padding: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px' })}
             
             <div style={{ textAlign: 'center', marginBottom: '16px', border: `1px solid ${colors.accent}`, padding: '8px', background: 'rgba(0,0,0,0.3)', display: 'inline-block', width: '100%' }}>
               <span style={{ color: colors.accent }}>&lt;Subject&gt;</span> {data.subject} <span style={{ color: colors.accent }}>&lt;/Subject&gt;</span>
             </div>

             {renderStudentData({}, { fontFamily: 'monospace' })}
          </div>
        </div>
      );

    case 'nature':
      return (
        <div style={{ background: colors.headerBg, padding: '32px', position: 'relative', overflow: 'hidden', color: 'white' }}>
           <div style={{ position: 'absolute', top: '-30px', right: '10%', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '60% 40% 50% 50%' }}></div>
           <div style={{ position: 'absolute', bottom: '-20px', left: '5%', width: '80px', height: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '50% 40% 60% 40%' }}></div>
           
           <div style={{ position: 'relative', zIndex: 1 }}>
             {renderLogos({ borderRadius: '50% 50% 50% 0', border: '3px solid rgba(255,255,255,0.3)', background: 'white', padding: '6px' })}
             {renderTopic()}
             {renderStudentData()}
           </div>
        </div>
      );

    case 'geometric':
      return (
        <div style={{ background: colors.headerBg, padding: '0', position: 'relative', overflow: 'hidden', color: 'white' }}>
          <div style={{ position: 'absolute', top: '0', right: '0', width: '0', height: '0', borderTop: `100px solid rgba(255,255,255,0.05)`, borderLeft: '100px solid transparent' }}></div>
          
          <div style={{ padding: '32px', position: 'relative', zIndex: 1 }}>
             {renderLogos({ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)', background: 'white', padding: '4px' })}
             {renderTopic()}
             {renderStudentData()}
          </div>
        </div>
      );

    case 'wave':
      return (
        <div style={{ background: colors.headerBg, paddingBottom: '20px', position: 'relative', color: 'white' }}>
          <div style={{ padding: '24px 32px 40px' }}>
             {renderLogos({ borderRadius: '12px', background: 'white', padding: '6px' })}
             {renderTopic()}
             <div style={{ paddingBottom: '20px' }}>{renderStudentData()}</div>
          </div>
           {/* Wave at bottom */}
           <svg style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '40px' }} viewBox="0 0 1200 40" preserveAspectRatio="none">
            <path d="M0,20 C300,45 400,-5 600,20 C800,45 900,-5 1200,20 L1200,40 L0,40 Z" fill="white" opacity="0.9"/>
          </svg>
        </div>
      );

    default:
      return null;
  }
};

export default DocumentHeader;
