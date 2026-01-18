// steps/DataStep.tsx
import { useState } from "react";
import { Button } from "@/shared/ui/Button/Button";
import { useAppDispatch } from "@/app/store/hooks";
import { setEditorStep } from "@/shared/api/doc/slice";
import type { RepTemplate } from "@/shared/types/repEditorTypes";
import type { EditorMode, EditorType } from "@/shared/api/doc/slice";

import cl from "./Step.module.css";

interface Props {
  mode: EditorMode;
  type: EditorType;
  template: RepTemplate;
  onNext: () => void;
  onBack: () => void;
}

export function DataStep({ mode, type, template, onNext, onBack }: Props) {
    const dispatch = useAppDispatch();
    const [dataValues, setDataValues] = useState<Record<string, any>>({});

    // Находим все динамические элементы для заполнения
    const dynamicElements = template.elements.filter(el => el.mode === 'dynamic');

    const handleInputChange = (elementId: string, value: any) => {
        setDataValues(prev => ({
        ...prev,
        [elementId]: value
        }));
    };

    const renderElementInput = (element: any) => {
        switch (element.type) {
        case 'text':
            return (
                <div key={element.id} className={cl.DataInputGroup}>
                    <label className={cl.DataInputLabel}>
                    Текстове поле: {element.payload.text || "Без назви"}
                    </label>
                    <input
                    type="text"
                    className={cl.DataInput}
                    value={dataValues[element.id] || ''}
                    onChange={(e) => handleInputChange(element.id, e.target.value)}
                    placeholder="Введіть значення..."
                    />
                </div>
            );
        
        case 'table':
            return (
                <div key={element.id} className={cl.DataInputGroup}>
                    <label className={cl.DataInputLabel}>
                        Таблиця: Заповнення даних
                    </label>
                    <div className={cl.TableDataInputs}>
                        {element.payload.rows?.map((row: any[], rowIndex: number) => (
                            <div key={rowIndex} className={cl.TableRowInputs}>
                            {row.map((cell: any, colIndex: number) => (
                                <input
                                key={`${rowIndex}-${colIndex}`}
                                type="text"
                                className={cl.TableCellInput}
                                value={dataValues[`${element.id}-${rowIndex}-${colIndex}`] || ''}
                                onChange={(e) => handleInputChange(
                                    `${element.id}-${rowIndex}-${colIndex}`,
                                    e.target.value
                                )}
                                placeholder={`Рядок ${rowIndex + 1}, Колонка ${colIndex + 1}`}
                                />
                            ))}
                            </div>
                        ))}
                    </div>
                </div>
            );
        
        case 'image':
            return (
                <div key={element.id} className={cl.DataInputGroup}>
                    <label className={cl.DataInputLabel}>
                        Зображення: {element.payload.alt || "Зображення"}
                    </label>
                    <input
                        type="file"
                        className={cl.DataInput}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                            handleInputChange(element.id, URL.createObjectURL(file));
                            }
                        }}
                        accept="image/*"
                    />
                </div>
            );
        
        case 'chart':
            return (
                <div key={element.id} className={cl.DataInputGroup}>
                    <label className={cl.DataInputLabel}>
                        Діаграма: {element.payload.title || "Діаграма"}
                    </label>
                    <textarea
                        className={cl.DataTextarea}
                        value={dataValues[element.id] || ''}
                        onChange={(e) => handleInputChange(element.id, e.target.value)}
                        placeholder="Введіть дані для діаграми у форматі JSON..."
                        rows={4}
                    />
                </div>
            );
        
        default:
            return null;
        }
    };

    const handleNext = () => {
        // Здесь можно обработать dataValues перед переходом
        // Например, обновить template с введенными данными
        onNext();
    };

    const handleBack = () => {
        onBack();
    };

    return (
        <div className={cl.DataStepContainer}>
            <h2 className={cl.StepTitle}>
                {mode === 'edit' ? 'Редагування даних звіту' : 'Заповнення даних звіту'}
            </h2>
      
            {dynamicElements.length === 0 ? (
                <div className={cl.NoDynamicElements}>
                <p>У шаблоні немає динамічних елементів для заповнення.</p>
                <p>Всі дані будуть взяти з шаблону.</p>
                </div>
            ) : (
                <div className={cl.DataInputsContainer}>
                    <p className={cl.DataStepDescription}>
                        Заповніть дані для динамічних елементів звіту:
                    </p>
                    
                    {dynamicElements.map(renderElementInput)}
                </div>
            )}

            <div className={cl.ButtonGroup}>
                <Button
                    text="Назад"
                    onClick={handleBack}
                    extraClassName={cl.Button}
                />
                
                <Button
                    text="Переглянути результат"
                    onClick={handleNext}
                    extraClassName={cl.Button}
                />
            </div>
        </div>
    );
}