import { authReducer } from "@/shared/api/auth/authSlice";
import { docsReducer } from "@/shared/api/doc/slice";
import { filesReducer } from "@/shared/api/file/slice";
import { myWorksReducer } from "@/shared/api/myWorks/myWorksSlice";
import { reportsReducer } from "@/shared/api/reports/reportSlice";
import { statsReducer } from "@/shared/api/stats/slice";
import { templateTypesReducer } from "@/shared/api/templateTypes/templateTypesSlice";
import { templateCreateReducer } from "@/shared/api/templates/templateCreateSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        templateTypes: templateTypesReducer,
        templateCreate: templateCreateReducer,
        myWorks: myWorksReducer,
        reports: reportsReducer,
        stats: statsReducer,
        files: filesReducer,
        docs: docsReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
        serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
