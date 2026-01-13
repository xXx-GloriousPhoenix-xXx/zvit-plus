import { createBrowserRouter } from 'react-router-dom';

import { MainOutlet } from '@/widgets/layouts/MainOutlet/MainOutlet';
import { AuthOutlet } from '@/widgets/layouts/AuthOutlet/AuthOutlet';

import { LoginPage } from '@/pages/auth/LoginPage/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage/RegisterPage';

import { DiscoveryPage } from '@/pages/general/DiscoveryPage/DiscoveryPage';
import { MyWorkPage } from '@/pages/general/MyWorkPage/MyWorkPage';
import { TemplatePage } from '@/pages/templates/TemplatePage/TemplatePage';
import { ReportPage } from '@/pages/reports/ReportPage/ReportPage';

import { NotFoundPage } from '@/pages/extra/NotFoundPage/NotFoundPage';
import { TemplateUploadPage } from '@/pages/templates/TemplateUploadPage/TemplateUploadPage';
import { TemplateCreatePage } from '@/pages/templates/TemplateCreatePage/TemplateCreatePage';
import { TemplateEditPage } from '@/pages/templates/TemplateEditPage/TemplateEditPage';
import { HomePage } from '@/pages/general/HomePage/HomePage';
import { ProtectedRoute } from '../../shared/components/ProtectedRoute';

export const router = createBrowserRouter([
    {
        element: <MainOutlet/>,
        children: [
            { path: "/", element: <HomePage/> },
            { path: "/discovery", element: <DiscoveryPage/> },
            { path: "/my-works", element: <MyWorkPage/> },
            { path: "/reports", element: <ReportPage/> },

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
                element: <ProtectedRoute />,
                children: [
                    { path: "upload", element: <TemplateUploadPage /> },
                    { path: "create", element: <TemplateCreatePage /> },
                    { path: ":id/edit", element:
                        <TemplateEditPage
                            mode="template"
                            readonly={false}    
                        /> }
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