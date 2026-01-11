import { ELEMENT_COLORS } from "@/shared/constants/editor";
import type { RepElement } from "../../../types";
import { BarChart3, Image } from "lucide-react";
import cl from '../Canvas.module.css';

import { TableContent } from "./TableContent";

interface ElementRendererProps {
  element: RepElement;
  isSelected: boolean;
  isDragged: boolean;
  onDragStart: (e: React.MouseEvent<Element, MouseEvent>, element: RepElement) => void;
  onResizeStart: (e: React.MouseEvent<Element, MouseEvent>, element: RepElement) => void;
  onSelect: (element: RepElement) => void;
  resizeHandleClass: string;
}

export function ElementRenderer({
  element,
  isSelected,
  isDragged,
  onDragStart,
  onResizeStart,
  onSelect,
  resizeHandleClass
}: ElementRendererProps) {
  
  const renderContent = () => {
    switch (element.type) {
      case 'text':
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
            {element.payload.text || 'Порожній текст'}
          </div>
        );
      
      case 'image':
        return (
          <div className={cl.PlaceholderIcon}>
            <Image size={32} />
          </div>
        );
      
      case 'chart':
        return (
          <div className={cl.PlaceholderIcon}>
            <BarChart3 size={32} />
          </div>
        );
      
      case 'table':
        return <TableContent element={element} />;
      
      default:
        return null;
    }
  };

  return (
    <div
      onMouseDown={(e) => {
        onDragStart(e, element);
        onSelect(element);
      }}
      style={{
        position: 'absolute',
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        backgroundColor: ELEMENT_COLORS[element.type],
        border: isSelected ? '0.05rem solid var(--secondary-color)' : '0.05rem dashed #ddd',
        cursor: isDragged ? 'grabbing' : 'grab',
        borderRadius: 'var(--border-radius)',
      }}
      className={cl.Element}
    >
      <div className={cl.ElementLabel}>
        {element.type} {element.mode === 'static' && '(статичний)'}
      </div>
      
      <div className={cl.ElementContent}>
        {renderContent()}
      </div>

      {isSelected && (
        <div
          className={resizeHandleClass}
          onMouseDown={(e) => onResizeStart(e, element)}
        />
      )}
    </div>
  );
}