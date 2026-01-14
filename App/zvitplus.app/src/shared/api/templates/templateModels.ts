export interface SearchTemplateParams {
    name?: string;
    author?: string;
    templateType?: string;
    createdFrom?: string; // ISO string
    createdTo?: string;
    updatedFrom?: string;
    updatedTo?: string;
}

export interface GetTemplatesArgs {
    page?: number;
    itemsPerPage?: number;
    searchParams?: SearchTemplateParams;
}

export interface TemplateItemDTO {
    id: string;
    name: string;
    author: string;
    templateType: string;
    isPrivate: boolean;
    fileId: string;
    fileSize: number;
    createdAt: string;
    updatedAt: string;
}