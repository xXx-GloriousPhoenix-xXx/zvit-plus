import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";

import cl from './Input.module.css';

type InputProps = {
    label: string;
    error?: string;
} & ComponentPropsWithoutRef<"input">;

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, id, ...rest }, ref) => {
        const inputId = id ?? crypto.randomUUID();

        return (
            <div className={cl.Wrapper}>
                <label className={cl.Label}
                    htmlFor={inputId}>
                    {label}
                </label>

                <input className={cl.Input}
                    ref={ref}
                    id={inputId}
                    {...rest}
                />

                {error && (
                    <span className={cl.Error}>
                        {error}
                    </span>
                )}
            </div>
        );
    }
);
