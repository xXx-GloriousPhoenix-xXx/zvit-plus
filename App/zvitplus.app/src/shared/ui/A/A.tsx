import type { ComponentPropsWithoutRef, ReactNode } from "react";

import cl from './A.module.css';

type Props = Omit<ComponentPropsWithoutRef<'a'>, 'onClick'> & {
    onClick: () => void;
    children: ReactNode;
}

export const A = ({ onClick, children,  ...otherProps } : Props) => {
    return (
        <div className={cl.Wrapper}>
            <a onClick={onClick} {...otherProps}>{children}</a>
        </div>
    );
}