export interface RegisterDTO {
    email: string;
    password: string;
    fullName?: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
}