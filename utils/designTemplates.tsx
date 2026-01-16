// Design System Templates & Types
import React from 'react';
import { 
  FileText, Sparkles, BookOpen, Palette, 
  GraduationCap, Layout, Zap, Feather, 
  Hexagon, Waves, Briefcase, Star, 
  Award, Bookmark, PenTool 
} from 'lucide-react';

export type HeaderLayout = 
  | 'classic' 
  | 'centered' 
  | 'modern' 
  | 'minimal' 
  | 'corporate' 
  | 'elegant' 
  | 'tech' 
  | 'nature' 
  | 'geometric' 
  | 'wave';

export interface DesignColors {
  primary: string;
  secondary: string;
  accent: string;
  headerBg: string;
  footerBg: string;
  textPrimary: string;
  textSecondary: string;
  borderTop: string;
  borderBottom: string;
  titleBg: string; // Used in some layouts for the title section
}

export interface DesignTemplate {
  id: string;
  name: string;
  nameAr: string;
  headerLayout: HeaderLayout;
  colors: DesignColors;
  icon: React.ReactNode;
}

// --- Color Palettes (Premium Light Themes) ---
// We define base palettes and then mix them with layouts

interface PaletteDef {
  name: string;
  colors: DesignColors;
}

const PALETTES: PaletteDef[] = [
  {
    name: "Royal Blue",
    colors: {
      primary: '#1e3a8a', // blue-900
      secondary: '#1d4ed8', // blue-700
      accent: '#3b82f6', // blue-500
      headerBg: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
      footerBg: '#eff6ff', // blue-50
      textPrimary: '#172554', // blue-950
      textSecondary: '#64748b', // slate-500
      borderTop: 'linear-gradient(to right, #1e3a8a, #3b82f6)',
      borderBottom: 'linear-gradient(to right, #3b82f6, #1e3a8a)',
      titleBg: '#1e3a8a',
    }
  },
  {
    name: "Emerald City",
    colors: {
      primary: '#064e3b', // emerald-900
      secondary: '#047857', // emerald-700
      accent: '#10b981', // emerald-500
      headerBg: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
      footerBg: '#ecfdf5', // emerald-50
      textPrimary: '#022c22', // emerald-950
      textSecondary: '#475569', // slate-600
      borderTop: 'linear-gradient(to right, #064e3b, #10b981)',
      borderBottom: 'linear-gradient(to right, #10b981, #064e3b)',
      titleBg: '#064e3b',
    }
  },
  {
    name: "Crimson Red",
    colors: {
      primary: '#7f1d1d', // red-900
      secondary: '#b91c1c', // red-700
      accent: '#ef4444', // red-500
      headerBg: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)',
      footerBg: '#fef2f2', // red-50
      textPrimary: '#450a0a', // red-950
      textSecondary: '#57534e', // stone-500
      borderTop: 'linear-gradient(to right, #7f1d1d, #ef4444)',
      borderBottom: 'linear-gradient(to right, #ef4444, #7f1d1d)',
      titleBg: '#7f1d1d',
    }
  },
  {
    name: "Amethyst Purple",
    colors: {
      primary: '#581c87', // purple-900
      secondary: '#7e22ce', // purple-700
      accent: '#a855f7', // purple-500
      headerBg: 'linear-gradient(135deg, #581c87 0%, #7e22ce 100%)',
      footerBg: '#faf5ff', // purple-50
      textPrimary: '#3b0764', // purple-950
      textSecondary: '#52525b', // zinc-600
      borderTop: 'linear-gradient(to right, #581c87, #a855f7)',
      borderBottom: 'linear-gradient(to right, #a855f7, #581c87)',
      titleBg: '#581c87',
    }
  },
  {
    name: "Sunset Orange",
    colors: {
      primary: '#7c2d12', // orange-900
      secondary: '#c2410c', // orange-700
      accent: '#f97316', // orange-500
      headerBg: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)',
      footerBg: '#fff7ed', // orange-50
      textPrimary: '#431407', // orange-950
      textSecondary: '#57534e', // stone-500
      borderTop: 'linear-gradient(to right, #7c2d12, #f97316)',
      borderBottom: 'linear-gradient(to right, #f97316, #7c2d12)',
      titleBg: '#7c2d12',
    }
  },
  {
    name: "Teal Ocean",
    colors: {
      primary: '#134e4a', // teal-900
      secondary: '#0f766e', // teal-700
      accent: '#14b8a6', // teal-500
      headerBg: 'linear-gradient(135deg, #134e4a 0%, #0d9488 100%)',
      footerBg: '#f0fdfa', // teal-50
      textPrimary: '#042f2e', // teal-950
      textSecondary: '#475569', // slate-600
      borderTop: 'linear-gradient(to right, #134e4a, #14b8a6)',
      borderBottom: 'linear-gradient(to right, #14b8a6, #134e4a)',
      titleBg: '#134e4a',
    }
  },
  {
    name: "Cyan Sky",
    colors: {
      primary: '#164e63', // cyan-900
      secondary: '#0e7490', // cyan-700
      accent: '#06b6d4', // cyan-500
      headerBg: 'linear-gradient(135deg, #164e63 0%, #0891b2 100%)',
      footerBg: '#ecfeff', // cyan-50
      textPrimary: '#083344', // cyan-950
      textSecondary: '#475569', // slate-600
      borderTop: 'linear-gradient(to right, #164e63, #06b6d4)',
      borderBottom: 'linear-gradient(to right, #06b6d4, #164e63)',
      titleBg: '#164e63',
    }
  },
  {
    name: "Magenta Rose",
    colors: {
      primary: '#831843', // pink-900
      secondary: '#be185d', // pink-700
      accent: '#ec4899', // pink-500
      headerBg: 'linear-gradient(135deg, #831843 0%, #db2777 100%)',
      footerBg: '#fdf2f8', // pink-50
      textPrimary: '#500724', // pink-950
      textSecondary: '#52525b', // zinc-600
      borderTop: 'linear-gradient(to right, #831843, #ec4899)',
      borderBottom: 'linear-gradient(to right, #ec4899, #831843)',
      titleBg: '#831843',
    }
  },
  {
    name: "Golden Lux",
    colors: {
      primary: '#713f12', // yellow-900
      secondary: '#a16207', // yellow-700
      accent: '#eab308', // yellow-500
      headerBg: 'linear-gradient(135deg, #713f12 0%, #ca8a04 100%)',
      footerBg: '#fefce8', // yellow-50
      textPrimary: '#422006', // yellow-950
      textSecondary: '#57534e', // stone-500
      borderTop: 'linear-gradient(to right, #713f12, #eab308)',
      borderBottom: 'linear-gradient(to right, #eab308, #713f12)',
      titleBg: '#713f12',
    }
  },
  {
    name: "Slate Minimal",
    colors: {
      primary: '#0f172a', // slate-900
      secondary: '#334155', // slate-700
      accent: '#64748b', // slate-500
      headerBg: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
      footerBg: '#f8fafc', // slate-50
      textPrimary: '#020617', // slate-950
      textSecondary: '#64748b', // slate-500
      borderTop: 'linear-gradient(to right, #0f172a, #64748b)',
      borderBottom: 'linear-gradient(to right, #64748b, #0f172a)',
      titleBg: '#0f172a',
    }
  },
  {
    name: "Indigo Night",
    colors: {
      primary: '#312e81', // indigo-900
      secondary: '#4338ca', // indigo-700
      accent: '#6366f1', // indigo-500
      headerBg: 'linear-gradient(135deg, #312e81 0%, #4f46e5 100%)',
      footerBg: '#eef2ff', // indigo-50
      textPrimary: '#1e1b4b', // indigo-950
      textSecondary: '#475569', // slate-600
      borderTop: 'linear-gradient(to right, #312e81, #6366f1)',
      borderBottom: 'linear-gradient(to right, #6366f1, #312e81)',
      titleBg: '#312e81',
    }
  },
  {
    name: "Lime Fresh",
    colors: {
      primary: '#365314', // lime-900
      secondary: '#4d7c0f', // lime-700
      accent: '#84cc16', // lime-500
      headerBg: 'linear-gradient(135deg, #365314 0%, #65a30d 100%)',
      footerBg: '#f7fee7', // lime-50
      textPrimary: '#1a2e05', // lime-950
      textSecondary: '#57534e', // stone-600
      borderTop: 'linear-gradient(to right, #365314, #84cc16)',
      borderBottom: 'linear-gradient(to right, #84cc16, #365314)',
      titleBg: '#365314',
    }
  },
  {
    name: "Fuchsia Pop",
    colors: {
      primary: '#701a75', // fuchsia-900
      secondary: '#a21caf', // fuchsia-700
      accent: '#d946ef', // fuchsia-500
      headerBg: 'linear-gradient(135deg, #701a75 0%, #c026d3 100%)',
      footerBg: '#fdf4ff', // fuchsia-50
      textPrimary: '#4a044e', // fuchsia-950
      textSecondary: '#52525b', // zinc-600
      borderTop: 'linear-gradient(to right, #701a75, #d946ef)',
      borderBottom: 'linear-gradient(to right, #d946ef, #701a75)',
      titleBg: '#701a75',
    }
  },
    {
    name: "Bronze Earth",
    colors: {
      primary: '#451a03', // amber-950 sometimes closer to bronze
      secondary: '#78350f', // amber-900
      accent: '#d97706', // amber-600
      headerBg: 'linear-gradient(135deg, #451a03 0%, #92400e 100%)',
      footerBg: '#fffbeb', // amber-50
      textPrimary: '#451a03', 
      textSecondary: '#57534e',
      borderTop: 'linear-gradient(to right, #451a03, #d97706)',
      borderBottom: 'linear-gradient(to right, #d97706, #451a03)',
      titleBg: '#451a03',
    }
  },
    {
    name: "Midnight",
    colors: {
      primary: '#020617', // slate-950
      secondary: '#1e293b', // slate-800
      accent: '#94a3b8', // slate-400
      headerBg: 'linear-gradient(135deg, #020617 0%, #172554 100%)',
      footerBg: '#f8fafc',
      textPrimary: '#000000',
      textSecondary: '#4b5563',
      borderTop: 'linear-gradient(to right, #020617, #94a3b8)',
      borderBottom: 'linear-gradient(to right, #94a3b8, #020617)',
      titleBg: '#020617',
    }
  }
];

// --- Layout Definitions ---
const LAYOUTS: { id: HeaderLayout; name: string; icon: React.ReactNode }[] = [
  { id: 'classic', name: 'Classic', icon: <FileText /> },
  { id: 'centered', name: 'Centered', icon: <Layout /> },
  { id: 'modern', name: 'Modern', icon: <Zap /> },
  { id: 'minimal', name: 'Minimal', icon: <Feather /> },
  { id: 'corporate', name: 'Corporate', icon: <Briefcase /> },
  { id: 'elegant', name: 'Elegant', icon: <Star /> },
  { id: 'tech', name: 'Tech', icon: <Hexagon /> },
  { id: 'nature', name: 'Nature', icon: <Waves /> },
  { id: 'geometric', name: 'Geometric', icon: <Award /> },
  { id: 'wave', name: 'Wave', icon: <Bookmark /> },
];

// --- Combinatorial Generation ---
const generateTemplates = (): DesignTemplate[] => {
  const templates: DesignTemplate[] = [];
  
  LAYOUTS.forEach((layout) => {
    PALETTES.forEach((palette) => {
      const id = `${layout.id}-${palette.name.toLowerCase().replace(/\s+/g, '-')}`;
      templates.push({
        id,
        name: `${palette.name} ${layout.name}`,
        nameAr: `${layout.name} - ${palette.name}`, // Keeping English mostly but structure implies translation
        headerLayout: layout.id,
        colors: palette.colors,
        icon: layout.icon,
      });
    });
  });
  
  return templates;
};

// Export the massive list
export const DESIGN_TEMPLATES = generateTemplates();

// Helper to get random design
export const getRandomDesign = (): DesignTemplate => {
  const randomIndex = Math.floor(Math.random() * DESIGN_TEMPLATES.length);
  return DESIGN_TEMPLATES[randomIndex];
};

export const getDesignById = (id: string): DesignTemplate | undefined => {
  return DESIGN_TEMPLATES.find(d => d.id === id);
};
