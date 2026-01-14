import { useState, useCallback, useRef } from 'react';
import type { RepElement } from '../../types/repEditorTypes';

export function useDragAndDrop(
  canvasWrapperRef: React.RefObject<HTMLDivElement | null>, // Принимаем ref на CanvasWrapper
  updateElement: (id: string, updates: Partial<RepElement>) => void
) {
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, element: RepElement) => {
      e.stopPropagation();
      setDraggedElement(element.id);

      const canvasWrapper = canvasWrapperRef.current;
      if (!canvasWrapper) return;

      const canvasRect = canvasWrapper.getBoundingClientRect();
      
      dragOffset.current = {
        x: e.clientX - canvasRect.left - element.position.x,
        y: e.clientY - canvasRect.top - element.position.y
      };

      console.log('CanvasWrapper rect:', canvasRect);
    },
    [canvasWrapperRef]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggedElement) return;

      const canvasWrapper = canvasWrapperRef.current; // Используем тот же CanvasWrapper
      if (!canvasWrapper) return;

      const canvasRect = canvasWrapper.getBoundingClientRect();
      
      let newX = e.clientX - canvasRect.left - dragOffset.current.x;
      let newY = e.clientY - canvasRect.top - dragOffset.current.y;

      const elementEl = document.getElementById(draggedElement);
      if (!elementEl) return;
      
      const elementWidth = elementEl.offsetWidth;
      const elementHeight = elementEl.offsetHeight;

      const maxX = Math.max(0, canvasRect.width - elementWidth);
      const maxY = Math.max(0, canvasRect.height - elementHeight);

      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      updateElement(draggedElement, {
        position: { x: newX, y: newY }
      });
    },
    [draggedElement, canvasWrapperRef, updateElement]
  );

  const handleMouseUp = useCallback(() => {
    setDraggedElement(null);
  }, []);

  return { draggedElement, handleMouseDown, handleMouseMove, handleMouseUp };
}