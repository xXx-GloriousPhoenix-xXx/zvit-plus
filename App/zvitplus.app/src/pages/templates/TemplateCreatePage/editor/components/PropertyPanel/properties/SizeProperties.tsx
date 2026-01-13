import { useState, useEffect } from "react";
import type { RepElement, RepElementType } from "@/shared/types/repEditorTypes";
import cl from '../PropertyPanel.module.css';
import { useRepEditorContext } from "@/app/context/RepEditorContext";

type SizePropertiesProps = {
    selectedElement: RepElement;
    updateElement: (id: string, updates: Partial<RepElement> & {
        type?: RepElementType | undefined;
    }) => void
}

export function SizeProperties({
    selectedElement,
    updateElement
}: SizePropertiesProps) {
    const { canvasRef } = useRepEditorContext();
    const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });

    // Получаем размеры canvas при монтировании и при изменении
    useEffect(() => {
        const updateCanvasDimensions = () => {
            if (canvasRef.current) {
                const canvas = canvasRef.current;
                setCanvasDimensions({
                    width: canvas.scrollWidth,
                    height: canvas.scrollHeight
                });
            }
        };

        updateCanvasDimensions();
        
        // Обновляем при ресайзе окна
        window.addEventListener('resize', updateCanvasDimensions);
        return () => window.removeEventListener('resize', updateCanvasDimensions);
    }, [canvasRef]);

    const handlePositionChange = (axis: 'x' | 'y', value: number) => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const elementEl = document.getElementById(selectedElement.id);
        
        let newValue = Math.max(0, value);
        
        if (elementEl) {
            const elementWidth = elementEl.offsetWidth;
            const elementHeight = elementEl.offsetHeight;
            
            if (axis === 'x') {
                newValue = Math.min(newValue, canvas.scrollWidth - elementWidth);
            } else {
                newValue = Math.min(newValue, canvas.scrollHeight - elementHeight);
            }
        } else {
            // Если элемент еще не отрендерен, используем его сохраненные размеры
            if (axis === 'x') {
                newValue = Math.min(newValue, canvas.scrollWidth - selectedElement.size.width);
            } else {
                newValue = Math.min(newValue, canvas.scrollHeight - selectedElement.size.height);
            }
        }

        updateElement(selectedElement.id, {
            position: {
                ...selectedElement.position,
                [axis]: Math.round(newValue)
            }
        });
    };

    const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const minSize = dimension === 'width' ? 80 : 40;
        
        let newValue = Math.max(minSize, value);
        
        // Ограничиваем максимальный размер в зависимости от позиции элемента
        const maxSize = dimension === 'width' 
            ? canvas.scrollWidth - selectedElement.position.x
            : canvas.scrollHeight - selectedElement.position.y;
        
        newValue = Math.min(newValue, maxSize);

        updateElement(selectedElement.id, {
            size: {
                ...selectedElement.size,
                [dimension]: Math.round(newValue)
            }
        });
    };

    return (
        <>
            <div className={cl.PropertyRow}>
                <div className={cl.PropertyGroup}>
                    <label className={cl.PropertyLabel}>X</label>
                    <input
                        type="number"
                        value={Math.round(selectedElement.position.x)}
                        onChange={(e) => handlePositionChange('x', parseInt(e.target.value) || 0)}
                        className={cl.PropertyInput}
                        min="0"
                        max={canvasDimensions.width - selectedElement.size.width}
                    />
                </div>
            
                <div className={cl.PropertyGroup}>
                    <label className={cl.PropertyLabel}>Y</label>
                    <input
                        type="number"
                        value={Math.round(selectedElement.position.y)}
                        onChange={(e) => handlePositionChange('y', parseInt(e.target.value) || 0)}
                        className={cl.PropertyInput}
                        min="0"
                        max={canvasDimensions.height - selectedElement.size.height}
                    />
                </div>
            </div>

            <div className={cl.PropertyRow}>
                <div className={cl.PropertyGroup}>
                    <label className={cl.PropertyLabel}>Ширина</label>
                    <input
                        type="number"
                        value={Math.round(selectedElement.size.width)}
                        onChange={(e) => handleSizeChange('width', parseInt(e.target.value) || 80)}
                        className={cl.PropertyInput}
                        min="80"
                        max={canvasDimensions.width - selectedElement.position.x}
                    />
                </div>
                <div className={cl.PropertyGroup}>
                    <label className={cl.PropertyLabel}>Висота</label>
                    <input
                        type="number"
                        value={Math.round(selectedElement.size.height)}
                        onChange={(e) => handleSizeChange('height', parseInt(e.target.value) || 40)}
                        className={cl.PropertyInput}
                        min="40"
                        max={canvasDimensions.height - selectedElement.position.y}
                    />
                </div>
            </div>

            {/* Информация о пределах для отладки (можно удалить позже) */}
            <div className={cl.PropertyGroup} style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#666' }}>
                <div className={cl.PropertyLabel}>Ограничения:</div>
                <div className={cl.PropertyValue}>
                    <div>Canvas: {canvasDimensions.width}×{canvasDimensions.height}px</div>
                    <div>Max X: {canvasDimensions.width - selectedElement.size.width}px</div>
                    <div>Max Y: {canvasDimensions.height - selectedElement.size.height}px</div>
                    <div>Max Width: {canvasDimensions.width - selectedElement.position.x}px</div>
                    <div>Max Height: {canvasDimensions.height - selectedElement.position.y}px</div>
                </div>
            </div>
        </>
    );
}