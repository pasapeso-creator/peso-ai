// Utility for exporting HTML content to Word document (.docx)
// Uses a simple HTML to Word conversion approach

declare global {
  interface Window {
    saveAs?: (blob: Blob, filename: string) => void;
  }
}

import { DesignTemplate } from './designTemplates';

export interface WordExportOptions {
  filename: string;
  title?: string;
  author?: string;
  design?: DesignTemplate;
}

/**
 * Converts HTML content to a Word document and triggers download
 * @param element - The HTML element to convert
 * @param options - Export options
 */
export const exportToWord = async (
  element: HTMLElement,
  options: WordExportOptions
): Promise<boolean> => {
  try {
    const { filename, title = 'Document', author = '', design } = options;
    
    // Default colors if no design provided
    const primaryColor = design?.colors.primary || '#2F5496';
    const secondaryColor = design?.colors.secondary || '#2F5496';
    const accentColor = design?.colors.accent || '#F2F2F2';
    const textColor = design?.colors.textPrimary || '#000000';
    const titleBg = design?.colors.titleBg || '#ffffff'; // Fallback
    
    // Clone the element to modify
    const clone = element.cloneNode(true) as HTMLElement;
    
    // HELPER: Convert Flexbox headers to Tables (Word loves tables, hates flexbox)
    const convertFlexToTables = (el: HTMLElement) => {
      // Find elements with flex style that likely represent the header row
      const flexRows = Array.from(el.querySelectorAll('div')).filter(div => {
        const style = window.getComputedStyle(div);
        return style.display === 'flex' && style.justifyContent === 'space-between';
      });

      flexRows.forEach(row => {
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.border = 'none';
        table.style.marginBottom = '20px';
        
        const tr = document.createElement('tr');
        
        // Move children into cells
        Array.from(row.children).forEach((child: any) => {
          const td = document.createElement('td');
          td.style.verticalAlign = 'top';
          td.style.padding = '5px';
          td.style.border = 'none';
          
          // Apply minimal internal styling
          const childStyle = window.getComputedStyle(child);
          if (childStyle.textAlign) td.style.textAlign = childStyle.textAlign;
          
          td.appendChild(child.cloneNode(true));
          tr.appendChild(td);
        });

        table.appendChild(tr);
        row.parentNode?.replaceChild(table, row);
      });
    };

    // Apply layout fixes
    convertFlexToTables(clone);

    // Get all inline styles from elements (basic processor)
    const processStyles = (el: HTMLElement) => {
      const computedStyle = window.getComputedStyle(el);
      // We focus on text attributes and background stuff
      const importantStyles = [
        'color', 'background-color', 'font-size', 'font-weight', 'font-family',
        'text-align', 'margin-bottom', 'padding', 'line-height', 'border-bottom',
        'border-top', 'border', 'text-transform', 'letter-spacing'
      ];
      
      let inlineStyle = '';
      
      // Special Handling for Headings
      if (['H1', 'H2', 'H3'].includes(el.tagName)) {
        inlineStyle += `mso-outline-level:${el.tagName.replace('H', '')}; `;
      }

      importantStyles.forEach(prop => {
        const value = computedStyle.getPropertyValue(prop);
        if (value && value !== 'normal' && value !== 'auto' && value !== 'none' && value !== '0px') {
           // Color adjustment for dark mode to print
           if (prop === 'color' && (value === 'rgb(255, 255, 255)' || value === '#fff')) {
             // If background is transparent/white, flip text to black
             const bg = computedStyle.backgroundColor;
             if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent' || bg === 'rgb(255, 255, 255)') {
               inlineStyle += `color: ${textColor}; `;
               return;
             }
           }
           inlineStyle += `${prop}: ${value}; `;
        }
      });
      
      if (inlineStyle) {
        el.setAttribute('style', (el.getAttribute('style') || '') + inlineStyle);
      }
      
      // Process children
      Array.from(el.children).forEach(child => {
        if (child instanceof HTMLElement) {
          processStyles(child);
        }
      });
    };
    
    // We only process specific children if the structure is known to ensure we don't break the table fix
    // processStyles(clone); // Skipping deep computed style copy as it breaks Word logic often. Rely on CSS classes below.

    // Convert images to base64
    const images = clone.querySelectorAll('img');
    for (const img of Array.from(images)) {
      try {
        if (img.src && !img.src.startsWith('data:')) {
          const response = await fetch(img.src);
          const blob = await response.blob();
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          img.src = base64;
          // Ensure image dimensions are respected
          if (img.width) img.style.width = img.width + 'px';
          if (img.height) img.style.height = img.height + 'px';
        }
      } catch (e) {
        console.warn('Could not convert image:', e);
      }
    }
    
    // Build Professional Word XML/HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:w="urn:schemas-microsoft-com:office:word" 
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          /* Page Setup */
          @page {
            size: A4;
            margin: 2.54cm 2.54cm 2.54cm 2.54cm;
            mso-page-orientation: portrait;
          }
          @page Section1 {
             mso-header-margin: 36.0pt;
             mso-footer-margin: 36.0pt;
          }
          div.Section1 { page: Section1; }

          /* Typography */
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            color: ${textColor};
            background: #ffffff;
            text-align: justify; /* Academic standard */
          }
          
          /* Headings */
          h1 { 
            font-size: 24pt; 
            font-weight: bold; 
            margin-top: 24pt; 
            margin-bottom: 12pt; 
            color: ${primaryColor}; 
            page-break-after: avoid; 
            text-align: center;
            border-bottom: 2px solid ${primaryColor};
            padding-bottom: 6px;
          }
          h2 { 
            font-size: 18pt; 
            font-weight: bold; 
            margin-top: 18pt; 
            margin-bottom: 6pt; 
            color: ${secondaryColor}; 
            page-break-after: avoid;
            border-bottom: 1px solid ${accentColor};
          }
          h3 { 
            font-size: 14pt; 
            font-weight: bold; 
            color: ${secondaryColor}; 
            margin-top: 12pt; 
            margin-bottom: 6pt; 
          }
          
          /* Text Elements */
          p { margin-bottom: 10pt; }
          ul, ol { margin-left: 0.5in; margin-bottom: 10pt; }
          li { margin-bottom: 4pt; }
          a { color: ${primaryColor}; text-decoration: underline; }
          strong { color: ${primaryColor}; }
          
          /* Tables */
          table { width: 100%; border-collapse: collapse; margin-bottom: 12pt; }
          td { vertical-align: top; padding: 4pt; }
          
          /* Images */
          img { max-width: 100%; height: auto; }
          
          /* Academic Box Styles */
          .info-box {
            border: 1px solid ${primaryColor};
            background-color: ${accentColor};
            padding: 10pt;
            margin: 10pt 0;
            border-radius: 4pt;
          }
        </style>
      </head>
      <body>
        <div class="Section1">
          ${clone.innerHTML}
        </div>
      </body>
      </html>
    `;
    
    // Create blob with Word MIME type
    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword'
    });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.doc') ? filename : `${filename}.doc`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Word Export Error:', error);
    throw new Error('فشل في تصدير ملف Word');
  }
};

/**
 * Simplified version - exports plain text content to Word
 */
export const exportTextToWord = (
  content: string,
  options: WordExportOptions
): boolean => {
  try {
    const { filename, title = 'Document', author = '' } = options;
    
    // Convert markdown-like syntax to HTML
    let htmlContent = content
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
    
    // Wrap in paragraphs
    htmlContent = `<p>${htmlContent}</p>`;
    
    // Wrap lists
    htmlContent = htmlContent.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
    
    const fullHtml = `
      <!DOCTYPE html>
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:w="urn:schemas-microsoft-com:office:word">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; }
          h1 { font-size: 18pt; } h2 { font-size: 16pt; } h3 { font-size: 14pt; }
          p { margin-bottom: 8pt; text-align: justify; }
        </style>
      </head>
      <body>
        {/* Footer removed */}
        <hr>
        ${htmlContent}
      </body>
      </html>
    `;
    
    const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.doc') ? filename : `${filename}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Word Export Error:', error);
    return false;
  }
};
