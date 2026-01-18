// shared/utils/templatePackage.ts
import JSZip from "jszip";
import type { RepTemplate, MetaValue, RepElement } from "@/shared/types/repEditorTypes";
import html2canvas from "html2canvas";
import type { RepDocData, RepDocFiles } from "@/shared/api/doc/models";

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

export async function packRepFile(template: RepTemplate, previewElement?: HTMLElement | null): Promise<Blob> {
    const zip = new JSZip();
    
    zip.file("meta.json", JSON.stringify(template.meta, null, 2));
    
    zip.file("struct.json", JSON.stringify({
        elements: template.elements
    }, null, 2));

    if (previewElement) {
        try {
          const canvas = await html2canvas(previewElement, {
            scale: 0.5,
            backgroundColor: "#ffffff",
            useCORS: true,
            logging: false
          });
          
          const previewBlob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => {
              if (blob) resolve(blob);
            }, 'image/jpeg', 0.7);
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

export async function unpackRepFile(blob: Blob): Promise<{
    data: RepDocData;
    files: RepDocFiles;
}> {
    const zip = new JSZip();
    const zipData = await zip.loadAsync(blob);
    
    // Читаем meta.json
    const metaContent = await zipData.file("meta.json")?.async("text");
    if (!metaContent) {
        throw new Error("Файл meta.json не найден в архиве");
    }
    const meta = JSON.parse(metaContent) as MetaValue;
    
    // Читаем struct.json
    const structContent = await zipData.file("struct.json")?.async("text");
    if (!structContent) {
        throw new Error("Файл struct.json не найден в архиве");
    }
    const struct = JSON.parse(structContent) as { elements: RepElement[] };
    
    // Создаем URL для файлов
    let previewUrl: string | undefined;
    const previewFile = zipData.file("preview.jpg") || zipData.file("preview.jpeg");
    if (previewFile) {
        const previewBlob = await previewFile.async("blob");
        previewUrl = URL.createObjectURL(previewBlob);
    }
    
    const dataFiles: Record<string, string> = {};
    const mediaFiles: Record<string, string> = {};
    
    const dataFolder = zipData.folder("data");
    if (dataFolder) {
        const dataFilePromises = Object.keys(dataFolder.files).map(async (filename) => {
            const file = dataFolder.file(filename);
            if (file && !file.dir) {
                const blob = await file.async("blob");
                dataFiles[filename] = URL.createObjectURL(blob);
            }
        });
        await Promise.all(dataFilePromises);
    }
    
    const mediaFolder = zipData.folder("media");
    if (mediaFolder) {
        const mediaFilePromises = Object.keys(mediaFolder.files).map(async (filename) => {
            const file = mediaFolder.file(filename);
            if (file && !file.dir) {
                const blob = await file.async("blob");
                mediaFiles[filename] = URL.createObjectURL(blob);
            }
        });
        await Promise.all(mediaFilePromises);
    }
    
    return {
        data: {
            meta,
            elements: struct.elements
        },
        files: {
            previewUrl,
            dataFiles,
            mediaFiles
        }
    };
}

export function createRepFileName(meta: MetaValue): string {
    const name = meta.templateName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    
    return `${name || 'template'}.rep`;
}