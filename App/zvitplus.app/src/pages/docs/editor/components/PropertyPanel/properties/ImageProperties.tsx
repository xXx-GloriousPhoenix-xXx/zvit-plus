// properties/ImageProperties.tsx
import type { ImageElement, RepElement } from "@/shared/types/repEditorTypes";
import cl from '../PropertyPanel.module.css';

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
    
    // Для отчетов показываем упрощенную версию
    if (isReportMode) {
        return (
            <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>Шлях до зображення</label>
                {readonly ? (
                    <div className={cl.PropertyValue}>
                        {selectedElement.payload.src || '(зображення не вказано)'}
                    </div>
                ) : (
                    <input
                        type="text"
                        value={selectedElement.payload.src || ''}
                        onChange={(e) => updatePayload(selectedElement.id, { 
                            src: e.target.value 
                        })}
                        placeholder="Назва змінної або шлях до файлу"
                        className={cl.PropertyInput}
                        disabled={readonly}
                    />
                )}
            </div>
        );
    }

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
                    disabled={readonly}
                />
            </div>
            
            {!readonly && (
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
            )}
        </>
    );
}