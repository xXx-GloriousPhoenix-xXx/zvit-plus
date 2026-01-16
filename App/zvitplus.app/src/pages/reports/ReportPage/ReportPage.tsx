import { useReportPage } from "@/shared/lib/hooks/useReportPage.ts";

import cl from './ReportPage.module.css';
import { NavLink } from "react-router-dom";

import { SearchBar } from "@/shared/ui/SearchBar/SearchBar";
import { Button } from "@/shared/ui/Button/Button";
import { ItemList } from "@/shared/ui/ItemList/ItemList";
import { Pagination } from "@/shared/ui/Pagination/Pagination";

export function ReportPage() {
    const {
        onSearch,
        onClear,
        error,
        templateTypes,
        searchParams,
        isLoading,
        loadReports,
        reports,
        totalPages,
        onPageChange,
        currentPage
    } = useReportPage();

    return (
        <section className={cl.Wrapper}>
            <div className={cl.Control}>
                <div className={cl.Option}>
                    <NavLink to="/templates" replace>
                        <i className="fa-solid fa-pen-to-square"></i>
                    </NavLink>
                    <h4 className={cl.Header}>Створюйте звіти</h4>
                    <p className={cl.Description}>Оберіть шаблон з переліку існуючих і створіть з його допогомогою звіт</p>
                </div>
                <div className={cl.Option}>
                    <NavLink to="upload">
                        <i className="fa-solid fa-arrow-up-from-bracket"></i>
                    </NavLink>
                    <h4 className={cl.Header}>Завантажуйте звіти</h4>
                    <p className={cl.Description}>Завантажуйте власні звіти з локального сховища</p>
                </div>
            </div>

            <SearchBar
                onSearch={onSearch}
                onClear={onClear}
                initialParams={searchParams}
                templateTypes={templateTypes}
                isLoading={isLoading}
            />

            {error && (
                <div className={cl.Error}>
                    {error}
                    <Button
                        onClick={loadReports}
                        text='Повторити'
                    />
                </div>
            )}

            <div className={cl.Reports}>
                {reports.length === 0 ? (
                    <div className={cl.EmptyState}>
                        <i className="fa-solid fa-file-circle-question"></i>
                        <h3>Звітів не знайдено</h3>
                        <p>Створіть перший звіт або змініть параметри пошуку</p>
                    </div>
                ) : (
                    <ItemList type='report' items={reports} />
                )}
            </div>

            {totalPages > 1 && reports.length > 0 && (
                <div className={cl.PaginationContainer}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </section>
    );
}