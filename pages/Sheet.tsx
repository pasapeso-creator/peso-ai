import React, { useState, useEffect, useRef } from 'react';
import { StudentData } from '../types';
import InputForm from '../components/InputForm';
import ProgressIndicator from '../components/ProgressIndicator';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { solveSheet } from '../services/geminiService';
import { exportToWord } from '../utils/wordExport';
import { FileDown, Loader2, Sparkles, FileSpreadsheet, Palette, Check, Upload, FileText, Image as ImageIcon, GraduationCap, User, Calendar, BadgeInfo, School, FileType, Shuffle, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '../components/Toast';
import { authService } from '../services/authService';
import { DESIGN_TEMPLATES, getRandomDesign, DesignTemplate } from '../utils/designTemplates';
import CoverPage, { CoverPageVariant } from '../components/CoverPage';
import { CheckCircle2 } from 'lucide-react';

declare global {
  interface Window {
    renderMathInElement: (element: HTMLElement, options: any) => void;
    html2pdf: any;
  }
}

interface Props {
  onDeductCredits: () => boolean;
}

// Use shared design templates

const Sheet: React.FC<Props> = ({ onDeductCredits }) => {
  const { showToast } = useToast();
  const [data, setData] = useState<StudentData>({
    name: '', studentId: '', subject: '', college: '', drName: '', department: '', logo: null
  });
  const [sheetFile, setSheetFile] = useState<File | null>(null);
  const [sheetPreview, setSheetPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingWord, setIsDownloadingWord] = useState(false);
  const [progressStage, setProgressStage] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [universityLogoUrl, setUniversityLogoUrl] = useState<string | null>(null);
  const [collegeLogoUrl, setCollegeLogoUrl] = useState<string | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<DesignTemplate>(DESIGN_TEMPLATES[0]);
  const colors = selectedDesign.colors;
  const [showAllDesigns, setShowAllDesigns] = useState(false);
  const [coverStyle, setCoverStyle] = useState<CoverPageVariant>('classic');
  const [autoRandomDesign, setAutoRandomDesign] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleRandomDesign = () => {
    const newDesign = getRandomDesign();
    setSelectedDesign(newDesign);
    showToast(`تم اختيار تصميم "${newDesign.nameAr}" عشوائياً! 🎨`, "success");
  };

  // Convert university logo to base64 when uploaded
  useEffect(() => {
    if (data.logo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUniversityLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(data.logo);
    } else {
      setUniversityLogoUrl(null);
    }
  }, [data.logo]);

  // Convert college logo to base64
  useEffect(() => {
    if (data.collegeLogo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCollegeLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(data.collegeLogo);
    } else {
      setCollegeLogoUrl(null);
    }
  }, [data.collegeLogo]);

  // Handle sheet file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSheetFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSheetPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        setSheetPreview('pdf');
      }
    }
  };

  // Render math formulas when result changes
  useEffect(() => {
    if (result && contentRef.current && window.renderMathInElement) {
      setTimeout(() => {
        window.renderMathInElement(contentRef.current!, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false }
          ],
          throwOnError: false
        });
      }, 100);
    }
  }, [result]);

  const handleGenerate = async () => {
    if (!data.name) {
      showToast("يا غالي، اكتب اسمك عشان نحل الشيت!", "error");
      return;
    }
    
    if (!sheetFile) {
      showToast("يا ريس، ارفع صورة الشيت أو ملف PDF عشان نحله!", "error");
      return;
    }
    
    // Check Trial / Subscription Logic
    const user = await authService.getCurrentProfile();
    if (user) {
       const allowed = await authService.checkAndMarkTrial(user.id, 'sheet');
       if (!allowed) {
          showToast("عفواً، لقد استهلكت التجربة المجانية لهذه الميزة. يرجى الاشتراك للمتابعة 👑", "error");
          return;
       }
    }

    if (!onDeductCredits()) return;

    // Auto-select random design if enabled
    if (autoRandomDesign) {
      const randomDesign = getRandomDesign();
      setSelectedDesign(randomDesign);
    }

    setIsLoading(true);
    setResult(null);
    setProgressStage(0);
    setElapsedTime(0);

    // Start elapsed time counter
    const startTime = Date.now();
    const timeInterval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    // Progress stages simulation
    const progressInterval = setInterval(() => {
      setProgressStage(prev => Math.min(prev + 1, 3));
    }, 5000);

    try {
      setProgressStage(0); // Analyzing
      const prompt = `You are an expert academic tutor. Analyze this worksheet/sheet and provide COMPLETE, DETAILED solutions for ALL questions.

IMPORTANT INSTRUCTIONS:
1. Solve EVERY question in the sheet - don't skip any
2. Number each answer clearly (Q1, Q2, Q3, etc.)
3. Show step-by-step solutions with clear explanations
4. Use proper mathematical notation with LaTeX: $...$ for inline, $$...$$ for display math
5. Format the output professionally with headers and sections
6. If there are multiple choice questions, explain why each answer is correct
7. For calculations, show all intermediate steps

OUTPUT FORMAT:
# Sheet Solutions

## Question 1
[Full solution with steps]

## Question 2
[Full solution with steps]

... and so on for ALL questions

Student: ${data.name}
Subject: ${data.subject || 'General'}
College: ${data.college || 'University'}

IMPORTANT: Output must be in ENGLISH. Be thorough and complete.`;

      setProgressStage(3); // Finalizing
      const answer = await solveSheet(sheetFile, prompt);
      setResult(answer);
      showToast("تم حل الشيت بنجاح! 🎉", "success", 4000, "/logo.png");
    } catch (e: any) {
      console.error("Sheet solving error:", e);
      showToast(e.message || "يا ساتر، السيرفر مهنج شوية.. جرب تاني كمان شوية", "error");
    } finally {
      clearInterval(timeInterval);
      clearInterval(progressInterval);
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!contentRef.current) {
      showToast("مفيش حل جاهز للتحميل دلوقتي.. حل الشيت الأول!", "info");
      return;
    }
    
    setIsDownloading(true);
    
    const element = contentRef.current;
    const filename = `${data.name || 'Sheet'}-Solution.pdf`;
    
    try {
      // Clone the element to work with
      const clone = element.cloneNode(true) as HTMLElement;
      
      // Create a temporary container with proper styling
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '210mm';
      container.style.background = 'white';
      container.appendChild(clone);
      document.body.appendChild(container);

      // Wait a bit for rendering
      await new Promise(resolve => setTimeout(resolve, 500));

      // Use html2pdf with proper options
      const opt = {
        margin: [10, 10, 10, 10],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: false,
          allowTaint: true,
          backgroundColor: '#ffffff',
          scrollX: 0,
          scrollY: 0,
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { mode: 'avoid-all' }
      };

      await window.html2pdf().set(opt).from(clone).save();
      
      // Cleanup
      document.body.removeChild(container);
      
      showToast("تم تحميل الحل بنجاح! 🎉", "success");
    } catch (err) {
      console.error('PDF Error:', err);
      showToast("جاري فتح نافذة الطباعة...", "info");
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadWord = async () => {
    if (!contentRef.current) {
      showToast("مفيش حل جاهز للتحميل.. حل الشيت الأول!", "info");
      return;
    }
    
    setIsDownloadingWord(true);
    
    try {
      await exportToWord(contentRef.current, {
        filename: `${data.name || 'Sheet'}-Solution.doc`,
        title: 'Sheet Solution',
        author: data.name,
        design: selectedDesign
      });
      showToast("تم تحميل ملف Word بنجاح! 🎉", "success");
    } catch (err) {
      console.error('Word Error:', err);
      showToast("حصل مشكلة في تحميل Word.. جرب PDF", "error");
    } finally {
      setIsDownloadingWord(false);
    }
  };

  const formatContent = (text: string) => {
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Main title
      if (line.startsWith('# ')) {
        return (
          <h1 key={index} style={{ 
            fontSize: '22px', 
            fontWeight: 'bold', 
            color: colors.primary, 
            marginBottom: '16px', 
            marginTop: '24px', 
            borderBottom: `3px solid ${colors.accent}`, 
            paddingBottom: '10px',
            letterSpacing: '0.5px'
          }}>
            {line.replace(/^#\s*/, '')}
          </h1>
        );
      }
      // Section headers (Questions)
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            color: colors.secondary, 
            marginBottom: '12px', 
            marginTop: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            borderLeft: `4px solid ${colors.accent}`,
            paddingLeft: '12px',
            background: `linear-gradient(to right, ${colors.accent}15, transparent)`,
            paddingTop: '8px',
            paddingBottom: '8px'
          }}>
            {line.replace(/^##\s*/, '')}
          </h2>
        );
      }
      // Subsection headers
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: colors.primary, 
            marginBottom: '8px', 
            marginTop: '14px',
            fontStyle: 'italic'
          }}>
            {line.replace(/^###\s*/, '')}
          </h3>
        );
      }
      // Bold text handling
      if (line.includes('**')) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={index} style={{ 
            marginBottom: '12px', 
            lineHeight: '1.9', 
            textAlign: 'justify', 
            color: colors.textPrimary,
            fontSize: '14px'
          }}>
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i} style={{ fontWeight: 'bold', color: colors.primary }}>{part}</strong> : part
            )}
          </p>
        );
      }
      // Bullet points
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <div key={index} style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            marginBottom: '10px', 
            marginLeft: '16px',
            gap: '10px'
          }}>
            <span style={{ 
              color: colors.accent, 
              fontSize: '18px', 
              lineHeight: '1.5'
            }}>•</span>
            <p style={{ 
              color: colors.textPrimary, 
              lineHeight: '1.8',
              fontSize: '14px',
              flex: 1
            }}>
              {line.replace(/^[-*]\s*/, '')}
            </p>
          </div>
        );
      }
      // Numbered list
      if (line.match(/^\d+\.\s/)) {
        const num = line.match(/^(\d+)\./)?.[1];
        return (
          <div key={index} style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            marginBottom: '10px', 
            marginLeft: '16px',
            gap: '10px'
          }}>
            <span style={{ 
              color: 'white', 
              background: colors.accent,
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              flexShrink: 0
            }}>{num}</span>
            <p style={{ 
              color: colors.textPrimary, 
              lineHeight: '1.8',
              fontSize: '14px',
              flex: 1
            }}>
              {line.replace(/^\d+\.\s*/, '')}
            </p>
          </div>
        );
      }
      // Regular paragraph
      if (line.trim()) {
        return (
          <p key={index} style={{ 
            marginBottom: '12px', 
            lineHeight: '1.9', 
            textAlign: 'justify', 
            color: colors.textPrimary,
            fontSize: '14px'
          }}>
            {line}
          </p>
        );
      }
      return <br key={index} />;
    });
  };



  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-orange-600 rounded-xl">
            <FileSpreadsheet className="text-white" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Sheet Solver
            </h2>
            <p className="text-slate-500 text-sm">Upload your worksheet and get complete solutions with professional PDF export</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div>
          <InputForm data={data} onChange={setData} />
          
          {/* Sheet Upload & Design Selection Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/50 shadow-2xl mt-6 backdrop-blur-sm">
            
            {/* Sheet Upload */}
            <div className="mb-6">
              <label className="block text-slate-300 text-sm font-semibold mb-3 flex items-center gap-2">
                <Upload size={16} className="text-orange-400" />
                Upload Worksheet (Image or PDF)
              </label>
              <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center hover:border-orange-500 hover:bg-orange-500/5 transition-all cursor-pointer bg-slate-900/50 relative group">
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
                
                {sheetFile ? (
                  <div className="flex flex-col items-center">
                    {sheetPreview && sheetPreview !== 'pdf' ? (
                      <div className="w-48 h-48 rounded-lg overflow-hidden mb-3 border-2 border-orange-500">
                        <img 
                          src={sheetPreview} 
                          alt="Sheet Preview" 
                          className="w-full h-full object-contain bg-white"
                        />
                      </div>
                    ) : sheetPreview === 'pdf' ? (
                      <div className="w-24 h-24 rounded-lg bg-red-500/20 flex items-center justify-center mb-3 border-2 border-red-500">
                        <FileText className="text-red-500" size={40} />
                      </div>
                    ) : null}
                    <span className="text-orange-400 font-medium">{sheetFile.name}</span>
                    <span className="text-xs text-slate-500 mt-1">Click to change</span>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-slate-800 rounded-xl mb-3 group-hover:bg-orange-500/20 transition-colors">
                      <ImageIcon className="text-slate-400 group-hover:text-orange-400 transition-colors" size={40} />
                    </div>
                    <span className="text-sm text-slate-400 group-hover:text-orange-400 transition-colors font-medium">
                      Click or drag to upload sheet
                    </span>
                    <span className="text-xs text-slate-500 mt-1">Supports: PNG, JPG, PDF</span>
                  </>
                )}
              </div>
            </div>

            {/* PDF Design Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-slate-300 text-sm font-semibold flex items-center gap-2">
                  <Palette size={16} className="text-orange-400" />
                  Choose PDF Design
                </label>
                <button
                  onClick={handleRandomDesign}
                  className="text-xs bg-gradient-to-r from-orange-600 to-amber-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:from-orange-500 hover:to-amber-500 transition-all"
                >
                  <Shuffle size={12} />
                  Random
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(showAllDesigns ? DESIGN_TEMPLATES : DESIGN_TEMPLATES.slice(0, 8)).map((design) => (
                  <button
                    key={design.id}
                    onClick={() => setSelectedDesign(design)}
                    className={`relative p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1.5 text-center group
                      ${selectedDesign.id === design.id 
                        ? 'border-orange-500 bg-orange-500/20 shadow-lg shadow-orange-500/20' 
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-700/50'}`}
                  >
                    <div className="text-2xl flex justify-center">{design.icon}</div>
                    
                    {/* Color Preview */}
                    <div className="flex gap-0.5">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: design.colors.primary}}></div>
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: design.colors.secondary}}></div>
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: design.colors.accent}}></div>
                    </div>
                    
                    <span className={`text-xs font-bold ${selectedDesign.id === design.id ? 'text-white' : 'text-slate-300'}`}>
                      {design.name}
                    </span>
                    
                    {selectedDesign.id === design.id && (
                      <div className="absolute top-1.5 right-1.5 text-orange-400"><Check size={12} /></div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Show More/Less Button */}
              {DESIGN_TEMPLATES.length > 8 && (
                <button
                  onClick={() => setShowAllDesigns(!showAllDesigns)}
                  className="w-full mt-3 py-2 text-sm text-slate-400 hover:text-white flex items-center justify-center gap-2 transition-colors"
                >
                  {showAllDesigns ? (
                    <>Show Less <ChevronUp size={16} /></>
                  ) : (
                    <>Show All {DESIGN_TEMPLATES.length} Designs <ChevronDown size={16} /></>
                  )}
                </button>
              )}
            </div>
            
            {/* Cover Page Style Selection */}
            <div className="mb-6 border-t border-slate-700 pt-6 mt-4">
               <label className="block text-slate-300 text-sm font-semibold mb-3 flex items-center gap-2">
                 <FileText size={16} className="text-orange-400" />
                 Cover Page Style
               </label>
               <div className="grid grid-cols-2 gap-4">
                 <button
                   onClick={() => setCoverStyle('classic')}
                   className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 group
                     ${coverStyle === 'classic' 
                       ? 'border-orange-500 bg-orange-500/10' 
                       : 'border-slate-700 bg-slate-800/30 hover:bg-slate-700/50'}`}
                 >
                   <div className={`w-full max-w-[80px] aspect-[0.7] border rounded flex flex-col items-center justify-center gap-1 ${coverStyle === 'classic' ? 'border-orange-500 bg-white' : 'border-slate-600 bg-slate-700'}`}>
                     <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                     <div className="w-12 h-2 bg-slate-200 rounded-sm"></div>
                     <div className="w-10 h-2 bg-slate-200 rounded-sm"></div>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className={`text-sm font-bold ${coverStyle === 'classic' ? 'text-orange-400' : 'text-slate-400'}`}>Classic</span>
                     {coverStyle === 'classic' && <CheckCircle2 size={16} className="text-orange-500" />}
                   </div>
                 </button>

                 <button
                   onClick={() => setCoverStyle('modern')}
                   className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 group
                     ${coverStyle === 'modern' 
                       ? 'border-orange-500 bg-orange-500/10' 
                       : 'border-slate-700 bg-slate-800/30 hover:bg-slate-700/50'}`}
                 >
                   <div className={`w-full max-w-[80px] aspect-[0.7] border rounded flex relative overflow-hidden ${coverStyle === 'modern' ? 'border-orange-500 bg-white' : 'border-slate-600 bg-slate-700'}`}>
                     <div className="absolute left-0 top-0 bottom-0 w-3 bg-orange-500/50"></div>
                     <div className="absolute top-4 left-4 right-0 h-8 bg-slate-200"></div>
                   </div>
                   <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${coverStyle === 'modern' ? 'text-orange-400' : 'text-slate-400'}`}>Modern</span>
                    {coverStyle === 'modern' && <CheckCircle2 size={16} className="text-orange-500" />}
                   </div>
                 </button>

                 <button
                   onClick={() => setCoverStyle('artistic')}
                   className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 group
                     ${coverStyle === 'artistic' 
                       ? 'border-orange-500 bg-orange-500/10' 
                       : 'border-slate-700 bg-slate-800/30 hover:bg-slate-700/50'}`}
                 >
                   <div className={`w-full max-w-[80px] aspect-[0.7] border rounded flex relative overflow-hidden ${coverStyle === 'artistic' ? 'border-orange-500 bg-white' : 'border-slate-600 bg-slate-700'}`}>
                     <div className="absolute -top-4 -right-4 w-12 h-12 bg-orange-500/30 rounded-full"></div>
                     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-8 bg-slate-200 rounded"></div>
                   </div>
                   <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${coverStyle === 'artistic' ? 'text-orange-400' : 'text-slate-400'}`}>Artistic</span>
                    {coverStyle === 'artistic' && <CheckCircle2 size={16} className="text-orange-500" />}
                   </div>
                 </button>

                 <button
                   onClick={() => setCoverStyle('executive')}
                   className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 group
                     ${coverStyle === 'executive' 
                       ? 'border-orange-500 bg-orange-500/10' 
                       : 'border-slate-700 bg-slate-800/30 hover:bg-slate-700/50'}`}
                 >
                   <div className={`w-full max-w-[80px] aspect-[0.7] border rounded flex relative overflow-hidden ${coverStyle === 'executive' ? 'border-orange-500 bg-white' : 'border-slate-600 bg-slate-700'}`}>
                     <div className="absolute left-0 top-0 bottom-0 w-8 bg-orange-500/80"></div>
                     <div className="absolute top-4 left-10 right-2 h-2 bg-slate-200 rounded-sm"></div>
                     <div className="absolute top-8 left-10 right-4 h-2 bg-slate-200 rounded-sm opacity-50"></div>
                   </div>
                   <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${coverStyle === 'executive' ? 'text-orange-400' : 'text-slate-400'}`}>Executive</span>
                    {coverStyle === 'executive' && <CheckCircle2 size={16} className="text-orange-500" />}
                   </div>
                 </button>
               </div>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full mt-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              {isLoading ? 'Solving Sheet...' : 'Solve Sheet'}
            </button>
          </div>
        </div>

        {/* Progress Indicator - Shown during loading or success */}
        {(isLoading || result) && (
          <div className="animate-fade-in mb-8">
            <ProgressIndicator 
              stages={[
                { id: 'analyzing', label: 'تحليل الشيت والصور' },
                { id: 'generating', label: 'توليد الحلول الأكاديمية' },
                { id: 'formatting', label: 'تنسيق الخطوات' },
                { id: 'finalizing', label: 'إنهاء العملية' },
              ]}
              currentStage={result ? 4 : progressStage}
              estimatedTime={40}
              elapsedTime={elapsedTime}
              isComplete={!!result}
            />
            {isLoading && (
              <div className="mt-6">
                <LoadingSkeleton variant="pdf" />
              </div>
            )}
          </div>
        )}

        {/* Result Preview - Professional PDF Design */}
        {result && !isLoading && (
          <div className="animate-fade-in-up">
            {/* PDF Container */}
            <div 
              ref={contentRef}
              className="bg-white text-slate-900 rounded-lg shadow-2xl overflow-hidden"
              style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
            >
              {/* Decorative Top Border */}
              <div style={{ height: '10px', background: colors.borderTop }}></div>
              
              {/* Professional Header - Now Cover Page */}
              <CoverPage 
                data={data} 
                design={selectedDesign} 
                universityLogoUrl={universityLogoUrl} 
                collegeLogoUrl={collegeLogoUrl} 
                topic="Sheet Solutions"
                variant={coverStyle}
              />

              {/* Title Section Removed */}

              {/* Content Area */}
              <div style={{ padding: '32px', background: 'white' }} dir="ltr">
                <div style={{ fontSize: '14px', lineHeight: '1.8', color: colors.textPrimary }}>
                  {formatContent(result)}
                </div>
              </div>

              {/* Footer */}
              <div style={{ background: colors.footerBg, padding: '20px 32px', borderTop: `2px solid ${colors.accent}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: colors.textSecondary }} dir="ltr">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Branding Removed */}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    <span style={{ fontWeight: '500' }}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              {/* Decorative Bottom Border */}
              <div style={{ height: '10px', background: colors.borderBottom }}></div>
            </div>

            {/* Download Buttons */}
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <button 
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white px-8 py-3.5 rounded-xl flex items-center gap-3 transition-all disabled:opacity-50 font-bold text-lg shadow-lg shadow-orange-600/25"
              >
                {isDownloading ? <Loader2 className="animate-spin" size={22} /> : <FileDown size={22} />}
                {isDownloading ? 'Generating...' : 'Download PDF'}
              </button>
              <button 
                onClick={handleDownloadWord}
                disabled={isDownloadingWord}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-3.5 rounded-xl flex items-center gap-3 transition-all disabled:opacity-50 font-bold text-lg shadow-lg shadow-indigo-600/25"
              >
                {isDownloadingWord ? <Loader2 className="animate-spin" size={22} /> : <FileType size={22} />}
                {isDownloadingWord ? 'Generating...' : 'Download Word'}
              </button>
            </div>
            <p className="text-center text-sm text-slate-400 mt-4">
              <Sparkles className="w-4 h-4 text-slate-400" /> Your solution will be exported with the "{selectedDesign.name}" design
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sheet;
