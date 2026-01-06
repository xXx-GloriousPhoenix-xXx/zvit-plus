import type { ComponentPropsWithoutRef } from "react";

import cl from "./Button.module.css";

type ButtonProps = {
    text: string;
    extraClassName?: string;
} & ComponentPropsWithoutRef<"button">;

export function Button(props : ButtonProps) {
    const { text, extraClassName, ...rest } = props;
    const classes = [cl.Button, extraClassName]
        .filter(Boolean)
        .join(" ");
        
    return (
        <button className={classes} {...rest}>
            {text}
        </button>
    );
}