// TemplateCreatePage.tsx
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { MetaStep } from "./steps/MetaStep";
import { EditorStep } from "./steps/EditorStep";
import { ReviewStep } from "./steps/ReviewStep";
import { 
    setMeta, 
    setTemplate, 
    setStep, 
    clearDraft 
} from "@/shared/api/templates/templateSlice";

import cl from "./TemplateCreatePage.module.css";

export function TemplateCreatePage() {
    const dispatch = useAppDispatch();
    const { meta, template, step } = useAppSelector(s => s.templateCreate);

    // Очистка черновика при размонтировании (опционально)
    // useEffect(() => {
    //     return () => {
    //         // Очищаем только если пользователь покинул страницу создания
    //         // Можно добавить подтверждение
    //     };
    // }, []);

    const handleClearDraft = () => {
        if (window.confirm('Вы уверены что хотите очистить черновик?')) {
            dispatch(clearDraft());
        }
    };

    function renderStep(currentStep: number) {
        switch (currentStep) {
            case 1:
                return (
                    <MetaStep
                        value={meta}
                        onNext={(data) => {
                            dispatch(setMeta(data));
                            dispatch(setStep(2));
                        }}
                    />
                );
            case 2:
                return (
                    <EditorStep
                        template={template}
                        onChange={(newTemplate) => dispatch(setTemplate(newTemplate))}
                        onNext={() => dispatch(setStep(3))}
                        onBack={() => dispatch(setStep(1))}
                    />
                );
            case 3:
                return (
                    <ReviewStep
                        template={template}
                        onBack={() => dispatch(setStep(2))}
                        onClearDraft={handleClearDraft}
                    />
                );
            default:
                return null;
        }
    }

    return (
        <section className={cl.Wrapper}>
            {renderStep(step)}
        </section>
    );
}