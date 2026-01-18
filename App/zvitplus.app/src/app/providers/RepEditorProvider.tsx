// app/providers/RepEditorProvider.tsx
import { useEffect, useRef, useMemo } from 'react';
import { RepEditorContext } from '@/app/context/RepEditorContext';
import { useRepEditor } from '@/shared/hooks/useRepEditor';
import { useDragAndDrop } from '@/shared/hooks/useDragAndDrop';
import { useResize } from '@/shared/hooks/useResize';
import type { RepTemplate } from '@/shared/types/repEditorTypes';
import type { EditorType } from '@/shared/api/doc/slice';

interface Props {
  template: RepTemplate;
  onChange: (t: RepTemplate) => void;
  mode: EditorType;
  readonly?: boolean;
  children: React.ReactNode;
}

export function RepEditorProvider({ 
  template, 
  onChange, 
  mode, 
  readonly = false, 
  children 
}: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const rep = useRepEditor({ template, onChange, mode, readonly });
  const drag = useDragAndDrop(canvasRef, rep.updateElement, readonly);
  const resize = useResize(canvasRef, rep.updateElement, readonly);

  // Обработка клавиш
  useEffect(() => {
    if (readonly) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && rep.selectedElement) {
        rep.deleteElement(rep.selectedElement.id);
      }
      
      // Дополнительные горячие клавиши
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            // Ctrl+Z для undo
            e.preventDefault();
            break;
          case 'y':
            // Ctrl+Y для redo
            e.preventDefault();
            break;
          case 's':
            // Ctrl+S для сохранения
            e.preventDefault();
            break;
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [rep.selectedElement, rep.deleteElement, readonly]);

  // Контекстное значение
  const contextValue = useMemo(() => ({
    // Ссылки
    canvasRef,
    
    // Состояние
    elements: rep.elements,
    selectedElement: rep.selectedElement,
    draggedElement: drag.draggedElement,
    selectedCell: rep.selectedCell,
    
    // Режимы
    mode,
    readonly,
    
    // Действия
    rep: {
      addElement: rep.addElement,
      deleteElement: rep.deleteElement,
      updateElement: rep.updateElement,
      updatePayload: rep.updatePayload,
      setSelectedElement: rep.setSelectedElement,
      setSelectedCell: rep.setSelectedCell,
      clearSelection: rep.clearSelection,
      updateReportData: rep.updateReportData,
      fillReportData: (data: Record<string, any>) => {
        // Заполнение данных отчета
        if (mode === 'report' && !readonly) {
          Object.entries(data).forEach(([elementId, value]) => {
            rep.updateReportData?.(elementId, value);
          });
        }
      }
    },
    drag: {
      handleMouseDown: (e: React.MouseEvent, element: any, resizeHandleClass?: string) => 
        drag.handleMouseDown(e, element, resizeHandleClass),
      handleMouseMove: drag.handleMouseMove,
      handleMouseUp: drag.handleMouseUp
    },
    resize: {
      handleResizeStart: resize.handleResizeStart,
      handleResizeMove: resize.handleResizeMove,
      handleResizeEnd: resize.handleResizeEnd
    },
    
    // Вспомогательные флаги
    isTemplateMode: mode === 'template',
    isReportMode: mode === 'report',
    isEditable: !readonly
  }), [
    canvasRef,
    rep,
    drag,
    resize,
    mode,
    readonly
  ]);

  return (
    <RepEditorContext.Provider value={contextValue}>
      {children}
    </RepEditorContext.Provider>
  );
}