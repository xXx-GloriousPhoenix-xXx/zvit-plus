import { useState, useCallback, useRef } from 'react';
import type { Dimension, Position, RepElement } from '../types';

export function useDragAndDrop(
  canvasRef: React.RefObject<HTMLDivElement | null>,
  updateElement: (id: string, updates: Partial<RepElement>) => void
) {
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const dragRef = useRef<Position & Dimension>({
    x: 0, y: 0,
    width: 50, height: 50
  });

  const handleMouseDown = useCallback((
    e: React.MouseEvent, 
    element: RepElement,
    resizeHandleClass: string
  ) => {
    if ((e.target as HTMLElement).classList.contains(resizeHandleClass)) return;
    
    e.stopPropagation();
    setDraggedElement(element.id);
    
    // Розмір об'єкту
    dragRef.current = {
      ...dragRef.current,
      width: element.size.width,
      height: element.size.height,
    };    

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();

    // Позиція курсору усередині об'єкту
    dragRef.current = {
      ...dragRef.current,
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

    // Позиція курсору усередені холсту
    const positionX = e.clientX - borderLeft;
    const positionY = e.clientY - borderTop;

    const newX = Math.max(0, Math.min(positionX - dragRef.current.x, canvasWidth - dragRef.current.width));
    const newY = Math.max(0, Math.min(positionY - dragRef.current.y, canvasHeight - dragRef.current.height));
    
    console.log(rect.width, rect.height);

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