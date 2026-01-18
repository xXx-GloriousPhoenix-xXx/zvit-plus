// editor/RepEditor.tsx
import { useState, useEffect } from "react";
import type { RepTemplate } from "@/shared/types/repEditorTypes";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Canvas } from "./components/Canvas/Canvas";
import { PropertyPanel } from "./components/PropertyPanel/PropertyPanel";
import { RepEditorProvider } from "@/app/providers/RepEditorProvider";
import type { EditorType } from "@/shared/api/doc/slice";

import cl from "./RepEditor.module.css";

interface Props {
    template: RepTemplate;
    onChange: (t: RepTemplate) => void;
    mode: EditorType; // 'template' | 'report'
    readonly: boolean;
}

export function RepEditor({ template, onChange, mode, readonly = false }: Props) {
    const [localTemplate, setLocalTemplate] = useState(template);

    useEffect(() => {
        setLocalTemplate(template);
    }, [template]);

    const handleChange = (newTemplate: RepTemplate) => {
        setLocalTemplate(newTemplate);
        onChange(newTemplate);
    };

    // В режиме report скрываем sidebar и property panel если readonly
    const showSidebar = mode === 'template' || !readonly;
    const showPropertyPanel = mode === 'template' || !readonly;

    return (
        <RepEditorProvider
            template={localTemplate}
            onChange={handleChange}
            mode={mode}
            readonly={readonly}
            >
            <div className={cl.Wrapper}>
                {showSidebar && <Sidebar mode={mode} readonly={readonly} />}
                <Canvas mode={mode} readonly={readonly} />
                {showPropertyPanel && <PropertyPanel/>}
            </div>
        </RepEditorProvider>
    );
}