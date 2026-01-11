import { useState, useCallback, useRef } from 'react';
import type { RepElement } from '../types';

export function useResize(
  canvasRef: React.RefObject<HTMLDivElement | null>,
  updateElement: (id: string, updates: Partial<RepElement>) => void
) {
  const [resizingElement, setResizingElement] = useState<string | null>(null);

  const resizeRef = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    elementX: number;
    elementY: number;
  }>({
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    elementX: 0,
    elementY: 0
  });

  const handleResizeStart = useCallback((e: React.MouseEvent, element: RepElement) => {
    e.stopPropagation();
    setResizingElement(element.id);

    const canvas = canvasRef.current;
    if (!canvas) return;

    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: element.size.width,
      startHeight: element.size.height,
      elementX: element.position.x,
      elementY: element.position.y
    };
  }, [canvasRef]);

  const handleResizeMove = useCallback((e: React.MouseEvent) => {
    if (!resizingElement) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const deltaX = e.clientX - resizeRef.current.startX;
    const deltaY = e.clientY - resizeRef.current.startY;

    const newWidth = Math.max(120, resizeRef.current.startWidth + deltaX);
    const newHeight = Math.max(60, resizeRef.current.startHeight + deltaY);

    // const canvasRect = canvas.getBoundingClientRect();
    const maxWidth = canvas.scrollWidth - resizeRef.current.elementX;
    const maxHeight = canvas.scrollHeight - resizeRef.current.elementY;

    updateElement(resizingElement, {
      size: {
        width: Math.min(newWidth, maxWidth),
        height: Math.min(newHeight, maxHeight)
      }
    });
  }, [resizingElement, canvasRef, updateElement]);

  const handleResizeEnd = useCallback(() => {
    setResizingElement(null);
  }, []);

  return {
    resizingElement,
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd
  };
}
