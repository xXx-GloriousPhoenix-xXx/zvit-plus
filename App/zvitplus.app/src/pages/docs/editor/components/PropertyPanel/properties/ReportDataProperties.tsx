// editor/components/properties/ReportDataProperties.tsx
import { useState, useEffect } from 'react';
import cl from '../PropertyPanel.module.css';
import type { RepElement, ChartElement, TableElement, TextElement, ImageElement } from '@/shared/types/repEditorTypes';

interface ReportDataPropertiesProps {
    element: RepElement;
    onUpdate: (data: any) => void;
    readonly?: boolean;
}

export function ReportDataProperties({ 
    element, 
    onUpdate, 
    readonly = false 
}: ReportDataPropertiesProps) {
    const [data, setData] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Инициализация данных из элемента
    useEffect(() => {
        if (element.payload) {
            let elementData = '';
            
            switch (element.type) {
                case 'text':
                    // Для текста берем текст из payload
                    elementData = (element as TextElement).payload.text || '';
                    break;
                case 'image':
                    // Для изображения берем src
                    elementData = (element as ImageElement).payload.src || '';
                    break;
                case 'chart':
                    // Для графика: chartType + dataSource + title
                    const chartElement = element as ChartElement;
                    elementData = JSON.stringify({
                        chartType: chartElement.payload.chartType || 'bar',
                        dataSource: chartElement.payload.dataSource || '',
                        title: chartElement.payload.title || ''
                    }, null, 2);
                    break;
                case 'table':
                    // Для таблицы: columns + rows
                    const tableElement = element as TableElement;
                    elementData = JSON.stringify({
                        columns: tableElement.payload.columns || [],
                        rows: tableElement.payload.rows || []
                    }, null, 2);
                    break;
            }
            
            setData(elementData);
        }
    }, [element]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setData(value);
        setError(null);
        
        if (!readonly) {
            try {
                let parsedData;
                
                // Парсим в зависимости от типа элемента
                if (element.type === 'chart' || element.type === 'table') {
                    parsedData = JSON.parse(value);
                } else {
                    parsedData = value;
                }
                
                // Преобразуем данные в формат для обновления payload
                const payloadUpdate = transformDataForPayload(element.type, parsedData);
                onUpdate(payloadUpdate);
            } catch (error) {
                setError('Неправильний формат JSON');
                // Если ошибка парсинга, пытаемся сохранить как текст
                if (element.type === 'text' || element.type === 'image') {
                    const payloadUpdate = transformDataForPayload(element.type, value);
                    onUpdate(payloadUpdate);
                }
            }
        }
    };

    // Функция для преобразования введенных данных в формат payload
    const transformDataForPayload = (type: string, data: any) => {
        switch (type) {
            case 'text':
                return { text: data };
            case 'image':
                return { src: data };
            case 'chart':
                // Проверяем, что data - объект с нужными полями
                if (typeof data === 'object' && data !== null) {
                    return {
                        chartType: data.chartType || 'bar',
                        dataSource: data.dataSource || '',
                        title: data.title || ''
                    };
                }
                // Если это строка, пробуем использовать как dataSource
                return { dataSource: data };
            case 'table':
                // Проверяем структуру данных для таблицы
                if (typeof data === 'object' && data !== null) {
                    return {
                        columns: Array.isArray(data.columns) ? data.columns : [],
                        rows: Array.isArray(data.rows) ? data.rows : []
                    };
                }
                // Если неправильный формат, возвращаем пустые массивы
                return { columns: [], rows: [] };
            default:
                return {};
        }
    };

    const getInputType = () => {
        switch (element.type) {
            case 'text':
                return 'text';
            case 'image':
                return 'url';
            case 'chart':
            case 'table':
                return 'json';
            default:
                return 'text';
        }
    };

    const getPlaceholder = () => {
        switch (element.type) {
            case 'text':
                return element.mode === 'dynamic' ? '{variable_name}' : 'Введіть текст...';
            case 'image':
                return element.mode === 'dynamic' ? '{image_path}' : 'URL зображення...';
            case 'chart':
                return element.mode === 'dynamic' 
                    ? '{"dataSource": "{data_variable}", "title": "Заголовок"}'
                    : 'JSON дані для діаграми...';
            case 'table':
                return element.mode === 'dynamic'
                    ? '{"columns": [...], "rows": [...]}'
                    : 'JSON дані для таблиці...';
            default:
                return 'Введіть дані...';
        }
    };

    const getLabel = () => {
        switch (element.type) {
            case 'text':
                return element.mode === 'dynamic' ? 'Змінна для тексту' : 'Текст звіту';
            case 'image':
                return element.mode === 'dynamic' ? 'Змінна для зображення' : 'Джерело зображення';
            case 'chart':
                return element.mode === 'dynamic' ? 'Змінна для даних діаграми' : 'Дані для діаграми';
            case 'table':
                return element.mode === 'dynamic' ? 'Змінна для даних таблиці' : 'Дані для таблиці';
            default:
                return 'Дані';
        }
    };

    const renderPreview = () => {
        if (!data.trim()) return null;
        
        try {
            if (element.type === 'chart' || element.type === 'table') {
                const parsed = JSON.parse(data);
                return (
                    <div className={cl.DataPreview}>
                        <h4 className={cl.PreviewTitle}>Попередній перегляд:</h4>
                        <pre className={cl.PreviewContent}>
                            {JSON.stringify(parsed, null, 2)}
                        </pre>
                    </div>
                );
            } else if (element.type === 'image' && data) {
                return (
                    <div className={cl.DataPreview}>
                        <h4 className={cl.PreviewTitle}>Попередній перегляд:</h4>
                        <div className={cl.ImagePreview}>
                            {data.startsWith('http') || data.startsWith('/') ? (
                                <>
                                    <img 
                                        src={data} 
                                        alt="Попередній перегляд" 
                                        className={cl.PreviewImage}
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                    <div className={cl.ImageUrl}>{data}</div>
                                </>
                            ) : (
                                <div className={cl.ImagePlaceholder}>
                                    {element.mode === 'dynamic' ? `Змінна: ${data}` : 'Локальний файл'}
                                </div>
                            )}
                        </div>
                    </div>
                );
            } else if (element.type === 'text') {
                return (
                    <div className={cl.DataPreview}>
                        <h4 className={cl.PreviewTitle}>Попередній перегляд тексту:</h4>
                        <div className={cl.TextPreview}>
                            {element.mode === 'dynamic' ? `{${data}}` : data}
                        </div>
                    </div>
                );
            }
        } catch (error) {
            return (
                <div className={cl.ErrorPreview}>
                    Помилка в форматі даних
                </div>
            );
        }
        
        return null;
    };

    const inputType = getInputType();
    const isJson = inputType === 'json';
    const isDynamic = element.mode === 'dynamic';

    return (
        <div className={cl.PropertyGroup}>
            <label className={cl.PropertyLabel}>
                {getLabel()}
                {isDynamic && <span className={cl.DynamicBadge}>динамічний</span>}
            </label>
            
            {isJson ? (
                <textarea
                    className={cl.PropertyTextarea}
                    value={data}
                    onChange={handleChange}
                    placeholder={getPlaceholder()}
                    rows={isDynamic ? 4 : 6}
                    readOnly={readonly}
                    disabled={readonly}
                />
            ) : (
                <input
                    type={inputType}
                    className={cl.PropertyInput}
                    value={data}
                    onChange={handleChange}
                    placeholder={getPlaceholder()}
                    readOnly={readonly}
                    disabled={readonly}
                />
            )}
            
            {error && (
                <div className={cl.ErrorPreview}>
                    {error}
                </div>
            )}
            
            {renderPreview()}
            
            <div className={cl.PropertyHint}>
                {isJson 
                    ? isDynamic 
                        ? 'Введіть JSON з даними або іменами змінних для заповнення'
                        : 'Введіть дані у форматі JSON'
                    : isDynamic
                    ? 'Введіть ім\'я змінної для заповнення у звіті'
                    : 'Введіть значення для заповнення у звіті'}
            </div>
        </div>
    );
}