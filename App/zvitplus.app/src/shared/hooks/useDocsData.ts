import type { RootState } from "@/app/store/store";

// В слайсе или отдельном файле selectors.ts
export const selectMediaFileById = (state: RootState, elementId: string) => {
    return state.docs.reports.current.files?.mediaFiles[elementId];
};

export const selectDataFileById = (state: RootState, elementId: string) => {
    return state.docs.reports.current.files?.dataFiles[elementId];
};

export const selectAllMediaFiles = (state: RootState) => {
    return state.docs.reports.current.files?.mediaFiles || {};
};

export const selectAllDataFiles = (state: RootState) => {
    return state.docs.reports.current.files?.dataFiles || {};
};