// ReviewStep.tsx (полная версия)
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/Button/Button";
import { ReviewCanvas } from "./Review/ReviewCanvas";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { 
  setEditorStep, 
  cloneTemplateToReport
} from "@/shared/api/doc/slice";
import { 
  createReport, 
  createTemplate, 
  updateTemplate, 
  updateReport,
  deleteTemplate,
  deleteReport 
} from "@/shared/api/doc/thunks";
import type { RepTemplate } from "@/shared/types/repEditorTypes";
import type { EditorMode, EditorType } from "@/shared/api/doc/slice";

import cl from "./Step.module.css";
import { ConfirmationDialogue } from "@/shared/ui/ConfirmationDialogue/ConfirmationDialogue";
import { generateDocumentPdf } from "@/shared/utils/pdfGenerator";
import { createRepFileName, packRepFile } from "@/shared/utils/repFileManager";

interface ReviewStepProps {
    mode: EditorMode;
    type: EditorType;
    template: RepTemplate;
    onClose: () => void;
    onClearDraft?: () => void;
    onSubmit?: (canvasRef?: React.RefObject<HTMLDivElement | null>) => Promise<void>;
}

export function ReviewStep({ 
  mode,
  type,
  template, 
  onClose,
  onClearDraft,
  onSubmit
}: ReviewStepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [repLoading, setRepLoading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const files = useAppSelector(state => state.docs.reports.current.files);
  const editorState = useAppSelector(state => state.docs.editor);
  const saveState = useAppSelector(state => 
    type === 'template' 
      ? state.docs.templates.save 
      : state.docs.reports.save
  );

  const { editor } = useAppSelector(state => state.docs);

  const handleBack = () => {
    if (mode === 'view') {
      onClose();
    } else {
      dispatch(setEditorStep(2));
    }
  };

  const handleEdit = () => {
    if (editorState.originalId) {
      navigate(`/${type}s/${editorState.originalId}/edit`);
    }
  };

  const handleDelete = async () => {
    setShowDeleteDialog(false);
    setLoading(true);
    setError(null);
    
    try {
      if (type === 'template') {
        await dispatch(deleteTemplate(editorState.originalId!)).unwrap();
        console.log(`${type} deleted successfully`);
        navigate(`/${type}s`);
      } else {
        await dispatch(deleteReport(editorState.originalId!)).unwrap();
        console.log(`${type} deleted successfully`);
        navigate(`/${type}s`);
      }
    } catch (err: any) {
      setError(err.message || `Помилка видалення ${type === 'template' ? 'шаблону' : 'звіту'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!canvasRef.current) {
      setError("Не вдалося знайти вміст для генерації PDF");
      return;
    }
    
    setIsDownloadingPdf(true);
    setError(null);
    
    try {
      await generateDocumentPdf(
        canvasRef.current,
        template.meta,
        `${template.meta.templateName || 'document'}.pdf`,
        {
          scale: 2,
          margin: 5,
          quality: 0.95,
          autoSplit: true
        }
      );
    } catch (err: any) {
      setError(err.message || "Помилка генерації PDF");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleSubmit = async () => {
    if (onSubmit) {
      await onSubmit(canvasRef);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      if (mode === 'create') {
        if (type === 'template') {
          const result = await dispatch(createTemplate({
            name: template.meta.templateName,
            templateTypeId: template.meta.templateTypeId,
            isPrivate: template.meta.isPrivate || false,
            template,
            canvasRef
          })).unwrap();
          
          console.log(`${type} created successfully:`, result);
          navigate(`/${type}s`);
        } else {
          const result = await dispatch(createReport({
            name: template.meta.templateName,
            templateId: template.meta.templateId!,
            isPrivate: template.meta.isPrivate || false,
            files: files!,
            template,
            canvasRef
          })).unwrap();

          console.log(`${type} created successfully:`, result);
          navigate(`/${type}s`);
        }
      } else if (mode === 'edit') {
        
        if (!editor.originalId) {
          throw new Error(`ID ${type === 'template' ? 'шаблона' : 'звіту'} не знайдено`);
        }
        
        if (type === 'template') {
          const result = await dispatch(updateTemplate({
            id: editor.originalId,
            name: template.meta.templateName,
            templateTypeId: template.meta.templateTypeId,
            isPrivate: template.meta.isPrivate,
            template,
            canvasRef
          })).unwrap();
          
          console.log(`${type} updated successfully:`, result);
          navigate(`/${type}s`);
        } else {
          const result = await dispatch(updateReport({
            id: editor.originalId,
            name: template.meta.templateName,
            isPrivate: template.meta.isPrivate,
            template,
            files: files!,
            canvasRef
          })).unwrap();
          
          console.log(`${type} updated successfully:`, result);
          navigate(`/${type}s`);
        }
      }
    } catch (err: any) {
      setError(err.message || `Помилка при ${mode === 'create' ? 'створенні' : 'редагуванні'} ${type === 'template' ? 'шаблону' : 'звіту'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadRep = async () => {
    setRepLoading(true);
    setError(null);
    
    try {
      const repBlob = await packRepFile(
        template,
        type === 'report' ? files! : undefined,
        canvasRef.current 
      );

      const filename = createRepFileName(template.meta);
      
      const url = URL.createObjectURL(repBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Очищаем
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err: any) {
      console.error('REP generation error:', err);
      setError(err.message || "Помилка генерації .rep файлу");
    } finally {
      setRepLoading(false);
    }
  };

  const handleFillTemplate = () => {
    navigate(`/reports/create`);
    dispatch(cloneTemplateToReport());
  };

  const isLoading = loading || saveState.loading || isDownloadingPdf;

  return (
    <div className={cl.Wrapper}>
      <div className={cl.ReviewCanvasSection}>
        <ReviewCanvas
          template={template}
          canvasRef={canvasRef}
        />
      </div>

      <div className={cl.ButtonGroup}>
        {mode === 'view' ? (
          <>
            <Button
              variant="primary"
              text="Закрити"
              onClick={onClose}
              extraClassName={cl.Button}
            />
            <Button
              variant="primary"
              text="Редагувати"
              onClick={handleEdit}
              disabled={!editorState.originalId}
              extraClassName={cl.Button}
            />
            <Button
              variant="primary"
              text='Видалити'
              onClick={() => setShowDeleteDialog(true)}
              disabled={!editorState.originalId}
              extraClassName={cl.Button}
            />
            <Button
              variant="primary"
              text={repLoading ? "Генерація REP..." : "Завантажити REP"}
              onClick={handleDownloadRep}
              disabled={isDownloadingPdf || repLoading}
              extraClassName={cl.Button}
            />
            {type === 'report'
                ? <Button
                  variant="primary"
                  text={isDownloadingPdf ? "Завантаження..." : "Завантажити PDF"}
                  onClick={handleDownloadPdf}
                  disabled={!editorState.originalId || isDownloadingPdf}
                  extraClassName={cl.Button}
                />
                : <Button
                    variant="primary"
                    text="Заповнити шаблон"
                    onClick={handleFillTemplate}
                    extraClassName={cl.Button}
                /> 
            }
          </>
        ) : (
          <>
            <Button
              variant="primary"
              text="Назад"
              onClick={handleBack}
              disabled={isLoading}
              extraClassName={cl.Button}
            />
            
            {mode === 'create' && onClearDraft && (
              <Button
                variant="primary"
                text="Очистити чернетку"
                onClick={onClearDraft}
                disabled={isLoading}
                extraClassName={cl.Button}
              />
            )}
            
            <Button
              variant="secondary"
              text={isLoading 
                ? (mode === 'create' ? 'Створення...' : 'Збереження...')
                : (mode === 'create' ? 'Створити' : 'Зберегти зміни')
              }
              onClick={handleSubmit}
              disabled={isLoading}
              extraClassName={cl.Button}
            />
          </>
        )}
      </div>

      <ConfirmationDialogue
        isOpen={showDeleteDialog}
        title={`Видалити ${type === 'template' ? 'шаблон' : 'звіт'}?`}
        message={`Ви впевнені, що хочете видалити "${template.meta.templateName}"? Цю дію неможливо скасувати.`}
        confirmText="Видалити"
        cancelText="Скасувати"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        variant="danger"
      />
    </div>
  );
}