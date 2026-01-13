// components/AuthInitializer.tsx
import { useEffect, type ReactNode } from 'react';
import { initAuth } from '@/shared/api/auth/authSlice';
import { useAppDispatch } from '@/app/store/hooks';

export function AuthInitializer({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(initAuth());
    }, [dispatch]);

    return <>{children}</>;
}