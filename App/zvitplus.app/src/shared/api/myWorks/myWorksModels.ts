// myWorksModels.ts
import type { TemplateItemDTO } from "@/shared/api/templates/templateModels";
import type { ReportItemDTO } from "@/shared/api/reports/reportModels";

export interface MyWorksState {
    templates: TemplateItemDTO[];
    reports: ReportItemDTO[];
    loading: boolean;
    error: string | null;
}
