// editor/context/RepEditorProvider.tsx
import { useEffect, useRef } from 'react';
import { RepEditorContext } from '../context/RepEditorContext';
import { useRepEditor } from '@/shared/lib/hooks/useRepEditor';
import { useDragAndDrop } from '@/shared/lib/hooks/useDragAndDrop';
import { useResize } from '@/shared/lib/hooks/useResize';
import type { RepTemplate } from '@/shared/types/repEditorTypes';

interface Props {
  template: RepTemplate;
  onChange: (t: RepTemplate) => void;
  children: React.ReactNode;
}

export function RepEditorProvider({ template, onChange, children }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const rep = useRepEditor({ template, onChange });
  const drag = useDragAndDrop(canvasRef, rep.updateElement);
  const resize = useResize(canvasRef, rep.updateElement);

  // Отладочный лог
  useEffect(() => {
    console.log('RepEditorProvider - selectedCell:', rep.selectedCell);
    console.log('RepEditorProvider - selectedElement:', rep.selectedElement);
  }, [rep.selectedCell, rep.selectedElement]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && rep.selectedElement) {
        rep.deleteElement(rep.selectedElement.id);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [rep.selectedElement, rep.deleteElement]);

  return (
    <RepEditorContext.Provider
      value={{
        elements: rep.elements,
        selectedElement: rep.selectedElement,
        draggedElement: drag.draggedElement,
        selectedCell: rep.selectedCell,
        rep: {
          ...rep,
          setSelectedCell: rep.setSelectedCell
        },
        drag,
        resize,
        canvasRef
      }}
    >
      {children}
    </RepEditorContext.Provider>
  );
}
