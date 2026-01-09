import { useState, useCallback, useRef } from 'react';
import type { RepElement } from '../types';

export function useResize(
  updateElement: (id: string, updates: Partial<RepElement>) => void
) {
  const [resizingElement, setResizingElement] = useState<string | null>(null);
  const resizeStartRef = useRef({ 
    x: 0, 
    y: 0, 
    width: 0, 
    height: 0 
  });

  const handleResizeStart = useCallback((
    e: React.MouseEvent, 
    element: RepElement
  ) => {
    e.stopPropagation();
    setResizingElement(element.id);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: element.size.width,
      height: element.size.height
    };
  }, []);

  const handleResizeMove = useCallback((e: React.MouseEvent) => {
    if (!resizingElement) return;

    const deltaX = e.clientX - resizeStartRef.current.x;
    const deltaY = e.clientY - resizeStartRef.current.y;
    
    updateElement(resizingElement, {
      size: {
        width: Math.max(80, resizeStartRef.current.width + deltaX),
        height: Math.max(40, resizeStartRef.current.height + deltaY)
      }
    } as Partial<RepElement>);
  }, [resizingElement, updateElement]);

  const handleResizeEnd = useCallback(() => {
    setResizingElement(null);
  }, []);

  return {
    resizingElement,
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd,
  };
}