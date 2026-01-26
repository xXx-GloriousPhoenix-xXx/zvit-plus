import { TemplateCard } from "../TemplateCard/TemplateCard";
import { ReportCard } from '../ReportCard/ReportCard';

import cl from './ItemList.module.css';
import type { DocItemDTO } from "@/shared/api/doc/models";
import type { EditorType } from "@/shared/api/doc/slice";

type Props = {
    type: EditorType;
    items: DocItemDTO[];
    interactive?: boolean;
}

export function ItemList({ type, items, interactive = false }: Props) {
    return (
        <div className={cl.Wrapper}>
            {
                items.map((item, index) => {
                    return type === 'template'
                        ? <TemplateCard key={index} template={item} interactive={interactive}/>
                        : <ReportCard key={index} report={item} interactive={interactive}/>
                })
            }
        </div>
    );
}