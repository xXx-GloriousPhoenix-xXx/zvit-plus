export type EditorMode = "template" | "report" | "view";
interface TemplateEditPageProps {
    mode: EditorMode;
    readonly: boolean;
}
export function TemplateEditPage({ mode, readonly }: TemplateEditPageProps) {
    return <h1>Template Edit {mode}/{readonly}</h1>
}