// shared/utils/templatePackage.ts
import JSZip from "jszip";
import type { RepTemplate, MetaValue } from "@/shared/types/repEditorTypes";
import html2canvas from "html2canvas";

export interface RepFileStructure {
    // meta.json - основні метадані
    "meta.json": MetaValue;

    // struct.json - структура
    "struct.json": {
        elements: RepTemplate['elements'];
    };

    // preview.jpeg - попередній перегляд

    // data/ - директорія даних для графіків
    // media/ - директорія зображень
}

export async function createRepFile(template: RepTemplate, previewElement?: HTMLElement | null): Promise<Blob> {
    const zip = new JSZip();
    
    zip.file("meta.json", JSON.stringify(template.meta, null, 2));
    
    zip.file("struct.json", JSON.stringify({
        elements: template.elements
    }, null, 2));

    if (previewElement) {
        try {
          const canvas = await html2canvas(previewElement, {
            scale: 0.5, // Уменьшаем размер для превью
            backgroundColor: "#ffffff",
            useCORS: true,
            logging: false
          });
          
          const previewBlob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => {
              if (blob) resolve(blob);
            }, 'image/jpeg', 0.7); // JPEG с качеством 70%
          });
          
          zip.file("preview.jpg", previewBlob);
        } catch (error) {
          console.warn("Failed to generate preview:", error);
        }
      }

    zip.folder("data");
    zip.folder("media");
    
    return await zip.generateAsync({ type: "blob" });
}

export function createRepFileName(meta: MetaValue): string {
    const name = meta.templateName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    
    return `${name || 'template'}.rep`;
}