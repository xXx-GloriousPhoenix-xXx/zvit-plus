import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";
import cl from "./StringToggle.module.css";

type ToggleOption = {
    value: string;
    label: string;
};

type StringToggleProps = {
    label: string;
    options: [ToggleOption, ToggleOption];
    value: string;
    onChange: (value: string) => void;
    error?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "onChange">;

export const StringToggle = forwardRef<HTMLButtonElement, StringToggleProps>(
    ({ label, options, value, onChange, error, ...rest }, ref) => {
        const [first, second] = options;
        const isActive = value === second.value;

        const handleClick = () => {
            onChange(isActive ? first.value : second.value);
        };

        return (
            <div className={cl.Wrapper}>
                <span className={cl.Label}>{label}</span>

                <button
                    ref={ref}
                    type="button"
                    className={`${cl.Toggle} ${isActive ? cl.Active : ""}`}
                    onClick={handleClick}
                    {...rest}
                >
                    {isActive ? second.label : first.label}
                </button>

                {error && <span className={cl.Error}>{error}</span>}
            </div>
        );
    }
);

StringToggle.displayName = "StringToggle";
