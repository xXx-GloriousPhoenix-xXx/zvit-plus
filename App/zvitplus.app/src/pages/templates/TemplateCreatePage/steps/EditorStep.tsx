// steps/EditorStep.tsx
import type { RepTemplate } from "../editor/types";
import { RepEditor } from "../editor/RepEditor";
import { Button } from "@/shared/ui/Button/Button";

interface Props {
    template: RepTemplate;
    onChange: (t: RepTemplate) => void;
    onNext: () => void;
    onBack: () => void;
}

export function EditorStep({ template, onChange, onNext, onBack }: Props) {
    return (
        <>
            <h2>Template editor</h2>

            <RepEditor
                template={template}
                onChange={onChange}
            />

            <Button
                text='Назад'
                onClick={onBack}
            />
            <Button
                text='Далі'
                onClick={onNext}
            />
        </>
    );
}
