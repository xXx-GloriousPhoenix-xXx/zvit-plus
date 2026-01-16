import type { EditorMode } from "@/shared/types/repEditorTypes";
import cl from './EditPage.module.css';
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { useEffect, useRef } from "react";
import { getFile, getMeta } from "@/shared/api/file/thunks";
import { useParams } from "react-router-dom";

import { ReviewCanvas } from "@/pages/templates/TemplateCreatePage/Review/ReviewCanvas";

interface Props {
    mode: EditorMode;
    readonly: boolean;
}

export function EditPage({ mode, readonly }: Props) {
    const { id } = useParams();

    const dispatch = useAppDispatch();
    const canvasRef = useRef<HTMLDivElement>(null);

    const { 
        item: template, 
        error, 
        loading 
    } = useAppSelector(state => state.files.file);

    const { 
        item: meta, 
        loading: metaLoading 
    } = useAppSelector(state => state.files.meta);

    useEffect(() => {
        if (!id) return;
        dispatch(getMeta({ id, type: mode }));
        dispatch(getFile({ id, type: mode }));
    }, [dispatch, id, mode])

    if (loading || metaLoading) {
        return (
            <section className={cl.Wrapper}>
                <div className={cl.Loading}>Завантаження шаблону...</div>
            </section>
        );
    }

    if (error) {
        return (
            <section className={cl.Wrapper}>
                <div className={cl.Error}>Помилка: {error}</div>
            </section>
        );
    }

    if (!template) {
        return (
            <section className={cl.Wrapper}>
                <div className={cl.Error}>Шаблон не знайдено</div>
            </section>
        );
    }

    return (
        <section className={cl.Wrapper}>            
            <div ref={canvasRef} className={cl.CanvasContainer}>
                <ReviewCanvas
                    template={template}
                    canvasRef={canvasRef}
                />
            </div>
        </section>
    );
}