import PptxGenJS from 'pptxgenjs';
import { PptDesignTemplate, PPT_DESIGN_TEMPLATES } from './pptDesigns';

export type { PptDesignTemplate } from './pptDesigns';
export { PPT_DESIGN_TEMPLATES as PPT_DESIGNS } from './pptDesigns';

export interface TeamMember { name: string; id: string; }
export interface SlideContent { 
  title: string; 
  content: string[]; 
  imageIndex?: number; 
  chartData?: {
    type: 'bar' | 'pie' | 'line';
    title: string;
    data: { label: string; value: number }[];
  };
}
export interface PresentationData {
  topic: string; subject: string; college: string; drName?: string; department?: string;
  teamMembers: TeamMember[]; universityLogo?: string; collegeLogo?: string;
  images: string[]; design: PptDesignTemplate; slides: SlideContent[];
}

const hex = (c: string) => c.replace('#', '');

// Helper to determine if text should be light or dark based on background
const isDarkColor = (color: string) => {
  const c = color.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  // YIQ equation
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq < 128; // Returns true if dark
};

// ==========================================
// 1. BACKGROUND DECORATION GENERATOR
// ==========================================
const addDecorations = (slide: PptxGenJS.Slide, design: PptDesignTemplate, isTitle = false) => {
  const c = design.colors;
  const s = design.shapeStyle;
  const l = design.layoutStyle;

  // Global background fill if needed (besides master)
  // slide.background = { color: hex(isTitle ? c.titleBg : c.background) };

  // --- SHAPE DESIGNS ---
  if (s === 'circles' || s === 'dots' || l === 'circle_flow') {
    // Top Right Corner
    slide.addShape('ellipse', { x: 8.0, y: isTitle ? -1.5 : -1.0, w: 3.5, h: 3.5, fill: { color: hex(c.secondary), transparency: 85 } });
    slide.addShape('ellipse', { x: 9.0, y: isTitle ? -0.5 : 0.5, w: 1.5, h: 1.5, fill: { color: hex(c.accent), transparency: 80 } });
    
    // Bottom Left Corner
    slide.addShape('ellipse', { x: -1.0, y: 4.5, w: 3.0, h: 3.0, fill: { color: hex(c.secondary), transparency: 90 } });
    if (s === 'dots') {
       for(let i=0; i<5; i++) slide.addShape('ellipse', { x: 0.5 + (i*0.2), y: 5.2, w: 0.1, h: 0.1, fill: { color: hex(c.accent)}});
    }
  } 
  else if (s === 'triangles' || l === 'geometric') {
    slide.addShape('triangle', { x: 8.5, y: -0.5, w: 2, h: 2, fill: { color: hex(c.secondary), transparency: 85 }, rotate: 180 });
    slide.addShape('triangle', { x: 9.2, y: 0.5, w: 1, h: 1, fill: { color: hex(c.accent), transparency: 70 }, rotate: 180 });
    slide.addShape('triangle', { x: -0.5, y: 4.5, w: 2.5, h: 2.5, fill: { color: hex(c.primary), transparency: 90 } });
  }
  else if (s === 'hexagons' || s === 'tech_grid') {
    slide.addShape('rect', { x: 9.5, y: 0, w: 0.5, h: 5.63, fill: { color: hex(c.secondary), transparency: 92 } });
    for (let i = 0; i < 4; i++) {
        slide.addShape('hexagon', { x: 9.2, y: 1 + i*1.2, w: 0.6, h: 0.6, line: { color: hex(c.accent), width: 1}, fill: { color: hex(c.background)} });
    }
    if (l === 'tech') {
        slide.addShape('rect', { x: 0, y: 5.2, w: 10, h: 0.05, fill: { color: hex(c.accent) } });
    }
  }
  else if (s === 'diamonds') {
     slide.addShape('rect', { x: 9, y: 0.5, w: 1.5, h: 1.5, fill: { color: hex(c.secondary), transparency: 80 }, rotate: 45 });
     slide.addShape('rect', { x: -0.5, y: 4.5, w: 1.5, h: 1.5, fill: { color: hex(c.accent), transparency: 85 }, rotate: 45 });
  }
  else if (s === 'lines' || l === 'minimal') {
     slide.addShape('rect', { x: 0.5, y: 0.5, w: 9, h: 0.03, fill: { color: hex(c.secondary), transparency: 80 } });
     slide.addShape('rect', { x: 0.5, y: 5.2, w: 9, h: 0.03, fill: { color: hex(c.secondary), transparency: 80 } });
  }
  else if (s === 'waves' || l === 'wave') {
     // Abstract representation of waves using curves or specialized shapes if available, simulating with ovals
     slide.addShape('ellipse', { x: -1, y: 4.8, w: 12, h: 2, fill: { color: hex(c.secondary), transparency: 75 } });
     slide.addShape('ellipse', { x: 2, y: 5.1, w: 12, h: 2, fill: { color: hex(c.accent), transparency: 70 } });
  }
  else if (s === 'squares' || l === 'bold') {
      slide.addShape('rect', { x: 0, y: 0, w: 1.5, h: 5.63, fill: { color: hex(c.primary), transparency: 90 } });
      slide.addShape('rect', { x: 0.5, y: 0.5, w: 0.5, h: 0.5, fill: { color: hex(c.accent) } });
  }
  else if (s === 'organic') {
      slide.addShape('ellipse', { x: 8, y: -1, w: 3, h: 3, fill: { color: hex(c.secondary), transparency: 60 } });
      slide.addShape('ellipse', { x: 7, y: 0, w: 2, h: 2, fill: { color: hex(c.primary), transparency: 80 } });
  }
};

// ==========================================
// 2. TITLE SLIDE RENDERER
// ==========================================
const createTitleSlide = (slide: PptxGenJS.Slide, data: PresentationData, design: PptDesignTemplate) => {
  const c = design.colors;
  const isDarkBg = isDarkColor(c.titleBg);
  const mainTxt = isDarkBg ? 'FFFFFF' : '000000';
  const subTxt = isDarkBg ? 'E0E0E0' : '404040';
  
  // Background Decorations
  addDecorations(slide, design, true);

  // LOGO PLACEMENT: University Top Right, College Top Left
  if (data.universityLogo) {
    try {
      // Optional backing shape for visibility
      slide.addShape('ellipse', { x: 8.7, y: 0.2, w: 1.1, h: 1.1, fill: { color: 'FFFFFF', transparency: 10 }, line: { color: hex(c.accent), width: 0.5 } });
      slide.addImage({ data: data.universityLogo, x: 8.85, y: 0.3, w: 0.8, h: 0.8 }); // Top Right
    } catch (e) { console.warn('Uni Logo error', e); }
  }

  if (data.collegeLogo) {
    try {
      slide.addShape('ellipse', { x: 0.2, y: 0.2, w: 1.1, h: 1.1, fill: { color: 'FFFFFF', transparency: 10 }, line: { color: hex(c.secondary), width: 0.5 } });
      slide.addImage({ data: data.collegeLogo, x: 0.35, y: 0.3, w: 0.8, h: 0.8 }); // Top Left
    } catch (e) { console.warn('Col Logo error', e); }
  }

  // --- CENTRE CONTENT ---
  // Title Box
  slide.addShape('rect', { x: 1, y: 1.5, w: 8, h: 0.1, fill: { color: hex(c.accent) } }); // Top Accent Line
  
  slide.addText(data.topic, {
    x: 0.5, y: 1.7, w: 9, h: 1.2,
    fontSize: 40, bold: true, color: mainTxt, align: 'center', fontFace: 'Segoe UI',
    shadow: { type: 'outer', blur: 3, offset: 2, angle: 45, opacity: 0.3 }
  });

  slide.addText(data.subject, {
    x: 1, y: 2.9, w: 8, h: 0.5,
    fontSize: 20, color: hex(c.accent), align: 'center', fontFace: 'Segoe UI', italic: true,
  });

  // College & Department
  if (data.college || data.department) {
      slide.addText(`${data.college} ${data.department ? ' | ' + data.department : ''}`, {
          x: 1, y: 3.4, w: 8, h: 0.3, fontSize: 12, color: subTxt, align: 'center'
      });
  }

  // --- MEMBER LIST SECTION ---
  // A styled card for members
  const memberY = 3.9;
  const memberH = 1.4;
  slide.addShape('roundRect', { x: 2, y: memberY, w: 6, h: memberH, fill: { color: hex(c.primary), transparency: 85 }, line: { color: hex(c.accent), width: 1 } });
  
  slide.addText('TEAM MEMBERS', {
      x: 2, y: memberY + 0.1, w: 6, h: 0.3, 
      fontSize: 10, bold: true, color: hex(c.accent), align: 'center', charSpacing: 3
  });

  // Format team names nicely
  const col1 = data.teamMembers.slice(0, Math.ceil(data.teamMembers.length/2));
  const col2 = data.teamMembers.slice(Math.ceil(data.teamMembers.length/2));
  
  const fmtMember = (m: TeamMember) => `${m.name}`;
  
  if (col2.length > 0) {
      slide.addText(col1.map(fmtMember).join('\n'), { x: 2.2, y: memberY + 0.4, w: 2.8, h: 1, fontSize: 11, color: isDarkBg ? 'FFFFFF' : hex(c.textColor), align: 'left', lineSpacing: 14 });
      slide.addText(col2.map(fmtMember).join('\n'), { x: 5.0, y: memberY + 0.4, w: 2.8, h: 1, fontSize: 11, color: isDarkBg ? 'FFFFFF' : hex(c.textColor), align: 'left', lineSpacing: 14 });
  } else {
      slide.addText(data.teamMembers.map(fmtMember).join('\n'), { x: 2.1, y: memberY + 0.4, w: 5.8, h: 1, fontSize: 12, color: isDarkBg ? 'FFFFFF' : hex(c.textColor), align: 'center', lineSpacing: 16 });
  }

  // Supervisor
  if (data.drName) {
    slide.addText(`Under Supervision of: Dr. ${data.drName}`, {
      x: 0, y: 5.4, w: 10, h: 0.3,
      fontSize: 11, color: subTxt, align: 'center', italic: true
    });
  }
};

// ==========================================
// 3. HEADER & FOOTER
// ==========================================
const addHeader = (slide: PptxGenJS.Slide, design: PptDesignTemplate, title: string) => {
  const c = design.colors;
  const l = design.layoutStyle;

  if (l === 'minimal') {
      slide.addText(title, { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 24, bold: true, color: hex(c.primary) });
      slide.addShape('line', { x: 0.5, y: 0.9, w: 9, h: 0, line: { color: hex(c.accent), width: 2 } });
  } 
  else if (l === 'tech') {
      slide.addShape('rect', { x:0, y:0, w:10, h:1.0, fill:{ color: hex(c.primary) } });
      slide.addShape('rect', { x:0, y:1.0, w:10, h:0.05, fill:{ color: hex(c.accent) } });
      slide.addText(title, { x: 0.5, y: 0.2, w: 9, h: 0.6, fontSize: 22, bold: true, color: 'FFFFFF' });
  }
  else {
      // Default Modern
      slide.addShape('rect', { x: 0.5, y: 0.3, w: 0.15, h: 0.6, fill: { color: hex(c.accent) } });
      slide.addText(title, { x: 0.8, y: 0.3, w: 8.5, h: 0.6, fontSize: 24, bold: true, color: hex(c.primary) });
  }
};

const addFooter = (slide: PptxGenJS.Slide, design: PptDesignTemplate, num: number, topic: string) => {
  const c = design.colors;
  const isDark = isDarkColor(c.background);
  const txtCol = isDark ? 'FFFFFF' : '666666';

  slide.addShape('line', { x: 0.5, y: 5.3, w: 9, h: 0, line: { color: hex(c.accent), width: 0.5, transparency: 50 } });
  slide.addText(`${num}`, { x: 9.0, y: 5.35, w: 0.5, h: 0.3, fontSize: 10, color: txtCol, align: 'right' });
  slide.addText(topic, { x: 0.5, y: 5.35, w: 5, h: 0.3, fontSize: 9, color: txtCol, transparency: 40 });
};

// ==========================================
// 4. MAIN GENERATION FUNCTION
// ==========================================
export const generatePresentation = async (data: PresentationData): Promise<void> => {
  const pptx = new PptxGenJS();
  const design = data.design;
  const c = design.colors;
  
  // Metadata
  pptx.author = data.teamMembers[0]?.name || 'Student';
  pptx.title = data.topic;
  pptx.subject = data.subject;
  pptx.company = data.college;
  pptx.layout = 'LAYOUT_16x9';

  // Master Slides
  pptx.defineSlideMaster({ title: 'TITLE', background: { color: hex(c.titleBg) }});
  pptx.defineSlideMaster({ title: 'CONTENT', background: { color: hex(c.background) }});

  // 1. Generate Title Slide
  const titleSlide = pptx.addSlide({ masterName: 'TITLE' });
  createTitleSlide(titleSlide, data, design);

  // 2. Generate Content Slides
  for (let i = 0; i < data.slides.length; i++) {
    const sd = data.slides[i];
    const slide = pptx.addSlide({ masterName: 'CONTENT' });
    
    // Decorations
    addDecorations(slide, design, false);
    
    // Header
    addHeader(slide, design, sd.title);

    // Layout Logic based on Content + Image + Chart
    const contentColor = isDarkColor(c.background) ? 'E0E0E0' : hex(c.textColor);
    
    if (sd.chartData) {
      // --- CHART SLIDE ---
      const chartData = sd.chartData;
      
      // Add brief textual context if provided
      if (sd.content.length > 0) {
        const bullets = sd.content.map(t => ({ 
           text: t, 
           options: { fontSize: 14, color: contentColor, bullet: { type: 'bullet' as const, color: hex(c.accent) }, paraSpaceAfter: 10, breakLine: true } 
        }));
        slide.addText(bullets, { x: 0.5, y: 1.2, w: 3.5, h: 3.8, fontFace: 'Segoe UI', valign: 'top' });
        
        // Render Chart on Right
        const pptChartData = [
          {
            name: chartData.title,
            labels: chartData.data.map(d => d.label),
            values: chartData.data.map(d => d.value)
          }
        ];
        
        let chartType = pptx.ChartType.bar;
        if (chartData.type === 'pie') chartType = pptx.ChartType.pie;
        if (chartData.type === 'line') chartType = pptx.ChartType.line;

        slide.addChart(chartType, pptChartData, { 
            x: 4.2, y: 1.2, w: 5.5, h: 3.8,
            barDir: 'col',
            chartColors: [hex(c.primary), hex(c.secondary), hex(c.accent)],
            showLegend: true, legendPos: 'b',
            showTitle: true, title: chartData.title, titleColor: hex(c.primary), titleFontSize: 14,
            showValue: true
        });

      } else {
        // Full Page Chart
        const pptChartData = [
          {
            name: chartData.title,
            labels: chartData.data.map(d => d.label),
            values: chartData.data.map(d => d.value)
          }
        ];

        let chartType = pptx.ChartType.bar;
        if (chartData.type === 'pie') chartType = pptx.ChartType.pie;
        if (chartData.type === 'line') chartType = pptx.ChartType.line;

        slide.addChart(chartType, pptChartData, { 
            x: 1.0, y: 1.2, w: 8.0, h: 3.8,
            barDir: 'col',
            chartColors: [hex(c.primary), hex(c.secondary), hex(c.accent)],
            showLegend: true, legendPos: 'b',
            showTitle: true, title: chartData.title, titleColor: hex(c.primary), titleFontSize: 16,
            showValue: true
        });
      }

    } else {
      // --- STANDARD SLIDECONTENT ---
      const hasImg = sd.imageIndex !== undefined && sd.imageIndex < data.images.length && data.images[sd.imageIndex];

      if (hasImg) {
         // Split Layout
         const bullets = sd.content.map(t => ({ 
             text: t, 
             options: { fontSize: 14, color: contentColor, bullet: { type: 'bullet' as const, color: hex(c.accent) }, paraSpaceAfter: 10, breakLine: true } 
         }));
         
         // Text Left, Image Right
         slide.addText(bullets, { x: 0.5, y: 1.2, w: 5.0, h: 3.8, fontFace: 'Segoe UI', valign: 'top' });
         
         // Image Frame
         const imgX = 5.8;
         const imgY = 1.2;
         const imgW = 3.8;
         const imgH = 3.2;

         // Decorative frame backing
         slide.addShape('rect', { x: imgX + 0.1, y: imgY + 0.1, w: imgW, h: imgH, fill: { color: hex(c.accent), transparency: 60 } });
         
         try {
           slide.addImage({ data: data.images[sd.imageIndex!], x: imgX, y: imgY, w: imgW, h: imgH });
         } catch (e) {
             slide.addText('[IMAGE ERROR]', { x: imgX, y: imgY, w: imgW, h: imgH, color: 'FF0000' });
         }

      } else {
         // Full Width Text
         const bullets = sd.content.map(t => ({ 
             text: t, 
             options: { fontSize: 18, color: contentColor, bullet: { type: 'bullet' as const, color: hex(c.accent) }, paraSpaceAfter: 12, breakLine: true } 
         }));
         slide.addText(bullets, { x: 0.8, y: 1.2, w: 8.4, h: 3.8, fontFace: 'Segoe UI', valign: 'top' });
      }
    }

    // Footer
    addFooter(slide, design, i + 1, data.topic);
  }

  // 3. Thank You Slide
  const tySlide = pptx.addSlide({ masterName: 'TITLE' });
  addDecorations(tySlide, design, true);
  
  tySlide.addText('Thank You', { 
      x: 0, y: 2.0, w: 10, h: 1.5, 
      fontSize: 60, bold: true, color: isDarkColor(c.titleBg) ? 'FFFFFF' : hex(c.primary), align: 'center' 
  });
  
  tySlide.addText('Any Questions?', { 
      x: 0, y: 3.5, w: 10, h: 0.5, 
      fontSize: 24, color: hex(c.accent), align: 'center', italic: true 
  });

  // Export
  const safeName = data.topic.replace(/[^a-zA-Z0-9 \u0600-\u06FF]/g, '').trim().substring(0, 30) || 'Presentation';
  await pptx.writeFile({ fileName: `${safeName}.pptx` });
};

export default generatePresentation;
