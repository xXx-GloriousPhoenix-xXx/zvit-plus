// editor/types.ts
export type RepElementType = "text" | "table" | "chart" | "image";

export interface RepElement {
    id: string;
    type: RepElementType;
    position: { x: number; y: number };
    size: { width: number; height: number };
    payload?: Record<string, unknown>;
}

export interface RepTemplate {
    meta: MetaValue;
    elements: RepElement[];
}

export interface MetaValue {
    templateName: string;
    templateTypeId: string;
    isPrivate: boolean;
    pageSize: PageSize;
    orientation: PageOrientation;
}

export type PageOrientation = "portrait" | "landscape";
export type PageSize = "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "A6";
export const PAGE_SIZES: PageSize[] = ["A0", "A1", "A2", "A3", "A4", "A5", "A6"];
