export type LoginRequest = {
    loginOrEmail: string;
    password: string;
};

export type RegisterRequest = {
    email: string;
    login: string;
    password: string;
};

export type TokenResponse = {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
};