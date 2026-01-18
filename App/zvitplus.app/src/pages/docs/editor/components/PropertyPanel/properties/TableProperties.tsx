// properties/TableProperties.tsx
import { Plus, Minus } from "lucide-react";
import type { RepElement, TableElement } from "@/shared/types/repEditorTypes";
import cl from "../PropertyPanel.module.css";
import { useTable } from "@/shared/hooks/useTable";

type TablePropertiesProps = {
    selectedElement: TableElement;
    updatePayload: (
        id: string,
        payloadUpdates: Partial<RepElement["payload"]>
    ) => void;
    readonly?: boolean;
    isReportMode?: boolean;
};

export function TableProperties({
    selectedElement,
    updatePayload,
    readonly = false,
    isReportMode = false
}: TablePropertiesProps) {
    const table = useTable(selectedElement, updatePayload);

    // Для отчетов не показываем управление структурой
    if (isReportMode) {
        return (
            <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>Структура таблиці</label>
                <div className={cl.PropertyValue}>
                    {table.columns.length} колонок × {table.rows.length} рядків
                </div>
                <div className={cl.PropertyHint}>
                    Структуру таблиці можна змінити тільки в шаблоні
                </div>
            </div>
        );
    }

    return (
        <div className={cl.PropertyRow}>
            
            {/* Колонки */}
            <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>Колонки</label>
                <div className={cl.CounterRow}>
                    <button
                        className={cl.CounterButton}
                        onClick={table.removeColumn}
                        disabled={table.columns.length <= 1 || readonly}
                        title={readonly ? "Тільки перегляд" : "Видалити колонку"}
                    >
                        <Minus size={14} />
                    </button>

                    <span className={cl.CounterValue}>
                        {table.columns.length}
                    </span>

                    <button
                        className={cl.CounterButton}
                        onClick={table.addColumn}
                        disabled={readonly}
                        title={readonly ? "Тільки перегляд" : "Додати колонку"}
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
                        disabled={table.rows.length <= 1 || readonly}
                        title={readonly ? "Тільки перегляд" : "Видалити рядок"}
                    >
                        <Minus size={14} />
                    </button>

                    <span className={cl.CounterValue}>
                        {table.rows.length}
                    </span>

                    <button
                        className={cl.CounterButton}
                        onClick={table.addRow}
                        disabled={readonly}
                        title={readonly ? "Тільки перегляд" : "Додати рядок"}
                    >
                        <Plus size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}