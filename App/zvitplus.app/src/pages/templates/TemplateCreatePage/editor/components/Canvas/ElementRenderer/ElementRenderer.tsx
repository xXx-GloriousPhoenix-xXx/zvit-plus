// editor/components/ElementRenderer/ElementRenderer.tsx
import { ELEMENT_COLORS } from "@/shared/constants/editor";
import type { RepElement } from "@/shared/types/repEditorTypes";
import { BarChart3, Image } from "lucide-react";
import cl from '../Canvas.module.css';
import { TableContent } from "./TableContent";
import type { EditorType } from "@/shared/api/doc/slice";

interface ElementRendererProps {
  element: RepElement;
  isSelected: boolean;
  isDragged: boolean;
  onDragStart: ((e: React.MouseEvent, element: RepElement) => void) | undefined;
  onResizeStart: ((e: React.MouseEvent, element: RepElement) => void) | undefined;
  onSelect: ((element: RepElement) => void) | undefined;
  resizeHandleClass: string;
  readonly: boolean;
  mode: EditorType;
}

export function ElementRenderer({
  element,
  isSelected,
  isDragged,
  onDragStart,
  onResizeStart,
  onSelect,
  resizeHandleClass,
  readonly,
  mode
}: ElementRendererProps) {
  
  const renderContent = () => {
    switch (element.type) {
      case 'text':
        // Для отчетов показываем данные, для шаблонов - текст
        const text = element.mode === 'dynamic' && mode === 'report' 
          ? `{${element.payload.text || 'data'}}`
          : (element.payload.text || 'Текст');
        
        return (
          <div 
            style={{
              fontSize: element.payload.fontSize,
              fontWeight: element.payload.fontWeight,
              color: element.payload.color,
              textAlign: element.payload.align
            }}
            className={cl.TextContent}
          >
            {text}
          </div>
        );
      case 'image':
        return (
          <div className={cl.PlaceholderIcon}>
            <Image size={32} />
            {mode === 'report' && element.mode === 'dynamic' && (
              <div className={cl.ImageLabel}>[Зображення]</div>
            )}
          </div>
        );
      case 'chart':
        return (
          <div className={cl.PlaceholderIcon}>
            <BarChart3 size={32} />
            {mode === 'report' && element.mode === 'dynamic' && (
              <div className={cl.ChartLabel}>[Дані графіка]</div>
            )}
          </div>
        );
      case 'table':
        return <TableContent element={element} mode={mode} />;
      default:
        return null;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (readonly) return;
    
    if (onDragStart) {
      onDragStart(e, element);
    }
    
    if (onSelect) {
      onSelect(element);
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (readonly || !onResizeStart) return;
    e.stopPropagation();
    onResizeStart(e, element);
  };

  return (
    <div
      id={element.id}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        backgroundColor: ELEMENT_COLORS[element.type],
        borderWidth: '0.05rem',
        borderColor: isSelected ? '#3b82f6' : 'var(--secondary-color)',
        borderStyle: isSelected ? 'solid' : 'dashed',
        cursor: readonly ? 'default' : (isDragged ? 'grabbing' : 'grab'),
        borderRadius: 'var(--border-radius)',
        transition: isDragged ? 'none' : 'all 0.2s',
        opacity: isDragged ? 0.8 : 1,
        userSelect: 'none'
      }}
      className={cl.Element}
      data-mode={mode}
      data-readonly={readonly}
    >
      <div className={cl.ElementContent}>
        {renderContent()}
      </div>

      {isSelected && !readonly && (
        <div
          className={resizeHandleClass}
          onMouseDown={handleResizeMouseDown}
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '12px',
            height: '12px',
            backgroundColor: '#3b82f6',
            border: '1px solid white',
            borderRadius: '2px',
            cursor: 'nwse-resize'
          }}
        />
      )}
    </div>
  );
}