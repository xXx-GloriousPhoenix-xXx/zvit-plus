import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { templateTypesApi, type TemplateTypeDto } from "./templateTypesApi";

type TemplateTypesState = {
    items: TemplateTypeDto[];
    loading: boolean;
    error: string | null;
};

const initialState: TemplateTypesState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchTemplateTypes = createAsyncThunk<
    TemplateTypeDto[],
    void,
    { rejectValue: string }
>(
    "templateTypes/fetch",
    async (_, { rejectWithValue }) => {
        try {
            return await templateTypesApi.getAll();
        } catch {
            return rejectWithValue("Failed to load template types");
        }
    }
);

const templateTypesSlice = createSlice({
    name: "templateTypes",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchTemplateTypes.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTemplateTypes.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchTemplateTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Unknown error";
            });
    },
});

export const templateTypesReducer = templateTypesSlice.reducer;
