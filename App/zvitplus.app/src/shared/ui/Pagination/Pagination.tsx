// shared/ui/Pagination/Pagination.tsx
import cl from './Pagination.module.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    // Если всего 1 страница или меньше - не показываем пагинацию
    if (totalPages <= 1) {
        return null;
    }

    // Создаем массив страниц для отображения
    const getVisiblePages = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        // Всегда показываем первую страницу
        pages.push(1);
        
        // Показываем диапазон вокруг текущей страницы
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);
        
        // Расширяем диапазон если нужно
        while (endPage - startPage + 1 < maxVisiblePages - 2 && (startPage > 2 || endPage < totalPages - 1)) {
            if (startPage > 2) {
                startPage--;
            }
            if (endPage < totalPages - 1) {
                endPage++;
            }
        }
        
        // Добавляем пропуск если нужно
        if (startPage > 2) {
            pages.push('...');
        }
        
        // Добавляем страницы диапазона
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        // Добавляем пропуск если нужно
        if (endPage < totalPages - 1) {
            pages.push('...');
        }
        
        // Всегда показываем последнюю страницу
        if (totalPages > 1) {
            pages.push(totalPages);
        }
        
        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className={cl.Pagination}>
            {/* Кнопка "Назад" */}
            <button
                className={`${cl.PageButton} ${cl.PrevButton}`}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Попередня сторінка"
            >
                ←
            </button>
            
            {/* Номера страниц */}
            {visiblePages.map((page, index) => {
                if (page === '...') {
                    return (
                        <span key={`dots-${index}`} className={cl.Dots}>
                            ...
                        </span>
                    );
                }
                
                return (
                    <button
                        key={`page-${page}`}
                        className={`${cl.PageButton} ${currentPage === page ? cl.Active : ''}`}
                        onClick={() => onPageChange(page as number)}
                        aria-label={`Сторінка ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                    >
                        {page}
                    </button>
                );
            })}
            
            {/* Кнопка "Вперед" */}
            <button
                className={`${cl.PageButton} ${cl.NextButton}`}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Наступна сторінка"
            >
                →
            </button>
        </div>
    );
}