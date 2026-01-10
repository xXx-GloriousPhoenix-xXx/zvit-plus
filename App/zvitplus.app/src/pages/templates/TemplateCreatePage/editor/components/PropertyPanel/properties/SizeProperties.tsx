import type { RepElement, RepElementType } from "../../../types";

type SizePropertiesProps = {
    selectedElement: RepElement;
    updateElement: (id: string, updates: Partial<Omit<RepElement, "type">> & {
        type?: RepElementType | undefined;
    }) => void
}

import cl from '../PropertyPanel.module.css';

export function SizeProperties({
    selectedElement,
    updateElement
} : SizePropertiesProps) {
    return(
        <>
            <div className={cl.PropertyRow}>
                <div className={cl.PropertyGroup}>
                    <label className={cl.PropertyLabel}>X</label>
                    <input
                        type="number"
                        value={Math.round(selectedElement.position.x)}
                        onChange={(e) => updateElement(selectedElement.id, {
                            position: { 
                                ...selectedElement.position, 
                                x: parseInt(e.target.value) || 0 
                            }
                        })}
                        className={cl.PropertyInput}
                    />
                </div>
            
                <div className={cl.PropertyGroup}>
                    <label className={cl.PropertyLabel}>Y</label>
                    <input
                        type="number"
                        value={Math.round(selectedElement.position.y)}
                        onChange={(e) => updateElement(selectedElement.id, {
                            position: { 
                                ...selectedElement.position, 
                                y: parseInt(e.target.value) || 0 
                            }
                        })}
                        className={cl.PropertyInput}
                    />
                </div>
            </div>

            <div className={cl.PropertyRow}>
                <div className={cl.PropertyGroup}>
                    <label className={cl.PropertyLabel}>Ширина</label>
                    <input
                        type="number"
                        value={Math.round(selectedElement.size.width)}
                        onChange={(e) => updateElement(selectedElement.id, {
                            size: { 
                                ...selectedElement.size, 
                                width: parseInt(e.target.value) || 80 
                            }
                        })}
                        className={cl.PropertyInput}
                    />
                </div>
                <div className={cl.PropertyGroup}>
                    <label className={cl.PropertyLabel}>Висота</label>
                    <input
                        type="number"
                        value={Math.round(selectedElement.size.height)}
                        onChange={(e) => updateElement(selectedElement.id, {
                            size: { 
                                ...selectedElement.size, 
                                height: parseInt(e.target.value) || 40 
                            }
                        })}
                        className={cl.PropertyInput}
                    />
                </div>
            </div>
        </>
    );
}