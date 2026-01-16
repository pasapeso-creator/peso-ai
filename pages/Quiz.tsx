import React, { useState, useEffect, useRef } from 'react';
import { QuizData } from '../types';
import { solveQuiz, fileToGenerativePart } from '../services/geminiService';
import { exportToWord } from '../utils/wordExport';
import ProgressIndicator from '../components/ProgressIndicator';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { Image as ImageIcon, Loader2, CheckCircle2, FileDown, Sparkles, Calculator, BookOpen, User, Hash, FileType, Palette, Shuffle, Check, GraduationCap, BadgeInfo, Calendar, School, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { useToast } from '../components/Toast';
import { DESIGN_TEMPLATES, getRandomDesign, DesignTemplate } from '../utils/designTemplates';
import CoverPage, { CoverPageVariant } from '../components/CoverPage';

declare global {
  interface Window {
    renderMathInElement: (element: HTMLElement, options: any) => void;
    html2pdf: any;
  }
}

interface Props {
  onDeductCredits: () => boolean;
}

const Quiz: React.FC<Props> = ({ onDeductCredits }) => {
  const { showToast } = useToast();
  const [data, setData] = useState<QuizData>({ name: '', studentId: '', questionText: '' });

  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [universityLogoUrl, setUniversityLogoUrl] = useState<string | null>(null); // Not used but consistent
  const [collegeLogoUrl, setCollegeLogoUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingWord, setIsDownloadingWord] = useState(false);
  const [progressStage, setProgressStage] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedDesign, setSelectedDesign] = useState<DesignTemplate>(DESIGN_TEMPLATES[0]);
  const [showAllDesigns, setShowAllDesigns] = useState(false);
  const [coverStyle, setCoverStyle] = useState<CoverPageVariant>('classic');
  const contentRef = useRef<HTMLDivElement>(null);

  const colors = selectedDesign.colors;

  const handleRandomDesign = () => {
    const newDesign = getRandomDesign();
    setSelectedDesign(newDesign);
    showToast(`تم اختيار تصميم "${newDesign.nameAr}" عشوائياً! 🎨`, "success");
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setData({ ...data, [name]: files[0] });
    }
  };

  const handleSolve = async () => {
    if ((!data.questionText && !data.questionImage) || !data.name) {
      showToast("يا عبقري، فين السؤال؟ لازم تكتب السؤال أو ترفع صورته وكمان تكتب اسمك!", "error");
      return;
    }
    if (!onDeductCredits()) return;



    setIsLoading(true);
    setResult('');
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
    }, 3000);

    try {
      setProgressStage(0); // Analyzing
      let imageBase64;
      if (data.questionImage) {
        imageBase64 = await fileToGenerativePart(data.questionImage);
      }
      
      const answer = await solveQuiz(
        `Solve this quiz question in ENGLISH. Provide a detailed academic explanation.

IMPORTANT CONTEXT-AWARE FORMATTING:
- If the question involves Mathematics, Physics, Chemistry, Engineering, Statistics, or any quantitative problem:
  * Use LaTeX notation for mathematical formulas: $...$ for inline math, $$...$$ for display/block math
  * Show step-by-step calculations with proper mathematical notation
  * Examples: $x^2 + y^2 = r^2$, $\\frac{a}{b}$, $\\int$, $\\sum$

- If the question is about Literature, History, Geography, Languages, Biology (non-quantitative), or general knowledge:
  * DO NOT use mathematical notation
  * Provide clear, well-structured textual explanation
  * Focus on facts, analysis, and reasoning

Show step-by-step solution with clear explanations.

Question: ${data.questionText || "See image."}

Output must be in English. ONLY use LaTeX mathematical notation if the question genuinely involves mathematical calculations.`, 
        imageBase64
      );
      
      setProgressStage(3); // Finalizing
      setResult(answer);
    } catch (e) {
      showToast("يا ساتر، حصلت مشكلة وأنا بحل السؤال.. اتأكد من السؤال كدا وجرب تاني", "error");
    } finally {
      clearInterval(timeInterval);
      clearInterval(progressInterval);
      setIsLoading(false);
    }
  };

  const handleDownloadWord = async () => {
    if (!contentRef.current) {
      showToast("مفيش حل جاهز للتحميل.. حل السؤال الأول!", "info");
      return;
    }
    
    setIsDownloadingWord(true);
    
    try {
      // For Quiz, we extract text content mostly but try to keep structure
      await exportToWord(contentRef.current, {
        filename: `${data.name || 'Quiz'}-Solution.doc`,
        title: 'Quiz Solution',
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

  const handleDownloadPDF = async () => {
    if (!contentRef.current) {
      showToast("مفيش حل جاهز للتحميل دلوقتي.. حل السؤال الأول!", "info");
      return;
    }
    
    setIsDownloading(true);
    
    const element = contentRef.current;
    const filename = `${data.name || 'Quiz'}-Solution.pdf`;
    
    try {
      // Clone the element to work with
      const clone = element.cloneNode(true) as HTMLElement;
      
      // Create a temporary container with proper styling
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '210mm'; // A4 width
      container.style.background = 'white';
      container.appendChild(clone);
      document.body.appendChild(container);

      // Wait a bit for rendering (especially math)
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
      
      showToast("تم تحميل الـ PDF بنجاح! 🎉", "success");
    } catch (err) {
      console.error('PDF Error:', err);
      // Fallback to window print if html2pdf fails
      showToast("جاري فتح نافذة الطباعة (Fallback)...", "info");
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const formatContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return (
          <h1 key={index} style={{ fontSize: '20px', fontWeight: 'bold', color: colors.primary, marginBottom: '12px', marginTop: '16px', borderBottom: `1px solid ${colors.accent}`, paddingBottom: '8px' }}>
            {line.replace(/^#\s*/, '')}
          </h1>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} style={{ fontSize: '18px', fontWeight: 'bold', color: colors.secondary, marginBottom: '10px', marginTop: '14px' }}>
            {line.replace(/^##\s*/, '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} style={{ fontSize: '16px', fontWeight: '600', color: colors.accent, marginBottom: '8px', marginTop: '12px' }}>
            {line.replace(/^###\s*/, '')}
          </h3>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={index} style={{ marginBottom: '8px', marginLeft: '16px', listStyleType: 'disc', color: colors.textPrimary }}>
            {line.replace(/^[-*]\s*/, '')}
          </li>
        );
      }
      if (line.match(/^\d+\.\s/)) {
        return (
          <li key={index} style={{ marginBottom: '8px', marginLeft: '16px', listStyleType: 'decimal', color: colors.textPrimary }}>
            {line.replace(/^\d+\.\s*/, '')}
          </li>
        );
      }
      if (line.includes('**')) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={index} style={{ marginBottom: '12px', lineHeight: '1.8', color: colors.textPrimary }}>
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i} style={{ fontWeight: 'bold', color: colors.primary }}>{part}</strong> : part
            )}
          </p>
        );
      }
      if (line.trim()) {
        return (
          <p key={index} style={{ marginBottom: '12px', lineHeight: '1.8', color: colors.textPrimary }}>
            {line}
          </p>
        );
      }
      return <br key={index} />;
    });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      {/* Page Header - Simple */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-blue-600 rounded-xl">
            <Calculator className="text-white" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Quiz Solver</h2>
            <p className="text-slate-500 text-sm">Get detailed AI solutions for your questions</p>
          </div>
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-700/50 backdrop-blur-sm">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2 flex items-center gap-2">
                <User size={14} className="text-green-400" />
                Student Name
              </label>
              <div className="flex items-center bg-slate-900/80 rounded-xl border-2 border-slate-600 focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/20 overflow-hidden transition-all">
                <span className="px-4 py-3 bg-slate-800/50 border-r border-slate-600 text-slate-400"><User size={18}/></span>
                <input 
                   placeholder="Ex: Mohamed Ahmed" 
                   className="w-full bg-transparent p-4 text-white focus:outline-none placeholder:text-slate-500"
                   value={data.name}
                   onChange={(e) => setData({...data, name: e.target.value})}
                   dir="ltr"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2 flex items-center gap-2">
                <Hash size={14} className="text-green-400" />
                Student ID
              </label>
              <div className="flex items-center bg-slate-900/80 rounded-xl border-2 border-slate-600 focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/20 overflow-hidden transition-all">
                <span className="px-4 py-3 bg-slate-800/50 border-r border-slate-600 text-slate-400"><Hash size={18}/></span>
                <input 
                   placeholder="20230000" 
                   className="w-full bg-transparent p-4 text-white focus:outline-none placeholder:text-slate-500"
                   value={data.studentId}
                   onChange={(e) => setData({...data, studentId: e.target.value})}
                   dir="ltr"
                />
              </div>
            </div>
         </div>

         <div className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2 flex items-center gap-2">
                <BookOpen size={14} className="text-green-400" />
                Question Text
              </label>
              <textarea 
                 className="w-full h-36 bg-slate-900/80 border-2 border-slate-600 rounded-xl p-4 text-white focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/20 placeholder:text-slate-500"
                 placeholder="Paste question text here (in English)..."
                 value={data.questionText}
                 onChange={(e) => setData({...data, questionText: e.target.value})}
                 dir="ltr"
              />
            </div>
            
            <div className="relative border-2 border-dashed border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-slate-700/30 hover:border-green-500/50 transition-all cursor-pointer group">
               <input type="file" name="questionImage" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
               <div className="p-3 bg-slate-800 rounded-xl mb-3 group-hover:bg-green-500/20 transition-colors">
                 <ImageIcon className="text-slate-400 group-hover:text-green-400 transition-colors" size={32} />
               </div>
               <span className="text-sm text-slate-400 group-hover:text-green-400 transition-colors font-medium">
                 {data.questionImage ? (
                   <span className="text-green-400">{data.questionImage.name}</span>
                 ) : (
                   'Or upload question image (PNG, JPG)'
                 )}
               </span>
            </div>
         </div>



         
          {/* Design Selection */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-slate-300 text-sm font-semibold flex items-center gap-2">
                <Palette size={16} className="text-blue-400" />
                Choose Solution Design
              </label>
              <button
                 onClick={handleRandomDesign}
                 className="text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:from-blue-500 hover:to-indigo-500 transition-all"
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
                      ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20' 
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-700/50'}`}
                >
                  <div className="text-2xl flex justify-center">{design.icon}</div>
                  
                  <div className="flex gap-0.5">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: design.colors.primary}}></div>
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: design.colors.secondary}}></div>
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: design.colors.accent}}></div>
                  </div>
                  
                  <span className={`text-xs font-bold ${selectedDesign.id === design.id ? 'text-white' : 'text-slate-300'}`}>
                    {design.name}
                  </span>
                  
                  {selectedDesign.id === design.id && (
                    <div className="absolute top-1.5 right-1.5 text-blue-400"><Check size={12} /></div>
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
           
            {/* Cover Page Style Selection */}
            <div className="mb-6 border-t border-slate-700 pt-6 mt-6">
              <label className="block text-slate-300 text-sm font-semibold mb-3 flex items-center gap-2">
                <FileText size={16} className="text-blue-400" />
                Cover Page Style
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setCoverStyle('classic')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 group
                    ${coverStyle === 'classic' 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-slate-700 bg-slate-800/30 hover:bg-slate-700/50'}`}
                >
                  <div className={`w-full max-w-[80px] aspect-[0.7] border rounded flex flex-col items-center justify-center gap-1 ${coverStyle === 'classic' ? 'border-blue-500 bg-white' : 'border-slate-600 bg-slate-700'}`}>
                    <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                    <div className="w-12 h-2 bg-slate-200 rounded-sm"></div>
                    <div className="w-10 h-2 bg-slate-200 rounded-sm"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${coverStyle === 'classic' ? 'text-blue-400' : 'text-slate-400'}`}>Classic</span>
                    {coverStyle === 'classic' && <CheckCircle2 size={16} className="text-blue-500" />}
                  </div>
                </button>

                <button
                  onClick={() => setCoverStyle('modern')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 group
                    ${coverStyle === 'modern' 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-slate-700 bg-slate-800/30 hover:bg-slate-700/50'}`}
                >
                  <div className={`w-full max-w-[80px] aspect-[0.7] border rounded flex relative overflow-hidden ${coverStyle === 'modern' ? 'border-blue-500 bg-white' : 'border-slate-600 bg-slate-700'}`}>
                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-blue-500/50"></div>
                    <div className="absolute top-4 left-4 right-0 h-8 bg-slate-200"></div>
                  </div>
                  <div className="flex items-center gap-2">
                   <span className={`text-sm font-bold ${coverStyle === 'modern' ? 'text-blue-400' : 'text-slate-400'}`}>Modern</span>
                   {coverStyle === 'modern' && <CheckCircle2 size={16} className="text-blue-500" />}
                  </div>
                </button>

                <button
                  onClick={() => setCoverStyle('artistic')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 group
                    ${coverStyle === 'artistic' 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-slate-700 bg-slate-800/30 hover:bg-slate-700/50'}`}
                >
                  <div className={`w-full max-w-[80px] aspect-[0.7] border rounded flex relative overflow-hidden ${coverStyle === 'artistic' ? 'border-blue-500 bg-white' : 'border-slate-600 bg-slate-700'}`}>
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-500/30 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-8 bg-slate-200 rounded"></div>
                  </div>
                  <div className="flex items-center gap-2">
                   <span className={`text-sm font-bold ${coverStyle === 'artistic' ? 'text-blue-400' : 'text-slate-400'}`}>Artistic</span>
                   {coverStyle === 'artistic' && <CheckCircle2 size={16} className="text-blue-500" />}
                  </div>
                </button>

                <button
                  onClick={() => setCoverStyle('executive')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 group
                    ${coverStyle === 'executive' 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-slate-700 bg-slate-800/30 hover:bg-slate-700/50'}`}
                >
                  <div className={`w-full max-w-[80px] aspect-[0.7] border rounded flex relative overflow-hidden ${coverStyle === 'executive' ? 'border-blue-500 bg-white' : 'border-slate-600 bg-slate-700'}`}>
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-blue-500/80"></div>
                    <div className="absolute top-4 left-10 right-2 h-2 bg-slate-200 rounded-sm"></div>
                    <div className="absolute top-8 left-10 right-4 h-2 bg-slate-200 rounded-sm opacity-50"></div>
                  </div>
                  <div className="flex items-center gap-2">
                   <span className={`text-sm font-bold ${coverStyle === 'executive' ? 'text-blue-400' : 'text-slate-400'}`}>Executive</span>
                   {coverStyle === 'executive' && <CheckCircle2 size={16} className="text-blue-500" />}
                  </div>
                </button>
              </div>
            </div>
          </div>
         
         <button 
           onClick={handleSolve}
           disabled={isLoading}
           className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2"
         >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            {isLoading ? 'Solving...' : 'Solve Question'}
         </button>
      </div>

       {/* Progress Indicator - Shown during loading */}
       {isLoading && (
          <div className="mt-8 animate-fade-in">
            <ProgressIndicator 
              stages={[
                { id: 'analyzing', label: 'تحليل السؤال' },
                { id: 'generating', label: 'توليد الحل بالتفصيل' },
                { id: 'formatting', label: 'تنسيق المعادلات' },
                { id: 'finalizing', label: 'إنهاء العملية' },
              ]}
              currentStage={progressStage}
              estimatedTime={15}
              elapsedTime={elapsedTime}
            />
            <div className="mt-6">
              <LoadingSkeleton variant="card" />
            </div>
          </div>
        )}

      {result && !isLoading && (
        <div className="mt-8 animate-fade-in-up">
          {/* Solution Container */}
          <div 
            ref={contentRef}
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
          >
            {/* Decorative Top Border */}
            <div style={{ height: '8px', background: colors.borderTop }}></div>
            
            {/* Header - Now Cover Page */}
            <CoverPage 
              data={{...data, subject: 'Quiz Solution', college: 'Academic Quiz', department: 'Detailed Solution', drName: '', logo: null}} 
              design={selectedDesign} 
              universityLogoUrl={null} 
              collegeLogoUrl={collegeLogoUrl}
              topic="Quiz Solution"
              variant={coverStyle}
            />

            {/* Question Display */}
            {data.questionText && (
              <div style={{ padding: '0 32px' }}>
                <div style={{ marginTop: '16px', background: colors.footerBg, borderRadius: '12px', padding: '16px', border: `1px solid ${colors.accent}`, borderLeft: `5px solid ${colors.primary}` }} dir="ltr">
                  <p style={{ fontSize: '12px', fontWeight: '600', color: colors.primary, marginBottom: '4px' }}>QUESTION:</p>
                  <p style={{ color: colors.textPrimary, fontSize: '14px' }}>{data.questionText}</p>
                </div>
              </div>
            )}

            {/* Solution Content */}
            <div style={{ padding: '32px' }} dir="ltr">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: colors.accent, display: 'flex', alignItems: 'center' }}><Sparkles size={18} /></span>
                <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: colors.primary, margin: 0 }}>AI Solution:</h4>
              </div>
              
              <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                {formatContent(result)}
              </div>
            </div>

            {/* Footer */}
            <div style={{ background: colors.footerBg, padding: '16px 32px', borderTop: `1px solid ${colors.accent}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: colors.textSecondary }} dir="ltr">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Branding Removed */}
                </div>
                <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            {/* Decorative Bottom Border */}
            <div style={{ height: '8px', background: colors.borderBottom }}></div>
          </div>

          {/* Download Buttons */}
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <button 
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 font-medium shadow-lg shadow-blue-600/25"
            >
              {isDownloading ? <Loader2 className="animate-spin" size={20} /> : <FileDown size={20} />}
              {isDownloading ? 'Generating...' : 'Download PDF'}
            </button>
            <button 
              onClick={handleDownloadWord}
              disabled={isDownloadingWord}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 font-medium shadow-lg shadow-indigo-600/25"
            >
              {isDownloadingWord ? <Loader2 className="animate-spin" size={20} /> : <FileType size={20} />}
              {isDownloadingWord ? 'Generating...' : 'Download Word'}
            </button>
          </div>
          <p className="text-center text-sm text-slate-400 mt-4">
            <Sparkles className="w-4 h-4 text-slate-400" /> Download the solution with properly formatted mathematical equations
          </p>
        </div>
      )}
    </div>
  );
};

export default Quiz;