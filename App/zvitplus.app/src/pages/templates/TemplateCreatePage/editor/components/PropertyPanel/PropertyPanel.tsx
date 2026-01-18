import { X } from "lucide-react";
import cl from './PropertyPanel.module.css';
import { TextProperties } from "./properties/TextProperties";
import { TableProperties } from "./properties/TableProperties";
import { ImageProperties } from "./properties/ImageProperties";
import { ChartProperties } from "./properties/ChartProperties";
import { SizeProperties } from "./properties/SizeProperties";
import { CellProperties } from "./properties/CellProperties";
import { ReportDataProperties } from "./properties/ReportDataProperties"; // Новый компонент
import { useRepEditorContext } from "@/app/context/RepEditorContext";

export function PropertyPanel() {
    const { 
        selectedElement, 
        rep, 
        selectedCell,
        mode, // 'template' | 'report'
        readonly 
    } = useRepEditorContext();

    if (!selectedElement) return null;

    const isEditable = !readonly;
    const isReportMode = mode === 'report';
    const isTemplateMode = mode === 'template';
    const isDynamicElement = selectedElement.mode === 'dynamic';

    return (        
        <div className={cl.PropertiesPanel}>
            <div className={cl.PropertiesHeader}>
                <h2 className={cl.PropertiesTitle}>
                    {isReportMode && isDynamicElement ? 'Дані елемента' : 'Властивості'}
                </h2>
                
                {isEditable && (
                    <button 
                        onClick={() => rep.deleteElement(selectedElement.id)} 
                        className={cl.DeleteButton}
                        title="Видалити елемент"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            <div className={cl.PropertiesContent}>
                <div className={cl.PropertyGroup}>
                    <label className={cl.PropertyLabel}>Тип</label>
                    <div className={cl.PropertyValue}>
                        {selectedElement.type} 
                        <span className={cl.ModeBadge}>
                            ({selectedElement.mode === 'static' ? 'статичний' : 'динамічний'})
                        </span>
                    </div>
                </div>

                {/* Основные свойства позиции/размера (только для шаблонов или если можно редактировать) */}
                {(isTemplateMode || (isReportMode && isEditable)) && (
                    <SizeProperties
                        selectedElement={selectedElement}
                        updateElement={rep.updateElement}
                        readonly={!isEditable}
                    />
                )}

                {/* Для отчетов показываем данные вместо свойств форматирования */}
                {isReportMode && isDynamicElement ? (
                    // Показываем компонент для заполнения данных отчета
                    <ReportDataProperties
                        element={selectedElement}
                        onUpdate={(data) => {
                            if (isEditable) {
                                // Здесь будет логика обновления данных отчета
                                rep.updatePayload(selectedElement.id, data);
                            }
                        }}
                        readonly={!isEditable}
                    />
                ) : (
                    // Показываем обычные свойства форматирования
                    <>
                        {selectedElement.type === 'text' && (
                            <TextProperties
                                selectedElement={selectedElement}
                                updatePayload={rep.updatePayload}
                                readonly={!isEditable}
                                isReportMode={isReportMode}
                            />
                        )}

                        {selectedElement.type === 'table' && (
                            <>
                                {/* Свойства таблицы */}
                                <TableProperties
                                    selectedElement={selectedElement}
                                    updatePayload={rep.updatePayload}
                                    readonly={!isEditable}
                                    isReportMode={isReportMode}
                                />
                                
                                {/* Свойства ячейки, если выбрана */}
                                {selectedCell && isEditable && (
                                    <CellProperties
                                        selectedElement={selectedElement}
                                        updatePayload={rep.updatePayload}
                                    />
                                )}
                            </>
                        )}

                        {selectedElement.type === 'chart' && (
                            <ChartProperties
                                selectedElement={selectedElement}
                                updatePayload={rep.updatePayload}
                                readonly={!isEditable}
                                isReportMode={isReportMode}
                            />
                        )}

                        {selectedElement.type === 'image' && (
                            <ImageProperties
                                selectedElement={selectedElement}
                                updatePayload={rep.updatePayload}
                                readonly={!isEditable}
                                isReportMode={isReportMode}
                            />
                        )}
                    </>
                )}

                {/* Информация о режиме */}
                <div className={cl.ModeInfo}>
                    <div className={cl.ModeInfoItem}>
                        <span className={cl.ModeInfoLabel}>Режим:</span>
                        <span className={cl.ModeInfoValue}>
                            {isTemplateMode ? 'Шаблон' : 'Звіт'}
                        </span>
                    </div>
                    <div className={cl.ModeInfoItem}>
                        <span className={cl.ModeInfoLabel}>Доступ:</span>
                        <span className={cl.ModeInfoValue}>
                            {readonly ? 'Тільки перегляд' : 'Редагування'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}