// myWorksSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchMyWorks } from "./myWorksThunks";
import type { MyWorksState } from "./myWorksModels";

const initialState: MyWorksState = {
    templates: [],
    reports: [],
    loading: false,
    error: null
};

const myWorksSlice = createSlice({
    name: "myWorks",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchMyWorks.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyWorks.fulfilled, (state, action) => {
                state.loading = false;
                state.templates = action.payload.templates;
                state.reports = action.payload.reports;
            })
            .addCase(fetchMyWorks.rejected, (state, action) => {
                state.loading = false;
                state.error = "Failed to load user works";
            });
    }
});

export const myWorksReducer = myWorksSlice.reducer;
