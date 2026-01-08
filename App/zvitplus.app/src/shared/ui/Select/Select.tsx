import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";

import cl from "./Select.module.css";

export type SelectOption = {
    value: string;
    label: string;
};

type SelectProps = {
    label: string;
    options: SelectOption[];
    error?: string;
} & ComponentPropsWithoutRef<"select">;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, options, error, id, ...rest }, ref) => {
        const selectId = id ?? crypto.randomUUID();

        return (
            <div className={cl.Wrapper}>
                <label className={cl.Label} htmlFor={selectId}>
                    {label}
                </label>
                <div className={cl.SelectWrapper}>
                    <select
                        ref={ref}
                        id={selectId}
                        className={cl.Select}
                        {...rest}
                    >
                        <option key="default" value="" disabled>Оберіть тип</option>
                        {options.map(o => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                    <span className={cl.Arrow}>▼</span>
                    {error && <span className={cl.Error}>{error}</span>}
                </div>
            </div>
        );
    }
);
