// editor/RepEditor.tsx
import type { RepTemplate } from "../../../../shared/types/repEditorTypes";

import { Sidebar } from "./components/Sidebar/Sidebar";

import cl from "./RepEditor.module.css";
import { Canvas } from "./components/Canvas/Canvas";
import { PropertyPanel } from "./components/PropertyPanel/PropertyPanel";
import { RepEditorProvider } from "@/app/providers/RepEditorProvider";

interface Props {
    template: RepTemplate;
    onChange: (t: RepTemplate) => void;
}

export function RepEditor({ template, onChange } : Props) {
    return (
        <RepEditorProvider
            template={template}
            onChange={onChange}
        >
            <div className={cl.Wrapper}>
                <Sidebar />
                <Canvas />
                <PropertyPanel />
            </div>
        </RepEditorProvider>
    );
}