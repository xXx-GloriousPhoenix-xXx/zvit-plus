import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";

import cl from "./BoolCheckbox.module.css";

type CheckboxProps = {
    label: string;
    error?: string;
} & ComponentPropsWithoutRef<"input">;

export const BoolCheckbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, error, id, ...rest }, ref) => {
        const checkboxId = id ?? crypto.randomUUID();

        return (
            <div className={cl.Wrapper}>
                <label className={cl.Label} htmlFor={checkboxId}>
                    {label}
                </label>
                
                <div className={cl.CheckboxContainer}>
                    <input
                        ref={ref}
                        id={checkboxId}
                        type="checkbox"
                        className={cl.Input}
                        {...rest}
                    />
                    <label 
                        htmlFor={checkboxId} 
                        className={cl.CustomCheckbox} 
                    />
                </div>
                
                {error && <span className={cl.Error}>{error}</span>}
            </div>
        );
    }
);

BoolCheckbox.displayName = "BoolCheckbox";