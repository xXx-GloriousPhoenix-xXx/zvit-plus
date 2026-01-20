// ReviewStep.tsx (обновленная версия)
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/Button/Button";
import { ReviewCanvas } from "./Review/ReviewCanvas";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { 
  setEditorStep, 
  clearEditorDraft,
  resetSaveState, 
  cloneTemplateToReport
} from "@/shared/api/doc/slice";
import { createReport, createTemplate, updateTemplate } from "@/shared/api/doc/thunks";
import type { RepTemplate } from "@/shared/types/repEditorTypes";
import type { EditorMode, EditorType } from "@/shared/api/doc/slice";

import cl from "./Step.module.css";

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
  const canvasRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const files = useAppSelector(state => state.docs.reports.current.files);

  const saveState = useAppSelector(state => 
    type === 'template' 
      ? state.docs.templates.save 
      : state.docs.reports.save
  );

  const handleBack = () => {
    if (mode === 'view') {
      onClose();
    } else {
      dispatch(setEditorStep(2));
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
        const { editor } = useAppSelector(state => state.docs);
        
        if (!editor.originalId) {
          throw new Error("ID шаблона не найден");
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
          // TODO: Добавить обновление отчета
          console.log('Обновление отчета пока не реализовано');
        }
      }
    } catch (err: any) {
      setError(err.message || `Помилка при ${mode === 'create' ? 'створенні' : 'редагуванні'} ${type === 'template' ? 'шаблону' : 'звіту'}`);
    } finally {
      setLoading(false);
    }
  };

  const isLoading = loading || saveState.loading;
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
              onClick={() => {}}
              extraClassName={cl.Button}
            />
            <Button
              variant="secondary"
              text='Видалити'
              onClick={() => {/* логика удаления */}}
              extraClassName={cl.Button}
            />
            {type === 'report'
                ? <Button
                    variant="primary"
                    text="Завантажити PDF"
                    onClick={() => {/* логика загрузки PDF */}}
                    extraClassName={cl.Button}
                />
                : <Button
                    variant="primary"
                    text="Заповнити шаблон"
                    onClick={() => {
                        navigate(`/reports/create`);
                        dispatch(cloneTemplateToReport());
                    }}
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
    </div>
  );
}