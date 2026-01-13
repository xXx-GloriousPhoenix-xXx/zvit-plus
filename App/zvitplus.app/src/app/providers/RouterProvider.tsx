import { RouterProvider as ReactRouterProvider } from 'react-router-dom';
import { router } from '../router/router';
import { useEffect } from 'react';
import { initAuth } from '@/shared/api/auth/authSlice';
import { useAppDispatch } from '../store/hooks';

export function RouterProvider() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(initAuth());
    }, [dispatch]);

    return <ReactRouterProvider router={router} />;
}
