import React, { useState, useEffect, useRef } from 'react';
import { StudentData, SearchImage } from '../types';
import InputForm from '../components/InputForm';
import ProgressIndicator from '../components/ProgressIndicator';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { generateTextContent } from '../services/geminiService';

import { searchImages, imageUrlToBase64 } from '../services/imageSearchService';
import { exportToWord } from '../utils/wordExport';
import { 
  FileDown, Loader2, Sparkles, BookOpen, Check, FileText, Palette, 
  GraduationCap, User, Calendar, BadgeInfo, School, FileType, Shuffle, ChevronDown, ChevronUp,
  Search, Image as ImageIcon, X, CheckCircle2, Upload, Plus
} from 'lucide-react';
import { useToast } from '../components/Toast';
import { DESIGN_TEMPLATES, getRandomDesign, DesignTemplate } from '../utils/designTemplates';
import CoverPage, { CoverPageVariant } from '../components/CoverPage';

// Title section removed as it is now in CoverPage

declare global {
  interface Window {
    renderMathInElement: (element: HTMLElement, options: any) => void;
    html2pdf: any;
  }
}

interface Props {
  onDeductCredits: () => boolean;
}

const Assignment: React.FC<Props> = ({ onDeductCredits }) => {
  const { showToast } = useToast();
  const [data, setData] = useState<StudentData>({
    name: '', studentId: '', subject: '', college: '', drName: '', department: '', logo: null
  });
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingWord, setIsDownloadingWord] = useState(false);
  const [progressStage, setProgressStage] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [universityLogoUrl, setUniversityLogoUrl] = useState<string | null>(null);
  const [collegeLogoUrl, setCollegeLogoUrl] = useState<string | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<DesignTemplate>(DESIGN_TEMPLATES[0]);
  const [showAllDesigns, setShowAllDesigns] = useState(false);
  const [coverStyle, setCoverStyle] = useState<CoverPageVariant>('classic');
  
  // Image search states
  // Image search states
  // Image search states
  // Image search states
  const [searchedImages, setSearchedImages] = useState<SearchImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<SearchImage[]>([]);
  const [tempSelectedImages, setTempSelectedImages] = useState<SearchImage[]>([]); // For multi-select
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  const [isProcessingImages, setIsProcessingImages] = useState(false); // For batch adding
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageQuery, setImageQuery] = useState('');

  const contentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (selectedImages.length >= 3) {
      showToast("أقصى عدد صور هو 3 صور فقط!", "info");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const newImage: SearchImage = {
        title: file.name,
        link: result,
        thumbnail: result,
        contextLink: 'local'
      };
      setSelectedImages(prev => [...prev, newImage]);
      showToast("تم إضافة الصورة بنجاح! 📸", "success");
    };
    reader.readAsDataURL(file);
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  // Design colors helper
  const colors = selectedDesign.colors;

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

  const handleRandomDesign = () => {
    const newDesign = getRandomDesign();
    setSelectedDesign(newDesign);
    showToast(`تم اختيار تصميم "${newDesign.nameAr}" عشوائياً! 🎨`, "success");
  };

  const handleGenerate = async () => {
    if (!data.name || !data.subject || !topic) {
      showToast("يا غالي، في بيانات ناقصة.. املأ الخانات دي عشان نبدأ!", "error");
      return;
    }
    
    if (!onDeductCredits()) return;



    setIsLoading(true);
    setResult(null);
    setProgressStage(0);
    setElapsedTime(0);

    const startTime = Date.now();
    const timeInterval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    const progressInterval = setInterval(() => {
      setProgressStage(prev => Math.min(prev + 1, 3));
    }, 5000);

    try {
      setProgressStage(0);
      
      // Check if user has selected images
      const hasImages = selectedImages.length > 0;
      
      // Prepare image context for the AI
      const imageContext = hasImages 
        ? selectedImages.map((img, i) => `Image ${i+1}: ${img.title}`).join('\n')
        : '';

      const text = await generateTextContent(
        `Write a highly professional academic assignment in ENGLISH about the subject: "${data.subject}", specifically on the topic: "${topic}".

IMPORTANT CONTEXT-AWARE FORMATTING:
- If the topic is related to Mathematics, Physics, Engineering, Chemistry, Computer Science, Statistics, Economics (with quantitative analysis), or any STEM field that naturally uses formulas and equations:
  * Use LaTeX notation for mathematical formulas: $...$ for inline math, $$...$$ for display/block math
  * Include relevant formulas, equations, and mathematical expressions where appropriate
  * Examples: $x^2 + y^2 = r^2$, $\\frac{a}{b}$, $\\int$, $\\sum$, $\\alpha$, $\\beta$, $\\pi$

- If the topic is related to Literature, History, Philosophy, Languages, Social Sciences, Arts, Business Management, or non-quantitative fields:
  * DO NOT use mathematical notation or LaTeX
  * Write in clear, professional prose without formulas
  * Focus on analysis, arguments, and textual evidence

${hasImages ? `
IMPORTANT - IMAGE PLACEMENT & EXPLANATION:
The user has selected ${selectedImages.length} specific images to be distributed throughout this assignment.
Here are the descriptions/titles of the images:
${imageContext}

INSTRUCTIONS FOR IMAGES:
1. You MUST distribute these images throughout the assignment where they are most relevant using identifiers [IMAGE_1], [IMAGE_2], etc.
2. DO NOT group them all together. Spread them out across different sections (e.g., Introduction, Analysis, Conclusion).
3. IMMEDIATELY AFTER placing an [IMAGE_X] tag, write a short paragraph or caption explaining how this image relates to the text above or describing the concept shown in references to the image title provided above.
4. Ensure every selected image (1 to ${selectedImages.length}) is included exactly once.
` : ''}

Structure: 
# Title
## Introduction
## Key Concepts
## Detailed Analysis
## Conclusion
## References

Style: Formal Academic English.
Student Name: ${data.name}.
College: ${data.college}.
IMPORTANT: The output MUST be entirely in English. ONLY include math formulas if the topic genuinely requires them.${hasImages ? ' Remember to distribute [IMAGE_X] placeholders with explanations.' : ''}`,
         "You are a professional academic assistant. Output exclusively in English. Use LaTeX notation for mathematical formulas ONLY when the subject matter genuinely requires mathematical expressions (STEM fields). For humanities, social sciences, and non-quantitative topics, write in clear prose without any math notation. Ensure professional image placement using placeholders."
      );

      setProgressStage(3);
      setResult(text);
    } catch (e: any) {
      console.error(e);
      showToast(e.message || "يا ساتر، السيرفر مهنج شوية.. جرب تاني كمان شوية", "error");
    } finally {
      clearInterval(timeInterval);
      clearInterval(progressInterval);
      setIsLoading(false);
    }
  };



  // Trigger search when modal opens
  useEffect(() => {
    if (showImageModal) {
        setTempSelectedImages([]);
        if (topic && !searchedImages.length) {
            setImageQuery(topic);
            handleSearchImages(topic);
        }
    }
  }, [showImageModal]);

  const handleSearchImages = async (queryOverride?: string) => {
    const query = queryOverride || imageQuery;
    if (!query.trim()) return;
    
    setIsSearchingImages(true);
    try {
      const images = await searchImages(query);
      setSearchedImages(images);
      if (images.length === 0) {
        showToast("مفيش صور لقيناها بالموضوع ده.. جرب كلمة تانية", "info");
      }
    } catch (error) {
      console.error(error);
      showToast("خطأ في البحث عن الصور.. تأكد من النت", "error");
    } finally {
      setIsSearchingImages(false);
    }
  };

  const toggleTempImageSelection = (img: SearchImage) => {
    setTempSelectedImages(prev => {
        const exists = prev.some(i => i.link === img.link);
        if (exists) {
            return prev.filter(i => i.link !== img.link);
        } else {
            const currentTotal = selectedImages.length + prev.length;
            if (currentTotal >= 3) {
                showToast("⚠️ أقصى عدد صور هو 3 صور فقط!", "info", 2000);
                return prev;
            }
            return [...prev, img];
        }
    });
  };

  const handleAddBatchImages = async () => {
      if (tempSelectedImages.length === 0) return;
      
      setIsProcessingImages(true);
      showToast("جاري تحميل الصور...", "info");
      
      try {
          const processedImages = await Promise.all(tempSelectedImages.map(async (img) => {
              try {
                  const base64 = await imageUrlToBase64(img.link);
                  return { ...img, link: base64, thumbnail: base64, contextLink: 'web' };
              } catch (e) {
                  console.error(`Failed to load image ${img.title}`, e);
                  return null;
              }
          }));
          
          const successfulImages = processedImages.filter(img => img !== null) as SearchImage[];
          
          if (successfulImages.length > 0) {
              setSelectedImages(prev => [...prev, ...successfulImages]);
              showToast(`تم إضافة ${successfulImages.length} صور بنجاح! 📸`, "success");
              setShowImageModal(false);
          } else {
              showToast("فشل تحميل الصور المختارة", "error");
          }
      } catch (error) {
          console.error(error);
          showToast("حدث خطأ أثناء تحميل الصور", "error");
      } finally {
          setIsProcessingImages(false);
      }
  };

  // Toggle image selection
  const toggleImageSelection = (image: SearchImage) => {
    setSelectedImages(prev => {
      const isSelected = prev.some(img => img.link === image.link);
      if (isSelected) {
        return prev.filter(img => img.link !== image.link);
      } else {
        if (prev.length >= 3) {
          showToast("أقصى عدد صور هو 3 صور فقط!", "info");
          return prev;
        }
        return [...prev, image];
      }
    });
  };

  const handleDownloadWord = async () => {
    if (!contentRef.current) {
      showToast("مفيش ملف جاهز للتحميل.. ولد الملف الأول!", "info");
      return;
    }
    
    setIsDownloadingWord(true);
    
    try {
      await exportToWord(contentRef.current, {
        filename: `${data.name || 'Assignment'}-${topic.replace(/\s+/g, '_')}.doc`,
        title: topic,
        author: data.name,
        design: selectedDesign
      });
      showToast("تم تحميل ملف Word بنجاح! 🎉", "success", 4000, "/logo.png");
    } catch (err) {
      console.error('Word Error:', err);
      showToast("حصل مشكلة في تحميل Word.. جرب PDF", "error");
    } finally {
      setIsDownloadingWord(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!contentRef.current) {
      showToast("مفيش ملف جاهز للتحميل دلوقتي.. ولد الملف الأول!", "info");
      return;
    }
    
    setIsDownloading(true);
    
    const element = contentRef.current;
    const filename = `${data.name || 'Assignment'}-${topic.replace(/\s+/g, '_')}.pdf`;
    
    try {
      const clone = element.cloneNode(true) as HTMLElement;
      
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '210mm';
      container.style.background = 'white';
      container.appendChild(clone);
      document.body.appendChild(container);

      // Convert all images to base64 to avoid CORS issues - SIMPLIFIED FOR LOCAL UPLOADS
      const images = clone.querySelectorAll('img');
      /*
      // Removed online image fetching logic
      const imagePromises = Array.from(images).map(async (img) => { ... });
      await Promise.all(imagePromises);
      */

      await new Promise(resolve => setTimeout(resolve, 1500));

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
      
      document.body.removeChild(container);
      
      showToast("تم تحميل الـ PDF بنجاح! 🎉", "success", 4000, "/logo.png");
    } catch (err) {
      console.error('PDF Error:', err);
      showToast("جاري فتح نافذة الطباعة...", "info");
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
          <h1 key={index} style={{ fontSize: '22px', fontWeight: 'bold', color: colors.primary, marginBottom: '16px', marginTop: '24px', borderBottom: `3px solid ${colors.accent}`, paddingBottom: '10px', letterSpacing: '0.5px' }}>
            {line.replace(/^#\s*/, '')}
          </h1>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} style={{ fontSize: '18px', fontWeight: 'bold', color: colors.secondary, marginBottom: '12px', marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', borderLeft: `4px solid ${colors.accent}`, paddingLeft: '12px', background: `linear-gradient(to right, ${colors.accent}15, transparent)`, paddingTop: '8px', paddingBottom: '8px' }}>
            {line.replace(/^##\s*/, '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} style={{ fontSize: '16px', fontWeight: '600', color: colors.primary, marginBottom: '8px', marginTop: '14px', fontStyle: 'italic' }}>
            {line.replace(/^###\s*/, '')}
          </h3>
        );
      }
      if (line.includes('**')) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={index} style={{ marginBottom: '12px', lineHeight: '1.9', textAlign: 'justify', color: colors.textPrimary, fontSize: '14px' }}>
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i} style={{ fontWeight: 'bold', color: colors.primary }}>{part}</strong> : part
            )}
          </p>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px', marginLeft: '16px', gap: '10px' }}>
            <span style={{ color: colors.accent, fontSize: '18px', lineHeight: '1.5' }}>•</span>
            <p style={{ color: colors.textPrimary, lineHeight: '1.8', fontSize: '14px', flex: 1 }}>{line.replace(/^[-*]\s*/, '')}</p>
          </div>
        );
      }
      if (line.match(/^\d+\.\s/)) {
        const num = line.match(/^(\d+)\./)?.[1];
        return (
          <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px', marginLeft: '16px', gap: '10px' }}>
            <span style={{ color: 'white', background: colors.accent, width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 }}>{num}</span>
            <p style={{ color: colors.textPrimary, lineHeight: '1.8', fontSize: '14px', flex: 1 }}>{line.replace(/^\d+\.\s*/, '')}</p>
          </div>
        );
      }

      // [IMAGE_N] placeholder - render specific image here
      const imageMatch = line.trim().match(/^\[IMAGE_(\d+)\]/i);
      if (imageMatch) {
        const imgIndex = parseInt(imageMatch[1]) - 1;
        
        if (imgIndex >= 0 && imgIndex < selectedImages.length) {
          const img = selectedImages[imgIndex];
          
          return (
            <div key={index} style={{ marginTop: '24px', marginBottom: '24px', pageBreakInside: 'avoid' }}>
              <div style={{ 
                borderRadius: '12px', 
                overflow: 'hidden', 
                border: `2px solid ${colors.accent}`,
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                <img 
                  src={img.link} 
                  alt={img.title}
                  style={{ 
                    width: '100%', 
                    maxHeight: '400px', 
                    objectFit: 'contain',
                    background: '#f8fafc' 
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = img.thumbnail;
                  }}
                />
                <div style={{ 
                  padding: '12px 16px', 
                  background: colors.footerBg, 
                  borderTop: `1px solid ${colors.accent}40`
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '4px'
                  }}>
                    <ImageIcon size={14} className="text-current" />
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: 'bold', 
                      color: colors.primary 
                    }}>
                      Figure {imgIndex + 1}
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: colors.textSecondary,
                    textAlign: 'center',
                    fontStyle: 'italic',
                    lineHeight: '1.5'
                  }}>
                    {img.title}
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return null;
      }

      if (line.trim()) {
        return (
          <p key={index} style={{ marginBottom: '12px', lineHeight: '1.9', textAlign: 'justify', color: colors.textPrimary, fontSize: '14px' }}>{line}</p>
        );
      }
      return <br key={index} />;
    });
  };

  const visibleDesigns = showAllDesigns ? DESIGN_TEMPLATES : DESIGN_TEMPLATES.slice(0, 8);

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-blue-600 rounded-xl">
            <FileText className="text-white" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Assignment Generator</h2>
            <p className="text-slate-500 text-sm">Generate professional academic assignments with beautiful PDF export</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div>
          <InputForm data={data} onChange={setData} />
          
          {/* Topic & Design Selection Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/50 shadow-2xl mt-6 backdrop-blur-sm">
            
            {/* Topic Input */}
            <div className="mb-6">
              <label className="block text-slate-300 text-sm font-semibold mb-3 flex items-center gap-2">
                <BookOpen size={16} className="text-blue-400" />
                Assignment Topic (in English)
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-900/80 border-2 border-slate-600 rounded-xl p-4 text-white h-28 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all placeholder:text-slate-500"
                placeholder="Ex: The impact of AI on Cybersecurity, Calculus derivatives, Quantum mechanics..."
                dir="ltr"
              ></textarea>
            </div>



            {/* PDF Design Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-slate-300 text-sm font-semibold flex items-center gap-2">
                  <Palette size={16} className="text-blue-400" />
                  Choose PDF Design ({DESIGN_TEMPLATES.length} designs)
                </label>
                <button
                  onClick={handleRandomDesign}
                  className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:from-purple-500 hover:to-pink-500 transition-all"
                >
                  <Shuffle size={12} />
                  Random
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {visibleDesigns.map((design) => (
                  <button
                    key={design.id}
                    onClick={() => setSelectedDesign(design)}
                    className={`relative p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1.5 text-center group
                      ${selectedDesign.id === design.id 
                        ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20' 
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
                    <span className="text-[10px] text-slate-500">{design.nameAr}</span>
                    
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
            </div>

            {/* Cover Page Style Selection */}
            <div className="mb-6 border-t border-slate-700 pt-6">
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

            {/* Image Search Section */}
            <div className="mb-6">
              <label className="block text-slate-300 text-sm font-semibold mb-3 flex items-center gap-2">
                <ImageIcon size={16} className="text-blue-400" />
                Add Images (Upload Only)
              </label>
              <div className="flex flex-wrap gap-3 items-center">

                <button
                  onClick={() => {
                     if (!topic) {
                         showToast("اكتب عنوان الموضوع الأول عشان أقدر أجبلك صور!", "error");
                         return;
                     }
                     setShowImageModal(true);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 border border-blue-400/30 group"
                >
                  <Search size={20} className="group-hover:scale-110 transition-transform" />
                  <span>Find Images for Topic</span>
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={selectedImages.length >= 3}
                  className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all font-semibold border border-slate-600"
                >
                  <Upload size={18} />
                  Upload Image
                </button>
                
                {selectedImages.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm">{selectedImages.length} image(s) selected</span>
                    <button
                      onClick={() => setSelectedImages([])}
                      className="text-red-400 hover:text-red-300 text-sm underline"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>
              
              {/* Selected Images Preview */}
              {selectedImages.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {selectedImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img 
                        src={img.thumbnail} 
                        alt={img.title}
                        className="w-24 h-24 object-cover rounded-lg border-2 border-blue-500"
                      />
                      <button
                        onClick={() => toggleImageSelection(img)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              {isLoading ? 'Generating...' : 'Generate Assignment'}
            </button>
          </div>
        </div>

        {/* Image Search Modal */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-fade-in-up">
              <div className="p-5 border-b border-slate-700 action-bar flex justify-between items-center bg-slate-800/50 rounded-t-2xl backdrop-blur-md">
                <div>
                   <h3 className="text-xl font-bold text-white flex items-center gap-2">
                     <ImageIcon className="text-blue-400" />
                     Select Images
                   </h3>
                   <p className="text-slate-400 text-sm mt-1">Showing results for: <span className="text-blue-300 font-semibold">{topic}</span></p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-xs font-mono border border-slate-700">
                        {selectedImages.length} / 3 Selected
                    </span>
                    <button 
                      onClick={() => setShowImageModal(false)}
                      className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors"
                    >
                      <X size={20} />
                    </button>
                </div>
              </div>
              
              {/* Search Bar Removed - Auto Searching based on Topic */}

              <div className="flex-1 overflow-y-auto p-5 min-h-[300px] pb-24">
                {isSearchingImages ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
                        <p>Searching for great images...</p>
                    </div>
                ) : searchedImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {searchedImages.map((img, idx) => {
                      const isSelected = selectedImages.some(s => s.link === img.link);
                      const isTempSelected = tempSelectedImages.some(s => s.link === img.link);
                      
                      return (
                      <div 
                        key={idx} 
                        className={`group relative aspect-video bg-slate-800 rounded-xl overflow-hidden border-2 transition-all cursor-pointer 
                            ${isSelected ? 'border-slate-600 opacity-50 grayscale' : 
                              isTempSelected ? 'border-blue-500 ring-2 ring-blue-500/50' : 
                              'border-slate-700 hover:border-blue-400'}`}
                        onClick={() => !isSelected && toggleTempImageSelection(img)}
                      >
                        <img 
                          src={img.thumbnail} 
                          alt={img.title}
                          className={`w-full h-full object-cover transition-transform duration-500 ${!isSelected && 'group-hover:scale-110'}`}
                        />
                         {isSelected && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
                                <span className="text-white font-bold text-xs bg-slate-700 px-2 py-1 rounded-full">Added</span>
                            </div>
                        )}
                         {isTempSelected && (
                            <div className="absolute inset-0 bg-blue-500/30 flex items-center justify-center backdrop-blur-[2px]">
                                <CheckCircle2 size={32} className="text-white drop-shadow-md animate-bounce-short" />
                            </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between">
                          <span className="text-white text-xs font-medium line-clamp-1 flex-1 mr-2">{img.title}</span>
                        </div>
                      </div>
                    )})}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
                    <ImageIcon size={64} className="mb-4" />
                    <p className="text-lg">No images found for "{topic}"</p>
                  </div>
                )}
              </div>

              {/* Footer with Batch Add Button */}
              <div className="p-4 border-t border-slate-700 bg-slate-800/80 backdrop-blur absolute bottom-0 left-0 right-0 rounded-b-2xl flex justify-between items-center">
                  <div className="text-slate-300 text-sm">
                      <span className="text-blue-400 font-bold">{tempSelectedImages.length}</span> images selected to add
                  </div>
                  <button
                    onClick={handleAddBatchImages}
                    disabled={tempSelectedImages.length === 0 || isProcessingImages}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    {isProcessingImages ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                    {isProcessingImages ? 'Processing...' : `Add ${tempSelectedImages.length} Images`}
                  </button>
              </div>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        {isLoading && (
          <div className="animate-fade-in">
            <ProgressIndicator 
              stages={[
                { id: 'analyzing', label: 'تحليل الموضوع' },
                { id: 'generating', label: 'توليد المحتوى' },
                { id: 'formatting', label: 'تنسيق النتائج' },
                { id: 'finalizing', label: 'إنهاء العملية' },
              ]}
              currentStage={progressStage}
              estimatedTime={25}
              elapsedTime={elapsedTime}
            />
            <div className="mt-6">
              <LoadingSkeleton variant="pdf" />
            </div>
          </div>
        )}

        {/* Result Preview */}
        {result && !isLoading && (
          <div className="animate-fade-in-up">
            {/* Design Info Badge */}
            <div className="flex items-center gap-2 mb-4 justify-end">
              <span className="text-xs text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
                Design: <span className="text-white font-semibold">{selectedDesign.name}</span>
              </span>
            </div>

            <div 
              ref={contentRef}
              style={{ fontFamily: "'Times New Roman', Georgia, serif", background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
            >
              {/* Decorative Top Border */}
              <div style={{ height: '10px', background: colors.borderTop }}></div>
              
              {/* Header - Now using Full Page Cover */}
              <CoverPage 
                data={data} 
                design={selectedDesign} 
                universityLogoUrl={universityLogoUrl} 
                collegeLogoUrl={collegeLogoUrl}
                topic={topic}
                variant={coverStyle}
              />

              {/* Title Section (REMOVED - moved to CoverPage) */}



              {/* Title Section */}


              {/* Content Area */}
              <div style={{ padding: '32px', background: 'white' }} dir="ltr">
                <div style={{ fontSize: '14px', lineHeight: '1.8', color: colors.textPrimary }}>
                  {formatContent(result)}
                </div>
              </div>

              {/* Footer */}
              <div style={{ background: colors.footerBg, padding: '20px 32px', borderTop: `2px solid ${colors.accent}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: colors.textSecondary }} dir="ltr">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}></div>
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
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-8 py-3.5 rounded-xl flex items-center gap-3 transition-all disabled:opacity-50 font-bold text-lg shadow-lg shadow-blue-600/25"
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
            <p className="text-center text-sm text-slate-400 mt-4 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> Your assignment will be exported with the "{selectedDesign.name}" design ({selectedDesign.headerLayout} layout)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignment;