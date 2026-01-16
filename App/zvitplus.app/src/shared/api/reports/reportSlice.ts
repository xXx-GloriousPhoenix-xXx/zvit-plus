import { createSlice } from "@reduxjs/toolkit";
import type { ReportItemDTO, SearchReportParams } from "./reportModels";
import { getReports } from "./reportThunks";

interface ReportsState {
    list: {
        items: ReportItemDTO[];
        currentPage: number;
        totalPages: number;
        totalCount: number;
        loading: boolean;
        error: string | null;
        searchParams: SearchReportParams;
    };
}

const initialState: ReportsState = {
    list: {
        items: [],
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        loading: false,
        error: null,
        searchParams: {}
    }
};

const reportSlice = createSlice({
    name: "reports",
    initialState,
    reducers: {
        setSearchParams: (state, action) => {
            state.list.searchParams = action.payload;
            state.list.currentPage = 1;
            state.list.totalPages = 0;
            state.list.totalCount = 0;
            state.list.items = [];
        },
        clearSearchParams: (state) => {
            state.list.searchParams = {};
            state.list.currentPage = 1;
            state.list.totalPages = 0;
            state.list.totalCount = 0;
            state.list.items = [];
        },
        setPage: (state, action) => {
            state.list.currentPage = action.payload;
        },
        clearError: (state) => {
            state.list.error = null;
        },
        resetReports: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(getReports.pending, (state) => {
                state.list.loading = true;
                state.list.error = null;
            })
            .addCase(getReports.fulfilled, (state, action) => {
                state.list.loading = false;
                state.list.items = action.payload.items;
                state.list.currentPage = action.payload.currentPage;
                state.list.totalCount = action.payload.totalCount;
                state.list.totalPages = action.payload.totalPages;
            })
            .addCase(getReports.rejected, (state, action) => {
                state.list.loading = false;
                state.list.error = action.payload || "Помилка завантаження шаблонів";
            });
    }
});

export const {
    setSearchParams,
    clearSearchParams,
    setPage,
    clearError,
    resetReports
} = reportSlice.actions;
export const reportsReducer = reportSlice.reducer;