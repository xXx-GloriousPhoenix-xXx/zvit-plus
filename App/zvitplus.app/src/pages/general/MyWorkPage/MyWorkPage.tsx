import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { getMyWorks, getMyTemplates, getMyReports } from "@/shared/api/myWorks/myWorksThunks";
import { ItemList } from "@/shared/ui/ItemList/ItemList";
import { HeaderLine } from "@/shared/ui/HeaderLine/HeaderLine";
import { Pagination } from "@/shared/ui/Pagination/Pagination";

import cl from './MyWorkPage.module.css';
import { setReportPage, setTemplatePage } from "@/shared/api/myWorks/myWorksSlice";

export function MyWorkPage() {
    const dispatch = useAppDispatch();
    const { templates, reports } = useAppSelector(
        state => state.myWorks
    );
    const { isAuth, loading } = useAppSelector(
        state => state.auth
    )

    const loadMyWorks = () => {
        if (isAuth) {
            dispatch(getMyWorks());
        }
    }

    const loadMyReports = () => {
        if (isAuth) {
            dispatch(getMyReports({
                page: reports.currentPage,
                itemsPerPage: 9
            }));
        }
    }

    const loadMyTemplates = () => {
        if (isAuth) {
            dispatch(getMyTemplates({
                page: templates.currentPage,
                itemsPerPage: 9
            }));
        }
    }

    useEffect(loadMyWorks, [dispatch, isAuth, loading]);
    useEffect(loadMyTemplates, [templates.currentPage]);
    useEffect(loadMyReports, [reports.currentPage]);

    const handleTemplatePageChange = (page: number) => {
        dispatch(setTemplatePage(page));
    };

    const handleReportPageChange = (page: number) => {
        dispatch(setReportPage(page));
    };

    return (
        <section className={cl.Wrapper}>
            {
                templates.totalCount > 0
                ? <>
                    <HeaderLine>Шаблони ({templates.totalCount})</HeaderLine>
                    <ItemList interactive={true} type="template" items={templates.items} />
                </>
                : <HeaderLine >Нема створених шаблонів</HeaderLine>
            }

            {templates.totalPages > 1 && templates.totalCount > 0 && (
                <div className={cl.PaginationContainer}>
                    <Pagination
                        currentPage={templates.currentPage}
                        totalPages={templates.totalPages}
                        onPageChange={handleTemplatePageChange}
                    />
                </div>
            )}
            
            {
                reports.totalCount > 0
                ? <>
                    <HeaderLine >Звіти ({reports.totalCount})</HeaderLine>
                    <ItemList interactive={true} type="report" items={reports.items} />
                </>
                : <HeaderLine >Нема створених Звітів</HeaderLine>
            }

            {reports.totalPages > 1 && reports.totalCount > 0 && (
                <div className={cl.PaginationContainer}>
                    <Pagination
                        currentPage={reports.currentPage}
                        totalPages={reports.totalPages}
                        onPageChange={handleReportPageChange}
                    />
                </div>
            )}
        </section>
    );
}
