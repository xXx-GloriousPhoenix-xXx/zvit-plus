import type { UserRole } from "../auth/authSlice";
import { baseApi } from "../baseApi";

export type GetUserDTO = {
    id: string;
    name: string;
    role: UserRole;
    isBanned: boolean;
}

export const fetchUserByLogin = async (login: string): Promise<GetUserDTO> => {
    try {
        const url = `users/get/${login}`;
        const response = await baseApi.get<GetUserDTO>(url);
        console.log(response.data.role);
        return response.data;
    } catch (error: any) {
        let errorMessage = 'Не вдалося отримати користувача';
        if (error.response) {
            errorMessage = `Помилка ${error.response.status}: ${error.response.data || error.response.statusText}`;
        } else if (error.request) {
            errorMessage = "Не вдалося отримати відповідь від сервера";
        } else {
            errorMessage = error.message || errorMessage;
        }
        throw new Error(errorMessage);
    }
};

export const banUser = async (id: string, isBan: boolean, accessToken: string): Promise<GetUserDTO> => {
    try {
        const url = `users/${id}/ban/${isBan}`;
        const response = await baseApi.post<GetUserDTO>(
            url,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        return response.data;
    }
    catch (error: any) {
        let errorMessage = `Не вдалося ${isBan ? 'заблокувати' : 'розблокувати'} користувача`;
        if (error.response) {
            errorMessage = `Помилка ${error.response.status}: ${error.response.data || error.response.statusText}`;
        } else if (error.request) {
            errorMessage = "Не вдалося отримати відповідь від сервера";
        } else {
            errorMessage = error.message || errorMessage;
        }
        throw new Error(errorMessage);
    }
}

export const grantRole = async (id: string, role: UserRole, accessToken: string): Promise<GetUserDTO> => {
    try {
        const url = `users/${id}/grant/${role}`;
        const response = await baseApi.post<GetUserDTO>(
            url,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        return response.data;
    }
    catch (error: any) {
        let errorMessage = `Не вдалося надати користувачу роль ${role}`;
        if (error.response) {
            errorMessage = `Помилка ${error.response.status}: ${error.response.data || error.response.statusText}`;
        } else if (error.request) {
            errorMessage = "Не вдалося отримати відповідь від сервера";
        } else {
            errorMessage = error.message || errorMessage;
        }
        throw new Error(errorMessage);
    }
}