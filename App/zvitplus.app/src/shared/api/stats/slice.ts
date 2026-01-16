import { createSlice } from "@reduxjs/toolkit";
import { getStats } from "./thunks";

type StatsState = {
    totalTemplates: number;
    totalReports: number;
    totalUsers: number;
    loading: boolean;
    error: string | null;
}

const initialState: StatsState = {
    totalTemplates: 0,
    totalReports: 0,
    totalUsers: 0,
    loading: false,
    error: null
}

const statsSlice = createSlice({
    name: "stats",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetStats: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStats.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStats.fulfilled, (state, action) => {
                state.loading = false;
                state.totalTemplates = action.payload.totalTemplates;
                state.totalReports = action.payload.totalReports;
                state.totalUsers = action.payload.totalUsers
            })
            .addCase(getStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Помилка завантаження статистики";
            })
    }
});

export const {
    clearError,
    resetStats
} = statsSlice.actions;

export const statsReducer = statsSlice.reducer;