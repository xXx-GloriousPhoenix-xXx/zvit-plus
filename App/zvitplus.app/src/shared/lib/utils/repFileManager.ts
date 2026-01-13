// shared/utils/templatePackage.ts
import JSZip from "jszip";
import type { RepTemplate, MetaValue } from "@/shared/types/repEditorTypes";

export interface RepFileStructure {
    // meta.json - основные метаданные
    "meta.json": MetaValue;
    // struct.json - структура элементов
    "struct.json": {
        elements: RepTemplate['elements'];
    };
    // data/ - для данных (пока пусто)
    // media/ - для медиа (пока пусто)
}

export async function createRepFile(template: RepTemplate): Promise<Blob> {
    const zip = new JSZip();
    
    // 1. meta.json
    zip.file("meta.json", JSON.stringify(template.meta, null, 2));
    
    // 2. struct.json
    zip.file("struct.json", JSON.stringify({
        elements: template.elements
    }, null, 2));
    
    // 3. Создаем пустые папки для будущего использования
    zip.folder("data");
    zip.folder("media");
    
    // Генерируем ZIP архив
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