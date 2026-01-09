import type { PageDimension, PageSize, RepElementType } from "@/pages/templates/TemplateCreatePage/editor/types";

// export const ELEMENT_COLORS: Record<RepElementType, string> = {
//     text: "rgba(0, 102, 255, 0.2)",    // синій
//     image: "rgba(0, 200, 83, 0.2)",    // зелений
//     chart: "rgba(255, 193, 7, 0.2)",   // жовтий
//     table: "rgba(244, 67, 54, 0.2)",   // червоний
// };

export const ELEMENT_COLORS: Record<RepElementType, string> = {
    text: "rgba(59, 130, 246, 0.15)",
    image: "rgba(16, 185, 129, 0.15)",
    chart: "rgba(251, 191, 36, 0.15)",
    table: "rgba(239, 68, 68, 0.15)",
};

const ELEMENT_BORDERS: Record<RepElementType, string> = {
    text: "#3b82f6",
    image: "#10b981",
    chart: "#fbbf24",
    table: "#ef4444",
  };

export const PAGE_DIMENSIONS: PageDimension = {
    A0: { width: 841, height: 1189 },
    A1: { width: 594, height: 841 },
    A2: { width: 420, height: 594 },
    A3: { width: 297, height: 420 },
    A4: { width: 210, height: 297 },
    A5: { width: 148, height: 210 },
    A6: { width: 105, height: 148 },
};

export const getScaleCoefficient = (pageSize: PageSize, factWidth: number) => {
    const pageDimensions = PAGE_DIMENSIONS[pageSize];
    const factHeight = factWidth * Math.sqrt(2);
    const scaleX = factWidth / pageDimensions.width;
    const scaleY = factHeight / pageDimensions.height;
    return { scaleX, scaleY };
}