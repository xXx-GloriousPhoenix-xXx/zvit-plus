import type { EditorMode } from "@/shared/types/repEditorTypes";
import cl from './EditPage.module.css';

interface Props {
    mode: EditorMode;
    readonly: boolean;
}

export function EditPage({ mode, readonly }: Props) {
    return (
        <section className={cl.Wrapper}>
            <h1>Page Edit {mode}/{readonly ? "true" : "false"}</h1>
        </section>
    );
}