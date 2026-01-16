import type { TemplateItemDTO } from "@/shared/api/templates/templateModels";
import type { ReportItemDTO } from "@/shared/api/reports/reportModels";

import { TemplateCard } from "../TemplateCard/TemplateCard";
import { ReportCard } from '../ReportCard/ReportCard';

import cl from './ItemList.module.css';

type ItemListProps = {
    type: 'template'
    items: TemplateItemDTO[]
} | {
    type: 'report'
    items: ReportItemDTO[]
}

export function ItemList({ type, items }: ItemListProps) {
    return (
        <div className={cl.Wrapper}>
            {
                items.map((item, index) => {
                    return type === 'template'
                        ? <TemplateCard key={index} template={item}/>
                        : <ReportCard key={index} report={item}/>
                })
            }
        </div>
    );
}