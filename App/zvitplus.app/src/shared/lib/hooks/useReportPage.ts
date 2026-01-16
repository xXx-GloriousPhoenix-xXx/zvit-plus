import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
    setPage,
    setSearchParams,
    clearSearchParams
} from "@/shared/api/reports/reportSlice";
import { getReports } from "@/shared/api/reports/reportThunks";
import { fetchTemplateTypes } from "@/shared/api/templateTypes/templateTypesSlice";
import { useEffect } from "react";
import { useKeyboardNavigation } from "./useKeyboardNavigation";

export function useReportPage() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchTemplateTypes());
    }, [dispatch])

    const { items: templateTypes } = useAppSelector(state => state.templateTypes);
    const { currentPage, searchParams, loading, error, items: reports, totalPages } = useAppSelector(state => state.reports.list)
    
    const handlePageChange = (page: number) => {
        dispatch(setPage(page));
    };

    const handleSearch = (newParams: typeof searchParams) => {
        dispatch(setSearchParams(newParams));
    };

    const handleClearSearch = () => {
        dispatch(clearSearchParams());
    };

    const loadReports = () => {
        dispatch(getReports({
            page: currentPage,
            itemsPerPage: 6,
            searchParams: searchParams
        }))
    }

    useEffect(() => {
        loadReports();
    }, [currentPage, searchParams]);

    useKeyboardNavigation({
        currentPage,
        totalPages,
        onPrevPage: () => dispatch(setPage(currentPage - 1)),
        onNextPage: () => dispatch(setPage(currentPage + 1)),
        onFirstPage: () => dispatch(setPage(1)),
        onLastPage: () => dispatch(setPage(totalPages))
    });

    return {
        currentPage,
        searchParams,
        templateTypes,
        isLoading: loading,
        error,
        onSearch: handleSearch,
        onClear: handleClearSearch,
        loadReports,
        onPageChange: handlePageChange,
        reports,
        totalPages
    }
}