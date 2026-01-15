import { createSlice } from "@reduxjs/toolkit";
import type { ReportItemDTO, SearchReportParams } from "./reportModels";

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

    current: {
        item: ReportItemDTO | null;
        loading: boolean;
        error: string | null;
    };

    mutation: {
        loading: boolean;
        error: string | null;
        success: boolean;
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
    },
    current: {
        item: null,
        loading: false,
        error: null
    },
    mutation: {
        loading: false,
        error: null,
        success: false
    }
};

const reportSlice = createSlice({
    name: "reports",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {

    }
});

export const {} = reportSlice.actions;
export const reportsReducer = reportSlice.reducer;