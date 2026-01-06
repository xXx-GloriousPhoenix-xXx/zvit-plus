export type EditorMode = "template" | "report" | "view";
interface TemplateEditPageProps {
    mode: EditorMode;
    id: string;
    readonly: boolean;
}
export function TemplateEditPage({ mode, id, readonly }: TemplateEditPageProps) {
    return <h1>Template Edit {mode}/{id}/{readonly}</h1>
}