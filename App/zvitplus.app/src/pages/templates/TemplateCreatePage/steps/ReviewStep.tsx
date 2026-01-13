// steps/ReviewStep.tsx
import { Button } from "@/shared/ui/Button/Button.tsx";
import type { RepTemplate } from "../../../../shared/types/repEditorTypes";
import { ReviewCanvas } from "../Review/ReviewCanvas";

import cl from "../TemplateCreatePage.module.css";

interface ReviewStepProps {
    template: RepTemplate;
    onBack: () => void;
    onClearDraft?: () => void;
    onSubmit: () => Promise<void>;
    loading?: boolean;
}

export function ReviewStep({ 
    template, 
    onBack, 
    onClearDraft, 
    onSubmit,
    loading = false 
}: ReviewStepProps) {
    const handleSubmit = async () => {
        await onSubmit();
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