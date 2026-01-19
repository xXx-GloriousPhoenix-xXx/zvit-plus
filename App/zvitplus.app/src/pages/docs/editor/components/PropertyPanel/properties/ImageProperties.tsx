// properties/ImageProperties.tsx
import type { ImageElement, RepElement } from "@/shared/types/repEditorTypes";
import cl from '../PropertyPanel.module.css';

import { FileDropZone } from "@/shared/ui/FileDropZone/FileDropZone";
import { setImage } from "@/shared/api/doc/slice";
import { useAppDispatch } from "@/app/store/hooks";

type ImagePropertiesProps = {
    selectedElement: ImageElement;
    updatePayload: (id: string, payloadUpdates: Partial<RepElement['payload']>) => void;
    readonly?: boolean;
    isReportMode?: boolean;
}

export function ImageProperties({
    selectedElement,
    updatePayload,
    readonly = false,
    isReportMode = false
} : ImagePropertiesProps) {
    
    const dispatch = useAppDispatch();

    if (isReportMode) {
        return (
            <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>Зображення</label>
                {readonly ? (
                    <div className={cl.PropertyValue}>
                        {selectedElement.payload.src || '(зображення не вказано)'}
                    </div>
                ) : (
                    <FileDropZone
                        mode='image'
                        onFileUpload={(file: File, fileUrl: string) => {
                            const id = selectedElement.id;
                            updatePayload(id, { src: fileUrl });
                            dispatch(setImage({ id, file }));
                        }}
                    />
                )}
            </div>
        );
    }
    else {
        return null;
    }
}