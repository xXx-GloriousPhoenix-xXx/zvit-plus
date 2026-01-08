import { baseApi } from "@/shared/api/baseApi.ts"; // axios instance с baseURL + auth interceptor

export interface TemplateTypeDto {
    id: string;
    name: string;
}

export const templateTypesApi = {
    async getAll(): Promise<TemplateTypeDto[]> {
        const { data } = await baseApi.get<TemplateTypeDto[]>("/template-types/");
        return data;
    },
};
