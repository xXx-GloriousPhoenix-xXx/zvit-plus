// pages/DocEditorPage.tsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { 
    type EditorType, 
    type EditorMode, 
    initEditor, 
    clearEditorDraft,
    setEditorStep, 
} from "@/shared/api/doc/slice";
import { fetchReportById, fetchTemplateById } from "@/shared/api/doc/thunks";

import cl from "./DocEditorPage.module.css";

import { ReviewStep } from "./steps/ReviewStep";
import { MetaStep } from "./steps/MetaStep";
import { EditorStep } from "./steps/EditorStep";

interface Props {
    mode: EditorMode;
    type: EditorType;
}

export function DocEditorPage({ mode, type }: Props) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    const { 
        editor,
        templates,
        reports 
    } = useAppSelector(state => state.docs);
    
    const docState = type === 'template' ? templates : reports;

    useEffect(() => {
        if (mode !== 'create' && id) {
            const fetchDoc = type === 'template' 
                ? () => dispatch(fetchTemplateById(id))
                : () => dispatch(fetchReportById(id));
        
            fetchDoc();
        }
    }, [mode, type, id, dispatch]);

    useEffect(() => {
        if (mode === 'create') {
        dispatch(initEditor({ mode, workMode: type }));
        } else if (id && docState.current.data) {
        dispatch(initEditor({ 
            mode, 
            workMode: type, 
            initialData: docState.current.data,
            id 
        }));
        }
    }, [mode, type, id, docState.current.data, dispatch]);

    const renderStep = () => {
        if (mode === 'view' && docState.current.data) {
            return (
                <ReviewStep
                    mode="view"
                    type={type}
                    template={editor.template || {
                        meta: docState.current.data.meta,
                        elements: docState.current.data.elements
                    }}
                    onClose={() => navigate(`/${type}s`)}
                />
            );
        }

        if (mode !== 'create' && !docState.current.data) {
            return null;
        }

        switch (editor.step) {
            case 1:
                return (
                    <MetaStep
                        mode={mode}
                        type={type}
                        value={editor.meta}
                        onNext={() => {}}
                        onBack={() => navigate(`/${type}s`)}
                    />
                );
            case 2:
                return (
                    <EditorStep
                        mode={mode}
                        type={type}
                        template={editor.template}
                    />
                )
            case 3:
                return (
                    <ReviewStep
                        mode={mode}
                        type={type}
                        template={editor.template}
                        onClose={() => navigate(`/${type}s`)}
                        onClearDraft={mode === 'create' ? handleClearDraft : undefined}
                    />
                );
            default:
                return null;
        }
    };

    const handleClearDraft = () => {
        dispatch(clearEditorDraft());
        navigate(`/${type}s`);
    };

    if (docState.current.loading) {
        return (
        <div className={cl.LoadingContainer}>
            <div className={cl.LoadingSpinner}></div>
            <p>Завантаження...</p>
        </div>
        );
    }

    if (docState.current.error) {
        return (
        <div className={cl.ErrorContainer}>
            <div className={cl.ErrorIcon}>⚠️</div>
            <h3>Помилка завантаження</h3>
            <p>{docState.current.error}</p>
            <button 
            className={cl.BackButton}
            onClick={() => navigate(`/${type}s`)}
            >
            Повернутись до списку
            </button>
        </div>
        );
    }

    if (mode !== 'create' && !docState.current.data) {
        return (
        <div className={cl.NotFoundContainer}>
            <div className={cl.NotFoundIcon}>📄</div>
            <h3>Документ не знайдено</h3>
            <p>Запитуваний документ не існує або був видалений</p>
            <button 
            className={cl.BackButton}
            onClick={() => navigate(`/${type}s`)}
            >
            Повернутись до списку
            </button>
        </div>
        );
    }

    return (
        <section className={cl.Wrapper}>
            {renderStep()}
        </section>
    );
}