// TemplateCreatePage.tsx
import { useState } from "react";
import { MetaStep } from "./steps/MetaStep";
import { EditorStep } from "./steps/EditorStep";
import { ReviewStep } from "./steps/ReviewStep";
import type { MetaValue, RepTemplate } from "./editor/types";

import cl from "./TemplateCreatePage.module.css";

type Step = 1 | 2 | 3;

export function TemplateCreatePage() {
    const [step, setStep] = useState<Step>(1);

    const [meta, setMeta] = useState<MetaValue>({
        templateName: "",
        templateTypeId: "",
        isPrivate: false,
        pageSize: "A4",
        orientation: "portrait"
    });

    const [template, setTemplate] = useState<RepTemplate>({
        meta: meta,
        elements: []
    });

    function renderStep(step: number) {
        switch (step) {
            case 1:
            return <MetaStep
                value={meta}
                onNext={(data) => {
                    setMeta(data);
                    setTemplate(t => ({
                        ...t,
                        templateName: data.templateName,
                        templateType: data.templateTypeId
                    }));
                    setStep(2);
                }}
            />

            case 2:
            return <EditorStep
                template={template}
                onChange={setTemplate}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
            />

            case 3:
            return <ReviewStep
                template={template}
                onBack={() => setStep(2)}
            />
        }
    }

    return (
        <section className={cl.Wrapper}>
            { renderStep(step) }
        </section>
    );
}
