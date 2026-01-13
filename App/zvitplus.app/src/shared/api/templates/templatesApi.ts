import { baseApi } from "@/shared/api/baseApi";
import type { RepTemplate } from "@/shared/types/repEditorTypes";

export interface CreateTemplateRequest {
    meta: {
        name: string;
        templateTypeId: string;
        isPrivate: boolean;
    }
    template: RepTemplate;
}

export const templatesApi = {
    async create(data: CreateTemplateRequest) {
        const res = await baseApi.post("/templates/", data);
        return res.data;
    },
};
