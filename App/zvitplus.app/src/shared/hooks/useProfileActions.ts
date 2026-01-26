import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { useNavigate } from "react-router-dom";
import { fetchReportsPage, fetchTemplatesPage } from "../api/doc/thunks";
import { useEffect, useCallback } from "react";
import { setPage } from "../api/doc/slice";

type Props = {
    author: string;
}

export function useProfileActions(props: Props) {
    const { author } = props;

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { list: templates } = useAppSelector(state => state.docs.templates)
    const { list: reports } = useAppSelector(state => state.docs.reports)
    const { isAuth, loading } = useAppSelector(state => state.auth)

    const loadMyReports = useCallback(() => {
        if (isAuth) {
            dispatch(fetchReportsPage({
                page: reports.currentPage,
                pageSize: 9,
                searchParams: {
                    author: author
                }
            }));
        }
    }, [dispatch, isAuth, reports.currentPage, author]); 

    const loadMyTemplates = useCallback(() => {
        if (isAuth) {
            dispatch(fetchTemplatesPage({
                page: templates.currentPage,
                pageSize: 9,
                searchParams: {
                    author: author
                }
            }));
        }
    }, [dispatch, isAuth, templates.currentPage, author]);

    const handleBack = () => {
        navigate(-1);
    }

    useEffect(() => {
        if (isAuth) {
            loadMyTemplates();
            loadMyReports();
        }
    }, [dispatch, isAuth, loading, loadMyTemplates, loadMyReports]); 

    useEffect(() => {
        loadMyTemplates();
    }, [templates.currentPage, loadMyTemplates]);

    useEffect(() => {
        loadMyReports();
    }, [reports.currentPage, loadMyReports]);

    const handleTemplatePageChange = (page: number) => dispatch(setPage({ type: 'template', page }));
    const handleReportPageChange = (page: number) => dispatch(setPage({ type: 'report', page }));

    return {
        handleBack,
        handleReportPageChange,
        handleTemplatePageChange,
        templates,
        reports
    };
}