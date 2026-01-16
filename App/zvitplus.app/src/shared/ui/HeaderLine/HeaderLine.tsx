import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import cl from './HeaderLine.module.css';

type Props = {
    children: ReactNode;
} & ComponentPropsWithoutRef<"h2">;

export function HeaderLine({ children, ...otherProps } : Props) {
    return (
        <div className={cl.Wrapper}>
            <h2 {...otherProps} className={cl.Header}>{children}</h2>
        </div>
    );
}