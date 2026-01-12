import type { RepElement, TableElement } from "../../types/repEditorTypes";

export function useTable(
    selectedElement: TableElement,
    updatePayload: (id: string, payloadUpdates: Partial<RepElement['payload']>) => void
) {
    const columns = selectedElement.payload.columns ?? [];
    const rows = selectedElement.payload.rows ?? [];

    /* -------------------- Колонки -------------------- */
    const addColumn = () => {
        updatePayload(selectedElement.id, {
            columns: [...columns, `Column ${columns.length + 1}`],
            rows: rows.map(row => [...row, ""]),
        });
    };

    const removeColumn = () => {
        if (columns.length <= 1) return;
    
        updatePayload(selectedElement.id, {
            columns: columns.slice(0, -1),
            rows: rows.map(row => row.slice(0, -1)),
        });
    };

    /* -------------------- Рядки -------------------- */
    const addRow = () => {
        const newRow = Array(columns.length).fill("");
        updatePayload(selectedElement.id, {
            rows: [...rows, newRow],
        });
    };

    const removeRow = () => {
        if (rows.length <= 1) return;
    
        updatePayload(selectedElement.id, {
            rows: rows.slice(0, -1),
        });
    };

    return {
        columns,
        rows,
        
        addRow,
        removeRow,
        addColumn,
        removeColumn
    }
}