import { useEffect, useState } from "react";

import { Input } from "@/shared/ui/Input/Input.tsx";
import { Button } from "@/shared/ui/Button/Button.tsx";
import { BoolCheckbox } from "@/shared/ui/BoolCheckbox/BoolCheckbox.tsx";
import { Select } from "@/shared/ui/Select/Select.tsx";
import { RadioGroup } from "@/shared/ui/RadioGroup/RadioGroup.tsx";
import { StringToggle } from "@/shared/ui/StringToggle/StringToggle.tsx";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchTemplateTypes } from "@/shared/api/templateTypes/templateTypesSlice";

import cl from "../TemplateCreatePage.module.css";

import type { PageSize, PageOrientation } from "../editor/types";
import { PAGE_SIZES } from "../editor/types";

import type { MetaValue } from "../editor/types";

interface Props {
    value: MetaValue;
    onNext: (value: MetaValue) => void;
}

export function MetaStep({ value, onNext }: Props) {
    const dispatch = useAppDispatch();
    const { items, loading } = useAppSelector(s => s.templateTypes);

    const [state, setState] = useState<MetaValue>(value);

    useEffect(() => {
        dispatch(fetchTemplateTypes());
    }, [dispatch]);

    const isSelected = state.templateName && state.templateTypeId;

    useEffect(() => {
        console.log(state, isSelected);
    }, [state])

    return (
        <>
            <Input
                label="Назва шаблону"
                placeholder="Invoice template"
                value={state.templateName}
                onChange={e =>
                    setState(prev => ({ ...prev, templateName: e.target.value }))
                }
            />

            <Select
                label="Тип шаблону"
                value={state.templateTypeId}
                disabled={loading}
                options={items.map(t => ({
                    value: t.id,
                    label: t.name,
                }))}
                onChange={e =>
                    setState(prev => ({
                        ...prev,
                        templateTypeId: e.target.value,
                    }))
                }
            />

            <BoolCheckbox
                label="Приватний шаблон"
                checked={state.isPrivate}
                onChange={e =>
                    setState(prev => ({
                        ...prev,
                        isPrivate: e.target.checked,
                    }))
                }
            />

            <RadioGroup
                label="Розмір аркушу"
                options={PAGE_SIZES.map(size => ({ value: size, label: size }))}
                value={state.pageSize}
                onChange={v =>
                    setState(prev => ({ ...prev, pageSize: v as PageSize }))
                }
            />

            <StringToggle
                label="Орієнтація аркушу"
                options={[
                    { value: "portrait", label: "Портрет" },
                    { value: "landscape", label: "Альбом" },
                ]}
                value={state.orientation}
                onChange={(val) =>
                    setState(prev => ({ ...prev, orientation: val as PageOrientation }))
                }
            />

            <Button
                text="Далі"
                disabled={!isSelected}
                onClick={() => onNext(state)}
                extraClassName={cl.MarginedButton}
            />
        </>
    );
}
