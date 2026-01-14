import { createAsyncThunk } from "@reduxjs/toolkit";
import type { PagedResponse } from "../models";
import type { GetTemplatesArgs, TemplateItemDTO } from "./templateModels";
import type { RootState } from "@/app/store/store";
import { baseApi } from "../baseApi";

export const getTemplates = createAsyncThunk<
    PagedResponse<TemplateItemDTO>,
    GetTemplatesArgs,
    {
        state: RootState;
        rejectValue: string;
    }
>(
    "templates/getAll",
    async ({ page = 1, itemsPerPage = 6, searchParams = {} }, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.accessToken;
            
            // Строим query параметры
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('itemsPerPage', itemsPerPage.toString());
            
            // Добавляем search параметры если они есть
            if (searchParams.name) params.append('name', searchParams.name);
            if (searchParams.author) params.append('author', searchParams.author);
            if (searchParams.templateType) params.append('templateType', searchParams.templateType);
            if (searchParams.createdFrom) params.append('createdFrom', searchParams.createdFrom);
            if (searchParams.createdTo) params.append('createdTo', searchParams.createdTo);
            if (searchParams.updatedFrom) params.append('updatedFrom', searchParams.updatedFrom);
            if (searchParams.updatedTo) params.append('updatedTo', searchParams.updatedTo);
            
            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await baseApi.get<PagedResponse<TemplateItemDTO>>(
                `/templates/${page}/${itemsPerPage}?${params.toString()}`,
                { headers }
            );
            
            console.log(response.data);
            return response.data;
        } catch (error: any) {
            console.error('Get templates error:', error);
            
            let errorMessage = "Не вдалося отримати список шаблонів";
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