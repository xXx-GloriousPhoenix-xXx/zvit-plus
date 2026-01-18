// properties/TextProperties.tsx
import type { HorizontalAlignType, FontWeight, RepElement, TextElement } from "@/shared/types/repEditorTypes";
import cl from '../PropertyPanel.module.css';

type TextPropertiesProps = {
    selectedElement: TextElement;
    updatePayload: (id: string, payloadUpdates: Partial<RepElement['payload']>) => void;
    readonly?: boolean;
    isReportMode?: boolean;
}

export function TextProperties({
    selectedElement,
    updatePayload,
    readonly = false,
    isReportMode = false
} : TextPropertiesProps) {
    const isDynamicElement = selectedElement.mode === 'dynamic';
    if (isReportMode) {
        return (
            <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>Текст звіту</label>
                {readonly ? (
                    <div className={cl.PropertyValue}>
                        {selectedElement.payload.text || '(текст не вказано)'}
                    </div>
                ) : (
                    <textarea
                        value={selectedElement.payload.text || ''}
                        onChange={(e) => updatePayload(selectedElement.id, { 
                            text: e.target.value 
                        })}
                        rows={3}
                        className={cl.PropertyTextarea}
                        placeholder="Введіть текст..."
                        disabled={readonly || !isDynamicElement}
                        style={{resize: isDynamicElement ? "vertical" : "none"}}
                    />
                )}
            </div>
        );
    }

    return (
        <>
            <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>Текст</label>
                <textarea
                    value={selectedElement.payload.text || ''}
                    onChange={(e) => updatePayload(selectedElement.id, { 
                        text: e.target.value 
                    })}
                    rows={3}
                    className={cl.PropertyTextarea}
                    placeholder="Введіть текст..."
                    disabled={readonly}
                />
            </div>
            
            {!readonly && (
                <>
                    <div className={cl.PropertyGroup}>
                        <label className={cl.PropertyLabel}>Розмір шрифту</label>
                        <input
                            type="number"
                            value={selectedElement.payload.fontSize || 16}
                            onChange={(e) => updatePayload(selectedElement.id, { 
                                fontSize: parseInt(e.target.value) || 16 
                            })}
                            className={cl.PropertyInput}
                            disabled={readonly}
                        />
                    </div>
                    <div className={cl.PropertyGroup}>
                        <label className={cl.PropertyLabel}>Колір</label>
                        <input
                            type="color"
                            value={selectedElement.payload.color || '#000000'}
                            onChange={(e) => updatePayload(selectedElement.id, { 
                                color: e.target.value 
                            })}
                            className={cl.PropertyColorInput}
                            disabled={readonly}
                        />
                    </div>
                    <div className={cl.PropertyGroup}>
                        <label className={cl.PropertyLabel}>Вирівнювання</label>
                        <select
                            value={selectedElement.payload.align || 'left'}
                            onChange={(e) => updatePayload(selectedElement.id, { 
                                align: e.target.value as HorizontalAlignType 
                            })}
                            className={cl.PropertySelect}
                            disabled={readonly}
                        >
                            <option value="left">Ліворуч</option>
                            <option value="center">По центру</option>
                            <option value="right">Праворуч</option>
                        </select>
                    </div>
                    <div className={cl.PropertyGroup}>
                        <label className={cl.PropertyLabel}>Насиченість</label>
                        <select
                            value={selectedElement.payload.fontWeight || 'normal'}
                            onChange={(e) => updatePayload(selectedElement.id, { 
                                fontWeight: e.target.value as FontWeight 
                            })}
                            className={cl.PropertySelect}
                            disabled={readonly}
                        >
                            <option value="normal">Звичайний</option>
                            <option value="bold">Жирний</option>
                        </select>
                    </div>
                </>
            )}
        </>
    )
}

// Почти всё гуд
// Отредактировать чтобы было сохранение ссылок для добавления данных
// Запретить ресайз и мув объектов
// Просмотреть работу пропсов
// Добавить загрузку