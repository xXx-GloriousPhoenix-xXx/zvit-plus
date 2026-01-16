import { Navigate, createBrowserRouter } from 'react-router-dom';

import { MainOutlet } from '@/widgets/layouts/MainOutlet/MainOutlet';
import { AuthOutlet } from '@/widgets/layouts/AuthOutlet/AuthOutlet';

import { LoginPage } from '@/pages/auth/LoginPage/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage/RegisterPage';

import { MyWorkPage } from '@/pages/general/MyWorkPage/MyWorkPage';
import { TemplatePage } from '@/pages/templates/TemplatePage/TemplatePage';
import { ReportPage } from '@/pages/reports/ReportPage/ReportPage';

import { NotFoundPage } from '@/pages/extra/NotFoundPage/NotFoundPage';
import { TemplateCreatePage } from '@/pages/templates/TemplateCreatePage/TemplateCreatePage';
import { HomePage } from '@/pages/general/HomePage/HomePage';
import { ProtectedOutlet } from '@/widgets/layouts/ProtectedOutlet/ProtectedOutlet';
import { ReportCreatePage } from '@/pages/reports/ReportCreatePage/ReportCreatePage';
import { EditPage } from '@/pages/general/EditPage/EditPage';
import { UploadPage } from '@/pages/general/UploadPage/UploadPage';

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
            {
                element: <ProtectedOutlet />,
                children: [
                    { path: "upload", element: <UploadPage mode="template" /> },
                    { path: "create", element: <TemplateCreatePage /> },
                    { path: ":id", element: <EditPage mode="template" readonly={true} />},
                    { path: ":id/edit", element: <EditPage mode="template" readonly={false} /> }
                ]
            }
        ]
    },
    {
        path: "/reports",
        element: <MainOutlet/>,
        children: [
            { index: true, element: <ReportPage/> },
            {
                element: <ProtectedOutlet />,
                children: [
                    { path: "upload", element: <UploadPage mode="report" /> },
                    { path: "create", element: <ReportCreatePage /> },
                    { path: ":id", element: <EditPage mode="report" readonly={true} />},
                    { path: ":id/edit", element: <EditPage mode="report" readonly={false} /> }
                ]
            }
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