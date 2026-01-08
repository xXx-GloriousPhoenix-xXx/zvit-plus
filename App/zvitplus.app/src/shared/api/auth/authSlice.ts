import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "@/shared/api/auth/authApi";
import type { TokenResponse, LoginRequest, RegisterRequest } from "@/shared/api/auth/authModels";

type AuthState = {
    accessToken: string | null;
    refreshToken: string | null;
    expiresIn: number | null;
    isAuth: boolean;
    loading: boolean;
    error: string | null;
};

const initialState: AuthState = {
    accessToken: null,
    refreshToken: null,
    expiresIn: null,
    isAuth: false,
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk<TokenResponse, LoginRequest, { rejectValue: string }>(
    "auth/login",
    async (data, { rejectWithValue }) => {
        try {
            return await authApi.login(data);
        } catch {
            return rejectWithValue("Login failed");
        }
    }
);

export const registerUser = createAsyncThunk<void, RegisterRequest, { rejectValue: string }>(
    "auth/register",
    async (data, { rejectWithValue }) => {
        try {
            await authApi.register(data);
        } catch {
            return rejectWithValue("Registration failed");
        }
    }
);

type LogoutArgs = { refreshToken: string; accessToken: string; }
export const logoutUser = createAsyncThunk<void, LogoutArgs, { rejectValue: string }>(
    "auth/logout",
    async ({ refreshToken, accessToken }, { rejectWithValue }) => {
        try {
            await authApi.logout(refreshToken, accessToken);
        } catch {
            return rejectWithValue("Logout failed");
        }
    }
);

export const refreshToken = createAsyncThunk<TokenResponse, string, { rejectValue: string }>(
    "auth/refresh",
    async (refreshToken, { rejectWithValue }) => {
        try {
            return await authApi.refresh(refreshToken);
        } catch {
            return rejectWithValue("Refresh token failed");
        }
    }
);

export const initAuth = createAsyncThunk<
    void,
    void
>(
    "auth/init",
    async (_, { dispatch }) => {
        const refreshTokenValue = localStorage.getItem("refreshToken");

        if (!refreshTokenValue) return;

        try {
            await dispatch(refreshToken(refreshTokenValue)).unwrap();
        } catch {
            localStorage.removeItem("refreshToken");
        }
    }
);



const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetError(state) {
            state.error = null;
        },
        clearAuth(state) {
            state.accessToken = null;
            state.refreshToken = null;
            state.expiresIn = null;
            state.isAuth = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // LOGIN
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.expiresIn = action.payload.expiresIn;
                state.isAuth = true;
                state.loading = false;

                localStorage.setItem("refreshToken", action.payload.refreshToken);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Unknown login error";
            })

            // REGISTER
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Unknown register error";
            })

            // LOGOUT
            .addCase(logoutUser.fulfilled, (state) => {
                state.accessToken = null;
                state.refreshToken = null;
                state.expiresIn = null;
                state.isAuth = false;

                localStorage.removeItem("refreshToken");
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.error = action.payload ?? "Unknown logout error";
            })

            // REFRESH
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.expiresIn = action.payload.expiresIn;
                state.isAuth = true;
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.accessToken = null;
                state.refreshToken = null;
                state.expiresIn = null;
                state.isAuth = false;
                state.error = action.payload ?? "Unknown refresh error";
            });
    },
});

export const { resetError, clearAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
