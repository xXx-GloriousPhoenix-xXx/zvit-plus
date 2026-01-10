import type { AlignType, FontWeight, RepElement, TextElement } from "../../../types";

type TextPropertiesProps = {
    selectedElement: TextElement;
    updatePayload: (id: string, payloadUpdates: Partial<RepElement['payload']>) => void;
}

import cl from '../PropertyPanel.module.css';

export function TextProperties({
    selectedElement,
    updatePayload
} : TextPropertiesProps) {
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
                    placeholder={
                        selectedElement.mode === 'dynamic' 
                        ? '{variable_name}' 
                        : 'Введіть текст...'
                    }
                />
            </div>
            <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>Розмір шрифту</label>
                <input
                    type="number"
                    value={selectedElement.payload.fontSize || 16}
                    onChange={(e) => updatePayload(selectedElement.id, { 
                        fontSize: parseInt(e.target.value) || 16 
                    })}
                    className={cl.PropertyInput}
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
                />
            </div>
            <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>Вирівнювання</label>
                <select
                    value={selectedElement.payload.align || 'left'}
                    onChange={(e) => updatePayload(selectedElement.id, { 
                        align: e.target.value as AlignType 
                    })}
                    className={cl.PropertySelect}
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
                >
                    <option value="normal">Звичайний</option>
                    <option value="bold">Жирний</option>
                </select>
            </div>
        </>
    )
}