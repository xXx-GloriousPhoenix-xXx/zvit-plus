import { Plus, X } from "lucide-react";
import type { RepElement, TableElement } from "../../../types";

type TablePropertiesProps = {
    selectedElement: TableElement;
    updatePayload: (id: string, payloadUpdates: Partial<RepElement['payload']>) => void;
}

import cl from '../PropertyPanel.module.css';

export function TableProperties({
    selectedElement,
    updatePayload
} : TablePropertiesProps) {
    return (
        <div className={cl.PropertyGroup}>
            {/* Колонки */}
            <label className={cl.PropertyLabel}>Колонки</label>
            {selectedElement.payload.columns?.map((col, i) => (
                <div key={i} className={cl.ColumnRow}>
                    <input
                        type="text"
                        value={col}
                        onChange={(e) => {
                            const newColumns = [...(selectedElement.payload.columns || [])];
                            newColumns[i] = e.target.value;
                            updatePayload(selectedElement.id, { columns: newColumns });
                        }}
                        className={cl.PropertyInput}
                    />
                    <button
                        onClick={() => {
                            const newColumns = selectedElement.payload.columns?.filter(
                                (_, idx) => idx !== i
                            );
                            updatePayload(selectedElement.id, { columns: newColumns });
                        }}
                        className={cl.DeleteButton}
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}

            <button
                onClick={() => {
                    const newColumns = [
                        ...(selectedElement.payload.columns || []), 
                        `Колонка ${(selectedElement.payload.columns?.length || 0) + 1}`
                    ];
                    updatePayload(selectedElement.id, { columns: newColumns });
                }}
                className={cl.AddColumnButton}
            >
                <Plus size={14} />
                Додати колонку
            </button>

            {/* Рядки */}
            <label className={cl.PropertyLabel}>Рядки</label>
            {selectedElement.payload.rows?.map((row, rowIndex) => (
                <div key={rowIndex} className={cl.ColumnRow}>
                    {row.map((cell: any, cellIndex: number) => (
                        <input
                            key={cellIndex}
                            type="text"
                            value={cell}
                            onChange={(e) => {
                                const newRows = [...(selectedElement.payload.rows || [])];
                                newRows[rowIndex][cellIndex] = e.target.value;
                                updatePayload(selectedElement.id, { rows: newRows });
                            }}
                            className={cl.PropertyInput}
                        />
                    ))}
                    <button
                        onClick={() => {
                            const newRows = selectedElement.payload.rows?.filter(
                                (_, idx) => idx !== rowIndex
                            );
                            updatePayload(selectedElement.id, { rows: newRows });
                        }}
                        className={cl.DeleteButton}
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
            
            <button
                onClick={() => {
                    const columnsCount = selectedElement.payload.columns?.length || 1;
                    const newRow = Array(columnsCount).fill("");
                    const newRows = [...(selectedElement.payload.rows || []), newRow];
                    updatePayload(selectedElement.id, { rows: newRows });
                }}
                className={cl.AddColumnButton}
            >
                <Plus size={14} />
                Додати рядок
            </button>
        </div>
    );
}