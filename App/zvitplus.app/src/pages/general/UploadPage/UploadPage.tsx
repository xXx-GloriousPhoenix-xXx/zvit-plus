// UploadPage.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/app/store/hooks';
import { unpackRepFile } from '@/shared/utils/repFileManager';
import { createTemplate, createReport } from '@/shared/api/doc/thunks';
import { initEditor } from '@/shared/api/doc/slice';
import { Button } from '@/shared/ui/Button/Button';
import { A } from '@/shared/ui/A/A';
import type { EditorType } from "@/shared/api/doc/slice";

import cl from './UploadPage.module.css';

type Props = {
    mode: EditorType;
}

export function UploadPage({ mode }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<{
        name: string;
        type: string;
        elementsCount: number;
        previewUrl?: string;
    } | null>(null);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const validateFile = useCallback((file: File): boolean => {
        setValidationError(null);

        // 1. Проверка расширения
        if (!file.name.toLowerCase().endsWith('.rep')) {
            setValidationError('Файл повинен мати розширення .rep');
            return false;
        }

        // 2. Проверка размера (до 50MB)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            setValidationError(`Файл занадто великий. Максимальний розмір: ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
            return false;
        }

        // 3. Проверка на минимальный размер (чтобы не был пустым)
        if (file.size < 100) { // Минимум 100 байт
            setValidationError('Файл занадто малий. Може бути пошкодженим.');
            return false;
        }

        return true;
    }, []);

    const previewFile = async (file: File) => {
        try {
            // Читаем первые байты файла для проверки сигнатуры ZIP
            const arrayBuffer = await file.slice(0, 4).arrayBuffer();
            const view = new Uint8Array(arrayBuffer);
            
            // Проверка сигнатуры ZIP (первые 4 байта: 0x50 0x4B 0x03 0x04)
            const isZipFile = view[0] === 0x50 && view[1] === 0x4B && 
                             view[2] === 0x03 && view[3] === 0x04;
            
            if (isZipFile) {
                setPreviewData({
                    name: file.name.replace(/\.rep$/i, ''),
                    type: 'REP файл',
                    elementsCount: 0
                });
            } else {
                setValidationError('Файл не є валідним .rep архівом (не знайдено сигнатуру ZIP)');
                setFile(null);
            }
        } catch (err) {
            console.warn('Preview error:', err);
            // Не блокируем пользователя если preview не удался
            setPreviewData({
                name: file.name.replace(/\.rep$/i, ''),
                type: 'REP файл',
                elementsCount: 0
            });
        }
    };

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!validateFile(selectedFile)) {
            setFile(null);
            setPreviewData(null);
            return;
        }

        setFile(selectedFile);
        setError(null);
        setValidationError(null);
        setPreviewData(null);

        // Сбрасываем input чтобы можно было выбрать тот же файл снова
        e.target.value = '';

        previewFile(selectedFile);
    }, [validateFile]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const droppedFile = e.dataTransfer.files?.[0];
        if (!droppedFile) return;

        if (!validateFile(droppedFile)) {
            return;
        }

        setFile(droppedFile);
        setError(null);
        setValidationError(null);
        setPreviewData(null);
        previewFile(droppedFile);
    }, [validateFile]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Добавляем визуальный эффект при перетаскивании
        const dropZone = e.currentTarget;
        dropZone.classList.add(cl.DragOver);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
        const dropZone = e.currentTarget;
        dropZone.classList.remove(cl.DragOver);
    }, []);

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        try {
            console.log('Starting REP file unpacking...');
            const { data, files } = await unpackRepFile(file);
            
            console.log('Unpacked successfully:', {
                templateName: data.meta.templateName,
                elementsCount: data.elements?.length || 0,
                hasTemplateId: !!data.meta.templateId,
                dataFiles: Object.keys(files.dataFiles).length,
                mediaFiles: Object.keys(files.mediaFiles).length
            });

            // Определяем тип документа
            const isTemplate = !data.meta.templateId;
            console.log('Is template?', isTemplate);

            if (mode === 'template') {
                if (!isTemplate) {
                    throw new Error('Завантажений файл є звітом, а не шаблоном. Виберіть "Завантажити звіт".');
                }

                // Создаем шаблон
                const result = await dispatch(createTemplate({
                    name: data.meta.templateName,
                    templateTypeId: data.meta.templateTypeId,
                    isPrivate: data.meta.isPrivate || false,
                    template: {
                        meta: data.meta,
                        elements: data.elements
                    }
                })).unwrap();

                console.log('Template created successfully:', result);
                navigate(`/templates`);
                
            } else if (mode === 'report') {
                if (isTemplate) {
                    throw new Error('Завантажений файл є шаблоном, а не звітом. Використайте опцію "Заповнити шаблон".');
                }

                // Проверяем наличие templateId для отчета
                if (!data.meta.templateId) {
                    throw new Error('Відсутній templateId у завантаженому звіті');
                }

                // Создаем отчет
                const result = await dispatch(createReport({
                    name: data.meta.templateName,
                    templateId: data.meta.templateId,
                    isPrivate: data.meta.isPrivate || false,
                    template: {
                        meta: data.meta,
                        elements: data.elements
                    },
                    files: files
                })).unwrap();

                console.log('Report created successfully:', result);
                navigate(`/reports`);
            }

        } catch (err: any) {
            console.error('Upload error:', err);
            
            let errorMessage = 'Помилка обробки файлу';
            if (err.message.includes('meta.json not found') || err.message.includes('struct.json not found')) {
                errorMessage = 'Невірний формат .rep файлу. Відсутні обов\'язкові файли.';
            } else if (err.message.includes('Invalid .rep file')) {
                errorMessage = 'Файл пошкоджений або має невірний формат.';
            } else {
                errorMessage = err.message || errorMessage;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickPreview = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        try {
            const { data, files } = await unpackRepFile(file);
            
            const isTemplate = !data.meta.templateId;
            const type = isTemplate ? 'template' : 'report';
            
            dispatch(initEditor({
                mode: 'view',
                workMode: type,
                initialData: data,
                id: data.meta.id || undefined
            }));
            
            // Переходим на страницу предпросмотра
            navigate(`/${type}s/${data.meta.id || 'preview'}`);
            
        } catch (err: any) {
            console.error('Preview error:', err);
            setError('Не вдалося відкрити файл для перегляду: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImportAsDraft = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        try {
            const { data, files } = await unpackRepFile(file);
            
            const isTemplate = !data.meta.templateId;
            const type = isTemplate ? 'template' : 'report';
            
            // Создаем черновик с обнуленным ID
            const draftData = {
                ...data,
                meta: {
                    ...data.meta,
                    id: null,
                    templateId: isTemplate ? null : data.meta.templateId,
                    templateName: `${data.meta.templateName} (імпортовано)`
                }
            };
            
            dispatch(initEditor({
                mode: 'create',
                workMode: type,
                initialData: draftData
            }));
            
            // Если это отчет, сохраняем файлы в состояние
            if (type === 'report') {
                // Здесь нужно dispatch действия для сохранения файлов
                console.log('Files for report draft:', Object.keys(files.dataFiles).length, Object.keys(files.mediaFiles).length);
            }
            
            // Переходим в редактор
            navigate(`/${type}s/create`);
            
        } catch (err: any) {
            console.error('Import error:', err);
            setError('Помилка імпорту файлу: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cl.Wrapper}>
            <div className={cl.Header}>
                <h1>Завантаження {mode === 'template' ? 'шаблону' : 'звіту'}</h1>
                <p className={cl.Subtitle}>
                    Завантажте файл .rep для {mode === 'template' ? 'створення нового шаблону' : 'створення нового звіту'}
                </p>
            </div>

            <div 
                className={`${cl.DropZone} ${file ? cl.HasFile : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <div className={cl.DropZoneContent}>
                    <div className={cl.UploadIcon}>
                        <i className="fa-solid fa-file-zipper"></i>
                    </div>
                    
                    <div className={cl.Instructions}>
                        {file ? (
                            <>
                                <div className={cl.FileInfo}>
                                    <i className="fa-solid fa-file-check"></i>
                                    <div className={cl.FileDetails}>
                                        <span className={cl.FileName}>{file.name}</span>
                                        <span className={cl.FileSize}>
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                    </div>
                                </div>
                                <div className={cl.ChangeFile}>
                                    <button onClick={() => {
                                        setFile(null);
                                        setPreviewData(null);
                                    }}>
                                        <i className="fa-solid fa-rotate-left"></i> Обрати інший файл
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className={cl.DragText}>
                                    <i className="fa-solid fa-upload"></i> Перетягніть файл .rep сюди
                                </p>
                                <p className={cl.OrText}>або</p>
                                <label className={cl.FileInputLabel}>
                                    <input
                                        type="file"
                                        accept=".rep"
                                        onChange={handleFileChange}
                                        className={cl.FileInput}
                                    />
                                    <span className={cl.BrowseButton}>
                                        <i className="fa-solid fa-folder-open"></i> Оберіть файл
                                    </span>
                                </label>
                                <p className={cl.FileTypes}>
                                    <i className="fa-solid fa-circle-info"></i> Тільки формат .rep
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {validationError && (
                <div className={cl.ValidationError}>
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <span>{validationError}</span>
                </div>
            )}

            {previewData && (
                <div className={cl.Preview}>
                    <h3>
                        <i className="fa-solid fa-eye"></i> Попередній перегляд:
                    </h3>
                    <div className={cl.PreviewInfo}>
                        <div className={cl.PreviewRow}>
                            <span className={cl.PreviewLabel}>Назва:</span>
                            <span className={cl.PreviewValue}>{previewData.name}</span>
                        </div>
                        <div className={cl.PreviewRow}>
                            <span className={cl.PreviewLabel}>Тип файлу:</span>
                            <span className={cl.PreviewValue}>{previewData.type}</span>
                        </div>
                        <div className={cl.PreviewRow}>
                            <span className={cl.PreviewLabel}>Розмір:</span>
                            <span className={cl.PreviewValue}>
                                {(file!.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className={cl.Error}>
                    <i className="fa-solid fa-circle-exclamation"></i>
                    <span>{error}</span>
                </div>
            )}

            <div className={cl.Actions}>
                <Button
                    variant="secondary"
                    text="Назад"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                    extraClassName={cl.Button}
                />
                
                {file && (
                    <Button
                        variant="secondary"
                        text={loading ? 'Обробка...' : 'Створити'}
                        onClick={handleUpload}
                        disabled={loading || !file}
                        extraClassName={cl.Button}
                        title={mode === 'template' ? 'Створити новий шаблон' : 'Створити новий звіт'}
                    />
                )}
            </div>

            <div className={cl.HelpSection}>
                <h4>
                    <i className="fa-solid fa-circle-question"></i> Довідка:
                </h4>
                <ul className={cl.HelpList}>
                    <li>
                        <i className="fa-solid fa-file-zipper"></i>
                        <span>Файл .rep - це ZIP архів, що містить метадані, структуру та файли документа</span>
                    </li>
                    <li>
                        <i className="fa-solid fa-hard-drive"></i>
                        <span>Максимальний розмір файлу: 50MB</span>
                    </li>
                    <li>
                        <i className="fa-solid fa-shield"></i>
                        <span>Файл автоматично перевіряється на валідність та безпеку</span>
                    </li>
                    {mode === 'template' && (
                        <li>
                            <i className="fa-solid fa-clipboard"></i>
                            <span>Шаблони не містять даних звітів, тільки структуру</span>
                        </li>
                    )}
                    {mode === 'report' && (
                        <li>
                            <i className="fa-solid fa-chart-column"></i>
                            <span>Звіти містять дані для графіків та завантажені зображення</span>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}