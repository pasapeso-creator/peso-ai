import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchImage } from '../types';
import { generateTextContent } from '../services/geminiService';
import { searchImages, imageUrlToBase64 } from '../services/imageSearchService';
import { generatePresentation, PPT_DESIGNS, PptDesignTemplate, TeamMember, SlideContent } from '../services/pptService';
import { 
  Loader2, Sparkles, BookOpen, Check, Palette, 
  School, Shuffle, ChevronDown, ChevronUp,
  Search, Image as ImageIcon, X, Upload, Plus, Trash2,
  Users, User, Hash, Download, Presentation as PresentationIcon, GraduationCap, BarChart3, Eye
} from 'lucide-react';
import { useToast } from '../components/Toast';
import { authService } from '../services/authService';
import { supabase } from '../services/supabase';
import ProgressIndicator from '../components/ProgressIndicator';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EnglishNotice from '../components/EnglishNotice';
import DesignPreviewCard from '../components/DesignPreviewCard';

interface Props {
  onDeductCredits: () => boolean;
}

const Presentation: React.FC<Props> = ({ onDeductCredits }) => {
  const { showToast } = useToast();
  
  // Form Data
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [drName, setDrName] = useState('');
  
  // Team members (unlimited)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ name: '', id: '' }]);
  
  // Logos
  const [universityLogo, setUniversityLogo] = useState<File | null>(null);
  const [universityLogoUrl, setUniversityLogoUrl] = useState<string | null>(null);
  const [collegeLogo, setCollegeLogo] = useState<File | null>(null);
  const [collegeLogoUrl, setCollegeLogoUrl] = useState<string | null>(null);
  
  // Images (max 8)
  const [selectedImages, setSelectedImages] = useState<SearchImage[]>([]);
  const [searchedImages, setSearchedImages] = useState<SearchImage[]>([]);
  const [tempSelectedImages, setTempSelectedImages] = useState<SearchImage[]>([]);
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageQuery, setImageQuery] = useState('');
  
  // Design
  const [selectedDesign, setSelectedDesign] = useState<PptDesignTemplate>(PPT_DESIGNS[0]);
  const [showAllDesigns, setShowAllDesigns] = useState(false);
  const [hoveredDesign, setHoveredDesign] = useState<PptDesignTemplate | null>(null);
  const [previewModalDesign, setPreviewModalDesign] = useState<PptDesignTemplate | null>(null);
  
  // Smart Charts Feature
  const [enableSmartCharts, setEnableSmartCharts] = useState(false);
  
  // Generation state
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPPT, setIsGeneratingPPT] = useState(false);
  const [progressStage, setProgressStage] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [generatedSlides, setGeneratedSlides] = useState<SlideContent[] | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const universityLogoRef = useRef<HTMLInputElement>(null);
  const collegeLogoRef = useRef<HTMLInputElement>(null);
  
  // Animation Variants for Smooth Entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  // Convert logos to base64
  useEffect(() => {
    if (universityLogo) {
      const reader = new FileReader();
      reader.onloadend = () => setUniversityLogoUrl(reader.result as string);
      reader.readAsDataURL(universityLogo);
    } else {
      setUniversityLogoUrl(null);
    }
  }, [universityLogo]);

  useEffect(() => {
    if (collegeLogo) {
      const reader = new FileReader();
      reader.onloadend = () => setCollegeLogoUrl(reader.result as string);
      reader.readAsDataURL(collegeLogo);
    } else {
      setCollegeLogoUrl(null);
    }
  }, [collegeLogo]);

  // Team member handlers
  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { name: '', id: '' }]);
  };

  const removeTeamMember = (index: number) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index));
    }
  };

  const updateTeamMember = (index: number, field: 'name' | 'id', value: string) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  // Image upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (selectedImages.length >= 8) {
      showToast("أقصى عدد صور هو 8 صور فقط!", "info");
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Image search handlers
  useEffect(() => {
    if (showImageModal && topic && !searchedImages.length) {
      setImageQuery(topic);
      handleSearchImages(topic);
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
        showToast("مفيش صور لقيناها بالموضوع ده", "info");
      }
    } catch (error) {
      console.error(error);
      showToast("خطأ في البحث عن الصور", "error");
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
        if (currentTotal >= 8) {
          showToast("⚠️ أقصى عدد صور هو 8 صور فقط!", "info", 2000);
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
        setTempSelectedImages([]);
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

  const handleRandomDesign = () => {
    const randomIndex = Math.floor(Math.random() * PPT_DESIGNS.length);
    setSelectedDesign(PPT_DESIGNS[randomIndex]);
    showToast(`تم اختيار تصميم "${PPT_DESIGNS[randomIndex].nameAr}" عشوائياً! 🎨`, "success");
  };

  // Generate presentation content with AI
  const handleGenerate = async () => {
    const validMembers = teamMembers.filter(m => m.name.trim() && m.id.trim());
    
    if (!topic || !subject || validMembers.length === 0) {
      showToast("يا غالي، في بيانات ناقصة.. املأ الموضوع والمادة واسم طالب واحد على الأقل!", "error");
      return;
    }
    
    // Check Trial / Subscription Logic
    const user = await authService.getCurrentProfile();
    if (user) {
       const allowed = await authService.checkAndMarkTrial(user.id, 'presentation');
       if (!allowed) {
          showToast("عفواً، لقد استهلكت التجربة المجانية لهذه الميزة. يرجى الاشتراك للمتابعة 👑", "error");
          return;
       }
    }

    if (!onDeductCredits()) return;

    setIsLoading(true);
    setGeneratedSlides(null);
    setProgressStage(0);
    setElapsedTime(0);

    const startTime = Date.now();
    const timeInterval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    const progressInterval = setInterval(() => {
      setProgressStage(prev => Math.min(prev + 1, 3));
    }, 4000);

    try {
      setProgressStage(0);
      
      const numImages = selectedImages.length;
      const imageDistribution = numImages > 0 
        ? `You have ${numImages} images to distribute. Assign imageIndex (0-${numImages-1}) to slides where images are most relevant.`
        : 'No images are available, so do not include imageIndex in any slide.';

      const chartInstructions = enableSmartCharts 
        ? `\n\nADDITIONAL REQUIREMENT: Include ONE slide with statistical chart data related to the topic.
For this chart slide, include a "chartData" field with this structure:
{
  "type": "bar" or "pie" or "line",
  "title": "Chart Title (e.g., 'AI Market Growth' or 'Technology Adoption Rates')",
  "data": [
    { "label": "Category 1", "value": 75 },
    { "label": "Category 2", "value": 60 },
    { "label": "Category 3", "value": 85 },
    { "label": "Category 4", "value": 45 }
  ]
}
Make up REALISTIC fake statistics that would be relevant for an academic presentation on this topic.`
        : '';

      const prompt = `Create a professional PowerPoint presentation outline about "${topic}" for the subject "${subject}".

Generate EXACTLY 6-8 content slides (not including title and thank you slides).

${imageDistribution}${chartInstructions}

Return ONLY a valid JSON array with this exact structure, no markdown or extra text:
[
  {
    "title": "Slide Title Here",
    "content": ["Point 1", "Point 2", "Point 3", "Point 4"],
    "imageIndex": 0
  },
  {
    "title": "Another Slide Title",
    "content": ["Point 1", "Point 2", "Point 3"]
  }${enableSmartCharts ? `,
  {
    "title": "Statistics Overview",
    "content": ["Key insight 1", "Key insight 2"],
    "chartData": {
      "type": "bar",
      "title": "Chart Title",
      "data": [{"label": "A", "value": 50}, {"label": "B", "value": 75}]
    }
  }` : ''}
]

Rules:
- Each slide should have 3-5 bullet points in the content array
- Content should be professional and academic
- Distribute images evenly across slides (if available)
- All text must be in English
- Make it suitable for a university/college presentation`;

      const response = await generateTextContent(prompt, 
        "You are a professional presentation creator. Return ONLY valid JSON, no markdown code blocks or extra text."
      );

      // Parse the response
      let slides: SlideContent[];
      try {
        // Clean up response - remove markdown code blocks if present
        let cleanResponse = response.trim();
        if (cleanResponse.startsWith('```json')) {
          cleanResponse = cleanResponse.slice(7);
        }
        if (cleanResponse.startsWith('```')) {
          cleanResponse = cleanResponse.slice(3);
        }
        if (cleanResponse.endsWith('```')) {
          cleanResponse = cleanResponse.slice(0, -3);
        }
        cleanResponse = cleanResponse.trim();
        
        slides = JSON.parse(cleanResponse);
        
        if (!Array.isArray(slides)) {
          throw new Error('Response is not an array');
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', response);
        throw new Error('فشل في تحليل رد الذكاء الاصطناعي. جرب مرة تانية.');
      }

      setProgressStage(3);
      setGeneratedSlides(slides);
      showToast("تم توليد محتوى البرزنتيشن بنجاح! 🎉", "success", 4000, "/logo.png");
      
    } catch (e: any) {
      console.error(e);
      showToast(e.message || "حصل مشكلة.. جرب تاني", "error");
    } finally {
      clearInterval(timeInterval);
      clearInterval(progressInterval);
      setIsLoading(false);
    }
  };

  // Download PPT
  const handleDownloadPPT = async () => {
    if (!generatedSlides) {
      showToast("لازم تولد المحتوى الأول!", "error");
      return;
    }

    const validMembers = teamMembers.filter(m => m.name.trim() && m.id.trim());
    
    setIsGeneratingPPT(true);
    try {
      await generatePresentation({
        topic,
        subject,
        college,
        department,
        drName,
        teamMembers: validMembers,
        universityLogo: universityLogoUrl || undefined,
        collegeLogo: collegeLogoUrl || undefined,
        images: selectedImages.map(img => img.link),
        design: selectedDesign,
        slides: generatedSlides,
      });
      
      showToast("تم تحميل ملف PowerPoint بنجاح! 🎉", "success");
    } catch (error) {
      console.error(error);
      showToast("حصل مشكلة في توليد الملف", "error");
    } finally {
      setIsGeneratingPPT(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">
      {/* Distinctive Header */}
      <div className="mb-6 relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 p-4 shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
            <PresentationIcon className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              Presentation Generator
            </h2>
            <p className="text-white/80 text-xs mt-0.5">Create stunning PowerPoint presentations with AI</p>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-pink-400/20 rounded-full blur-xl"></div>
      </div>

      <motion.div 
        className="grid grid-cols-1 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Student Data Card */}
        <motion.div variants={cardVariants} className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/50 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <GraduationCap className="text-purple-400" size={20} />
            بيانات المشروع
          </h3>
          
          <EnglishNotice />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Topic */}
            <div className="md:col-span-2">
              <label className="block text-slate-300 text-sm font-semibold mb-2 flex items-center gap-2">
                <BookOpen size={14} className="text-purple-400" />
                Presentation Topic (English)
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-900/80 border-2 border-slate-600 rounded-xl p-3 text-white focus:border-purple-500 focus:outline-none transition-all"
                placeholder="Ex: Artificial Intelligence in Healthcare"
                dir="ltr"
              />
            </div>
            
            {/* Subject */}
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-900/80 border-2 border-slate-600 rounded-xl p-3 text-white focus:border-purple-500 focus:outline-none transition-all"
                placeholder="Computer Science"
                dir="ltr"
              />
            </div>
            
            {/* College */}
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">College</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full bg-slate-900/80 border-2 border-slate-600 rounded-xl p-3 text-white focus:border-purple-500 focus:outline-none transition-all"
                placeholder="Faculty of Engineering"
                dir="ltr"
              />
            </div>
            
            {/* Department */}
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">Department (Optional)</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-900/80 border-2 border-slate-600 rounded-xl p-3 text-white focus:border-purple-500 focus:outline-none transition-all"
                placeholder="Software Engineering"
                dir="ltr"
              />
            </div>
            
            {/* Dr Name */}
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">Supervisor (Optional)</label>
              <input
                type="text"
                value={drName}
                onChange={(e) => setDrName(e.target.value)}
                className="w-full bg-slate-900/80 border-2 border-slate-600 rounded-xl p-3 text-white focus:border-purple-500 focus:outline-none transition-all"
                placeholder="Dr. Ahmed Hassan"
                dir="ltr"
              />
            </div>
          </div>

          {/* Logos */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2 flex items-center gap-2">
                <School size={14} className="text-purple-400" />
                University Logo
              </label>
              <input
                type="file"
                ref={universityLogoRef}
                onChange={(e) => setUniversityLogo(e.target.files?.[0] || null)}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => universityLogoRef.current?.click()}
                className="w-full bg-slate-700 hover:bg-slate-600 border-2 border-dashed border-slate-500 rounded-xl p-3 text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                {universityLogoUrl ? (
                  <img src={universityLogoUrl} alt="Logo" className="w-8 h-8 object-contain" />
                ) : (
                  <>
                    <Upload size={16} />
                    Upload Logo
                  </>
                )}
              </button>
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2 flex items-center gap-2">
                <School size={14} className="text-purple-400" />
                College Logo
              </label>
              <input
                type="file"
                ref={collegeLogoRef}
                onChange={(e) => setCollegeLogo(e.target.files?.[0] || null)}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => collegeLogoRef.current?.click()}
                className="w-full bg-slate-700 hover:bg-slate-600 border-2 border-dashed border-slate-500 rounded-xl p-3 text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                {collegeLogoUrl ? (
                  <img src={collegeLogoUrl} alt="Logo" className="w-8 h-8 object-contain" />
                ) : (
                  <>
                    <Upload size={16} />
                    Upload Logo
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Team Members Card */}
        <motion.div variants={cardVariants} className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-purple-500/30 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="text-purple-400" size={20} />
              فريق العمل
              <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full">
                {teamMembers.filter(m => m.name.trim()).length} أعضاء
              </span>
            </h3>
            <button
              onClick={addTeamMember}
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all"
            >
              <Plus size={16} />
              إضافة عضو
            </button>
          </div>
          
          <div className="space-y-3">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-700">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg py-2 pl-9 pr-3 text-white text-sm focus:border-purple-500 focus:outline-none transition-all"
                      placeholder="Student Name"
                      dir="ltr"
                    />
                  </div>
                  <div className="relative">
                    <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={member.id}
                      onChange={(e) => updateTeamMember(index, 'id', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg py-2 pl-9 pr-3 text-white text-sm focus:border-purple-500 focus:outline-none transition-all"
                      placeholder="Student ID"
                      dir="ltr"
                    />
                  </div>
                </div>
                {teamMembers.length > 1 && (
                  <button
                    onClick={() => removeTeamMember(index)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Images Card */}
        <motion.div variants={cardVariants} className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/50 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ImageIcon className="text-purple-400" size={20} />
            الصور ({selectedImages.length}/8)
          </h3>
          
          <div className="flex flex-wrap gap-3 items-center mb-4">
            <button
              onClick={() => {
                if (!topic) {
                  showToast("اكتب عنوان الموضوع الأول!", "error");
                  return;
                }
                setShowImageModal(true);
              }}
              className="group bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-pink-500 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 border border-purple-400/30"
            >
              <div className="p-1.5 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                <Search size={18} className="group-hover:scale-110 transition-transform" />
              </div>
              <span>Search Web Images</span>
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
              disabled={selectedImages.length >= 8}
              className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition-all font-semibold border border-slate-600"
            >
              <Upload size={18} />
              Upload Image
            </button>
            
            {selectedImages.length > 0 && (
              <button
                onClick={() => setSelectedImages([])}
                className="text-red-400 hover:text-red-300 text-sm underline"
              >
                Clear All
              </button>
            )}
          </div>
          
          {/* Selected Images Preview */}
          {selectedImages.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {selectedImages.map((img, idx) => (
                <div key={idx} className="relative group aspect-video">
                  <img 
                    src={img.thumbnail} 
                    alt={img.title}
                    className="w-full h-full object-cover rounded-lg border-2 border-purple-500"
                  />
                  <button
                    onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center rounded-b-lg">
                    {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Design Selection Card */}
        <motion.div variants={cardVariants} className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/50 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Palette className="text-purple-400" size={20} />
              تصميم الـ PowerPoint
            </h3>
            <button
              onClick={handleRandomDesign}
              className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:from-purple-500 hover:to-pink-500 transition-all"
            >
              <Shuffle size={12} />
              عشوائي
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {(showAllDesigns ? PPT_DESIGNS : PPT_DESIGNS.slice(0, 10)).map((design) => (
              <motion.button
                key={design.id}
                onClick={() => setSelectedDesign(design)}
                onMouseEnter={() => setHoveredDesign(design)}
                onMouseLeave={() => setHoveredDesign(null)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className={`relative p-4 rounded-xl border-2 transition-colors duration-200 flex flex-col items-center gap-2 text-center group/design
                  ${selectedDesign.id === design.id 
                    ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20' 
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'}`}
              >
                {/* Visual Preview Eye Icon (Mobile/Opt-in) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewModalDesign(design);
                  }}
                  className="absolute top-2 left-2 p-1.5 rounded-full bg-slate-700/80 text-slate-300 hover:text-white hover:bg-purple-500 transition-all opacity-100 md:opacity-0 md:group-hover/design:opacity-100 z-10"
                  title="معاينة التصميم"
                >
                  <Eye size={14} />
                </button>

                {/* Desktop Hover Preview Card */}
                <AnimatePresence>
                  {hoveredDesign?.id === design.id && (
                    <DesignPreviewCard design={design} className="md:block hidden" />
                  )}
                </AnimatePresence>
                
                {/* SVG Icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{backgroundColor: design.colors.primary}}>
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d={design.svgIcon} />
                  </svg>
                </div>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: design.colors.primary}}></div>
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: design.colors.secondary}}></div>
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: design.colors.accent}}></div>
                </div>
                <span className={`text-xs font-bold ${selectedDesign.id === design.id ? 'text-white' : 'text-slate-300'}`}>
                  {design.name}
                </span>
                <span className="text-[10px] text-slate-500">{design.nameAr}</span>
                {selectedDesign.id === design.id && (
                  <div className="absolute top-2 right-2 text-purple-400"><Check size={14} /></div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Show All Toggle Button */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setShowAllDesigns(!showAllDesigns)}
              className="flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full text-sm font-medium transition-colors border border-slate-700"
            >
              {showAllDesigns ? (
                <>
                  <ChevronUp size={16} />
                  عرض أقل
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  عرض كل التصاميم ({PPT_DESIGNS.length})
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Smart Charts Toggle */}
        <motion.div 
          variants={cardVariants}
          className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-2xl border border-amber-500/30 shadow-xl"
        >
          <label className="flex items-center gap-4 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={enableSmartCharts}
                onChange={(e) => setEnableSmartCharts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-slate-700 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-amber-500 peer-checked:to-orange-500 transition-all">
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-6 transition-all"></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <BarChart3 className="text-amber-400" size={18} />
                <span className="text-white font-bold text-sm">رسوم بيانية ذكية (Smart Charts)</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">متقدم</span>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                الذكاء الاصطناعي يقترح بيانات إحصائية وهمية مناسبة للموضوع ويضيف شريحة رسم بياني حقيقي
              </p>
            </div>
          </label>
        </motion.div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:from-purple-500 hover:via-pink-500 hover:to-rose-400 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              جاري التوليد...
            </>
          ) : (
            <>
              <Sparkles size={24} />
              <span className="font-righteous text-xl tracking-wider">GENERATE PRESENTATION</span>
            </>
          )}
        </button>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            <ProgressIndicator stage={progressStage} elapsedTime={elapsedTime} />
            <LoadingSkeleton />
          </div>
        )}

        {/* Generated Content Preview */}
        {generatedSlides && !isLoading && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-green-500/30 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Check className="text-green-400" size={20} />
                تم توليد المحتوى! ({generatedSlides.length} شرائح)
              </h3>
              <button
                onClick={handleDownloadPPT}
                disabled={isGeneratingPPT}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg disabled:opacity-50"
              >
                {isGeneratingPPT ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    جاري التحميل...
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    تحميل PowerPoint
                  </>
                )}
              </button>
            </div>
            
            {/* Slides Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedSlides.map((slide, idx) => (
                <div key={idx} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {idx + 1}
                    </span>
                    <h4 className="text-white font-bold text-sm">{slide.title}</h4>
                    {slide.imageIndex !== undefined && (
                      <span className="text-purple-400 text-xs flex items-center gap-1">
                        <ImageIcon size={12} />
                        Image {slide.imageIndex + 1}
                      </span>
                    )}
                  </div>
                  <ul className="text-slate-400 text-xs space-y-1">
                    {slide.content.slice(0, 3).map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-purple-400">•</span>
                        <span className="line-clamp-1">{point}</span>
                      </li>
                    ))}
                    {slide.content.length > 3 && (
                      <li className="text-slate-500 italic">+{slide.content.length - 3} more points</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Design Preview Modal (Opt-in) */}
      <AnimatePresence>
        {previewModalDesign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg flex flex-col items-center"
            >
              <button
                onClick={() => setPreviewModalDesign(null)}
                className="absolute -top-12 right-0 p-2 bg-slate-800 rounded-full text-white hover:bg-slate-700 transition-colors"
              >
                <X size={24} />
              </button>
              
              <DesignPreviewCard 
                design={previewModalDesign} 
                className="!static !transform-none !mb-0 !block !w-full !aspect-video !h-auto shadow-2xl" 
              />
              
              <div className="mt-6 text-center w-full">
                <h3 className="text-xl font-bold text-white mb-2">{previewModalDesign.name}</h3>
                <button
                  onClick={() => {
                    setSelectedDesign(previewModalDesign);
                    setPreviewModalDesign(null);
                  }}
                  className="w-full sm:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  اختيار هذا التصميم
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Search Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">ابحث عن صور</h3>
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setTempSelectedImages([]);
                }}
                className="text-slate-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={imageQuery}
                onChange={(e) => setImageQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchImages()}
                className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="Search for images..."
                dir="ltr"
              />
              <button
                onClick={() => handleSearchImages()}
                disabled={isSearchingImages}
                className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-xl flex items-center gap-2 font-bold transition-all disabled:opacity-50"
              >
                {isSearchingImages ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                بحث
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {isSearchingImages ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="animate-spin text-purple-500" size={40} />
                </div>
              ) : searchedImages.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {searchedImages.map((img, idx) => {
                    const isSelected = tempSelectedImages.some(i => i.link === img.link) ||
                                       selectedImages.some(i => i.link === img.link);
                    const isAlreadyAdded = selectedImages.some(i => i.link === img.link);
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => !isAlreadyAdded && toggleTempImageSelection(img)}
                        disabled={isAlreadyAdded}
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all
                          ${isSelected ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-transparent hover:border-slate-600'}
                          ${isAlreadyAdded ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <img src={img.thumbnail} alt={img.title} className="w-full h-full object-cover" />
                        {isSelected && !isAlreadyAdded && (
                          <div className="absolute top-1 right-1 bg-purple-500 text-white rounded-full p-1">
                            <Check size={12} />
                          </div>
                        )}
                        {isAlreadyAdded && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">تمت الإضافة</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-slate-500">
                  ابحث عن صور للموضوع
                </div>
              )}
            </div>
            
            {tempSelectedImages.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
                <span className="text-slate-400">
                  تم اختيار {tempSelectedImages.length} صور
                </span>
                <button
                  onClick={handleAddBatchImages}
                  disabled={isProcessingImages}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isProcessingImages ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      جاري التحميل...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      إضافة الصور
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Presentation;
