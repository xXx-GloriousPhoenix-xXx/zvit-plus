import { createSlice } from "@reduxjs/toolkit";
import type { FileItemDTO } from "./models";
import { getFile, getMeta } from "./thunks";
import type { RepTemplate } from "@/shared/types/repEditorTypes";

type FileState = {
    meta: {
        item: FileItemDTO | null;
        loading: boolean;
        error: string | null;
    }
    file: {
        item: RepTemplate | null;
        loading: boolean;
        error: string | null;
    }
}

const initialState: FileState = {
    meta: {
        item: null,
        loading: false,
        error: null
    },
    file: {
        item: null,
        loading: false,
        error: null
    }
}

const fileSlice = createSlice({
    name: "files",
    initialState,
    reducers: {
        clearError: (state) => {
            state.meta.error = null;
            state.file.error = null;
        },
        reset: () => initialState
    },
    extraReducers: (builder) => {
        builder
        
        //meta
        .addCase(getMeta.pending, state => {
            state.meta.loading = true;
            state.meta.error = null;
        })
        .addCase(getMeta.fulfilled, (state, action) => {
            state.meta.loading = false;
            state.meta.item = action.payload;
        })
        .addCase(getMeta.rejected, (state, action) => {
            state.meta.loading = false;
            state.meta.error = action.payload || "Помилка завантаження інформації про файл";
        })

        //file
        .addCase(getFile.pending, state => {
            state.file.loading = true;
            state.file.error = null;
        })
        .addCase(getFile.fulfilled, (state, action) => {
            state.file.loading = false;
            state.file.item = action.payload; 
        })
        .addCase(getFile.rejected, (state, action) => {
            state.file.loading = false;
            // state.file.error = action.payload || "Помилка завантаження файлу";
        })
    }
})

export const { clearError, reset } = fileSlice.actions;
export const filesReducer = fileSlice.reducer;
