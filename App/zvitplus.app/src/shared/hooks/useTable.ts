import { useRepEditorContext } from "@/app/context/RepEditorContext";
import type { RepElement, TableElement } from "../types/repEditorTypes";
import { useCallback } from "react";

export function useTable(
    selectedElement: TableElement,
    updatePayload: (id: string, payloadUpdates: Partial<RepElement['payload']>) => void
) {
    const columns = selectedElement.payload.columns ?? [];
    const rows = selectedElement.payload.rows ?? [];
    const { selectedCell, rep } = useRepEditorContext(); // Добавляем

    /* -------------------- Колонки -------------------- */
    const addColumn = useCallback(() => {
        const newColumns = [...columns, { text: `Колонка ${columns.length + 1}` }];
        const newRows = rows.map(row => [...row, { text: '' }]);
        
        // Сбрасываем выбранную ячейку если она в удаляемой колонке
        if (selectedCell && selectedCell.elementId === selectedElement.id) {
            rep.setSelectedCell(null);
        }
        
        updatePayload(selectedElement.id, {
            columns: newColumns,
            rows: newRows
        });
    }, [columns, rows, selectedElement.id, updatePayload, rep]);

    const removeColumn = useCallback(() => {
        if (columns.length <= 1) return;
        
        const newColumns = columns.slice(0, -1);
        const newRows = rows.map(row => row.slice(0, -1));
        
        // Проверяем, находится ли выбранная ячейка в удаляемой колонке
        if (selectedCell && 
            selectedCell.elementId === selectedElement.id && 
            selectedCell.col === columns.length - 1) {
            // Если ячейка в последней колонке - сбрасываем выбор
            rep.setSelectedCell(null);
        }
        
        updatePayload(selectedElement.id, {
            columns: newColumns,
            rows: newRows
        });
    }, [columns, rows, selectedElement.id, updatePayload, rep]);

    /* -------------------- Рядки -------------------- */
    const addRow = useCallback(() => {
        const newRow = Array(columns.length).fill(null).map(() => ({ text: '' }));
        const newRows = [...rows, newRow];
        
        // Сбрасываем выбранную ячейку если она в удаляемой строке
        if (selectedCell && selectedCell.elementId === selectedElement.id) {
            rep.setSelectedCell(null);
        }
        
        updatePayload(selectedElement.id, {
            rows: newRows
        });
    }, [columns.length, rows, selectedElement.id, updatePayload, rep]);

    const removeRow = useCallback(() => {
        if (rows.length <= 1) return;
        
        const newRows = rows.slice(0, -1);
        
        // Проверяем, находится ли выбранная ячейка в удаляемой строке
        if (selectedCell && 
            selectedCell.elementId === selectedElement.id && 
            selectedCell.row !== null && 
            selectedCell.row === rows.length - 1) {
            // Если ячейка в последней строке - сбрасываем выбор
            rep.setSelectedCell(null);
        }
        
        updatePayload(selectedElement.id, {
            rows: newRows
        });
    }, [rows, selectedElement.id, updatePayload, rep]);

    return {
        columns,
        rows,
        
        addRow,
        removeRow,
        addColumn,
        removeColumn
    }
}