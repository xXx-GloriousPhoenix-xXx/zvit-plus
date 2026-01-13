// MetaStep.tsx
import { useEffect, useState } from "react";
import { Input } from "@/shared/ui/Input/Input.tsx";
import { Button } from "@/shared/ui/Button/Button.tsx";
import { BoolCheckbox } from "@/shared/ui/BoolCheckbox/BoolCheckbox.tsx";
import { Select } from "@/shared/ui/Select/Select.tsx";
import { RadioGroup } from "@/shared/ui/RadioGroup/RadioGroup.tsx";
import { StringToggle } from "@/shared/ui/StringToggle/StringToggle.tsx";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchTemplateTypes } from "@/shared/api/templateTypes/templateTypesSlice";
import type { MetaValue, PageOrientation, PageSize } from "@/shared/types/repEditorTypes";
import { PAGE_SIZES } from "@/shared/types/repEditorTypes";

import cl from "../TemplateCreatePage.module.css";

interface Props {
    value: MetaValue;
    onNext: (value: MetaValue) => void;
}

export function MetaStep({ value, onNext }: Props) {
    const dispatch = useAppDispatch();
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

    return (
        <>
            <Input
                label="Назва шаблону"
                placeholder="Invoice template"
                value={formData.templateName}
                onChange={e =>
                    handleFieldChange({ templateName: e.target.value })
                }
            />

            <Select
                label="Тип шаблону"
                value={formData.templateTypeId}
                disabled={loading}
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

            <BoolCheckbox
                label="Приватний шаблон"
                checked={formData.isPrivate}
                onChange={e =>
                    handleFieldChange({ isPrivate: e.target.checked })
                }
            />

            <RadioGroup
                label="Розмір аркушу"
                options={PAGE_SIZES.map(size => ({ value: size, label: size }))}
                value={formData.pageSize}
                onChange={v =>
                    handleFieldChange({ pageSize: v as PageSize })
                }
            />

            <StringToggle
                label="Орієнтація аркушу"
                options={[
                    { value: "portrait", label: "Портрет" },
                    { value: "landscape", label: "Альбом" },
                ]}
                value={formData.orientation}
                onChange={(val) =>
                    handleFieldChange({ orientation: val as PageOrientation })
                }
            />

            <Button
                text="Далі"
                disabled={!isSelected}
                onClick={() => onNext(formData)}
                extraClassName={cl.MarginedButton}
            />
        </>
    );
}