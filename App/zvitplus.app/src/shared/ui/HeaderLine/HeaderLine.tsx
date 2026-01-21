import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import cl from './HeaderLine.module.css';

type Props = {
    children: ReactNode;
    extraClassName?: string;
} & ComponentPropsWithoutRef<"h2">;

export function HeaderLine({ children, extraClassName, ...otherProps } : Props) {
    return (
        <div className={cl.Wrapper}>
            <h2 {...otherProps} className={`${cl.Header} ${extraClassName}`}>{children}</h2>
        </div>
    );
}