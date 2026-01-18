// properties/ChartProperties.tsx
import type { ChartElement, ChartType, RepElement } from "@/shared/types/repEditorTypes";
import cl from '../PropertyPanel.module.css';

type ChartPropertiesProps = {
    selectedElement: ChartElement;
    updatePayload: (id: string, payloadUpdates: Partial<RepElement['payload']>) => void;
    readonly?: boolean;
    isReportMode?: boolean;
}

export function ChartProperties({
    selectedElement,
    updatePayload,
    readonly = false,
    isReportMode = false
} : ChartPropertiesProps) {
    
    // Для отчетов показываем только данные
    if (isReportMode) {
        return (
            <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>Дані для діаграми</label>
                {readonly ? (
                    <div className={cl.PropertyValue}>
                        {selectedElement.payload.dataSource || '(джерело не вказано)'}
                    </div>
                ) : (
                    <input
                        type="text"
                        value={selectedElement.payload.dataSource || ''}
                        onChange={(e) => updatePayload(selectedElement.id, { 
                            dataSource: e.target.value 
                        })}
                        placeholder="Назва змінної або шлях до даних"
                        className={cl.PropertyInput}
                        disabled={readonly}
                    />
                )}
            </div>
        );
    }

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
                    disabled={readonly}
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
                    placeholder="data/sales.json або {variable_name}"
                    className={cl.PropertyInput}
                    disabled={readonly}
                />
            </div>
            
            {!readonly && (
                <div className={cl.PropertyGroup}>
                    <label className={cl.PropertyLabel}>Заголовок діаграми</label>
                    <input
                        type="text"
                        value={selectedElement.payload.title || ''}
                        onChange={(e) => updatePayload(selectedElement.id, { 
                            title: e.target.value 
                        })}
                        placeholder="Назва діаграми"
                        className={cl.PropertyInput}
                    />
                </div>
            )}
        </>
    );
}