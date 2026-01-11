import { useEffect, useRef, useState } from "react";
import type { TableElement } from "../../../types";

import cl from '../Canvas.module.css';

interface TableContentProps {
    element: TableElement;
  }
  
export function TableContent({ element }: TableContentProps) {
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
  
  