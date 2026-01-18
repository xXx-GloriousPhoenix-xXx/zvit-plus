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
            return response.data;
        }
        catch (error: any) {            
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