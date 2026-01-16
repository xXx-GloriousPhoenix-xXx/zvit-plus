import { createAsyncThunk } from "@reduxjs/toolkit";
import type { GetStatsDTO } from "./models";
import type { RootState } from "@/app/store/store";
import { baseApi } from "../baseApi";

export const getStats = createAsyncThunk<
    GetStatsDTO,
    void,
    {
        state: RootState;
        rejectValue: string;
    }
>(
    "stats/get",
    async (_, { rejectWithValue }) => {
        try {
            const url = "stats";
            const response = await baseApi.get<GetStatsDTO>(url);
            console.log(response.data);
            return response.data;
        }
        catch (error: any) {
            console.error('Get stats error:', error);
            
            let errorMessage = "Не вдалося отримати статистику";
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