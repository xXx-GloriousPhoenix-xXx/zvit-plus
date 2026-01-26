// shared/hooks/useResize.ts - ОПТИМИЗИРОВАННАЯ ВЕРСИЯ
import { useState, useCallback, useRef, useEffect } from 'react';
import type { RepElement } from '../types/repEditorTypes';

export function useResize(
    canvasRef: React.RefObject<HTMLDivElement | null>,
    updateElement: (id: string, updates: Partial<RepElement>) => void,
    readonly: boolean = false
) {
    const [resizingElement, setResizingElement] = useState<string | null>(null);
    const resizingElementRef = useRef<string | null>(null);
    const animationFrameRef = useRef<number | null>(null); // <-- ДЛЯ requestAnimationFrame
    const lastUpdateTimeRef = useRef<number>(0); // <-- ДЛЯ троттлинга

    // Синхронизируем ref с state
    useEffect(() => {
        resizingElementRef.current = resizingElement;
    }, [resizingElement]);

    const resizeRef = useRef<{
        startX: number;
        startY: number;
        startWidth: number;
        startHeight: number;
        elementX: number;
        elementY: number;
        elementEl: HTMLElement | null; // <-- СОХРАНИМ ССЫЛКУ НА ЭЛЕМЕНТ
    }>({
        startX: 0,
        startY: 0,
        startWidth: 0,
        startHeight: 0,
        elementX: 0,
        elementY: 0,
        elementEl: null
    });

    // Очищаем animation frame при размонтировании
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    const handleResizeStart = useCallback((e: React.MouseEvent, element: RepElement) => {
        if (readonly) return;
        
        e.stopPropagation();
        e.preventDefault();
        
        setResizingElement(element.id);
        resizingElementRef.current = element.id;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const elementEl = document.getElementById(element.id);
        
        resizeRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            startWidth: element.size.width,
            startHeight: element.size.height,
            elementX: element.position.x,
            elementY: element.position.y,
            elementEl // Сохраняем элемент
        };

        // Сразу обновляем DOM для немедленной обратной связи
        if (elementEl) {
            elementEl.style.transition = 'none'; // Отключаем анимации
            elementEl.style.cursor = 'nwse-resize';
        }

        // Функция обновления с requestAnimationFrame
        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!resizingElementRef.current) return;
            
            // Отменяем предыдущий кадр если он есть
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            
            // Используем requestAnimationFrame для плавности
            animationFrameRef.current = requestAnimationFrame(() => {
                const currentResizingElement = resizingElementRef.current;
                if (!currentResizingElement || !canvasRef.current) return;

                const deltaX = moveEvent.clientX - resizeRef.current.startX;
                const deltaY = moveEvent.clientY - resizeRef.current.startY;

                const newWidth = Math.max(120, resizeRef.current.startWidth + deltaX);
                const newHeight = Math.max(60, resizeRef.current.startHeight + deltaY);

                const maxWidth = canvasRef.current.scrollWidth - resizeRef.current.elementX;
                const maxHeight = canvasRef.current.scrollHeight - resizeRef.current.elementY;

                const finalWidth = Math.min(newWidth, maxWidth);
                const finalHeight = Math.min(newHeight, maxHeight);

                // 1. Сначала обновляем DOM напрямую для мгновенной обратной связи
                const elementEl = resizeRef.current.elementEl || document.getElementById(currentResizingElement);
                if (elementEl) {
                    elementEl.style.width = `${finalWidth}px`;
                    elementEl.style.height = `${finalHeight}px`;
                }

                // 2. Троттлим обновление состояния (не чаще чем 60fps)
                const now = Date.now();
                if (now - lastUpdateTimeRef.current > 16) { // ~60 FPS
                    updateElement(currentResizingElement, {
                        size: {
                            width: finalWidth,
                            height: finalHeight
                        }
                    });
                    lastUpdateTimeRef.current = now;
                }
            });
        };

        const handleMouseUp = () => {
            // Отменяем animation frame
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }

            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            
            // Восстанавливаем курсор и анимации
            const elementEl = resizeRef.current.elementEl || 
                (resizingElementRef.current ? document.getElementById(resizingElementRef.current) : null);
            
            if (elementEl) {
                elementEl.style.transition = '';
                elementEl.style.cursor = '';
            }
            
            // Фиксируем окончательные размеры
            if (resizingElementRef.current) {
                const elementEl = document.getElementById(resizingElementRef.current);
                if (elementEl) {
                    const finalWidth = parseFloat(elementEl.style.width) || resizeRef.current.startWidth;
                    const finalHeight = parseFloat(elementEl.style.height) || resizeRef.current.startHeight;
                    
                    updateElement(resizingElementRef.current, {
                        size: {
                            width: finalWidth,
                            height: finalHeight
                        }
                    });
                }
            }
            
            setResizingElement(null);
            resizingElementRef.current = null;
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [canvasRef, updateElement, readonly]);

    const handleResizeMove = useCallback((e: React.MouseEvent) => {
        // Эта функция теперь вызывается из CanvasArea
    }, []);

    const handleResizeEnd = useCallback(() => {
        // Очищаем принудительно
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        
        // Восстанавливаем курсор
        if (resizingElementRef.current) {
            const elementEl = document.getElementById(resizingElementRef.current);
            if (elementEl) {
                elementEl.style.transition = '';
                elementEl.style.cursor = '';
            }
        }
        
        setResizingElement(null);
        resizingElementRef.current = null;
    }, []);

    return {
        resizingElement,
        handleResizeStart,
        handleResizeMove,
        handleResizeEnd
    };
}