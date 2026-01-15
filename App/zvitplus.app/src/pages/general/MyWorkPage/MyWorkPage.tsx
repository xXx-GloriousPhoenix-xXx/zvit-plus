import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchMyWorks } from "@/shared/api/myWorks/myWorksThunks";

export function MyWorkPage() {
    const dispatch = useAppDispatch();
    const { templates, reports, loading } = useAppSelector(
        state => state.myWorks
    );

    useEffect(() => {
        dispatch(fetchMyWorks());
    }, [dispatch]);

    if (loading) {
        return <h3>Завантаження...</h3>;
    }

    return (
        <section>
            <h1>Мої роботи</h1>

            <h2>Шаблони ({templates.length})</h2>
            {/* reuse <TemplateList /> */}
            
            <h2>Звіти ({reports.length})</h2>
            {/* reuse <ReportList /> */}
        </section>
    );
}
