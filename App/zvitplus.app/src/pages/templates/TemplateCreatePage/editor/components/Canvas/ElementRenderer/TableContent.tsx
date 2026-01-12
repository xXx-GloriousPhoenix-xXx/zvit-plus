import { useEffect, useRef, useState } from "react";
import type { Cell, TableElement } from "@/shared/types/repEditorTypes";
import cl from '../Canvas.module.css';

interface TableContentProps {
    element: TableElement;
}

export function TableContent({ element }: TableContentProps) {
    const { columns = [], rows = [] } = element.payload;

    const [editingCell, setEditingCell] = useState<Cell | null>(null);
    const [editingValue, setEditingValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingCell) {
            if (editingCell.row === null) {
                setEditingValue(columns[editingCell.col] || '');
            } else {
                setEditingValue(rows[editingCell.row][editingCell.col] || '');
            }

            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [editingCell, columns, rows]);

    const saveCell = () => {
        if (!editingCell) return;

        if (editingCell.row === null) {
            const newColumns = [...columns];
            newColumns[editingCell.col] = editingValue;
            element.payload.columns = newColumns;
        } else {
            const newRows = rows.map((row, r) =>
                r === editingCell.row ? row.map((cell, c) => (c === editingCell.col ? editingValue : cell)) : row
            );
            element.payload.rows = newRows;
        }

        setEditingCell(null);
    }

    if (!columns.length) return null;

    return (
        <div
            className={cl.TablePreview}
            style={{ display: "grid", gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
        >
            {/* Header */}
            {columns.map((col, i) => {
                const isEditing = editingCell?.row === null && editingCell?.col === i;
                return (
                    <div 
                        key={`h-${i}`}
                        className={cl.TableHeaderCell}
                        onClick={() => {
                            if (isEditing) return;
                            setEditingCell({ row: null, col: i });
                        }}
                    >
                        {isEditing ? (
                            <input
                                ref={inputRef}
                                className={cl.TableCellInput}
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onBlur={saveCell}
                                onKeyDown={(e) => { if (e.key === 'Enter') saveCell() }}
                            />
                        ) : col}
                    </div>
                )
            })}

            {/* Body */}
            {rows.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    const isEditing = editingCell?.row === rowIndex && editingCell?.col === colIndex;
                    return (
                        <div
                            key={`c-${rowIndex}-${colIndex}`}
                            className={cl.TableCell}
                            onClick={() => {
                                if (isEditing) return;
                                setEditingCell({ row: rowIndex, col: colIndex });
                            }}
                        >
                            {isEditing ? (
                                <input
                                    ref={inputRef}
                                    className={cl.TableCellInput}
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    onBlur={saveCell}
                                    onKeyDown={(e) => { if (e.key === 'Enter') saveCell() }}
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
