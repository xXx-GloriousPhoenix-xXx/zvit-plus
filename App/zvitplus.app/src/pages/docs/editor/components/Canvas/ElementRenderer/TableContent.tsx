// editor/components/TableContent.tsx
import { useEffect, useRef, useState } from "react";
import type { Cell, TableElement } from "@/shared/types/repEditorTypes";
import cl from '../Canvas.module.css';
import { useRepEditorContext } from "@/app/context/RepEditorContext";
import type { EditorType } from "@/shared/api/doc/slice";

interface TableContentProps {
    element: TableElement;
    mode?: EditorType;
}

export function TableContent({ element, mode = 'template' }: TableContentProps) {
    const { columns = [], rows = [] } = element.payload;

    const [editingCell, setEditingCell] = useState<Cell | null>(null);
    const [editingValue, setEditingValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
    const { rep, readonly } = useRepEditorContext();

    const isEditable = !readonly && mode === 'template';

    useEffect(() => {
        if (editingCell && isEditable) {
            if (editingCell.row === null) {
                setEditingValue(columns[editingCell.col]?.text ?? '');
            } else {
                setEditingValue(rows[editingCell.row][editingCell.col]?.text ?? '');
            }

            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [editingCell, columns, rows, isEditable]);

    const saveCell = () => {
        if (!editingCell || !isEditable) return;

        if (editingCell.row === null) {
            const newColumns = columns.map((col, idx) => 
                idx === editingCell.col 
                    ? { ...col, text: editingValue ?? '' }
                    : col
                );
            rep.updatePayload(element.id, { columns: newColumns });
        } else {
            const newRows = rows.map((row, r) =>
                r === editingCell.row
                    ? row.map((cell, c) => (
                        c === editingCell.col
                            ? { ...cell, text: editingValue ?? '' }
                            : cell
                        ))
                    : row
            );
            rep.updatePayload(element.id, { rows: newRows });
        }

        setEditingCell(null);
    }

    const handleCellClick = (clickedCell: Cell) => {        
        if (editingCell?.row === clickedCell.row && editingCell?.col === clickedCell.col) return;
        
        setEditingCell(clickedCell);
        
        const cellData = clickedCell.row === null 
            ? columns[clickedCell.col] 
            : rows[clickedCell.row][clickedCell.col];
            
        rep.setSelectedCell({
            elementId: element.id,
            cell: cellData || { text: '' },
            row: clickedCell.row,
            col: clickedCell.col
        });
    };

    const getCellStyles = (cell: any) => {
        const styles: React.CSSProperties = {};
        
        if (cell.fontSize) {
            styles.fontSize = `${cell.fontSize}px`;
        }
        
        if (cell.color) {
            styles.color = cell.color;
        }
        
        if (cell.align) {
            styles.justifyContent = (() => {
                switch(cell.align) {
                    case 'left': return 'flex-start';
                    case 'center': return 'center';
                    case 'right': return 'flex-end';
                    default: return 'flex-start';
                }
            })();
        }
        
        if (cell.fontWeight) {
            styles.fontWeight = cell.fontWeight;
        }

        if (cell.verticalAlign) {
            switch(cell.verticalAlign) {
                case 'top':
                    styles.display = 'flex';
                    styles.alignItems = 'flex-start';
                    break;
                case 'middle':
                    styles.display = 'flex';
                    styles.alignItems = 'center';
                    break;
                case 'bottom':
                    styles.display = 'flex';
                    styles.alignItems = 'flex-end';
                    break;
            }
        } else {
            styles.display = 'flex';
            styles.alignItems = 'center';
        }
        
        return styles;
    };

    const getCellContent = (rowIndex: number | null, colIndex: number, cell: any) => {
        if (rowIndex === null) {
            // Header
            if (mode === 'report' && element.mode === 'dynamic') {
                return `${cell.text || `header_${colIndex + 1}`}`;
            }
            return cell.text || `Заголовок ${colIndex + 1}`;
        } else {
            // Body
            if (mode === 'report' && element.mode === 'dynamic') {
                return `${cell.text || `cell_${rowIndex + 1}_${colIndex + 1}`}`;
            }
            return cell.text || `Клітинка ${rowIndex + 1}×${colIndex + 1}`;
        }
    };

    if (!columns.length) return null;

    return (
        <div
            className={cl.TablePreview}
            style={{ display: "grid", gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
        >
            {/* Header */}
            {columns.map((col, i) => {
                const isEditing = editingCell?.row === null && editingCell?.col === i;
                const cellStyles = getCellStyles(col);
                const inputStyles = { ...getCellStyles(col), width: '100%', height: '100%' };
                
                return (
                    <div 
                        key={`h-${i}`}
                        className={cl.TableHeaderCell}
                        onClick={() => handleCellClick({ row: null, col: i })}
                        style={cellStyles}
                    >
                        {isEditing ? (
                            <input
                                ref={inputRef}
                                className={cl.TableCellInput}
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onBlur={saveCell}
                                onKeyDown={(e) => { if (e.key === 'Enter') saveCell() }}
                                style={inputStyles}
                            />
                        ) : (
                            getCellContent(null, i, col)
                        )}
                    </div>
                )
            })}

            {/* Body */}
            {rows.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    const isEditing = editingCell?.row === rowIndex && editingCell?.col === colIndex;
                    const cellStyles = getCellStyles(cell);
                    const inputStyles = { ...getCellStyles(cell), width: '100%', height: '100%' };
                    
                    return (
                        <div
                            key={`c-${rowIndex}-${colIndex}`}
                            className={cl.TableCell}
                            onClick={() => handleCellClick({ row: rowIndex, col: colIndex })}
                            style={cellStyles}
                        >
                            {isEditing && isEditable ? (
                                <input
                                    ref={inputRef}
                                    className={cl.TableCellInput}
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    onBlur={saveCell}
                                    onKeyDown={(e) => { if (e.key === 'Enter') saveCell() }}
                                    style={inputStyles}
                                />
                            ) : (
                                getCellContent(rowIndex, colIndex, cell)
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}