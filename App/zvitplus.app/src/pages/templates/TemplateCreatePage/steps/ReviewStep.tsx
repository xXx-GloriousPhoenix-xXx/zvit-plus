import { useAppDispatch } from "@/app/store/hooks";
import { createTemplate } from "@/shared/api/templates/createTemplateThunk";
import { Button } from "@/shared/ui/Button/Button";
import type { RepTemplate } from "../../../../shared/types/repEditorTypes";
import { useState } from "react";

import cl from "../TemplateCreatePage.module.css";

interface ReviewStepProps {
    template: RepTemplate;
    onBack: () => void;
}

export function ReviewStep({ template, onBack }: ReviewStepProps) {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        try {
            setLoading(true);
            // await dispatch(createTemplate({ template })).unwrap();
            // можно navigate("/templates") или показать toast
        } catch (err) {
            console.error(err);
            alert("Failed to create template");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className={cl.Control}>
                <Button
                    extraClassName={cl.Button}
                    text='Назад'
                    onClick={onBack}
                />
                <Button
                    extraClassName={cl.Button}
                    text='Завершити'
                    onClick={submit}
                />
            </div>
        </>
    );
}
