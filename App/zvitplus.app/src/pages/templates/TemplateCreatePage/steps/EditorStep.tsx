// EditorStep.tsx
import { useAppDispatch } from "@/app/store/hooks";
import { Button } from "@/shared/ui/Button/Button.tsx";
import type { RepTemplate } from "@/shared/types/repEditorTypes";
import { setTemplate } from "@/shared/api/templates/templateCreateSlice";

import cl from "../TemplateCreatePage.module.css";
import { RepEditor } from "../editor/RepEditor";

interface Props {
    template: RepTemplate;
    onChange: (template: RepTemplate) => void;
    onNext: () => void;
    onBack: () => void;
}

export function EditorStep({ template, onNext, onBack }: Props) {
    const dispatch = useAppDispatch();

    const handleTemplateChange = (newTemplate: RepTemplate) => {
        dispatch(setTemplate(newTemplate));
    };

    return (
        <>
            <div className={cl.EditorContainer}>
                <RepEditor
                    template={template}
                    onChange={handleTemplateChange}
                />
            </div>

            <div className={cl.ButtonGroup}>
                <Button
                    extraClassName={cl.Button}
                    text="Назад"
                    onClick={onBack}
                />
                <Button
                    extraClassName={cl.Button}
                    text="Далее"
                    onClick={onNext}
                />
            </div>
        </>
    );
}