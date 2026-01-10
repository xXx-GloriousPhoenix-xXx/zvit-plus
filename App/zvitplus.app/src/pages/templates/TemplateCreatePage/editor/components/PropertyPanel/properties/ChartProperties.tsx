import type { ChartElement, ChartType, RepElement } from "../../../types";

type ChartPropertiesProps = {
    selectedElement: ChartElement;
    updatePayload: (id: string, payloadUpdates: Partial<RepElement['payload']>) => void;
}

import cl from '../PropertyPanel.module.css';

export function ChartProperties({
    selectedElement,
    updatePayload
} : ChartPropertiesProps) {
    return (
        <>
            <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>Тип діаграми</label>
                <select
                    value={selectedElement.payload.chartType || 'bar'}
                    onChange={(e) => updatePayload(selectedElement.id, { 
                        chartType: e.target.value as ChartType 
                    })}
                    className={cl.PropertySelect}
                >
                    <option value="bar">Стовпчаста</option>
                    <option value="line">Лінійна</option>
                    <option value="pie">Кругова</option>
                </select>
            </div>
            <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>Джерело даних</label>
                <input
                    type="text"
                    value={selectedElement.payload.dataSource || ''}
                    onChange={(e) => updatePayload(selectedElement.id, { 
                        dataSource: e.target.value 
                    })}
                    placeholder="data/sales.json"
                    className={cl.PropertyInput}
                />
            </div>
        </>
    );
}