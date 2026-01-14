import type { TemplateItemDTO } from "@/shared/api/templates/templateModels";
import { TemplateCard } from "../TemplateCard/TemplateCard";

import cl from './TemplateList.module.css';

interface TemplateListProps {
    templates: TemplateItemDTO[];
}

export function TemplateList({ templates }: TemplateListProps) {
    return (
        <div className={cl.Wrapper}>
            {
                templates.map((t, i) => {
                    return <TemplateCard key={i} template={t}/>
                })
            }
        </div>
    );
}