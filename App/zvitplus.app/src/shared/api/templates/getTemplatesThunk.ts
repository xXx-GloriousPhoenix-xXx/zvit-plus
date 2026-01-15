import { createAsyncThunk } from "@reduxjs/toolkit";
import type { PagedResponse } from "../models";
import type { GetTemplatesArgs, TemplateItemDTO } from "./templateModels";
import type { RootState } from "@/app/store/store";
import { baseApi } from "../baseApi";

// getTemplatesThunk.ts - исправляем отправку параметров
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
            
            // Строим query параметры - ТОЛЬКО если значение не пустое
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('itemsPerPage', itemsPerPage.toString());
            
            // Добавляем search параметры ТОЛЬКО если они не пустые
            if (searchParams.name && searchParams.name.trim() !== '') {
                params.append('name', searchParams.name.trim());
            }
            if (searchParams.author && searchParams.author.trim() !== '') {
                params.append('author', searchParams.author.trim());
            }
            if (searchParams.templateType && searchParams.templateType.trim() !== '') {
                params.append('templateType', searchParams.templateType.trim());
            }
            if (searchParams.createdFrom && searchParams.createdFrom.trim() !== '') {
                params.append('createdFrom', searchParams.createdFrom.trim());
            }
            if (searchParams.createdTo && searchParams.createdTo.trim() !== '') {
                params.append('createdTo', searchParams.createdTo.trim());
            }
            if (searchParams.updatedFrom && searchParams.updatedFrom.trim() !== '') {
                params.append('updatedFrom', searchParams.updatedFrom.trim());
            }
            if (searchParams.updatedTo && searchParams.updatedTo.trim() !== '') {
                params.append('updatedTo', searchParams.updatedTo.trim());
            }
            
            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            // Формируем URL
            const url = `/templates/${page}/${itemsPerPage}${params.toString() ? '?' + params.toString() : ''}`;
            
            console.log('Request URL:', url);
            
            const response = await baseApi.get<PagedResponse<TemplateItemDTO>>(
                url,
                { headers }
            );
            
            console.log('Response:', response.data);
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