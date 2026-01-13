// shared/api/templates/templateSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { MetaValue, RepTemplate } from "@/shared/types/repEditorTypes";
import { templatesApi, type CreateTemplateRequest } from "@/shared/api/templates/templatesApi";
import { TEMPLATE_DRAFT_KEY } from "@/shared/constants/localStorage";

type TemplateCreateState = {
    meta: MetaValue;
    template: RepTemplate;
    step: number;
    loading: boolean;
    error: string | null;
    lastSaved: string | null;
};

const getInitialState = (): TemplateCreateState => {
    const saved = localStorage.getItem(TEMPLATE_DRAFT_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.meta && parsed.template) {
                return {
                    ...parsed,
                    loading: false,
                    error: null,
                    lastSaved: parsed.lastSaved || null
                };
            }
        } catch (e) {
            console.error('Failed to parse saved template:', e);
            localStorage.removeItem(TEMPLATE_DRAFT_KEY);
        }
    }

    return {
        meta: {
            templateName: "",
            templateTypeId: "",
            isPrivate: false,
            pageSize: "A4",
            orientation: "portrait"
        },
        template: {
            meta: {
                templateName: "",
                templateTypeId: "",
                isPrivate: false,
                pageSize: "A4",
                orientation: "portrait"
            },
            elements: []
        },
        step: 1,
        loading: false,
        error: null,
        lastSaved: null
    };
};

const saveToStorage = (state: TemplateCreateState) => {
    const toSave = {
        meta: state.meta,
        template: state.template,
        step: state.step,
        lastSaved: new Date().toISOString()
    };
    localStorage.setItem(TEMPLATE_DRAFT_KEY, JSON.stringify(toSave));
};

const clearStorage = () => {
    localStorage.removeItem(TEMPLATE_DRAFT_KEY);
};

export const createTemplate = createAsyncThunk<
    void,
    void,
    {
        state: { templateCreate: TemplateCreateState };
        rejectValue: string;
    }
>(
    "templateCreate/create",
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState().templateCreate;
            const request: CreateTemplateRequest = {
                meta: {
                    name: state.meta.templateName,
                    templateTypeId: state.meta.templateTypeId,
                    isPrivate: state.meta.isPrivate
                },
                template: state.template
            };
            
            await templatesApi.create(request);
            return;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to create template");
        }
    }
);

const templateCreateSlice = createSlice({
    name: "templateCreate",
    initialState: getInitialState(),
    reducers: {
        setMeta: (state, action) => {
            state.meta = action.payload;
            state.template.meta = action.payload;
            saveToStorage(state);
        },
        setTemplate: (state, action) => {
            state.template = action.payload;
            if (action.payload.meta) {
                state.meta = action.payload.meta;
            }
            saveToStorage(state);
        },
        setStep: (state, action) => {
            state.step = action.payload;
            saveToStorage(state);
        },
        updateElement: (state, action) => {
            const { id, updates } = action.payload;
            const elementIndex = state.template.elements.findIndex(el => el.id === id);
            if (elementIndex !== -1) {
                state.template.elements[elementIndex] = {
                    ...state.template.elements[elementIndex],
                    ...updates
                };
                saveToStorage(state);
            }
        },
        addElement: (state, action) => {
            state.template.elements.push(action.payload);
            saveToStorage(state);
        },
        removeElement: (state, action) => {
            state.template.elements = state.template.elements.filter(el => el.id !== action.payload);
            saveToStorage(state);
        },
        clearDraft: (state) => {
            state.meta = {
                templateName: "",
                templateTypeId: "",
                isPrivate: false,
                pageSize: "A4",
                orientation: "portrait"
            };
            state.template = {
                meta: {
                    templateName: "",
                    templateTypeId: "",
                    isPrivate: false,
                    pageSize: "A4",
                    orientation: "portrait"
                },
                elements: []
            };
            state.step = 1;
            state.error = null;
            clearStorage();
        },
        resetError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createTemplate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTemplate.fulfilled, (state) => {
                state.loading = false;
                clearStorage();
            })
            .addCase(createTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to create template";
            });
    },
});

export const {
    setMeta,
    setTemplate,
    setStep,
    updateElement,
    addElement,
    removeElement,
    clearDraft,
    resetError
} = templateCreateSlice.actions;

export const templateCreateReducer = templateCreateSlice.reducer;