// shared/hooks/useDragAndDrop.ts - ИСПРАВЛЕННАЯ ВЕРСИЯ
import { useState, useCallback, useRef, useEffect } from 'react';
import type { RepElement } from '../types/repEditorTypes';

export function useDragAndDrop(
    canvasWrapperRef: React.RefObject<HTMLDivElement | null>,
    updateElement: (id: string, updates: Partial<RepElement>) => void,
    readonly: boolean = false
) {
    const [draggedElement, setDraggedElement] = useState<string | null>(null);
    const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const draggedElementRef = useRef<string | null>(null); // <-- ДОБАВЛЕНО
    const canvasRectRef = useRef<DOMRect | null>(null); // <-- ДОБАВЛЕНО

    // Синхронизируем ref с state
    useEffect(() => {
        draggedElementRef.current = draggedElement;
    }, [draggedElement]);

    const handleMouseDown = useCallback((
        e: React.MouseEvent,
        element: RepElement,
        resizeHandleClass?: string
    ) => {
        if (readonly) {
          return;
        }
        
        const target = e.target as HTMLElement;
        if (resizeHandleClass && target.closest(`.${resizeHandleClass}`)) {
          return;
        }

        e.stopPropagation();
        e.preventDefault();
      
        setDraggedElement(element.id);
        draggedElementRef.current = element.id; // <-- ОБНОВЛЯЕМ REF СРАЗУ

        const canvasWrapper = canvasWrapperRef.current;
        if (!canvasWrapper) {
            return;
        }

        const canvasRect = canvasWrapper.getBoundingClientRect();
        canvasRectRef.current = canvasRect; // <-- СОХРАНЯЕМ В REF
      
        dragOffset.current = {
            x: e.clientX - canvasRect.left - element.position.x,
            y: e.clientY - canvasRect.top - element.position.y
        };


        // Функции объявляем внутри handleMouseDown чтобы иметь доступ к актуальным refs
        const handleMouseMove = (moveEvent: MouseEvent) => {
            const currentDraggedElement = draggedElementRef.current; // <-- БЕРЁМ ИЗ REF
            const currentCanvasRect = canvasRectRef.current; // <-- БЕРЁМ ИЗ REF
            
            if (!currentDraggedElement) {
                return;
            }

            if (!currentCanvasRect) {
                return;
            }

            let newX = moveEvent.clientX - currentCanvasRect.left - dragOffset.current.x;
            let newY = moveEvent.clientY - currentCanvasRect.top - dragOffset.current.y;

            // Проверяем границы
            const elementEl = document.getElementById(currentDraggedElement);
            if (elementEl) {
                const elementWidth = elementEl.offsetWidth;
                const elementHeight = elementEl.offsetHeight;

                const maxX = Math.max(0, currentCanvasRect.width - elementWidth);
                const maxY = Math.max(0, currentCanvasRect.height - elementHeight);

                newX = Math.max(0, Math.min(newX, maxX));
                newY = Math.max(0, Math.min(newY, maxY));
            }

            updateElement(currentDraggedElement, {
                position: { x: newX, y: newY }
            });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            setDraggedElement(null);
            draggedElementRef.current = null;
            canvasRectRef.current = null;
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [canvasWrapperRef, updateElement, readonly]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {}, []);

    const handleMouseUp = useCallback(() => {
        setDraggedElement(null);
        draggedElementRef.current = null;
        canvasRectRef.current = null;
    }, []);

    return {
        draggedElement,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp
    };
}