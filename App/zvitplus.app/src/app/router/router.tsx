import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage/LoginPage.tsx';
import { DashboardPage } from '@/pages/DashboardPage/DashboardPage.tsx';
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage.tsx';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <DashboardPage />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
]);