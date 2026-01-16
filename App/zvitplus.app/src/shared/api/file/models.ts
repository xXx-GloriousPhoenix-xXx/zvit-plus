import type { FileType } from "@/shared/types/repEditorTypes";

export interface FileItemDTO {
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

export interface FileGetArgs {
    id: string;
    type: FileType;
}