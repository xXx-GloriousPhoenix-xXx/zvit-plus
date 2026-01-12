// editor/context/RepEditorContext.ts
import { createContext, useContext } from 'react';
import type { RepElement, RepElementMode, RepElementType } from '@/shared/types/repEditorTypes';

export interface RepEditorActions {
  addElement(type: RepElementType, mode: RepElementMode): void;
  deleteElement(id: string): void;
  updateElement(id: string, updates: Partial<RepElement>): void;
  updatePayload(id: string, payloadUpdates: Partial<RepElement['payload']>): void;
  setSelectedElement(element: RepElement | null): void;
}

export interface DragActions {
    handleMouseDown(e: React.MouseEvent, element: RepElement, resizeHandleClass: string): void;
    handleMouseMove(e: React.MouseEvent): void;
    handleMouseUp(): void;
}

export interface ResizeActions {
  handleResizeStart(e: React.MouseEvent, element: RepElement): void;
  handleResizeMove(e: React.MouseEvent): void;
  handleResizeEnd(): void;
}

export interface RepEditorContextType {
  canvasRef: React.RefObject<HTMLDivElement | null>;

  elements: RepElement[];
  selectedElement: RepElement | null;
  draggedElement: string | null;

  rep: RepEditorActions;
  drag: DragActions;
  resize: ResizeActions;
}

export const RepEditorContext =
  createContext<RepEditorContextType | null>(null);

export function useRepEditorContext() {
    const ctx = useContext(RepEditorContext);
    if (!ctx) {
      throw new Error('useRepEditorContext must be used within RepEditorProvider');
    }
    return ctx;
}