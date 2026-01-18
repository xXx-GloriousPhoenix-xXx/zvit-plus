// shared/hooks/useRepEditor.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import type { RepElement, RepElementType, RepElementMode, RepTemplate, SelectedCell } from '../types/repEditorTypes';
import type { EditorType } from '@/shared/api/doc/slice';

interface UseRepEditorProps {
  template: RepTemplate;
  onChange: (t: RepTemplate) => void;
  mode?: EditorType; // 'template' | 'report'
  readonly?: boolean;
}

export function useRepEditor({ 
  template, 
  onChange, 
  mode = 'template',
  readonly = false 
}: UseRepEditorProps) {
  const [elements, setElements] = useState<RepElement[]>(template.elements || []);
  const [selectedElement, setSelectedElement] = useState<RepElement | null>(null);
  const isInternalUpdate = useRef(false);
  const prevElementsRef = useRef<RepElement[]>(template.elements || []);
  const [selectedCell, setSelectedCell] = useState<SelectedCell>(null);

  const handleSetSelectedCell = useCallback((payload: SelectedCell) => {
    setSelectedCell(payload);
  }, []);

  // Синхронізація з template при зміні ззовні
  useEffect(() => {
    if (!isInternalUpdate.current) {
      const newElements = template.elements || [];
      if (JSON.stringify(newElements) !== JSON.stringify(prevElementsRef.current)) {
        setElements(newElements);
        prevElementsRef.current = newElements;
      }
    }
    isInternalUpdate.current = false;
  }, [template.elements]);

  // Синхронізація з onChange при зміні elements
  useEffect(() => {
    if (JSON.stringify(elements) !== JSON.stringify(prevElementsRef.current)) {
      isInternalUpdate.current = true;
      prevElementsRef.current = elements;
      onChange({
        ...template,
        elements
      });
    }
  }, [elements, onChange, template]);

  const generateId = useCallback(() => {
    return `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const addElement = useCallback((type: RepElementType, modeType: RepElementMode = 'dynamic') => {
    if (readonly) return;
    
    const newElement: RepElement = {
      id: generateId(),
      type,
      mode: modeType,
      position: { x: 50, y: 50 },
      size: { width: 200, height: 100 },
      payload: type === 'text' 
        ? { 
            text: modeType === 'static' ? 'Статичний текст' : '{dynamic_text}', 
            fontSize: 16, 
            fontWeight: 'normal', 
            color: '#000000', 
            align: 'left' 
          }
        : type === 'image'
        ? { src: '', alt: '' }
        : type === 'chart'
        ? { chartType: 'bar', dataSource: '', title: '' }
        : { 
            columns: [{ text: 'Колонка 1' }, { text: 'Колонка 2' }], 
            rows: [
              [{ text: '' }, { text: '' }]
            ] 
          }
    } as RepElement;

    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement);
  }, [generateId, readonly]);

  const deleteElement = useCallback((id: string) => {
    if (readonly) return;
    
    setElements(prev => prev.filter(el => el.id !== id));
    setSelectedElement(prev => prev?.id === id ? null : prev);
  }, [readonly]);

  const updateElement = useCallback((
    id: string, 
    updates: Partial<Omit<RepElement, 'type'>> & { type?: RepElementType }
  ) => {
    if (readonly) return;
    
    setElements(prev => prev.map(el => {
      if (el.id === id) {
        const updatedElement = { ...el, ...updates };
        
        if (updates.payload && el.payload) {
          updatedElement.payload = { ...el.payload, ...updates.payload };
        }
        
        return updatedElement as RepElement;
      }
      return el;
    }));
    
    setSelectedElement(prev => {
      if (!prev || prev.id !== id) return prev;
      
      const updated = { ...prev, ...updates };
      if (updates.payload && prev.payload) {
        updated.payload = { ...prev.payload, ...updates.payload };
      }
      return updated as RepElement;
    });
  }, [readonly]);

  const updatePayload = useCallback((
    id: string, 
    payloadUpdates: Partial<RepElement['payload']>
  ) => {
    if (readonly) return;
    
    console.log('useRepEditor - updatePayload called:', { id, payloadUpdates });

    setElements(prev => prev.map(el => {
      if (el.id === id) {
        console.log('useRepEditor - updating element:', el.id);
        console.log('useRepEditor - current payload:', el.payload);
        console.log('useRepEditor - updates:', payloadUpdates);
        
        const updatedElement = {
          ...el,
          payload: { ...el.payload, ...payloadUpdates }
        } as RepElement;
              
        console.log('useRepEditor - updated payload:', updatedElement.payload);
        return updatedElement;
      }
      return el;
    }));
    
    setSelectedElement(prev => {
      if (!prev || prev.id !== id || !prev.payload) return prev;
      
      const updated = {
        ...prev,
        payload: { ...prev.payload, ...payloadUpdates }
      } as RepElement;
    
      console.log('useRepEditor - updated selected element:', updated);
      return updated;
    });
  }, [readonly]);

  const clearSelection = useCallback(() => {
    setSelectedElement(null);
  }, []);

  // Для режима report добавляем специальные методы
  const updateReportData = useCallback((elementId: string, data: any) => {
    if (mode !== 'report' || readonly) return;
    
    // Логика обновления данных отчета
    console.log('Updating report data for element:', elementId, data);
  }, [mode, readonly]);

  return {
    elements,
    selectedElement,
    selectedCell,
    setSelectedElement,
    addElement,
    deleteElement,
    updateElement,
    updatePayload,
    clearSelection,
    setSelectedCell: handleSetSelectedCell,
    updateReportData,
    isReadonly: readonly,
    mode
  };
}