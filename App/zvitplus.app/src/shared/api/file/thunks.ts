import { createAsyncThunk } from "@reduxjs/toolkit";
import type { FileGetArgs, FileItemDTO } from "./models";
import type { RootState } from "@/app/store/store";
import { baseApi } from "../baseApi";
import { unpackRepFile, type RepTemplateData, type RepTemplateFiles } from "@/shared/utils/repFileManager";

export const getMeta = createAsyncThunk<
    FileItemDTO,
    FileGetArgs,
    {
        state: RootState;
        rejectValue: string;
    }
>(
    "file/getMeta",
    async({ id, type }, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.accessToken;

            const metaUrl = `${type}s/${id}`;

            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await baseApi.get<FileItemDTO>(metaUrl, { headers });
            return response.data;
        }
        catch (error: any) {
            console.error('Get file error:', error);
            
            let errorMessage = "Не вдалося отримати файл";
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
)

export const getFile = createAsyncThunk<
    {
        data: RepTemplateData,
        files: RepTemplateFiles
    },
    FileGetArgs,
    {
        state: RootState;
        rejectValue: string;
    }
>(
    "file/getFile",
    async({ id, type }, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.accessToken;

            const downloadUrl = `${type}s/${id}/download`;

            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await baseApi.get<Blob>(downloadUrl, { 
                headers,
                responseType: 'blob' 
            });

            const data = await unpackRepFile(response.data);
            return data;
        }
        catch (error: any) {
            console.error('Download file error:', error);
            
            let errorMessage = "Не вдалося завантажити файл";
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