// Utility for exporting HTML content to PDF
// Uses html2pdf.js library with improved configuration

declare global {
  interface Window {
    html2pdf: any;
  }
}

export interface PDFExportOptions {
  filename: string;
  margin?: number | [number, number, number, number];
  pageFormat?: 'a4' | 'letter' | 'legal';
  orientation?: 'portrait' | 'landscape';
  quality?: number;
  scale?: number;
}

const defaultOptions: PDFExportOptions = {
  filename: 'document.pdf',
  margin: 10,
  pageFormat: 'a4',
  orientation: 'portrait',
  quality: 0.98,
  scale: 2,
};

/**
 * Exports an HTML element to PDF
 * @param element - The HTML element to export
 * @param options - PDF export options
 * @returns Promise<boolean> - true if successful
 */
export const exportToPDF = async (
  element: HTMLElement,
  options: Partial<PDFExportOptions> = {}
): Promise<boolean> => {
  const config = { ...defaultOptions, ...options };
  
  // Check if html2pdf is available
  if (!window.html2pdf) {
    console.error('html2pdf library not loaded');
    throw new Error('مكتبة PDF غير متاحة');
  }

  try {
    // Clone the element to avoid modifying the original
    const clonedElement = element.cloneNode(true) as HTMLElement;
    
    // Create a temporary container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '210mm'; // A4 width
    container.style.backgroundColor = 'white';
    container.appendChild(clonedElement);
    document.body.appendChild(container);

    // Wait for images to load
    const images = clonedElement.querySelectorAll('img');
    await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) {
              resolve();
            } else {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            }
          })
      )
    );

    // Small delay to ensure rendering is complete
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Configure html2pdf options
    const pdfOptions = {
      margin: config.margin,
      filename: config.filename,
      image: { type: 'jpeg', quality: config.quality },
      html2canvas: {
        scale: config.scale,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: 794, // A4 width in pixels at 96 DPI
        windowHeight: 1123, // A4 height in pixels at 96 DPI
      },
      jsPDF: {
        unit: 'mm',
        format: config.pageFormat,
        orientation: config.orientation,
        compress: true,
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    // Generate and save PDF
    await window.html2pdf().set(pdfOptions).from(clonedElement).save();

    // Cleanup
    document.body.removeChild(container);

    return true;
  } catch (error) {
    console.error('PDF Export Error:', error);
    throw error;
  }
};

/**
 * Alternative: Opens print dialog as fallback
 * @param element - The HTML element to print
 */
export const printElement = (element: HTMLElement): void => {
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  if (!printWindow) {
    throw new Error('المتصفح مانع النوافذ المنبثقة');
  }

  // Get all styles from the current document
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((el) => el.outerHTML)
    .join('\n');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Print Document</title>
      ${styles}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
      <style>
        body { 
          background: white !important; 
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        @media print {
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      </style>
    </head>
    <body>
      ${element.outerHTML}
      <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"><\/script>
      <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"><\/script>
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          if (typeof renderMathInElement !== 'undefined') {
            renderMathInElement(document.body, {
              delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
              ],
              throwOnError: false
            });
          }
          setTimeout(function() {
            window.print();
            window.close();
          }, 500);
        });
      <\/script>
    </body>
    </html>
  `);

  printWindow.document.close();
};
