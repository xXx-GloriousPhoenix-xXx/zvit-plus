import type { EditorMode } from "@/shared/types/repEditorTypes";

type Props = {
    mode: EditorMode;
}

export function UploadPage({ mode } : Props) {
    return <h1>Upload Page {mode}</h1>
}