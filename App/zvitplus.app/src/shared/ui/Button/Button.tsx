import type { ComponentPropsWithoutRef } from "react";

import cl from "./Button.module.css";

type ButtonProps = {
    text: string;
    extraClassName?: string;
    variant: 'primary' | 'secondary';
} & ComponentPropsWithoutRef<"button">;

export function Button(props : ButtonProps) {
    const { text, extraClassName, variant = 'primary', ...rest } = props;
    const classes = [cl.Button, extraClassName, variant === 'primary' ? cl.Primary : cl.Secondary]
        .filter(Boolean)
        .join(" ");
        
    return (
        <button className={classes} {...rest}>
            {text}
        </button>
    );
}