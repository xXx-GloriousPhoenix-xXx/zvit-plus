// ReviewStep.tsx (полная версия)
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/Button/Button";
import { ReviewCanvas } from "./Review/ReviewCanvas";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { 
  setEditorStep, 
  clearEditorDraft,
  resetSaveState, 
  cloneTemplateToReport,
  initEditor
} from "@/shared/api/doc/slice";
import { 
  createReport, 
  createTemplate, 
  updateTemplate, 
  updateReport,
  deleteTemplate,
  deleteReport,
  downloadPdf 
} from "@/shared/api/doc/thunks";
import type { RepTemplate } from "@/shared/types/repEditorTypes";
import type { EditorMode, EditorType } from "@/shared/api/doc/slice";

import cl from "./Step.module.css";
import { ConfirmationDialogue } from "@/shared/ui/ConfirmationDialogue/ConfirmationDialogue";

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
    if (!editorState.originalId) return;
    
    setIsDownloadingPdf(true);
    setError(null);
    
    try {
      await dispatch(downloadPdf({ 
        id: editorState.originalId, 
        type,
        format: 'pdf' 
      })).unwrap();
    } catch (err: any) {
      setError(err.message || "Помилка завантаження PDF");
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

  const handleFillTemplate = () => {
    navigate(`/reports/create`);
    dispatch(cloneTemplateToReport());
  };

  const isLoading = loading || saveState.loading || isDownloadingPdf;
  const displayError = error || saveState.error;

  return (
    <div className={cl.Wrapper}>
      <div className={cl.ReviewCanvasSection}>
        <ReviewCanvas
          template={template}
          canvasRef={canvasRef}
        />
      </div>

      {displayError && (
        <div className={cl.ErrorMessage}>
          {displayError}
        </div>
      )}

      {saveState.success && (
        <div className={cl.SuccessMessage}>
          {type === 'template' ? 'Шаблон успішно збережено!' : 'Звіт успішно збережено!'}
        </div>
      )}

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
                variant="secondary"
                text="Очистити чернетку"
                onClick={onClearDraft}
                disabled={isLoading}
                extraClassName={cl.Button}
              />
            )}
            
            <Button
              variant="primary"
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