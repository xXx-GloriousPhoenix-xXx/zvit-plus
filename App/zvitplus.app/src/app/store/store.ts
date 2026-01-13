import { authReducer } from "@/shared/api/auth/authSlice";
import { templateTypesReducer } from "@/shared/api/templateTypes/templateTypesSlice";
import { templateCreateReducer } from "@/shared/api/templates/templateSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        templateTypes: templateTypesReducer,
        templateCreate: templateCreateReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
