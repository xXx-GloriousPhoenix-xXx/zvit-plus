import { ELEMENT_COLORS } from "@/shared/constants/editor";
import type { RepElement, TableElement } from "../../../types";
import { BarChart3, Image } from "lucide-react";
import cl from '../Canvas.module.css';

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
        border: isSelected ? '0.05rem solid var(--primary-color)' : '0.05rem dashed var(--secondary-color)',
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

import { useState, useRef, useEffect } from "react";

interface TableContentProps {
  element: TableElement;
}

function TableContent({ element }: TableContentProps) {
  const { columns = [], rows = [] } = element.payload;

  const [editingCell, setEditingCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingCell) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editingCell]);

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = rows.map((row, r) =>
      r === rowIndex
        ? row.map((cell, c) => (c === colIndex ? value : cell))
        : row
    );

    element.payload.rows = newRows;
    setEditingCell(null);
  };

  if (!columns.length) return null;

  return (
    <div
      className={cl.TablePreview}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns.length}, 1fr)`
      }}
    >
      {/* Header */}
      {columns.map((col, i) => (
        <div key={`h-${i}`} className={cl.TableHeaderCell}>
          {col}
        </div>
      ))}

      {/* Body */}
      {rows.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isEditing =
            editingCell?.row === rowIndex &&
            editingCell?.col === colIndex;

          return (
            <div
              key={`c-${rowIndex}-${colIndex}`}
              className={cl.TableCell}
              onMouseDown={(e) => e.stopPropagation()} // важно
              onClick={() =>
                setEditingCell({ row: rowIndex, col: colIndex })
              }
            >
              {isEditing ? (
                <input
                  ref={inputRef}
                  className={cl.TableCellInput}
                  defaultValue={cell}
                  onBlur={(e) =>
                    updateCell(rowIndex, colIndex, e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateCell(
                        rowIndex,
                        colIndex,
                        (e.target as HTMLInputElement).value
                      );
                    }
                  }}
                />
              ) : (
                cell || `Клітинка ${rowIndex + 1}×${colIndex + 1}`
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

