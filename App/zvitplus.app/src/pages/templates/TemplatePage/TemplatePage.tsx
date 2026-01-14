// pages/templates/TemplatePage.tsx
import { useCallback, useEffect } from 'react';
import cl from './TemplatePage.module.css';
import { NavLink } from 'react-router-dom';
import { TemplateList } from '@/shared/ui/TemplateList/TemplateList.tsx';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setPage } from '@/shared/api/templates/templatesGetSlice';
import { getTemplates } from '@/shared/api/templates/getTemplatesThunk';
import { Button } from '@/shared/ui/Button/Button';
import { Pagination } from '@/shared/ui/Pagination/Pagination';

export function TemplatePage() {
    const dispatch = useAppDispatch();
    const { 
        items: templates, 
        loading, 
        error,
        currentPage, 
        totalPages, 
        searchParams 
    } = useAppSelector(state => state.templatesGet);
    
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

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const activeElement = document.activeElement;
        const isInput = activeElement?.tagName === 'INPUT' || 
                       activeElement?.tagName === 'TEXTAREA' || 
                       activeElement?.hasAttribute('contenteditable');
        
        if (isInput) return;
        
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                if (currentPage > 1) {
                    dispatch(setPage(currentPage - 1));
                }
                break;
                
            case 'ArrowRight':
                e.preventDefault();
                if (currentPage < totalPages) {
                    dispatch(setPage(currentPage + 1));
                }
                break;
                
            case 'Home':
                e.preventDefault();
                if (currentPage !== 1) {
                    dispatch(setPage(1));
                }
                break;
                
            case 'End':
                e.preventDefault();
                if (currentPage !== totalPages) {
                    dispatch(setPage(totalPages));
                }
                break;
        }
    }, [currentPage, totalPages, dispatch]);
    
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    const handlePageChange = (page: number) => {
        dispatch(setPage(page));
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

            {totalPages > 1 && (
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