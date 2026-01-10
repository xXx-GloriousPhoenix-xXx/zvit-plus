import { useState, useCallback, useRef } from 'react';
import type { RepElement, RepElementType } from '../types';

export function useResize(
  canvasRef: React.RefObject<HTMLDivElement | null>,
  updateElement: (id: string, updates: Partial<RepElement>) => void
) {
  const [resizingElement, setResizingElement] = useState<string | null>(null);
  const resizeStartRef = useRef<{
    mouseX: number;
    mouseY: number;
    width: number;
    height: number;
    elementX: number;
    elementY: number;
    type?: RepElementType;
  }>({
    mouseX: 0,
    mouseY: 0,
    width: 0,
    height: 0,
    elementX: 0,
    elementY: 0,
    type: undefined
  });

  const handleResizeStart = useCallback((
    e: React.MouseEvent,
    element: RepElement
  ) => {
    e.stopPropagation();
    setResizingElement(element.id);
  
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      width: element.size.width,
      height: element.size.height,
      elementX: element.position.x,
      elementY: element.position.y,
      type: element.type
    };
  }, []);

  const handleResizeMove = useCallback((e: React.MouseEvent) => {
    if (!resizingElement) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;

    const maxWidth = canvasWidth - resizeStartRef.current.elementX;
    const maxHeight = canvasHeight - resizeStartRef.current.elementY;

    const deltaX = e.clientX - resizeStartRef.current.mouseX;
    const deltaY = e.clientY - resizeStartRef.current.mouseY;

    const newWidth = Math.min(
      Math.max(120, resizeStartRef.current.width + deltaX),
      maxWidth
    );

    const newHeight = Math.min(
      Math.max(60, resizeStartRef.current.height + deltaY),
      maxHeight
    );

    updateElement(resizingElement, {
      size: {
        width: newWidth,
        height: newHeight
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