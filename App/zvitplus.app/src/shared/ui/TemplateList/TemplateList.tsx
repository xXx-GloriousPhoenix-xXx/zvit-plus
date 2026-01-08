import { Template } from "../Template/Template";
import type { TemplateProps } from "../Template/Template";

import cl from './TemplateList.module.css';

type TemplateListProps = {
    templates: TemplateProps[]
}

export function TemplateList({ templates }: TemplateListProps) {
    return (
        <div className={cl.Wrapper}>
            {
                templates.map((prop, i) => {
                    return <Template key={i} data={prop.data}/>
                })
            }
        </div>
    );
}