import { X } from "lucide-react";
import type { RepElement, RepElementType } from "../../types";

import cl from './PropertyPanel.module.css';
import { TextProperties } from "./properties/TextProperties";
import { TableProperties } from "./properties/TableProperties";
import { ImageProperties } from "./properties/ImageProperties";
import { ChartProperties } from "./properties/ChartProperties";
import { SizeProperties } from "./properties/SizeProperties";

type PropertyPanelProps = {
    selectedElement: RepElement | null;
    deleteElement: (id: string) => void;
    updateElement: (id: string, updates: Partial<Omit<RepElement, "type">> & {
        type?: RepElementType | undefined;
    }) => void;
    updatePayload: (id: string, payloadUpdates: Partial<RepElement['payload']>) => void;
}

export function PropertyPanel({
    selectedElement,
    deleteElement,
    updateElement,
    updatePayload
} : PropertyPanelProps) {
    return (        
        <>
            {selectedElement && (
            <div className={cl.PropertiesPanel}>
                <div className={cl.PropertiesHeader}>
                    <h2 className={cl.PropertiesTitle}>Властивості</h2>
                    <button 
                        onClick={() => deleteElement(selectedElement.id)} 
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
                        updateElement={updateElement}
                    />

                    {selectedElement.type === 'text' && (
                        <TextProperties
                            selectedElement={selectedElement}
                            updatePayload={updatePayload}
                        />
                    )}

                    {selectedElement.type === 'table' && (
                        <TableProperties
                            selectedElement={selectedElement}
                            updatePayload={updatePayload}
                        />
                    )}

                    {selectedElement.type === 'chart' && (
                        <ChartProperties
                            selectedElement={selectedElement}
                            updatePayload={updatePayload}
                        />
                    )}

                    {selectedElement.type === 'image' && (
                        <ImageProperties
                            selectedElement={selectedElement}
                            updatePayload={updatePayload}
                        />
                    )}
                </div>
            </div>
            )}
        </>
    );
}