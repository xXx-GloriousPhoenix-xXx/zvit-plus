// steps/EditorStep.tsx
import type { RepTemplate } from "../../../../shared/types/repEditorTypes";
import { RepEditor } from "../editor/RepEditor";
import { Button } from "@/shared/ui/Button/Button";

import cl from "../TemplateCreatePage.module.css";

interface Props {
    template: RepTemplate;
    onChange: (t: RepTemplate) => void;
    onNext: () => void;
    onBack: () => void;
}

export function EditorStep({ template, onChange, onNext, onBack }: Props) {
    return (
        <>
            <RepEditor
                template={template}
                onChange={onChange}
            />

            <div className={cl.Control}>
                <Button
                    extraClassName={cl.Button}
                    text='Назад'
                    onClick={onBack}
                />
                <Button
                    extraClassName={cl.Button}
                    text='Далі'
                    onClick={onNext}
                />
            </div>
        </>
    );
}
