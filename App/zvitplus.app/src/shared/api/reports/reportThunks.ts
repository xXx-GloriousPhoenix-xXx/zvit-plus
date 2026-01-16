import { createAsyncThunk } from "@reduxjs/toolkit";
import type { PagedResponse } from "../models";
import type { GetReportArgs, ReportItemDTO } from "./reportModels";
import type { RootState } from "@/app/store/store";
import { baseApi } from "../baseApi";

export const getReports = createAsyncThunk<
    PagedResponse<ReportItemDTO>,
    GetReportArgs,
    {
        state: RootState;
        rejectValue: string;
    }
>(
    "reports/getAll",
    async ({ page = 1, itemsPerPage = 6, searchParams = {} }, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.accessToken;
            
            const params = new URLSearchParams();
            
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
            
            const url = `/reports/${page}/${itemsPerPage}${params.toString() ? '?' + params.toString() : ''}`;
            
            const response = await baseApi.get<PagedResponse<ReportItemDTO>>(
                url,
                { headers }
            );
            
            return response.data;
        } catch (error: any) {
            console.error('Get reports error:', error);
            
            let errorMessage = "Не вдалося отримати список звітів";
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

// export const getReport = createAsyncThunk<>