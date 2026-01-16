import React from 'react';
import { StudentData } from '../types';
import { DesignTemplate } from '../utils/designTemplates';
import { GraduationCap, BookOpen, User, Hash, School, Award } from 'lucide-react';

export type CoverPageVariant = 'classic' | 'modern' | 'artistic' | 'executive';

interface CoverPageProps {
  data: StudentData;
  design: DesignTemplate;
  universityLogoUrl: string | null;
  collegeLogoUrl: string | null;
  topic: string;
  variant?: CoverPageVariant;
}

const CoverPage: React.FC<CoverPageProps> = ({ 
  data, 
  design, 
  universityLogoUrl, 
  collegeLogoUrl, 
  topic,
  variant = 'classic'
}) => {
  const { colors } = design;

  // Classic Layout (Original)
  const renderClassic = () => (
    <>
      {/* Top Section: Logos */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginBottom: '60px' }}>
        {/* Left: College Logo */}
        <div style={{ width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {collegeLogoUrl ? (
            <img src={collegeLogoUrl} alt="College Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            null
          )}
        </div>

        {/* Right: University Logo */}
        <div style={{ width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {universityLogoUrl ? (
            <img src={universityLogoUrl} alt="University Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            (!collegeLogoUrl && !universityLogoUrl) ? <GraduationCap size={100} color={colors.primary} style={{ opacity: 0.2 }} /> : null
          )}
        </div>
      </div>

      {/* Center Section: Title & Topic */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginBottom: '80px' }}>
        
        {/* Decorative Element */}
        <div style={{ width: '100px', height: '4px', backgroundColor: colors.accent, marginBottom: '30px', borderRadius: '2px' }}></div>

        {/* Subject */}
        {data.subject && (
          <h2 style={{ fontSize: '32px', color: colors.secondary, fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '2px' }}>
            {data.subject}
          </h2>
        )}

        {/* Main Topic Title */}
        <h1 style={{ fontSize: '48px', color: colors.primary, fontWeight: 'bold', margin: '0 0 20px', lineHeight: '1.2' }}>
          {topic}
        </h1>

        {/* Decorative Element */}
        <div style={{ width: '100px', height: '4px', backgroundColor: colors.accent, marginTop: '30px', borderRadius: '2px' }}></div>
      </div>

      {/* Bottom Section: Student Data */}
      <div style={{ textAlign: 'center', padding: '40px', backgroundColor: `${colors.primary}10`, borderRadius: '20px', border: `2px solid ${colors.primary}20` }}>
        <h3 style={{ fontSize: '24px', color: colors.primary, fontWeight: 'bold', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Submitted By
        </h3>
        
        <div style={{ display: 'grid', gap: '16px', justifyContent: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: colors.textPrimary }}>
            {data.name}
          </div>
          
          {data.studentId && (
             <div style={{ fontSize: '20px', color: colors.textSecondary }}>
               ID: <span style={{ fontWeight: '600', color: colors.secondary }}>{data.studentId}</span>
             </div>
          )}

          {(data.college || data.department) && (
            <div style={{ marginTop: '16px', fontSize: '18px', color: colors.textSecondary, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {data.college && <span>{data.college}</span>}
              {data.department && <span>Department of {data.department}</span>}
            </div>
          )}

          {data.drName && (
            <div style={{ marginTop: '20px', fontSize: '18px', color: colors.textSecondary, borderTop: `1px solid ${colors.primary}20`, paddingTop: '16px' }}>
              Supervised By: <span style={{ fontWeight: 'bold', color: colors.primary }}>{data.drName}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );

  // Modern Layout (Ultra Premium - The "Strongest" Design)
  const renderModern = () => (
    <>
      {/* Background with subtle pattern and gradient */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: `linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)`, 
        zIndex: 0 
      }}>
        {/* Geometric Accent Top Right */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          width: '600px', 
          height: '600px', 
          background: `linear-gradient(225deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          clipPath: 'circle(70% at 90% 10%)',
          opacity: 0.9,
          zIndex: 1
        }} />
        
        {/* Geometric Accent Bottom Left */}
        <div style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          width: '500px', 
          height: '500px', 
          background: `linear-gradient(45deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
          clipPath: 'circle(60% at 10% 90%)',
          opacity: 0.1,
          zIndex: 1
        }} />

        {/* Diagonal Stripe */}
        <div style={{ 
          position: 'absolute', 
          top: '30%', 
          left: '-10%', 
          width: '120%', 
          height: '40px', 
          background: colors.accent,
          transform: 'rotate(-45deg)',
          opacity: 0.1,
          zIndex: 1
        }} />
      </div>

      {/* Main Glassmorphism Card */}
      <div style={{ 
        position: 'relative', 
        zIndex: 10,
        margin: '60px',
        flex: 1,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        borderRadius: '30px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Top Header Bar */}
        <div style={{ 
          padding: '40px 50px', 
          borderBottom: `1px solid ${colors.primary}10`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.5)'
        }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {collegeLogoUrl ? (
                <img src={collegeLogoUrl} alt="College" style={{ height: '70px', objectFit: 'contain' }} />
              ) : null}
              
              {(collegeLogoUrl && universityLogoUrl) && (
                <div style={{ width: '1px', height: '40px', background: `${colors.primary}30` }} />
              )}
              
              {universityLogoUrl ? (
                 <img src={universityLogoUrl} alt="University" style={{ height: '70px', objectFit: 'contain' }} />
              ) : null}
           </div>

           {(data.college || data.department) && (
             <div style={{ textAlign: 'right' }}>
               {data.college && <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: colors.primary }}>{data.college}</h3>}
               {data.department && <p style={{ margin: '4px 0 0', fontSize: '14px', color: colors.textSecondary, fontWeight: '500' }}>{data.department}</p>}
             </div>
           )}
        </div>

        {/* Central Content */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          padding: '60px 80px',
          textAlign: 'left'
        }}>
           
           {/* Subject Badge */}
           {data.subject && (
             <div style={{ 
               display: 'inline-flex',
               alignItems: 'center',
               gap: '10px',
               marginBottom: '30px',
               padding: '10px 24px',
               background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
               borderRadius: '12px',
               color: 'white',
               fontWeight: 'bold',
               fontSize: '16px',
               boxShadow: `0 10px 20px -5px ${colors.primary}40`,
               alignSelf: 'flex-start'
             }}>
               <BookOpen size={20} />
               <span>{data.subject}</span>
             </div>
           )}

           {/* Title */}
           <h1 style={{ 
             fontSize: '64px', 
             fontWeight: '900', 
             color: '#1e293b', 
             letterSpacing: '-1px', 
             lineHeight: '1.1',
             marginBottom: '30px',
             textShadow: '0 2px 0 rgba(255,255,255,0.5)'
           }}>
             {topic}
           </h1>
           
           <div style={{ width: '120px', height: '8px', background: colors.accent, borderRadius: '4px', marginBottom: '60px' }} />

           {/* Info Grid */}
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px' }}>
              
              {/* Student */}
              <div style={{ padding: '0 20px 0 0' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                    <div style={{ p: 8, borderRadius: '50%', background: `${colors.primary}15`, color: colors.primary, display: 'flex' }}><User size={20} /></div>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: colors.secondary, textTransform: 'uppercase', letterSpacing: '1px' }}>Created By</span>
                 </div>
                 <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', borderLeft: `4px solid ${colors.primary}`, paddingLeft: '20px' }}>
                    {data.name}
                    {data.studentId && <div style={{ fontSize: '16px', fontWeight: '500', color: '#64748b', marginTop: '5px' }}>ID: {data.studentId}</div>}
                 </div>
              </div>

              {/* Professor */}
              {data.drName && (
                <div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                      <div style={{ p: 8, borderRadius: '50%', background: `${colors.secondary}15`, color: colors.secondary, display: 'flex' }}><School size={20} /></div>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: colors.secondary, textTransform: 'uppercase', letterSpacing: '1px' }}>Supervised By</span>
                   </div>
                   <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', borderLeft: `4px solid ${colors.secondary}`, paddingLeft: '20px' }}>
                      {data.drName}
                   </div>
                </div>
              )}

           </div>

        </div>

        {/* Footer Bar */}
        <div style={{ 
          background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`, 
          padding: '20px 50px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'white'
        }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9 }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.accent }} />
              <span style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '1px' }}>ACADEMIC SUBMISSION</span>
           </div>
           
           <div style={{ fontSize: '12px', opacity: 0.8, fontWeight: '500' }}>
              {new Date().getFullYear()}
           </div>
        </div>

      </div>
    </>
  );

  // Artistic Layout (Creative & Dazzling)
  const renderArtistic = () => (
    <>
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: '#ffffff', 
        zIndex: 0 
      }}>
        {/* Abstract Shapes */}
        <div style={{ 
          position: 'absolute', 
          top: '-150px', 
          right: '-150px', 
          width: '600px', 
          height: '600px', 
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`,
          opacity: 0.1,
        }} />
        <div style={{ 
          position: 'absolute', 
          bottom: '-100px', 
          left: '-100px', 
          width: '500px', 
          height: '500px', 
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)`,
          opacity: 0.1,
        }} />
        {/* Accent Strip */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '60px',
          width: '12px',
          height: '100%',
          background: `linear-gradient(to bottom, ${colors.primary}, ${colors.secondary})`,
        }} />
      </div>

      <div style={{ 
        position: 'relative', 
        zIndex: 10,
        height: '100%',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        padding: '60px 120px 60px 100px'
      }}>
        
        {/* Logos floating layout */}
        <div style={{ display: 'flex', gap: '40px', marginBottom: '80px', alignItems: 'center' }}>
          {collegeLogoUrl && <img src={collegeLogoUrl} alt="College" style={{ height: '100px', objectFit: 'contain' }} />}
          {universityLogoUrl && <img src={universityLogoUrl} alt="University" style={{ height: '90px', objectFit: 'contain' }} />}
        </div>

        {/* Main Content */}
        <div style={{ marginBottom: 'auto' }}>
           <div style={{ 
             display: 'inline-block',
             marginBottom: '24px',
             padding: '8px 0',
             borderBottom: `2px solid ${colors.accent}`,
             color: colors.secondary,
             fontSize: '18px',
             fontWeight: 'bold',
             textTransform: 'uppercase',
             letterSpacing: '2px'
           }}>
             {data.subject}
           </div>

           <h1 style={{ 
             fontSize: '72px', 
             fontWeight: '900', 
             color: colors.primary, 
             lineHeight: '1',
             marginBottom: '60px',
           }}>
             {topic}
           </h1>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Submitted By</p>
                <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f172a' }}>{data.name}</h2>
                {data.studentId && <p style={{ fontSize: '20px', color: colors.secondary }}>{data.studentId}</p>}
              </div>

              {data.drName && (
                <div>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Supervised By</p>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>{data.drName}</h3>
                </div>
              )}
           </div>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderTop: `1px solid ${colors.primary}20`,
          paddingTop: '30px'
        }}>
           <div>
             <h4 style={{ margin: 0, color: colors.primary, fontWeight: 'bold' }}>{data.college}</h4>
             <p style={{ margin: 0, color: '#64748b' }}>{data.department}</p>
           </div>
           <div style={{ fontSize: '60px', fontWeight: '900', color: `rgba(0,0,0,0.03)` }}>
              {new Date().getFullYear()}
           </div>
        </div>
      </div>
    </>
  );

  // Executive Layout (Corporate & Professional)
  const renderExecutive = () => (
    <>
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: '#f1f5f9', // Slate-100
        zIndex: 0 
      }} />

      {/* Main Container Layer */}
      <div style={{ 
        position: 'absolute', 
        inset: '30px', 
        background: 'white',
        boxShadow: '0 0 40px rgba(0,0,0,0.05)',
        display: 'flex',
        zIndex: 10
      }}>
        {/* Left Sidebar */}
        <div style={{ 
          width: '35%', 
          background: colors.primary, 
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
           {/* Texture overlay on sidebar */}
           <div style={{ 
             position: 'absolute', 
             inset: 0, 
             background: 'linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.05) 50%, transparent 55%)',
             backgroundSize: '20px 20px' 
           }} />

           <div style={{ position: 'relative', zIndex: 10 }}>
              <div style={{ width: '60px', height: '6px', background: colors.accent, marginBottom: '40px' }} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
                 <div>
                    <p style={{ opacity: 0.7, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Author</p>
                    <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, lineHeight: 1.2 }}>{data.name}</h2>
                    {data.studentId && <p style={{ opacity: 0.8, fontSize: '16px', marginTop: '4px' }}>{data.studentId}</p>}
                 </div>

                 {data.drName && (
                   <div>
                      <p style={{ opacity: 0.7, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Supervisor</p>
                      <h3 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>{data.drName}</h3>
                   </div>
                 )}

                 {(data.college || data.department) && (
                   <div>
                      <p style={{ opacity: 0.7, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Affiliation</p>
                      <h4 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{data.college}</h4>
                      <p style={{ opacity: 0.8, fontSize: '14px', marginTop: '4px' }}>{data.department}</p>
                   </div>
                 )}
              </div>
           </div>

           <div style={{ position: 'relative', zIndex: 10 }}>
              <p style={{ fontSize: '14px', opacity: 0.5 }}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
           </div>
        </div>

        {/* Right Content */}
        <div style={{ 
          width: '65%', 
          padding: '60px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center'
        }}>
           {/* Logos Area */}
           <div style={{ 
             display: 'flex', 
             alignItems: 'center', 
             gap: '30px', 
             marginBottom: 'auto',
             width: '100%',
             paddingBottom: '40px',
             borderBottom: `1px solid ${colors.secondary}20`
           }}>
             {collegeLogoUrl && <img src={collegeLogoUrl} alt="College" style={{ height: '80px', objectFit: 'contain' }} />}
             {universityLogoUrl && <img src={universityLogoUrl} alt="University" style={{ height: '80px', objectFit: 'contain' }} />}
           </div>

           <div style={{ margin: 'auto 0' }}>
             {data.subject && (
               <div style={{ 
                 fontSize: '16px', 
                 color: colors.secondary, 
                 fontWeight: 'bold', 
                 textTransform: 'uppercase', 
                 letterSpacing: '2px',
                 display: 'flex',
                 alignItems: 'center',
                 gap: '12px',
                 marginBottom: '20px'
               }}>
                 <span style={{ width: '20px', height: '2px', background: colors.secondary }} />
                 {data.subject}
               </div>
             )}

             <h1 style={{ 
               fontSize: '56px', 
               fontWeight: 'bold', 
               color: '#0f172a', 
               lineHeight: '1.2',
               letterSpacing: '-0.5px' 
             }}>
               {topic}
             </h1>
           </div>

           <div style={{ marginTop: 'auto', width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
             <Award size={60} color={colors.primary} style={{ opacity: 0.1 }} />
           </div>
        </div>
      </div>
    </>
  );

  const getVariantRenderer = () => {
    switch (variant) {
      case 'modern': return renderModern();
      case 'artistic': return renderArtistic();
      case 'executive': return renderExecutive();
      default: return renderClassic();
    }
  };

  return (
    <div 
      style={{ 
        width: '100%', 
        minHeight: '1030px', // Adjusted to fit within A4 printable area (297mm - 20mm margins)
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        padding: variant === 'classic' ? '60px 50px' : '0', // Only classic needs manual padding, others handle it
        backgroundColor: 'white',
        position: 'relative',
        boxSizing: 'border-box',
        breakAfter: 'page', 
        pageBreakAfter: 'always',
        overflow: 'hidden' 
      }} 
      className="html2pdf__page-break"
      dir="ltr"
    >
      {getVariantRenderer()}
    </div>
  );
};

export default CoverPage;
