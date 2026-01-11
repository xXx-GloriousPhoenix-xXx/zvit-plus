import { useState, useCallback, useRef } from 'react';
import type { RepElement } from '../types';

export function useDragAndDrop(
  canvasRef: React.RefObject<HTMLDivElement | null>,
  updateElement: (id: string, updates: Partial<RepElement>) => void
) {
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, element: RepElement) => {
      e.stopPropagation();
      setDraggedElement(element.id);

      const canvas = canvasRef.current;
      if (!canvas) return;

      const canvasRect = canvas.getBoundingClientRect();

      dragOffset.current = {
        x: e.clientX - canvasRect.left - element.position.x,
        y: e.clientY - canvasRect.top - element.position.y
      };
    },
    [canvasRef]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggedElement) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const canvasRect = canvas.getBoundingClientRect();
      const scrollLeft = canvas.scrollLeft;
      const scrollTop = canvas.scrollTop;

      let newX = e.clientX - canvasRect.left + scrollLeft - dragOffset.current.x;
      let newY = e.clientY - canvasRect.top + scrollTop - dragOffset.current.y;

      const elementEl = document.getElementById(draggedElement);
      if (!elementEl) return;
      const width = elementEl.offsetWidth;
      const height = elementEl.offsetHeight;

      newX = Math.max(0, Math.min(newX, canvas.scrollWidth - width));
      newY = Math.max(0, Math.min(newY, canvas.scrollHeight - height));

      updateElement(draggedElement, {
        position: { x: newX, y: newY }
      });
    },
    [draggedElement, canvasRef, updateElement]
  );

  const handleMouseUp = useCallback(() => {
    setDraggedElement(null);
  }, []);

  return { draggedElement, handleMouseDown, handleMouseMove, handleMouseUp };
}
