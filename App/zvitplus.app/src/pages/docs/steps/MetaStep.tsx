// MetaStep.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/shared/ui/Input/Input";
import { Button } from "@/shared/ui/Button/Button";
import { BoolCheckbox } from "@/shared/ui/BoolCheckbox/BoolCheckbox";
import { Select } from "@/shared/ui/Select/Select";
import { RadioGroup } from "@/shared/ui/RadioGroup/RadioGroup";
import { StringToggle } from "@/shared/ui/StringToggle/StringToggle";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchTemplateTypes } from "@/shared/api/templateTypes/templateTypesSlice";
import { setEditorMeta, setEditorStep } from "@/shared/api/doc/slice";
import type { 
    MetaValue, 
    PageOrientation, 
    PageSize 
} from "@/shared/types/repEditorTypes";
import { PAGE_SIZES } from "@/shared/types/repEditorTypes";
import type { EditorMode, EditorType } from "@/shared/api/doc/slice";

import cl from "./Step.module.css";

interface Props {
    mode: EditorMode;
    type: EditorType;
    value: MetaValue;
    onNext: (value: MetaValue) => void;
    onBack: () => void;
}

export function MetaStep({ mode, type, value, onNext, onBack }: Props) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { items, loading } = useAppSelector(s => s.templateTypes);
    const [formData, setFormData] = useState<MetaValue>(value);

    useEffect(() => {
        dispatch(fetchTemplateTypes());
    }, [dispatch]);

    useEffect(() => {
        setFormData(value);
    }, [value]);

    const isSelected = formData.templateName && formData.templateTypeId;

    const handleFieldChange = (updates: Partial<MetaValue>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const handleNext = () => {
        dispatch(setEditorMeta(formData));
        dispatch(setEditorStep(2));
    };

    const handleBack = () => {
        if (mode === 'create') {
            // Для создания - просто переходим назад
            onBack();
        } else {
            // Для редактирования - возвращаемся на предыдущий шаг
            onBack();
        }
    };

    return (
        <div className={cl.Wrapper}>
            <Input
                label="Назва"
                placeholder={type === 'template' ? "Invoice template" : "Monthly report"}
                value={formData.templateName}
                onChange={e =>
                    handleFieldChange({ templateName: e.target.value })
                }
                disabled={mode === 'view'}
            />  
            <Select
                label="Тип"
                value={formData.templateTypeId}
                disabled={loading || mode === 'view' || type === 'report'}
                options={items.map(t => ({
                    value: t.id,
                    label: t.name,
                }))}
                onChange={e => {
                    const selectedValue = e.target.value;
                    const selectedOption = items.find(item => item.id === selectedValue);
                    
                    handleFieldChange({
                        templateTypeId: selectedValue,
                        templateTypeName: selectedOption?.name || ''
                    });
                }}
            />

            {type === 'template' && (
                <BoolCheckbox
                    label="Приватний"
                    checked={formData.isPrivate}
                    onChange={e =>
                    handleFieldChange({ isPrivate: e.target.checked })
                    }
                    disabled={mode === 'view'}
                />
            )}

            <RadioGroup
                label="Розмір аркушу"
                options={PAGE_SIZES.map(size => ({ value: size, label: size }))}
                value={formData.pageSize}
                onChange={v =>
                    handleFieldChange({ pageSize: v as PageSize })
                }
                disabled={mode === 'view' || type === 'report'}
            />

            <StringToggle
                label="Орієнтація"
                options={[
                    { value: "portrait", label: "Портрет" },
                    { value: "landscape", label: "Альбом" },
                ]}
                value={formData.orientation}
                onChange={(val) =>
                    handleFieldChange({ orientation: val as PageOrientation })
                }
                disabled={mode === 'view' || type === 'report'}
            />

            <div className={cl.ButtonGroup}>
                <Button
                    variant="primary"
                    text="Назад"
                    onClick={handleBack}
                    extraClassName={cl.Button}
                />

                {mode !== 'view' && (
                    <Button
                        variant="primary"
                        text="Далі"
                        disabled={!isSelected}
                        onClick={handleNext}
                        extraClassName={cl.Button}
                    />
                )}

                {mode === 'view' && (
                    <Button
                        variant="primary"
                        text="Закрити"
                        onClick={() => navigate(`/${type}s`)}
                        extraClassName={cl.Button}
                    />
                )}
            </div>    
        </div>
    );
}