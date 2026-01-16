// PPT Design Templates - Premium Collection (50+ Unique Designs)
// Each design has completely different visual layout, shapes, and styling

export interface PptDesignColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  titleBg: string;
  textColor: string;
  subtitleColor: string;
}

export interface PptDesignTemplate {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  svgIcon: string;
  colors: PptDesignColors;
  layoutStyle: 'geometric' | 'wave' | 'minimal' | 'bold' | 'elegant' | 'tech' | 'creative' | 'classic' | 'modern' | 'abstract' | 'grid' | 'circle_flow' | 'diagonal' | 'organic';
  shapeStyle: 'circles' | 'triangles' | 'hexagons' | 'diamonds' | 'lines' | 'dots' | 'waves' | 'squares' | 'mixed' | 'none' | 'organic' | 'tech_grid';
}

// SVG Icon Paths (Expanded)
const ICONS = {
  screen: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  graduation: 'M12 14l9-5-9-5-9 5 9 5zm0 7l-9-5v-4l9 5 9-5v4l-9 5z',
  star: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
  diamond: 'M12 2L2 12l10 10 10-10L12 2z',
  hexagon: 'M12 2l7 4v8l-7 4-7-4V6l7-4z',
  cube: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z',
  layers: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  circle: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
  triangle: 'M12 2l10 18H2L12 2z',
  lightning: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  rocket: 'M12 2C8 6 6 10 6 14c0 3 2 6 6 8 4-2 6-5 6-8 0-4-2-8-6-12zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  award: 'M12 15l-3 9 3-2 3 2-3-9zm0-13a4 4 0 100 8 4 4 0 000-8z',
  book: 'M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z',
  sun: 'M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M12 6a6 6 0 100 12 6 6 0 000-12z',
  moon: 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z',
  heart: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
  crown: 'M2 17l3-11 5 5 2-8 2 8 5-5 3 11H2z',
  flame: 'M12 2c-4 4-6 8-6 12a6 6 0 0012 0c0-4-2-8-6-12z',
  chart: 'M3 3v18h18M18 17l-5-8-5 5-4-4',
  compass: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09L12 12l-1.41 6.09 6.09-1.41L12 12l1.41-6.09-6.09 1.41L12 12l-1.41-6.09z',
  atom: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
};

export const PPT_DESIGN_TEMPLATES: PptDesignTemplate[] = [
  // ==========================================
  // 1. ORIGINAL REQUESTED DESIGN (KEPT)
  // ==========================================
  { id: 'cyber-neon', name: 'Cyber Neon', nameAr: 'السايبر المتوهج', category: 'Tech', svgIcon: ICONS.screen, colors: { primary: '#0a0a1a', secondary: '#00f0ff', accent: '#ff00ff', background: '#0f0f23', titleBg: '#0a0a1a', textColor: '#e2e8f0', subtitleColor: '#00f0ff' }, layoutStyle: 'tech', shapeStyle: 'lines' },
  { id: 'marketing', name: 'Marketing', nameAr: 'التسويق', category: 'Professional', svgIcon: ICONS.star, colors: { primary: '#be123c', secondary: '#e11d48', accent: '#fb7185', background: '#fff1f2', titleBg: '#be123c', textColor: '#9f1239', subtitleColor: '#e11d48' }, layoutStyle: 'bold', shapeStyle: 'circles' },
  { id: 'hr', name: 'HR Solutions', nameAr: 'الموارد البشرية', category: 'Professional', svgIcon: ICONS.heart, colors: { primary: '#0e7490', secondary: '#06b6d4', accent: '#22d3ee', background: '#ecfeff', titleBg: '#0e7490', textColor: '#155e75', subtitleColor: '#0891b2' }, layoutStyle: 'modern', shapeStyle: 'waves' },

  // 21-30: ACADEMIC & EDUCATION
  { id: 'university', name: 'University', nameAr: 'الجامعي', category: 'Academic', svgIcon: ICONS.graduation, colors: { primary: '#1e3a5f', secondary: '#8b7355', accent: '#c9a227', background: '#fffef7', titleBg: '#1e3a5f', textColor: '#1e3a5f', subtitleColor: '#8b7355' }, layoutStyle: 'classic', shapeStyle: 'lines' },
  { id: 'science-lab', name: 'Science Lab', nameAr: 'المختبر', category: 'Academic', svgIcon: ICONS.hexagon, colors: { primary: '#2563eb', secondary: '#10b981', accent: '#06b6d4', background: '#f8fafc', titleBg: '#1e40af', textColor: '#1e3a8a', subtitleColor: '#64748b' }, layoutStyle: 'modern', shapeStyle: 'hexagons' },
  { id: 'medical', name: 'Medical', nameAr: 'الطبي', category: 'Academic', svgIcon: ICONS.heart, colors: { primary: '#0284c7', secondary: '#0891b2', accent: '#22d3ee', background: '#ffffff', titleBg: '#0c4a6e', textColor: '#0c4a6e', subtitleColor: '#67e8f9' }, layoutStyle: 'minimal', shapeStyle: 'circles' },
  { id: 'engineering', name: 'Engineering', nameAr: 'الهندسي', category: 'Academic', svgIcon: ICONS.cube, colors: { primary: '#1e3a5f', secondary: '#ea580c', accent: '#fb923c', background: '#fff7ed', titleBg: '#1e3a5f', textColor: '#1c1917', subtitleColor: '#9a3412' }, layoutStyle: 'geometric', shapeStyle: 'triangles' },
  { id: 'arts', name: 'Arts', nameAr: 'الفنون', category: 'Academic', svgIcon: ICONS.star, colors: { primary: '#831843', secondary: '#c026d3', accent: '#e879f9', background: '#fdf4ff', titleBg: '#701a75', textColor: '#4a044e', subtitleColor: '#a855f7' }, layoutStyle: 'creative', shapeStyle: 'waves' },
  { id: 'literature', name: 'Literature', nameAr: 'الأدب', category: 'Academic', svgIcon: ICONS.book, colors: { primary: '#1c1917', secondary: '#78716c', accent: '#a8a29e', background: '#fafaf9', titleBg: '#292524', textColor: '#292524', subtitleColor: '#78716c' }, layoutStyle: 'elegant', shapeStyle: 'none' },
  { id: 'history', name: 'History', nameAr: 'التاريخ', category: 'Academic', svgIcon: ICONS.book, colors: { primary: '#451a03', secondary: '#92400e', accent: '#d97706', background: '#fffbeb', titleBg: '#451a03', textColor: '#78350f', subtitleColor: '#b45309' }, layoutStyle: 'classic', shapeStyle: 'lines' },
  { id: 'psychology', name: 'Psychology', nameAr: 'علم النفس', category: 'Academic', svgIcon: ICONS.circle, colors: { primary: '#4c1d95', secondary: '#7c3aed', accent: '#a78bfa', background: '#f5f3ff', titleBg: '#4c1d95', textColor: '#5b21b6', subtitleColor: '#7c3aed' }, layoutStyle: 'abstract', shapeStyle: 'circles' },
  { id: 'biology', name: 'Biology', nameAr: 'الأحياء', category: 'Academic', svgIcon: ICONS.hexagon, colors: { primary: '#14532d', secondary: '#15803d', accent: '#4ade80', background: '#f0fdf4', titleBg: '#14532d', textColor: '#166534', subtitleColor: '#22c55e' }, layoutStyle: 'modern', shapeStyle: 'hexagons' },
  { id: 'chemistry', name: 'Chemistry', nameAr: 'الكيمياء', category: 'Academic', svgIcon: ICONS.hexagon, colors: { primary: '#0369a1', secondary: '#0284c7', accent: '#38bdf8', background: '#f0f9ff', titleBg: '#0c4a6e', textColor: '#0c4a6e', subtitleColor: '#0ea5e9' }, layoutStyle: 'geometric', shapeStyle: 'hexagons' },

  // 31-40: ELEGANT & LUXURY
  { id: 'black-gold', name: 'Black Gold', nameAr: 'الأسود الذهبي', category: 'Luxury', svgIcon: ICONS.crown, colors: { primary: '#0a0a0a', secondary: '#d4af37', accent: '#ffd700', background: '#0a0a0a', titleBg: '#0a0a0a', textColor: '#f5f5f5', subtitleColor: '#d4af37' }, layoutStyle: 'elegant', shapeStyle: 'diamonds' },
  { id: 'rose-gold', name: 'Rose Gold', nameAr: 'الذهبي الوردي', category: 'Luxury', svgIcon: ICONS.heart, colors: { primary: '#831843', secondary: '#fda4af', accent: '#fecdd3', background: '#fff1f2', titleBg: '#9f1239', textColor: '#4c0519', subtitleColor: '#be123c' }, layoutStyle: 'elegant', shapeStyle: 'circles' },
  { id: 'royal-blue', name: 'Royal Blue', nameAr: 'الأزرق الملكي', category: 'Luxury', svgIcon: ICONS.crown, colors: { primary: '#1e3a8a', secondary: '#c9a227', accent: '#fbbf24', background: '#fefce8', titleBg: '#1e3a8a', textColor: '#1e3a8a', subtitleColor: '#b45309' }, layoutStyle: 'classic', shapeStyle: 'lines' },
  { id: 'diamond', name: 'Diamond', nameAr: 'الماسي', category: 'Luxury', svgIcon: ICONS.diamond, colors: { primary: '#374151', secondary: '#9ca3af', accent: '#e5e7eb', background: '#f9fafb', titleBg: '#1f2937', textColor: '#111827', subtitleColor: '#6b7280' }, layoutStyle: 'elegant', shapeStyle: 'diamonds' },
  { id: 'burgundy', name: 'Burgundy', nameAr: 'العنابي', category: 'Luxury', svgIcon: ICONS.flame, colors: { primary: '#722f37', secondary: '#9a3b3b', accent: '#d4a574', background: '#faf5f0', titleBg: '#4a1c23', textColor: '#2d1f1f', subtitleColor: '#9a3b3b' }, layoutStyle: 'elegant', shapeStyle: 'lines' },
  { id: 'emerald', name: 'Emerald', nameAr: 'الزمردي', category: 'Luxury', svgIcon: ICONS.diamond, colors: { primary: '#064e3b', secondary: '#10b981', accent: '#34d399', background: '#ecfdf5', titleBg: '#064e3b', textColor: '#065f46', subtitleColor: '#10b981' }, layoutStyle: 'elegant', shapeStyle: 'diamonds' },
  { id: 'sapphire', name: 'Sapphire', nameAr: 'الياقوتي', category: 'Luxury', svgIcon: ICONS.diamond, colors: { primary: '#1e3a8a', secondary: '#3b82f6', accent: '#60a5fa', background: '#eff6ff', titleBg: '#1e3a8a', textColor: '#1e40af', subtitleColor: '#2563eb' }, layoutStyle: 'elegant', shapeStyle: 'diamonds' },
  { id: 'amethyst', name: 'Amethyst', nameAr: 'الجمشتي', category: 'Luxury', svgIcon: ICONS.diamond, colors: { primary: '#581c87', secondary: '#a855f7', accent: '#c084fc', background: '#faf5ff', titleBg: '#581c87', textColor: '#6b21a8', subtitleColor: '#9333ea' }, layoutStyle: 'elegant', shapeStyle: 'diamonds' },
  { id: 'pearl', name: 'Pearl', nameAr: 'اللؤلؤي', category: 'Luxury', svgIcon: ICONS.circle, colors: { primary: '#44403c', secondary: '#a8a29e', accent: '#d6d3d1', background: '#fafaf9', titleBg: '#292524', textColor: '#1c1917', subtitleColor: '#78716c' }, layoutStyle: 'minimal', shapeStyle: 'circles' },
  { id: 'obsidian', name: 'Obsidian', nameAr: 'السبج', category: 'Luxury', svgIcon: ICONS.triangle, colors: { primary: '#0a0a0a', secondary: '#1f2937', accent: '#374151', background: '#111827', titleBg: '#0a0a0a', textColor: '#f3f4f6', subtitleColor: '#9ca3af' }, layoutStyle: 'bold', shapeStyle: 'triangles' },

  // 41-50: CREATIVE & MODERN
  { id: 'ocean-wave', name: 'Ocean Wave', nameAr: 'موج المحيط', category: 'Creative', svgIcon: ICONS.moon, colors: { primary: '#0c4a6e', secondary: '#0ea5e9', accent: '#38bdf8', background: '#f0f9ff', titleBg: '#0369a1', textColor: '#0c4a6e', subtitleColor: '#0284c7' }, layoutStyle: 'wave', shapeStyle: 'waves' },
  { id: 'sunset', name: 'Sunset', nameAr: 'الغروب', category: 'Creative', svgIcon: ICONS.sun, colors: { primary: '#7c2d12', secondary: '#ea580c', accent: '#fb923c', background: '#fff7ed', titleBg: '#7c2d12', textColor: '#7c2d12', subtitleColor: '#c2410c' }, layoutStyle: 'wave', shapeStyle: 'waves' },
  { id: 'aurora', name: 'Aurora', nameAr: 'الشفق', category: 'Creative', svgIcon: ICONS.star, colors: { primary: '#0f172a', secondary: '#06b6d4', accent: '#a855f7', background: '#0f172a', titleBg: '#020617', textColor: '#e2e8f0', subtitleColor: '#67e8f9' }, layoutStyle: 'abstract', shapeStyle: 'waves' },
  { id: 'forest', name: 'Forest', nameAr: 'الغابة', category: 'Creative', svgIcon: ICONS.triangle, colors: { primary: '#14532d', secondary: '#166534', accent: '#22c55e', background: '#f0fdf4', titleBg: '#14532d', textColor: '#15803d', subtitleColor: '#4ade80' }, layoutStyle: 'geometric', shapeStyle: 'triangles' },
  { id: 'desert', name: 'Desert', nameAr: 'الصحراء', category: 'Creative', svgIcon: ICONS.sun, colors: { primary: '#78350f', secondary: '#b45309', accent: '#f59e0b', background: '#fffbeb', titleBg: '#78350f', textColor: '#92400e', subtitleColor: '#d97706' }, layoutStyle: 'wave', shapeStyle: 'dots' },
  { id: 'galaxy', name: 'Galaxy', nameAr: 'المجرة', category: 'Creative', svgIcon: ICONS.star, colors: { primary: '#0f0a1e', secondary: '#6366f1', accent: '#818cf8', background: '#0f0a1e', titleBg: '#0a0512', textColor: '#e0e7ff', subtitleColor: '#a5b4fc' }, layoutStyle: 'abstract', shapeStyle: 'dots' },
  { id: 'lava', name: 'Lava', nameAr: 'الحمم', category: 'Creative', svgIcon: ICONS.flame, colors: { primary: '#450a0a', secondary: '#dc2626', accent: '#f87171', background: '#0a0a0a', titleBg: '#450a0a', textColor: '#fecaca', subtitleColor: '#ef4444' }, layoutStyle: 'bold', shapeStyle: 'waves' },
  { id: 'ice', name: 'Ice', nameAr: 'الجليد', category: 'Creative', svgIcon: ICONS.hexagon, colors: { primary: '#0c4a6e', secondary: '#7dd3fc', accent: '#bae6fd', background: '#f0f9ff', titleBg: '#0c4a6e', textColor: '#0369a1', subtitleColor: '#38bdf8' }, layoutStyle: 'geometric', shapeStyle: 'hexagons' },
  { id: 'spring', name: 'Spring', nameAr: 'الربيع', category: 'Creative', svgIcon: ICONS.heart, colors: { primary: '#be185d', secondary: '#f472b6', accent: '#fbcfe8', background: '#fdf2f8', titleBg: '#9d174d', textColor: '#831843', subtitleColor: '#db2777' }, layoutStyle: 'creative', shapeStyle: 'circles' },
  { id: 'minimal-mono', name: 'Minimal', nameAr: 'البسيط', category: 'Creative', svgIcon: ICONS.grid, colors: { primary: '#0a0a0a', secondary: '#525252', accent: '#171717', background: '#fafafa', titleBg: '#0a0a0a', textColor: '#171717', subtitleColor: '#737373' }, layoutStyle: 'minimal', shapeStyle: 'none' },
];

export const getDesignById = (id: string) => PPT_DESIGN_TEMPLATES.find(d => d.id === id);
export const getRandomDesign = () => PPT_DESIGN_TEMPLATES[Math.floor(Math.random() * PPT_DESIGN_TEMPLATES.length)];
export const getDesignsByCategory = (cat: string) => PPT_DESIGN_TEMPLATES.filter(d => d.category === cat);
export const PPT_CATEGORIES = ['Tech', 'Professional', 'Academic', 'Luxury', 'Creative'];

export default PPT_DESIGN_TEMPLATES;
