// editor/types.ts
export type RepElementType = "text" | "table" | "chart" | "image";
export type RepElementMode = "static" | "dynamic";
export type ChartType = "bar" | "line" | "pie";
export type AlignType = 'left' | 'center' | 'right';
export type FontWeight = 'normal' | 'bold';

export interface BaseRepElement {
    id: string;
    type: RepElementType;
    mode: RepElementMode;
    position: { x: number; y: number };
    size: { width: number; height: number };
}

export interface TextElement extends BaseRepElement {
    type: "text";
    payload: {
        text?: string;
        fontSize?: number;
        fontWeight?: FontWeight;
        color?: string;
        align?: AlignType;
    };
}
  
export interface ImageElement extends BaseRepElement {
    type: "image";
    payload: {
        src?: string;
        alt?: string;
    };
}
  
export interface ChartElement extends BaseRepElement {
    type: "chart";
    payload: {
        chartType?: ChartType;
        dataSource?: string;
        title?: string;
    };
}
  
export interface TableElement extends BaseRepElement {
    type: "table";
    payload: {
        columns?: string[];
        rows?: string[][];
    };
}

export type RepElement = TextElement | ImageElement | ChartElement | TableElement;

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

export type Position = {
    x: number;
    y: number;
}

export type Dimension = {
    width: number;
    height: number;
}
export type PageDimension = {
    [key in PageSize]: Dimension
};

export type Cell = {
    row: number | null;
    col: number;
}