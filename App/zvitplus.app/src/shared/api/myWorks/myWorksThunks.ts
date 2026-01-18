import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store/store";
import type { GetMyReportArgs, ReportItemDTO } from "../reports/reportModels";
import type { GetMyTemplatesArgs, TemplateItemDTO } from "../templates/templateModels";
import type { PagedResponse } from "../models";
import { baseApi } from "../baseApi";

export const getMyWorks = createAsyncThunk<
    {
        templates: PagedResponse<TemplateItemDTO>;
        reports: PagedResponse<ReportItemDTO>;
    },
    void,
    { state: RootState }
>(
    "myWorks/getAll",
    async (_, { dispatch }) => {
        const [templates, reports] = await Promise.all([
            dispatch(getMyTemplates({
                page: 1,
                itemsPerPage: 9
            })).unwrap(),

            dispatch(getMyReports({
                page: 1,
                itemsPerPage: 9
            })).unwrap()
        ]);

        return {
            templates: templates,
            reports: reports
        };
    }
);

export const getMyTemplates  = createAsyncThunk<
    PagedResponse<TemplateItemDTO>,
    GetMyTemplatesArgs,
    {
        state: RootState; 
        rejectValue: string
    }
>(
    "templates/getMy",
    async ({ page = 1, itemsPerPage = 6 }, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.accessToken;

            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const url = `/templates/my/${page}/${itemsPerPage}`;

            const response = await baseApi.get<PagedResponse<TemplateItemDTO>>(
                url,
                { headers }
            );

            return response.data;
        }
        catch (error: any) {            
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

export const getMyReports = createAsyncThunk<
    PagedResponse<ReportItemDTO>,
    GetMyReportArgs,
    {
        state: RootState; 
        rejectValue: string
    }
>(
    "reports/getMy",
    async ({ page = 1, itemsPerPage = 6 }, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.accessToken;

            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const url = `/reports/my/${page}/${itemsPerPage}`;

            const response = await baseApi.get<PagedResponse<ReportItemDTO>>(
                url,
                { headers }
            );

            return response.data;
        }
        catch (error: any) {
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