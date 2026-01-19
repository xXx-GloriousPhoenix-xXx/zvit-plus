import { X } from "lucide-react";
import cl from './PropertyPanel.module.css';
import { TextProperties } from "./properties/TextProperties";
import { TableProperties } from "./properties/TableProperties";
import { ImageProperties } from "./properties/ImageProperties";
import { ChartProperties } from "./properties/ChartProperties";
import { SizeProperties } from "./properties/SizeProperties";
import { CellProperties } from "./properties/CellProperties";
import { useRepEditorContext } from "@/app/context/RepEditorContext";

export function PropertyPanel() {
    const { 
        selectedElement, 
        rep, 
        selectedCell,
        mode,
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

                <SizeProperties
                    selectedElement={selectedElement}
                    updateElement={rep.updateElement}
                    readonly={!isTemplateMode}
                />

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
                        <TableProperties
                            selectedElement={selectedElement}
                            updatePayload={rep.updatePayload}
                            readonly={!isEditable}
                            isReportMode={isReportMode}
                        />
                        
                        {selectedCell && (
                            <CellProperties
                                selectedElement={selectedElement}
                                updatePayload={rep.updatePayload}
                                isReportMode={mode === 'report'}
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
            </div>
        </div>
    );
}