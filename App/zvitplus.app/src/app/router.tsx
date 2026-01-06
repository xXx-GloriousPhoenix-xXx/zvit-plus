import { createBrowserRouter } from 'react-router-dom';

import { MainOutlet } from '@/widgets/layouts/MainOutlet/MainOutlet';
import { AuthOutlet } from '@/widgets/layouts/AuthOutlet/AuthOutlet';

import { LoginPage } from '@/pages/LoginPage/LoginPage.tsx';
import { RegisterPage } from '@/pages/RegisterPage/RegisterPage.tsx';

import { DiscoveryPage } from '@/pages/DiscoveryPage/DiscoveryPage.tsx';
import { MyWorkPage } from '@/pages/MyWorkPage/MyWorkPage.tsx';
import { TemplatePage } from '@/pages/templates/TemplatePage/TemplatePage';
import { ReportPage } from '@/pages/ReportPage/ReportPage.tsx';

import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage.tsx';
import { TemplateUploadPage } from '@/pages/templates/TemplateUploadPage/TemplateUploadPage';
import { TemplateCreatePage } from '@/pages/templates/TemplateCreatePage/TemplateCreatePage';
import { TemplateEditPage } from '@/pages/templates/TemplateEditPage/TemplateEditPage';
import { HomePage } from '@/pages/general/HomePage/HomePage';

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
            { path: "upload", element: <TemplateUploadPage /> },
            { path: "create", element: <TemplateCreatePage /> },
            { path: ":id/edit", element:
                <TemplateEditPage
                    mode="template"
                    id={id}
                    readonly={false}    
                /> },
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