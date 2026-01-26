// EditorStep.tsx
import { Button } from "@/shared/ui/Button/Button";
import { useAppDispatch } from "@/app/store/hooks";
import { setEditorTemplate, setEditorStep } from "@/shared/api/doc/slice";
import { RepEditor } from "../editor/RepEditor";
import type { RepTemplate } from "@/shared/types/repEditorTypes";
import type { EditorMode, EditorType } from "@/shared/api/doc/slice";

import cl from "./Step.module.css";

interface Props {
    mode: EditorMode;
    type: EditorType;
    template: RepTemplate;
}

export function EditorStep({ 
    mode, 
    type, 
    template
}: Props) {
    const dispatch = useAppDispatch();

    const handleTemplateChange = (newTemplate: RepTemplate) => {
        dispatch(setEditorTemplate(newTemplate));
    };

    const handleNext = () => {
        dispatch(setEditorStep(3));
    };

    const handleBack = () => {
        dispatch(setEditorStep(1));
    };

    return (
        <div className={cl.Wrapper}>            
            <div className={cl.EditorContainer}>
                <RepEditor
                    template={template}
                    onChange={handleTemplateChange}
                    mode={type}
                    readonly={mode === 'view'}
                />
            </div>

            <div className={cl.ButtonGroup}>
                <Button
                    variant="primary"
                    text="Назад"
                    onClick={handleBack}
                    extraClassName={cl.Button}
                />
                
                {mode !== 'view' && (
                    <Button
                        variant="primary"
                        text="Далі"
                        onClick={handleNext}
                        extraClassName={cl.Button}
                    />
                )}
                
                {mode === 'view' && (
                    <Button
                        variant="primary"
                        text="Переглянути результат"
                        onClick={() => dispatch(setEditorStep(3))}
                        extraClassName={cl.Button}
                    />
                )}
            </div>
        </div>
    );
}