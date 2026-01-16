// shared/api/templates/createTemplateThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createRepFile, createRepFileName } from "@/shared/lib/utils/repFileManager";
import type { RepTemplate } from "@/shared/types/repEditorTypes";
import type { RootState } from "@/app/store/store";
import { baseApi } from "../baseApi";

interface CreateTemplateArgs {
    name: string;
    templateTypeId: string;
    isPrivate: boolean;
    template: RepTemplate;
    canvasRef?: React.RefObject<HTMLElement | null>;
}

interface CreateTemplateResponse {
    id: string;
    name: string;
}

export const createTemplate = createAsyncThunk<
    CreateTemplateResponse,
    CreateTemplateArgs,
    {
        state: RootState;
        rejectValue: string;
    }
>(
    "templates/create",
    async ({ name, templateTypeId, isPrivate, template, canvasRef }, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.accessToken;
            
            if (!template.meta) {
                throw new Error("Відсутні метадані шаблону");
            }

            // 1. Создаем .rep файл
            const repFile = await createRepFile(template, canvasRef!.current);
            const fileName = createRepFileName(template.meta);

            // 2. Создаем FormData
            const formData = new FormData();
            formData.append("Name", name);
            formData.append("TemplateTypeId", templateTypeId);
            formData.append("IsPrivate", String(isPrivate));
            formData.append("File", repFile, fileName);

            // 3. Настраиваем headers
            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // 4. Отправляем через baseApi
            const response = await baseApi.post<CreateTemplateResponse>(
                '/templates',
                formData,
                {
                    headers: {
                        ...headers,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('Create template error:', error);
            
            let errorMessage = "Не вдалося створити шаблон";
            if (error.response) {
                errorMessage = `Помилка ${error.response.status}: ${error.response.data || error.response.statusText}`;
            } else if (error.request) {
                errorMessage = "Не вдалося отримати відповідь від сервера";
            } else {
                errorMessage = error.message || errorMessage;
            }
            
            return rejectWithValue(errorMessage);
        }
    }
);