import { useKeyboardNavigation } from "@/shared/lib/hooks/useKeyboardNavigation";
import { useReportPage } from "@/shared/lib/hooks/useReportPage.ts";

import cl from './ReportPage.module.css';
import { NavLink } from "react-router-dom";

import { SearchBar } from "@/shared/ui/SearchBar/SearchBar";

export function ReportPage() {
    const reportPage = useReportPage();
    // const navigation = useKeyboardNavigation();


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
                    <h4 className={cl.Header}>Створюйте звіти</h4>
                    <p className={cl.Description}>Завантажуйте власні звіти з локального сховища</p>
                </div>
            </div>

            <SearchBar
                onSearch={reportPage.onSearch}
                onClear={reportPage.onClear}
                // initialParams={}
                templateTypes={reportPage.templateTypes}
                // isLoading={loading}
            />
        </section>
    );
}