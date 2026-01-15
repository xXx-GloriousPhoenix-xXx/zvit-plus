import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchTemplateTypes } from "@/shared/api/templateTypes/templateTypesSlice";
import { useEffect } from "react";

export function useReportPage() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchTemplateTypes());
    }, [dispatch])

    const { items: templateTypes } = useAppSelector(state => state.templateTypes);
    
    const handleSearch = () => {

    }

    const handleClear = () => {

    }

    return {
        templateTypes,
        onSearch: handleSearch,
        onClear: handleClear
    }
}