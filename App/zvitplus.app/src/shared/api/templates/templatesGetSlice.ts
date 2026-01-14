// shared/api/templates/templatesSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { getTemplates } from "./getTemplatesThunk";
import type { TemplateItemDTO } from "./templateModels";

interface TemplatesState {
    items: TemplateItemDTO[];
    currentPage: number;
    totalCount: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
    searchParams: {
        name?: string;
        author?: string;
        templateType?: string;
        createdFrom?: string;
        createdTo?: string;
        updatedFrom?: string;
        updatedTo?: string;
    };
}

const initialState: TemplatesState = {
    items: [],
    currentPage: 1,
    totalCount: 0,
    totalPages: 0,
    loading: false,
    error: null,
    searchParams: {}
};

const templatesGetSlice = createSlice({
    name: "templatesGet",
    initialState,
    reducers: {
        setSearchParams: (state, action) => {
            state.searchParams = action.payload;
            state.currentPage = 1;
        },
        clearSearchParams: (state) => {
            state.searchParams = {};
            state.currentPage = 1;
        },
        setPage: (state, action) => {
            state.currentPage = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        resetTemplates: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTemplates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTemplates.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.currentPage = action.payload.currentPage;
                state.totalCount = action.payload.totalCount;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getTemplates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Помилка завантаження шаблонів";
            });
    }
});

export const {
    setSearchParams,
    clearSearchParams,
    setPage,
    clearError,
    resetTemplates
} = templatesGetSlice.actions;

export const templatesGetReducer = templatesGetSlice.reducer;