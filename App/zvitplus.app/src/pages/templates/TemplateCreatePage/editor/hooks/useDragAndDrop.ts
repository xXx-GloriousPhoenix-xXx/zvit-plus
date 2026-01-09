import { useState, useCallback, useRef } from 'react';
import type { RepElement } from '../types';

export function useDragAndDrop(
  canvasRef: React.RefObject<HTMLDivElement | null>,
  updateElement: (id: string, updates: Partial<RepElement>) => void
) {
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((
    e: React.MouseEvent, 
    element: RepElement,
    resizeHandleClass: string
  ) => {
    if ((e.target as HTMLElement).classList.contains(resizeHandleClass)) return;
    
    e.stopPropagation();
    setDraggedElement(element.id);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    dragOffsetRef.current = {
      x: e.clientX - rect.left - element.position.x,
      y: e.clientY - rect.top - element.position.y
    };
  }, [canvasRef]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggedElement) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const borderLeft = rect.left;
    const borderTop = rect.top;
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;

    const positionX = e.clientX - borderLeft;
    const positionY = e.clientY - borderTop;

    const newX = Math.max(0, Math.min(positionX - dragOffsetRef.current.x, canvasWidth - 50));
    const newY = Math.max(0, Math.min(positionY - dragOffsetRef.current.y, canvasHeight - 50));
    
    updateElement(draggedElement, {
      position: { x: newX, y: newY }
    } as Partial<RepElement>);
  }, [draggedElement, canvasRef, updateElement]);

  const handleMouseUp = useCallback(() => {
    setDraggedElement(null);
  }, []);

  return {
    draggedElement,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}

//TODO: FIX