// steps/ReviewStep.tsx
import { Button } from "@/shared/ui/Button/Button.tsx";
import type { RepTemplate } from "../../../../shared/types/repEditorTypes";
import { ReviewCanvas } from "../Review/ReviewCanvas";

import cl from "../TemplateCreatePage.module.css";
import { useState } from "react";

interface ReviewStepProps {
    template: RepTemplate;
    onBack: () => void;
    onClearDraft?: () => void;
    onSubmit: () => Promise<void>;
}

export function ReviewStep({ 
    template, 
    onBack, 
    onClearDraft, 
    onSubmit
}: ReviewStepProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        
        try {
            await onSubmit();
        } catch (err: any) {
            setError(err.message || "Помилка при створенні шаблону");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cl.ReviewContainer}>
            <div className={cl.ReviewCanvasSection}>
                <ReviewCanvas template={template} />
            </div>

            <div className={cl.ButtonGroup}>
                <Button
                    extraClassName={cl.Button}
                    text="Назад до редактора"
                    onClick={onBack}
                    disabled={loading}
                />
                
                <Button
                    extraClassName={cl.Button}
                    text={loading ? "Створення..." : "Створити"}
                    onClick={handleSubmit}
                    disabled={loading}
                />
            </div>

            {onClearDraft && (
                <div className={cl.DraftActions}>
                    <Button
                        extraClassName={cl.MarginedButton}
                        text="Очистити"
                        onClick={onClearDraft}
                        disabled={loading}
                    />
                </div>
            )}        
        </div>
    );
}