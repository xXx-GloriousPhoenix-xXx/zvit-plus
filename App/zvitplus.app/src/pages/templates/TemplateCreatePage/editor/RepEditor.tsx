// editor/RepEditor.tsx
import { useEffect, useRef } from "react";

import type { RepTemplate } from "./types";

import { useRepEditor } from "./hooks/useRepEditor";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import { useResize } from "./hooks/useResize";

import { Sidebar } from "./components/Sidebar/Sidebar";

import cl from "./RepEditor.module.css";
import { Canvas } from "./components/Canvas/Canvas";
import { PropertyPanel } from "./components/PropertyPanel/PropertyPanel";

interface Props {
    template: RepTemplate;
    onChange: (t: RepTemplate) => void;
}

export function RepEditor({ template, onChange }: Props) {
    const canvasRef = useRef<HTMLDivElement>(null);

    const rep = useRepEditor({ template, onChange });
    const drag = useDragAndDrop(canvasRef, rep.updateElement);
    const resize = useResize(canvasRef, rep.updateElement);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === "Delete" && rep.selectedElement) {
            rep.deleteElement(rep.selectedElement.id);
          }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [rep.selectedElement, rep.deleteElement]);

    return (
        <div className={cl.Wrapper}>
            <Sidebar
                elements={rep.elements}
                selectedElement={rep.selectedElement}
                
                addElement={rep.addElement}
                deleteElement={rep.deleteElement}
                setSelectedElement={rep.setSelectedElement}
            />

            <Canvas
                handleDragStart={drag.handleMouseDown}
                handleDragMove={drag.handleMouseMove}
                handleDragEnd={drag.handleMouseUp}

                handleResizeStart={resize.handleResizeStart}
                handleResizeMove={resize.handleResizeMove}
                handleResizeEnd={resize.handleResizeEnd}

                setSelectedElement={rep.setSelectedElement}

                elements={rep.elements}
                selectedElement={rep.selectedElement}
                draggedElement={drag.draggedElement}
                canvasRef={canvasRef}
            />

            <PropertyPanel
                selectedElement={rep.selectedElement}

                deleteElement={rep.deleteElement}
                updateElement={rep.updateElement}
                updatePayload={rep.updatePayload}
            />
        </div>
    );
}