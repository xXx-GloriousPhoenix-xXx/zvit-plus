import { createAsyncThunk } from "@reduxjs/toolkit";
import JSZip from "jszip";
import { baseApi } from "@/shared/api/baseApi";
import type { RootState } from "@/app/store/store.ts";
import type { RepTemplate } from "@/pages/templates/TemplateCreatePage/editor/types";

export interface CreateTemplateRequest {
    meta: {
        name: string;
        templateTypeId: string;
        isPrivate: boolean;
    };
    template: RepTemplate;
}

export const createTemplate = createAsyncThunk<
    void,
    CreateTemplateRequest,
    {
        state: RootState;
        rejectValue: string;
    }
>(
    "templates/create",
    async ({ meta, template }, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.accessToken;

            const zip = new JSZip();
            zip.file("template.json", JSON.stringify(template, null, 2));

            const blob = await zip.generateAsync({ type: "blob" });

            console.log(meta);
            console.log(blob);

            const form = new FormData();
            form.append("Name", meta.name);
            form.append("TemplateTypeId", meta.templateTypeId);
            form.append("IsPrivate", String(meta.isPrivate));
            form.append("File", blob, `${meta.name}.rep`);

            var response = await baseApi.post("/templates", form, {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : undefined
            });
            console.log(response);
        } catch(error: any) {
            console.error(error.response);
            return rejectWithValue("Failed to create template");
        }
    }
);
