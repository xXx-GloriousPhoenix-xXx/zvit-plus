import { X } from "lucide-react";

import cl from './PropertyPanel.module.css';
import { TextProperties } from "./properties/TextProperties";
import { TableProperties } from "./properties/TableProperties";
import { ImageProperties } from "./properties/ImageProperties";
import { ChartProperties } from "./properties/ChartProperties";
import { SizeProperties } from "./properties/SizeProperties";
import { useRepEditorContext } from "@/app/context/RepEditorContext";

export function PropertyPanel() {
    const { selectedElement, rep } = useRepEditorContext();
    return (        
        <>
            {selectedElement && (
            <div className={cl.PropertiesPanel}>
                <div className={cl.PropertiesHeader}>
                    <h2 className={cl.PropertiesTitle}>Властивості</h2>
                    <button 
                        onClick={() => rep.deleteElement(selectedElement.id)} 
                        className={cl.DeleteButton}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className={cl.PropertiesContent}>
                    <div className={cl.PropertyGroup}>
                        <label className={cl.PropertyLabel}>Тип</label>
                        <div className={cl.PropertyValue}>
                            {selectedElement.type} ({selectedElement.mode})
                        </div>
                    </div>

                    <SizeProperties
                        selectedElement={selectedElement}
                        updateElement={rep.updateElement}
                    />

                    {selectedElement.type === 'text' && (
                        <TextProperties
                            selectedElement={selectedElement}
                            updatePayload={rep.updatePayload}
                        />
                    )}

                    {selectedElement.type === 'table' && (
                        <TableProperties
                            selectedElement={selectedElement}
                            updatePayload={rep.updatePayload}
                        />
                    )}

                    {selectedElement.type === 'chart' && (
                        <ChartProperties
                            selectedElement={selectedElement}
                            updatePayload={rep.updatePayload}
                        />
                    )}

                    {selectedElement.type === 'image' && (
                        <ImageProperties
                            selectedElement={selectedElement}
                            updatePayload={rep.updatePayload}
                        />
                    )}
                </div>
            </div>
            )}
        </>
    );
}