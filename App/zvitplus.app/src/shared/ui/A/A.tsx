import type { ComponentPropsWithoutRef } from "react";

import cl from './A.module.css';

type Props = Omit<ComponentPropsWithoutRef<'a'>, 'onClick'> & {
    onClick: () => void;
}

export const A = ({ onClick, ...otherProps } : Props) => {
    return (
        <div className={cl.Wrapper}>
            <a onClick={onClick} {...otherProps}></a>
        </div>
    );
}