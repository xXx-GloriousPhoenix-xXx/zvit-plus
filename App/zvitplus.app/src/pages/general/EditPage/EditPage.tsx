import cl from './EditPage.module.css';
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { useEffect, useRef } from "react";
import { getFile, getMeta } from "@/shared/api/file/thunks";
import { useParams } from "react-router-dom";

import { ReviewCanvas } from "@/pages/docs/steps/Review/ReviewCanvas";
import { revokeFileUrls } from "@/shared/api/file/slice";
import type { EditorMode } from '@/shared/api/doc/slice';

interface Props {
    mode: EditorMode;
    readonly: boolean;
}

export function EditPage({ mode, readonly }: Props) {
    const { id } = useParams<{ id: string }>();

    const dispatch = useAppDispatch();
    const canvasRef = useRef<HTMLDivElement>(null);
    
    const { 
        data: templateData, 
        files: templateFiles,
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
        
        return () => {
            dispatch(revokeFileUrls());
        };
    }, [dispatch, id, mode]);

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

    if (!templateData) {
        return (
            <section className={cl.Wrapper}>
                <div className={cl.Error}>Дані шаблону не знайдено</div>
            </section>
        );
    }

    return (
        <section className={cl.Wrapper}>
            <header className={cl.Header}>
                <h1 className={cl.Title}>
                    {templateData.meta.templateName || meta?.name || "Редагування шаблону"}
                </h1>
                <p className={cl.ModeInfo}>
                    Режим: {mode} | 
                    {readonly ? " Тільки перегляд" : " Редагування"}
                </p>
            </header>

            <div ref={canvasRef} className={cl.CanvasContainer}>
                <ReviewCanvas
                    template={templateData}
                    canvasRef={canvasRef}
                />
            </div>

            {/* Информация о файлах */}
            {templateFiles && (
                <div className={cl.FilesInfo}>
                    <h3>Файли в шаблоні:</h3>
                    <p>Прев'ю: {templateFiles.previewUrl ? "Є" : "Немає"}</p>
                    <p>Файлів даних: {Object.keys(templateFiles.dataFiles).length}</p>
                    <p>Медіафайлів: {Object.keys(templateFiles.mediaFiles).length}</p>
                </div>
            )}

            {/* Дебаг информация */}
            <div className={cl.DebugInfo}>
                <p>ID: {id}</p>
                <p>Назва: {templateData.meta.templateName}</p>
                <p>Елементів: {templateData.elements?.length || 0}</p>
            </div>
        </section>
    );
}