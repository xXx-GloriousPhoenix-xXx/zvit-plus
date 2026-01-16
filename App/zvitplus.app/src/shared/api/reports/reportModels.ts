export interface SearchReportParams {
    name?: string;
    author?: string;
    templateType?: string;
    createdFrom?: string;
    createdTo?: string;
    updatedFrom?: string;
    updatedTo?: string;
}

export interface GetReportArgs {
    page?: number;
    itemsPerPage?: number;
    searchParams?: SearchReportParams;
}

export interface ReportItemDTO {
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

export interface GetMyReportArgs {
    page?: number;
    itemsPerPage?: number;
}