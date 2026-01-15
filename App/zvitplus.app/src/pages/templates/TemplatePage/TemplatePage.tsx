import { useEffect } from 'react';
import cl from './TemplatePage.module.css';
import { NavLink } from 'react-router-dom';
import { TemplateList } from '@/shared/ui/TemplateList/TemplateList.tsx';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { getTemplates } from '@/shared/api/templates/getTemplatesThunk';
import { Button } from '@/shared/ui/Button/Button';
import { Pagination } from '@/shared/ui/Pagination/Pagination';
import { useKeyboardNavigation } from '@/shared/lib/hooks/useKeyboardNavigation';
import { SearchBar } from '@/shared/ui/SearchBar/SearchBar';
import { 
    setPage, 
    setSearchParams,
    clearSearchParams 
} from '@/shared/api/templates/templatesGetSlice';
import { fetchTemplateTypes } from '@/shared/api/templateTypes/templateTypesSlice';

export function TemplatePage() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (templateTypes.length === 0) {
            dispatch(fetchTemplateTypes());
        }
    }, []);
    const { 
        items: templates, 
        loading, 
        error,
        currentPage, 
        totalPages, 
        searchParams,
    } = useAppSelector(state => state.templatesGet);
    
    const { items: templateTypes } = useAppSelector(state => state.templateTypes);

    useEffect(() => {
        loadTemplates();
    }, [currentPage, searchParams]);
    
    const loadTemplates = () => {        
        dispatch(getTemplates({
            page: currentPage,
            itemsPerPage: 6,
            searchParams
        }));
    };

    useKeyboardNavigation({
        currentPage,
        totalPages,
        onPrevPage: () => dispatch(setPage(currentPage - 1)),
        onNextPage: () => dispatch(setPage(currentPage + 1)),
        onFirstPage: () => dispatch(setPage(1)),
        onLastPage: () => dispatch(setPage(totalPages))
    });

    const handlePageChange = (page: number) => {
        dispatch(setPage(page));
    };

    const handleSearch = (newParams: typeof searchParams) => {
        dispatch(setSearchParams(newParams));
    };

    const handleClearSearch = () => {
        dispatch(clearSearchParams());
    };

    if (loading && templates.length === 0) {
        return (
            <section className={cl.Section}>
                <div className={cl.Loading}>Завантаження...</div>
            </section>
        );
    }

    return (
        <section className={cl.Section}>
            <div className={cl.Control}>
                <div className={cl.Option}>
                    <NavLink to="create">
                        <i className="fa-solid fa-plus"></i>
                    </NavLink>
                    <h4 className={cl.Header}>Створюйте шаблони</h4>
                    <p className={cl.Description}>
                        Створюйте власні шаблони за допомогою зручного онлайн-редактору
                    </p>
                </div>
                <div className={cl.Option}>
                    <NavLink to="upload">
                        <i className="fa-solid fa-arrow-up-from-bracket"></i>
                    </NavLink>
                    <h4 className={cl.Header}>Завантажуйте шаблони</h4>
                    <p className={cl.Description}>
                        Завантажуйте власні шаблони з локального сховища
                    </p>
                </div>
            </div>

            <SearchBar
                onSearch={handleSearch}
                onClear={handleClearSearch}
                initialParams={searchParams}
                templateTypes={templateTypes}
                isLoading={loading}
            />

            {error && (
                <div className={cl.Error}>
                    {error}
                    <Button
                        onClick={loadTemplates}
                        text='Повторити'
                    />
                </div>
            )}

            <div className={cl.Templates}>
                {templates.length === 0 ? (
                    <div className={cl.EmptyState}>
                        <i className="fa-solid fa-file-circle-question"></i>
                        <h3>Шаблонів не знайдено</h3>
                        <p>Створіть перший шаблон або змініть параметри пошуку</p>
                    </div>
                ) : (
                    <TemplateList templates={templates} />
                )}
            </div>

            {totalPages > 1 && templates.length > 0 && (
                <div className={cl.PaginationContainer}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </section>
    );
}