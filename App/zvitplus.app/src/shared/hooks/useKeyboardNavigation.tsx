// shared/hooks/useKeyboardNavigation.ts
import { useEffect, useCallback } from 'react';

interface UseKeyboardNavigationProps {
    currentPage: number;
    totalPages: number;
    onPrevPage: () => void;
    onNextPage: () => void;
    onFirstPage?: () => void;
    onLastPage?: () => void;
    disabled?: boolean;
}

export function useKeyboardNavigation({
    currentPage,
    totalPages,
    onPrevPage,
    onNextPage,
    onFirstPage,
    onLastPage,
    disabled = false
}: UseKeyboardNavigationProps) {
    
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (disabled) return;
        
        const activeElement = document.activeElement;
        const tagName = activeElement?.tagName;
        const isInput = tagName === 'INPUT' || 
                       tagName === 'TEXTAREA' || 
                       activeElement?.hasAttribute('contenteditable');
        
        if (isInput) return;
        
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                if (currentPage > 1) {
                    onPrevPage();
                }
                break;
                
            case 'ArrowRight':
                e.preventDefault();
                if (currentPage < totalPages) {
                    onNextPage();
                }
                break;
                
            case 'Home':
                if (onFirstPage) {
                    e.preventDefault();
                    onFirstPage();
                }
                break;
                
            case 'End':
                if (onLastPage) {
                    e.preventDefault();
                    onLastPage();
                }
                break;
        }
    }, [currentPage, totalPages, onPrevPage, onNextPage, onFirstPage, onLastPage, disabled]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);
}