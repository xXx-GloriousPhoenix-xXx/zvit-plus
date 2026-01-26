import type { MetaValue, RepElement } from "@/shared/types/repEditorTypes";

export interface SearchParams {
    name?: string;
    author?: string;
    templateType?: string;
    createdFrom?: string;
    createdTo?: string;
    updatedFrom?: string;
    updatedTo?: string;
}

export interface GetDocDTO {
    page: number;
    pageSize: number;
    searchParams: SearchParams;
}

export interface RepDocData {
    meta: MetaValue;
    elements: RepElement[];
}

export interface RepDocFiles {
    previewUrl?: Blob;
    dataFiles: Record<string, File>;
    mediaFiles: Record<string, File>;
}

export interface DocItemDTO {
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

export type DocType = 'report' | 'template';