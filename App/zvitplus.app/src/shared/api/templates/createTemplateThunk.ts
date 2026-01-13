// shared/api/templates/createTemplateThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createRepFile, createRepFileName } from "@/shared/lib/utils/repFileManager";
import type { RepTemplate } from "@/shared/types/repEditorTypes";
import type { RootState } from "@/app/store/store";

interface CreateTemplateArgs {
    name: string;
    templateTypeId: string;
    isPrivate: boolean;
    template: RepTemplate;
}

export const createTemplate = createAsyncThunk<
    void,
    CreateTemplateArgs,
    {
        state: RootState;
        rejectValue: string;
    }
>(
    "templates/create",
    async ({ name, templateTypeId, isPrivate, template }, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.accessToken;

            // 1. Создаем .rep файл
            const repFile = await createRepFile(template);
            const fileName = createRepFileName(template.meta);

            // 2. Создаем FormData
            const formData = new FormData();
            formData.append("Name", name);
            formData.append("TemplateTypeId", templateTypeId);
            formData.append("IsPrivate", String(isPrivate));
            formData.append("File", repFile, fileName);

            // 3. Отправляем запрос
            const response = await fetch('/api/templates', {
                method: 'POST',
                headers: token
                    ? { 
                        'Authorization': `Bearer ${token}`,
                        // Не устанавливаем Content-Type - браузер сделает это сам
                      }
                    : {},
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Failed to create template: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error: any) {
            console.error('Create template error:', error);
            return rejectWithValue(error.message || "Failed to create template");
        }
    }
);