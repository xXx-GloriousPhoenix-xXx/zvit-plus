import type { ImageElement, RepElement } from "../../../../../../../shared/types/repEditorTypes";

type ImagePropertiesProps = {
    selectedElement: ImageElement;
    updatePayload: (id: string, payloadUpdates: Partial<RepElement['payload']>) => void;
}

import cl from '../PropertyPanel.module.css';

export function ImageProperties({
    selectedElement,
    updatePayload
} : ImagePropertiesProps) {
    return (
        <>
            <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>Шлях до зображення</label>
                <input
                    type="text"
                    value={selectedElement.payload.src || ''}
                    onChange={(e) => updatePayload(selectedElement.id, { 
                        src: e.target.value 
                    })}
                    placeholder="media/logo.png"
                    className={cl.PropertyInput}
                />
            </div>
            <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>Alt текст</label>
                <input
                    type="text"
                    value={selectedElement.payload.alt || ''}
                    onChange={(e) => updatePayload(selectedElement.id, { 
                        alt: e.target.value 
                    })}
                    placeholder="Опис зображення"
                    className={cl.PropertyInput}
                />
            </div>
        </>
    );
}