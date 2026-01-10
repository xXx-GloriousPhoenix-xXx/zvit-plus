import { ELEMENT_COLORS } from "@/shared/constants/editor";
import type { RepElement } from "../../types";
import { BarChart3, Image } from "lucide-react";

import cl from './Canvas.module.css';

type CanvasProps = {
    handleDragStart: (e: React.MouseEvent<Element, MouseEvent>, element: RepElement, resizeHandleClass: string) => void;
    handleDragMove: (e: React.MouseEvent<Element, MouseEvent>) => void;
    handleDragEnd: () => void;

    handleResizeStart: (e: React.MouseEvent<Element, MouseEvent>, element: RepElement) => void;
    handleResizeMove: (e: React.MouseEvent<Element, MouseEvent>) => void;
    handleResizeEnd: () => void;

    setSelectedElement: (value: React.SetStateAction<RepElement | null>) => void;

    elements: RepElement[];
    selectedElement: RepElement | null;
    draggedElement: string | null;
    canvasRef: React.RefObject<HTMLDivElement | null>;
}

export function Canvas({
    handleDragStart, handleDragMove, handleDragEnd,
    handleResizeStart, handleResizeMove, handleResizeEnd,
    setSelectedElement,

    selectedElement,
    draggedElement,
    elements,
    canvasRef
} : CanvasProps) {

    const handleMouseMove = (e: React.MouseEvent) => {
        handleDragMove(e);
        handleResizeMove(e);
    };
  
    const handleMouseUp = () => {
      handleDragEnd();
      handleResizeEnd();
    };

    return (
        <div className={cl.CanvasContainer}>
        <div className={cl.Header}>
          <h1 className={cl.HeaderTitle}>Редактор шаблонів</h1>
        </div>
        
        <div 
          className={cl.CanvasArea}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className={cl.Canvas}
            ref={canvasRef}
          >
            {elements.map(el => (
              <div
                key={el.id}
                onMouseDown={(e) => {
                  handleDragStart(e, el, cl.ResizeHandle);
                  setSelectedElement(el);
                }}
                style={{
                  position: 'absolute',
                  left: el.position.x,
                  top: el.position.y,
                  width: el.size.width,
                  height: el.size.height,
                  backgroundColor: ELEMENT_COLORS[el.type],
                  border: selectedElement?.id === el.id 
                    ? '2px solid #3b82f6' 
                    : '2px dashed #d1d5db',
                  cursor: draggedElement === el.id ? 'grabbing' : 'grab',
                  borderRadius: '4px',
                }}
                className={cl.Element}
              >
                <div className={cl.ElementLabel}>
                  {el.type} {el.mode === 'static' && '(статичний)'}
                </div>
                
                <div className={cl.ElementContent}>
                  {el.type === 'text' && (
                    <div 
                      style={{
                        fontSize: el.payload.fontSize,
                        fontWeight: el.payload.fontWeight,
                        color: el.payload.color,
                        textAlign: el.payload.align
                      }}
                      className={cl.TextContent}
                    >
                      {el.payload.text || 'Порожній текст'}
                    </div>
                  )}
                  
                  {el.type === 'image' && (
                    <div className={cl.PlaceholderIcon}>
                      <Image size={32} />
                    </div>
                  )}
                  
                  {el.type === 'chart' && (
                    <div className={cl.PlaceholderIcon}>
                      <BarChart3 size={32} />
                    </div>
                  )}
                  
                  {el.type === 'table' && (
                    <div className={cl.TablePreview}>
                        {/* Заголовок */}
                        <div className={cl.TableHeader}>
                        {el.payload.columns?.map((col, i) => (
                            <div key={i} className={cl.TableHeaderCell}>
                            {col}
                            </div>
                        ))}
                        </div>

                        {/* Строки */}
                        <div className={cl.TableBody}>
                        {el.payload.rows?.map((row, rowIndex) => (
                            <div key={rowIndex} className={cl.TableRow}>
                            {row.map((cell, cellIndex) => (
                                <div key={cellIndex} className={cl.TableCell}>
                                {cell || ''}
                                </div>
                            ))}
                            </div>
                        ))}
                        </div>
                    </div>
                    )}
                </div>

                {selectedElement?.id === el.id && (
                  <div
                    className={cl.ResizeHandle}
                    onMouseDown={(e) => handleResizeStart(e, el)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
}