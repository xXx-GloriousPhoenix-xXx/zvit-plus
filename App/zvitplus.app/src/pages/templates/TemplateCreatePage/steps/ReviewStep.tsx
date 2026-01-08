import { useAppDispatch } from "@/app/store/hooks";
import { createTemplate } from "@/shared/api/templates/createTemplateThunk";
import type { RepTemplate } from "../editor/types";
import { useState } from "react";

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
            <h2>Review & submit</h2>
            <button onClick={onBack} disabled={loading}>Back</button>
            <button onClick={submit} disabled={loading}>Create template</button>
        </>
    );
}
