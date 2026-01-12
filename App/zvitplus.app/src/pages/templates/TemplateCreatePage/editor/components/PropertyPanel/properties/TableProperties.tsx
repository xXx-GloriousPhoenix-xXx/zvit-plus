import { Plus, Minus } from "lucide-react";
import type { RepElement, TableElement } from "../../../../../../../shared/types/repEditorTypes";
import cl from "../PropertyPanel.module.css";
import { useTable } from "../../../../../../../shared/lib/hooks/useTable";

type TablePropertiesProps = {
    selectedElement: TableElement;
    updatePayload: (
        id: string,
        payloadUpdates: Partial<RepElement["payload"]>
    ) => void;
};

export function TableProperties({
    selectedElement,
    updatePayload,
}: TablePropertiesProps) {
    const table = useTable(selectedElement, updatePayload);

    return (
        <div className={cl.PropertyRow}>
            
            {/* Колонки */}
            <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>Колонки</label>
                <div className={cl.CounterRow}>
                    <button
                        className={cl.CounterButton}
                        onClick={table.removeColumn}
                        disabled={table.columns.length <= 1}
                    >
                        <Minus size={14} />
                    </button>

                    <span className={cl.CounterValue}>
                        {table.columns.length}
                    </span>

                    <button
                        className={cl.CounterButton}
                        onClick={table.addColumn}
                    >
                        <Plus size={14} />
                    </button>
                </div>
            </div>

            {/* Рядки */}
            <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>Рядки</label>
                <div className={cl.CounterRow}>
                    <button
                        className={cl.CounterButton}
                        onClick={table.removeRow}
                        disabled={table.rows.length <= 1}
                    >
                        <Minus size={14} />
                    </button>

                    <span className={cl.CounterValue}>
                        {table.rows.length}
                    </span>

                    <button
                        className={cl.CounterButton}
                        onClick={table.addRow}
                    >
                        <Plus size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
