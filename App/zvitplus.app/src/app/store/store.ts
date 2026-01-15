import { authReducer } from "@/shared/api/auth/authSlice";
import { myWorksReducer } from "@/shared/api/myWorks/myWorksSlice";
import { reportsReducer } from "@/shared/api/reports/reportSlice";
import { templateTypesReducer } from "@/shared/api/templateTypes/templateTypesSlice";
import { templateCreateReducer } from "@/shared/api/templates/templateCreateSlice";
import { templatesGetReducer } from "@/shared/api/templates/templatesGetSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        templateTypes: templateTypesReducer,
        templateCreate: templateCreateReducer,
        templatesGet: templatesGetReducer,
        myWorks: myWorksReducer,
        reports: reportsReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
