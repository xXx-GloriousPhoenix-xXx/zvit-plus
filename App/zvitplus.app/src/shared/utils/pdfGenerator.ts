import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { MetaValue } from '../types/repEditorTypes';

const PAGE_SIZE_MAP: Record<string, [number, number]> = {
  // Размеры в мм
  'A0': [841, 1189],
  'A1': [594, 841],
  'A2': [420, 594],
  'A3': [297, 420],
  'A4': [210, 297],
  'A5': [148, 210],
  'A6': [105, 148],
  'letter': [216, 279], // US Letter
};

export async function generatePdfFromElement(
  element: HTMLElement,
  meta?: MetaValue,
  filename: string = 'document.pdf',
  options: {
    scale?: number;
    margin?: number;
    quality?: number;
  } = {}
): Promise<void> {
  const {
    scale = 2,
    margin = 10,
    quality = 0.95
  } = options;

  try {
    const pageSize = meta?.pageSize || 'A4';
    const orientation = meta?.orientation || 'portrait';
    
    const [widthMM, heightMM] = PAGE_SIZE_MAP[pageSize];
    
    const [pageWidthMM, pageHeightMM] = orientation === 'landscape' 
      ? [Math.max(widthMM, heightMM), Math.min(widthMM, heightMM)]
      : [Math.min(widthMM, heightMM), Math.max(widthMM, heightMM)];

    const contentWidthMM = pageWidthMM - 2 * margin;
    const contentHeightMM = pageHeightMM - 2 * margin;

    console.log(`Generating PDF: ${pageSize} ${orientation}`);
    console.log(`Page dimensions: ${pageWidthMM}x${pageHeightMM}mm`);
    console.log(`Content area: ${contentWidthMM}x${contentHeightMM}mm`);

    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
      foreignObjectRendering: false,
      onclone: (clonedDoc) => {
        const interactiveElements = clonedDoc.querySelectorAll(
          'button, a, input, [onclick], .resize-handle, .element-handle'
        );
        interactiveElements.forEach(el => {
          (el as HTMLElement).style.cssText += ';display:none !important;';
        });
      }
    });

    console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}px`);

    // Рассчитываем размеры контента для PDF
    const imgData = canvas.toDataURL('image/jpeg', quality);
    
    // Создаем PDF с правильными размерами
    const pdf = new jsPDF({
      orientation: orientation as 'portrait' | 'landscape',
      unit: 'mm',
      format: pageSize.toLowerCase() as any
    });

    // Рассчитываем масштабирование для вписывания в страницу
    const aspectRatio = canvas.width / canvas.height;
    let imgWidthMM, imgHeightMM;
    
    if (contentWidthMM / contentHeightMM > aspectRatio) {
      // Высота ограничивающий фактор
      imgHeightMM = contentHeightMM;
      imgWidthMM = contentHeightMM * aspectRatio;
    } else {
      // Ширина ограничивающий фактор
      imgWidthMM = contentWidthMM;
      imgHeightMM = contentWidthMM / aspectRatio;
    }

    // Центрируем изображение на странице
    const offsetX = (pageWidthMM - imgWidthMM) / 2;
    const offsetY = (pageHeightMM - imgHeightMM) / 2;

    console.log(`Image in PDF: ${imgWidthMM}x${imgHeightMM}mm`);
    console.log(`Offset: ${offsetX}x${offsetY}mm`);

    // Добавляем изображение в PDF
    pdf.addImage(imgData, 'JPEG', offsetX, offsetY, imgWidthMM, imgHeightMM);
    
    // Добавляем метаданные
    if (meta?.templateName) {
      pdf.setProperties({
        title: meta.templateName,
        subject: meta.templateTypeName || '',
        author: 'ZvitPlus',
        keywords: 'report, template, document',
        creator: 'ZvitPlus'
      });
    }
    
    pdf.save(filename || `${meta?.templateName || 'document'}.pdf`);
    
    console.log('PDF generated successfully');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Не вдалося згенерувати PDF');
  }
}

export async function generatePdfWithMultiPage(
  element: HTMLElement,
  meta?: MetaValue,
  filename: string = 'document.pdf',
  options: {
    scale?: number;
    margin?: number;
    quality?: number;
  } = {}
): Promise<void> {
  const {
    scale = 1.5,
    margin = 10,
    quality = 0.9
  } = options;

  try {
    const pageSize = meta?.pageSize || 'A4';
    const orientation = meta?.orientation || 'portrait';
    
    const [widthMM, heightMM] = PAGE_SIZE_MAP[pageSize];
    const [pageWidthMM, pageHeightMM] = orientation === 'landscape' 
      ? [Math.max(widthMM, heightMM), Math.min(widthMM, heightMM)]
      : [Math.min(widthMM, heightMM), Math.max(widthMM, heightMM)];

    const contentWidthMM = pageWidthMM - 2 * margin;
    
    console.log(`Generating multi-page PDF: ${pageSize} ${orientation}`);

    // Рендерим элемент
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
      onclone: (clonedDoc) => {
        const interactiveElements = clonedDoc.querySelectorAll(
          'button, a, input, [onclick]'
        );
        interactiveElements.forEach(el => {
          (el as HTMLElement).style.display = 'none';
        });
      }
    });

    const pdf = new jsPDF({
      orientation: orientation as 'portrait' | 'landscape',
      unit: 'mm',
      format: pageSize.toLowerCase() as any
    });

    const imgData = canvas.toDataURL('image/jpeg', quality);
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Рассчитываем размеры в PDF
    const aspectRatio = imgWidth / imgHeight;
    const imgWidthMM = contentWidthMM;
    const imgHeightMM = contentWidthMM / aspectRatio;
    
    // Проверяем, помещается ли на одну страницу
    if (imgHeightMM <= pageHeightMM - 2 * margin) {
      // Помещается на одну страницу
      const offsetY = (pageHeightMM - imgHeightMM) / 2;
      pdf.addImage(imgData, 'JPEG', margin, offsetY, imgWidthMM, imgHeightMM);
    } else {
      // Разбиваем на несколько страниц
      const pageContentHeight = pageHeightMM - 2 * margin;
      let currentPosition = 0;
      let pageNumber = 0;
      
      while (currentPosition < imgHeightMM) {
        if (pageNumber > 0) {
          pdf.addPage();
        }
        
        const pageImgHeight = Math.min(pageContentHeight, imgHeightMM - currentPosition);
        const pageOffsetY = margin + (pageContentHeight - pageImgHeight) / 2;
        
        // Вычисляем координаты для вырезания части canvas
        const srcY = (currentPosition / imgHeightMM) * imgHeight;
        const srcHeight = (pageImgHeight / imgHeightMM) * imgHeight;
        
        // Создаем временный canvas для страницы
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = imgWidth;
        pageCanvas.height = srcHeight;
        
        const ctx = pageCanvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');
        
        // Копируем часть изображения
        ctx.drawImage(
          canvas,
          0, srcY, imgWidth, srcHeight,
          0, 0, imgWidth, srcHeight
        );
        
        const pageImgData = pageCanvas.toDataURL('image/jpeg', quality);
        pdf.addImage(pageImgData, 'JPEG', margin, pageOffsetY, imgWidthMM, pageImgHeight);
        
        currentPosition += pageImgHeight;
        pageNumber++;
      }
    }
    
    // Добавляем метаданные
    if (meta?.templateName) {
      pdf.setProperties({
        title: meta.templateName,
        subject: meta.templateTypeName || '',
        author: 'ZvitPlus',
        keywords: 'report, template, document',
        creator: 'ZvitPlus'
      });
    }
    
    pdf.save(filename || `${meta?.templateName || 'document'}.pdf`);
    
    console.log(`Multi-page PDF generated with ${pdf.internal.pages.length} pages`);
    
  } catch (error) {
    console.error('Error generating multi-page PDF:', error);
    throw new Error('Не вдалося згенерувати PDF');
  }
}

export function shouldSplitToPages(
  element: HTMLElement,
  meta?: MetaValue,
  scale: number = 1.5
): Promise<boolean> {
  return new Promise((resolve) => {
    // Быстрая оценка высоты
    const estimatedHeight = element.offsetHeight * scale / 96 * 25.4; // px to mm
    
    const pageSize = meta?.pageSize || 'A4';
    const orientation = meta?.orientation || 'portrait';
    
    const [widthMM, heightMM] = PAGE_SIZE_MAP[pageSize];
    const pageHeightMM = orientation === 'landscape' 
      ? Math.min(widthMM, heightMM)
      : Math.max(widthMM, heightMM);
    
    // Если высота больше 150% высоты страницы, разбиваем
    resolve(estimatedHeight > pageHeightMM * 1.5);
  });
}

export async function generateDocumentPdf(
  element: HTMLElement,
  meta?: MetaValue,
  filename?: string,
  options: {
    scale?: number;
    margin?: number;
    quality?: number;
    autoSplit?: boolean;
  } = {}
): Promise<void> {
  const {
    scale = 2,
    margin = 10,
    quality = 0.95,
    autoSplit = true
  } = options;

  try {
    if (autoSplit) {
      const needSplit = await shouldSplitToPages(element, meta, scale);
      if (needSplit) {
        return await generatePdfWithMultiPage(
          element, 
          meta, 
          filename, 
          { scale: scale * 0.75, margin, quality }
        );
      }
    }
    
    return await generatePdfFromElement(
      element, 
      meta, 
      filename, 
      { scale, margin, quality }
    );
    
  } catch (error) {
    console.error('Error generating document PDF:', error);
    throw error;
  }
}