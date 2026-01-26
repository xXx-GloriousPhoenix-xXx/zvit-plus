// editor/context/RepEditorContext.ts
import { createContext, useContext } from 'react';
import type { 
  RepElement, 
  RepElementMode, 
  RepElementType, 
  SelectedCell 
} from '@/shared/types/repEditorTypes';
import type { EditorType } from '@/shared/api/doc/slice';

export interface RepEditorActions {
  // Базовые действия
  addElement(type: RepElementType, mode: RepElementMode): void;
  deleteElement(id: string): void;
  updateElement(id: string, updates: Partial<RepElement>): void;
  updatePayload(id: string, payloadUpdates: Partial<RepElement['payload']>): void;
  setSelectedElement(element: RepElement | null): void;
  setSelectedCell: (payload: SelectedCell) => void;
  clearSelection(): void;
  
  // Дополнительные действия для отчетов
  updateReportData?(elementId: string, data: any): void;
  fillReportData?(data: Record<string, any>): void;
}

export interface DragActions {
  handleMouseDown(e: React.MouseEvent, element: RepElement): void;
  handleMouseMove(e: React.MouseEvent): void;
  handleMouseUp(): void;
}

export interface ResizeActions {
  handleResizeStart(e: React.MouseEvent, element: RepElement): void;
  handleResizeMove(e: React.MouseEvent): void;
  handleResizeEnd(): void;
}

export interface RepEditorContextType {
  // Ссылки
  canvasRef: React.RefObject<HTMLDivElement | null>;
  
  // Состояние
  elements: RepElement[];
  selectedElement: RepElement | null;
  draggedElement: string | null;
  selectedCell: SelectedCell;
  
  // Режимы
  mode: EditorType; // 'template' | 'report'
  readonly: boolean;
  
  // Действия
  rep: RepEditorActions;
  drag: DragActions;
  resize: ResizeActions;
  
  // Вспомогательные флаги
  isTemplateMode: boolean;
  isReportMode: boolean;
  isEditable: boolean;
}

export const RepEditorContext = createContext<RepEditorContextType | null>(null);

export function useRepEditorContext() {
  const ctx = useContext(RepEditorContext);
  if (!ctx) {
    throw new Error('useRepEditorContext must be used within RepEditorProvider');
  }
  return ctx;
}

// Вспомогательные хуки для удобства
export function useRepEditorMode() {
  const ctx = useRepEditorContext();
  return {
    mode: ctx.mode,
    readonly: ctx.readonly,
    isTemplateMode: ctx.mode === 'template',
    isReportMode: ctx.mode === 'report',
    isEditable: !ctx.readonly
  };
}

export function useRepEditorElements() {
  const ctx = useRepEditorContext();
  return {
    elements: ctx.elements,
    selectedElement: ctx.selectedElement,
    selectedCell: ctx.selectedCell
  };
}

export function useRepEditorActions() {
  const ctx = useRepEditorContext();
  return {
    rep: ctx.rep,
    drag: ctx.drag,
    resize: ctx.resize
  };
}