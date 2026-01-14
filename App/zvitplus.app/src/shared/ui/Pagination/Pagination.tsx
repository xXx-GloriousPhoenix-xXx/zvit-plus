// shared/ui/Pagination/Pagination.tsx
import cl from './Pagination.module.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const getVisiblePages = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        pages.push(1);
        
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);
        
        while (endPage - startPage + 1 < maxVisiblePages - 2 && (startPage > 2 || endPage < totalPages - 1)) {
            if (startPage > 2) {
                startPage--;
            }
            if (endPage < totalPages - 1) {
                endPage++;
            }
        }
        
        if (startPage > 2) {
            pages.push('...');
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        if (endPage < totalPages - 1) {
            pages.push('...');
        }
        
        if (totalPages > 1) {
            pages.push(totalPages);
        }
        
        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className={cl.Pagination}>
            <button
                className={`${cl.PageButton} ${cl.PrevButton}`}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Попередня сторінка"
            >
                ←
            </button>
            
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