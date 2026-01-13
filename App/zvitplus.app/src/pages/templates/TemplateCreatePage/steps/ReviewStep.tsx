// steps/ReviewStep.tsx
import { Button } from "@/shared/ui/Button/Button.tsx";
import type { RepTemplate } from "../../../../shared/types/repEditorTypes";

import cl from "../TemplateCreatePage.module.css";

interface ReviewStepProps {
    template: RepTemplate;
    onBack: () => void;
    onClearDraft?: () => void; // Делаем опциональным
}

export function ReviewStep({ template, onBack, onClearDraft }: ReviewStepProps) {
    const handleSubmit = async () => {
        // Отправка шаблона
        console.log('Submitting template:', template);
    };

    return (
        <>
            <div className={cl.ReviewContainer}>
                <h3>Обзор шаблона</h3>
                <div>
                    <strong>Название:</strong> {template.meta.templateName}
                </div>
                <div>
                    <strong>Тип:</strong> {template.meta.templateTypeId}
                </div>
                <div>
                    <strong>Элементов:</strong> {template.elements.length}
                </div>
                {/* Детали шаблона */}
            </div>

            <div className={cl.ButtonGroup}>
                <Button
                    text="Назад"
                    onClick={onBack}
                />
                
                {onClearDraft && (
                    <Button
                        text="Очистить черновик"
                        onClick={onClearDraft}
                    />
                )}
                
                <Button
                    text="Создать шаблон"
                    onClick={handleSubmit}
                />
            </div>
        </>
    );
}