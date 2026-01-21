import { Navigate, createBrowserRouter } from 'react-router-dom';

import { MainOutlet } from '@/widgets/layouts/MainOutlet/MainOutlet';
import { AuthOutlet } from '@/widgets/layouts/AuthOutlet/AuthOutlet';

import { LoginPage } from '@/pages/auth/LoginPage/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage/RegisterPage';

import { MyWorkPage } from '@/pages/general/MyWorkPage/MyWorkPage';
import { TemplatePage } from '@/pages/templates/TemplatePage/TemplatePage';
import { ReportPage } from '@/pages/reports/ReportPage/ReportPage';

import { NotFoundPage } from '@/pages/extra/NotFoundPage/NotFoundPage';
import { HomePage } from '@/pages/general/HomePage/HomePage';
import { ProtectedOutlet } from '@/widgets/layouts/ProtectedOutlet/ProtectedOutlet';
import { UploadPage } from '@/pages/general/UploadPage/UploadPage';
import { DocEditorPage } from '@/pages/docs/DocEditorPage';
import { ProfilePage } from '@/pages/general/ProfilePage/ProfilePage';

export const router = createBrowserRouter([
    {
        element: <MainOutlet/>,
        children: [
            { index: true, element: <Navigate to="/home" replace /> },
            { path: "/home", element: <HomePage/> },
            { path: "/my-works", element: <MyWorkPage/> },

            // { path: "/tutorials", element: <TutorialPage/> },
            // { path: "/faq", element: <FAQPage/> },
            // { path: "/blog", element: <BlogPage/> },
            // { path: "/tools", element: <ToolsPage/> },
        ]
    },
    {
        element: <AuthOutlet/>,
        children: [
            { path: "/login", element: <LoginPage/> },
            { path: "/register", element: <RegisterPage/> }            
        ]
    },
    {
        path: "/templates",
        element: <MainOutlet/>,
        children: [
            { index: true, element: <TemplatePage/> },
            { path: ":id", element: <DocEditorPage mode="view" type="template" /> },
            {
                element: <ProtectedOutlet />,
                children: [
                    { path: "upload", element: <UploadPage mode='template' /> },
                    { path: "create", element: <DocEditorPage mode="create" type="template" /> },
                    { path: ":id/edit", element: <DocEditorPage mode="edit" type="template" /> }
                ]
            }
        ]
    },
    {
        path: "/reports",
        element: <MainOutlet/>,
        children: [
            { index: true, element: <ReportPage/> },
            { path: ":id", element: <DocEditorPage mode="view" type="report" /> },
            {
                element: <ProtectedOutlet />,
                children: [
                    { path: "upload", element: <UploadPage mode="report" /> },
                    { path: "create", element: <DocEditorPage mode="create" type="report" /> },
                    { path: ":id/edit", element: <DocEditorPage mode="edit" type="report" /> }
                ]
            }
        ]
    },
    {
        path: "/profiles",
        element: <MainOutlet/>,
        children: [
            { index: true, element: <Navigate to="/my-works" replace /> },
            { path: ":login", element: <ProfilePage /> }
        ]
    },
    // { 
    //     Later: Admin Panel
    // },
    {
        path: '*',
        element: <NotFoundPage />,
    },
]);