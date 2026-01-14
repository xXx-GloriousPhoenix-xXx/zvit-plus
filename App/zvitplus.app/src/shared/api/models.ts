export interface PagedResponse<T> {
    items: T[];
    currentPage: number;
    totalCount: number;
    totalPages: number;
}

