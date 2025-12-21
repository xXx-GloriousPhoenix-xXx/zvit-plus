import api from './axios';
import type { LoginDTO, RegisterDTO, TokenResponse } from '../types/auth';

export const authApi = {
    register: async (data: RegisterDTO): Promise<void> => {
        await api.post('/auth/register', data);
    },
    
    login: async (data: LoginDTO): Promise<TokenResponse> => {
        const response = await api.post<TokenResponse>('/auth/login', data);
        if (response.data.accessToken && response.data.refreshToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        return response.data;
    },
    
    logout: async (): Promise<void> => {
        await api.post('/auth/logout');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },
    
    refresh: async (refreshToken: string): Promise<TokenResponse> => {
        const response = await api.post<TokenResponse>('/auth/refresh', { refreshToken });
        return response.data;
    }
};