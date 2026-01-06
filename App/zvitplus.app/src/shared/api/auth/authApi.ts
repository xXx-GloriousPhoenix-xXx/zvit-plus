import { baseApi } from "@/shared/api/baseApi";

import type { LoginRequest, RegisterRequest, TokenResponse } from '@/shared/api/auth/authModels';

export const authApi = {
    login: async (data: LoginRequest): Promise<TokenResponse> => {
        const response = await baseApi.post<TokenResponse>(
            "/auth/login", 
            data, 
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data;
    },
        
    register: async (data: RegisterRequest): Promise<void> => {
        await baseApi.post<void>(
            "/auth/register",
            data,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
    },

    logout: async (refreshToken: string, accessToken: string): Promise<void> => {
        await baseApi.post<void>(
            `/auth/logout/${refreshToken}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
    },

    refresh: async (refreshToken: string): Promise<TokenResponse> => {
        const response = await baseApi.post<TokenResponse>(
            `/auth/refresh/${refreshToken}`
        );
        return response.data;
    }
};