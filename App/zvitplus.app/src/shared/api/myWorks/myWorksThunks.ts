import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTemplates } from "@/shared/api/templates/getTemplatesThunk";
import { getReports } from "@/shared/api/reports/reportThunks";
import type { RootState } from "@/app/store/store";

export const fetchMyWorks = createAsyncThunk<
    {
        templates: any[];
        reports: any[];
    },
    void,
    { state: RootState }
>(
    "myWorks/fetch",
    async (_, { dispatch }) => {
        const [templates, reports] = await Promise.all([
            dispatch(getTemplates({
                page: 1,
                itemsPerPage: 100,
                searchParams: {}
            })).unwrap(),

            dispatch(getReports({
                page: 1,
                itemsPerPage: 100,
                searchParams: {}
            })).unwrap()
        ]);

        return {
            templates: templates.items,
            reports: reports.items
        };
    }
);
