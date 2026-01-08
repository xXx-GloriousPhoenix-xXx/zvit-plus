import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";
import cl from "./RadioGroup.module.css";

export type RadioOption = {
    value: string;
    label: string;
};

type RadioGroupProps = {
    label: string;
    options: RadioOption[];
    error?: string;
    value: string;
    onChange: (value: string) => void;
} & ComponentPropsWithoutRef<"div">;

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
    ({ label, options, error, value, onChange, ...rest }, ref) => {
        return (
            <div className={cl.Wrapper} ref={ref} {...rest}>
                <span className={cl.Label}>{label}</span>

                <div className={cl.RadioGroup}>
                    {options.map((o) => (
                        <label key={o.value} className={cl.RadioOption}>
                            <input
                                type="radio"
                                name={label}
                                value={o.value}
                                checked={value === o.value}
                                onChange={() => onChange(o.value)}
                            />
                            <span>{o.label}</span> {/* эта span — визуальная кнопка */}
                        </label>
                    ))}
                </div>

                {error && <span className={cl.Error}>{error}</span>}
            </div>
        );
    }
);
