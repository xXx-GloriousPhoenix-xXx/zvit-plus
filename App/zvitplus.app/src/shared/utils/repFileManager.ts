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

export async function packRepFile(
    template: RepTemplate,
    files?: RepDocFiles,
    previewElement?: HTMLElement | null
): Promise<Blob> {
    const zip = new JSZip();

    zip.file("meta.json", JSON.stringify(template.meta, null, 2));
    zip.file("struct.json", JSON.stringify({ elements: template.elements }, null, 2));

    if (previewElement) {
        try {
            const canvas = await html2canvas(previewElement, {
                scale: 0.5,
                backgroundColor: "#ffffff",
                useCORS: true,
                logging: false
            });

            const previewBlob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob(
                    blob => (blob ? resolve(blob) : reject()),
                    "image/jpeg",
                    0.7
                );
            });

            zip.file("preview.jpg", previewBlob);
        } catch (err) {
            console.warn("Failed to generate preview:", err);
        }
    }

    const nameCheckArray = ['meta.json', 'struct.json'];

    if (files?.dataFiles && Object.keys(files.dataFiles).length > 0) {
        const dataFolder = zip.folder("data")!;
        for (const [id, file] of Object.entries(files.dataFiles)) {
            const fileName = id.split('/').pop() || id;
            if (!nameCheckArray.includes(fileName))
            {
                dataFolder.file(fileName, file);
            }
        }
    }

    if (files?.mediaFiles && Object.keys(files.mediaFiles).length > 0) {
        const mediaFolder = zip.folder("media")!;
        for (const [id, file] of Object.entries(files.mediaFiles)) {
            const fileName = id.split('/').pop() || id;
            if (!nameCheckArray.includes(fileName))
            {
                mediaFolder.file(fileName, file);
            }
        }
    }

    return zip.generateAsync({ type: "blob" });
}


export async function unpackRepFile(blob: Blob): Promise<{
    data: RepDocData;
    files: RepDocFiles;
    // preview: Blob | undefined;
}> {
    const zip = await JSZip.loadAsync(blob);

    // meta.json
    const metaText = await zip.file("meta.json")?.async("text");
    if (!metaText) {
        throw new Error("meta.json not found");
    }
    const meta = JSON.parse(metaText) as MetaValue;

    // struct.json
    const structText = await zip.file("struct.json")?.async("text");
    if (!structText) {
        throw new Error("struct.json not found");
    }
    const struct = JSON.parse(structText) as { elements: RepElement[] };

    // preview
    let preview: Blob | undefined;
    const previewFile =
        zip.file("preview.jpg") || zip.file("preview.jpeg");
    if (previewFile) {
        preview = await previewFile.async("blob");
    }

    // data/
    const dataFiles: Record<string, File> = {};
    const dataFolder = zip.folder("data");
    if (dataFolder) {
        for (const [path, entry] of Object.entries(dataFolder.files)) {
            if (!entry.dir) {
                const blob = await entry.async("blob");
                const name = path.replace(/^data\//, "");
                dataFiles[name] = new File([blob], name, {
                    type: blob.type || "application/octet-stream"
                });
            }
        }
    }

    // media/
    const mediaFiles: Record<string, File> = {};
    const mediaFolder = zip.folder("media");
    if (mediaFolder) {
        for (const [path, entry] of Object.entries(mediaFolder.files)) {
            if (!entry.dir) {
                const blob = await entry.async("blob");
                const name = path.replace(/^media\//, "");
                mediaFiles[name] = new File([blob], name, {
                    type: blob.type || "application/octet-stream"
                });
            }
        }
    }

    return {
        data: {
            meta,
            elements: struct.elements
        },
        files: {
            dataFiles,
            mediaFiles,
            previewUrl: preview
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