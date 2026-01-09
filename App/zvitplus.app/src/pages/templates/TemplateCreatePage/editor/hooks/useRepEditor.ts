import { useState, useCallback, useEffect, useRef } from 'react';
import type { RepElement, RepElementType, RepElementMode, RepTemplate } from '../types';

interface UseRepEditorProps {
  template: RepTemplate;
  onChange: (t: RepTemplate) => void;
}

export function useRepEditor({ template, onChange }: UseRepEditorProps) {
  const [elements, setElements] = useState<RepElement[]>(template.elements || []);
  const [selectedElement, setSelectedElement] = useState<RepElement | null>(null);
  const isInternalUpdate = useRef(false);
  const prevElementsRef = useRef<RepElement[]>(template.elements || []);

  // Синхронізація з template при зміні ззовні (тільки якщо це не внутрішнє оновлення)
  useEffect(() => {
    if (!isInternalUpdate.current) {
      const newElements = template.elements || [];
      // Перевіряємо чи дійсно змінилися елементи
      if (JSON.stringify(newElements) !== JSON.stringify(prevElementsRef.current)) {
        setElements(newElements);
        prevElementsRef.current = newElements;
      }
    }
    isInternalUpdate.current = false;
  }, [template.elements]);

  // Синхронізація з onChange при зміні elements
  useEffect(() => {
    // Перевіряємо чи дійсно змінилися елементи
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

  const addElement = useCallback((type: RepElementType, mode: RepElementMode = 'dynamic') => {
    const newElement: RepElement = {
      id: generateId(),
      type,
      mode,
      position: { x: 50, y: 50 },
      size: { width: 200, height: 100 },
      payload: type === 'text' 
        ? { 
            text: mode === 'static' ? 'Статичний текст' : '{dynamic_text}', 
            fontSize: 16, 
            fontWeight: 'normal', 
            color: '#000000', 
            align: 'left' 
          }
        : type === 'image'
        ? { src: '', alt: '' }
        : type === 'chart'
        ? { chartType: 'bar', dataSource: '', title: '' }
        : { columns: ['Колонка 1', 'Колонка 2'], rows: [] }
    } as RepElement;

    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement);
  }, [generateId]);

  const deleteElement = useCallback((id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    setSelectedElement(prev => prev?.id === id ? null : prev);
  }, []);

  const updateElement = useCallback((
    id: string, 
    updates: Partial<Omit<RepElement, 'type'>> & { type?: RepElementType }
  ) => {
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
  }, []);

  const updatePayload = useCallback((
    id: string, 
    payloadUpdates: Partial<RepElement['payload']>
  ) => {
    setElements(prev => prev.map(el => {
      if (el.id === id) {
        return {
          ...el,
          payload: { ...el.payload, ...payloadUpdates }
        } as RepElement;
      }
      return el;
    }));
    
    setSelectedElement(prev => {
      if (!prev || prev.id !== id || !prev.payload) return prev;
      
      return {
        ...prev,
        payload: { ...prev.payload, ...payloadUpdates }
      } as RepElement;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedElement(null);
  }, []);

  return {
    elements,
    selectedElement,
    setSelectedElement,
    addElement,
    deleteElement,
    updateElement,
    updatePayload,
    clearSelection,
  };
}