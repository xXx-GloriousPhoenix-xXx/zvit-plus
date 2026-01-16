import { createSlice } from "@reduxjs/toolkit";
import { getMyReports, getMyTemplates } from "./myWorksThunks";

import type { TemplateItemDTO } from "@/shared/api/templates/templateModels";
import type { ReportItemDTO } from "@/shared/api/reports/reportModels";

export interface MyWorksState {
    templates: {
        items: TemplateItemDTO[];
        currentPage: number;
        totalPages: number;
        totalCount: number;
        loading: boolean;
        error: string | null;
    }
    reports: {
        items: ReportItemDTO[];
        currentPage: number;
        totalPages: number;
        totalCount: number;
        loading: boolean;
        error: string | null;
    }
}

const initialState: MyWorksState = {
    templates: {
        items: [],
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        loading: false,
        error: null
    },
    reports: {
        items: [],
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        loading: false,
        error: null
    }
};

const myWorksSlice = createSlice({
    name: "myWorks",
    initialState,
    reducers: {
        setTemplatePage: (state, action) => {
            state.templates.currentPage = action.payload;
        },
        setReportPage: (state, action) => {
            state.reports.currentPage = action.payload;
        },
        clearError: (state) => {
            state.templates.error = null;
            state.reports.error = null;
        },
        resetMyWorks: () => initialState
    },
    extraReducers: builder => {
        builder
            // .addCase(getMyWorks.pending, state => {
            //     state.loading = true;
            //     state.error = null;
            // })
            // .addCase(getMyWorks.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.templates = action.payload.templates;
            //     state.reports = action.payload.reports;
            // })
            // .addCase(getMyWorks.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = "Failed to load user works";
            // })
            .addCase(getMyTemplates.pending, state => {
                state.templates.loading = true;
                state.templates.error = null;
            })
            .addCase(getMyTemplates.fulfilled, (state, action) => {
                state.templates.loading = false;
                state.templates.items = action.payload.items;
                state.templates.totalCount = action.payload.totalCount;
                state.templates.totalPages = action.payload.totalPages;
            })
            .addCase(getMyTemplates.rejected, state => {
                state.templates.loading = false;
                state.templates.error = "Failed to load user templates";
            })
            .addCase(getMyReports.pending, state => {
                state.reports.loading = true;
                state.reports.error = null;
            })
            .addCase(getMyReports.fulfilled, (state, action) => {
                state.reports.loading = false;
                state.reports.items = action.payload.items;
                state.reports.totalCount = action.payload.totalCount;
                state.reports.totalPages = action.payload.totalPages;
            })
            .addCase(getMyReports.rejected, state => {
                state.reports.loading = false;
                state.reports.error = "Failed to load user reports";
            })
    }
});

export const {
    setTemplatePage,
    setReportPage,
    clearError,
    resetMyWorks
} = myWorksSlice.actions;
export const myWorksReducer = myWorksSlice.reducer;
