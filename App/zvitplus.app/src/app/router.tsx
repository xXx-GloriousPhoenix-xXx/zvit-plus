import { createBrowserRouter } from 'react-router-dom';

// Outlet
import { MainOutlet } from '@/widgets/layouts/MainOutlet/MainOutlet';
import { AuthOutlet } from '@/widgets/layouts/AuthOutlet/AuthOutlet';

// Auth section components
import { LoginPage } from '@/pages/LoginPage/LoginPage.tsx';
import { RegisterPage } from '@/pages/RegisterPage/RegisterPage.tsx';

// Main section components
import { DiscoveryPage } from '@/pages/DiscoveryPage/DiscoveryPage.tsx';
import { MyWorkPage } from '@/pages/MyWorkPage/MyWorkPage.tsx';
import { TemplatePage } from '@/pages/TemplatePage/TemplatePage.tsx';
import { ReportPage } from '@/pages/ReportPage/ReportPage.tsx';

// Extra section components
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage.tsx';

export const router = createBrowserRouter([
    {
        element: <MainOutlet/>,
        children: [
            // { path: "/", element: <HomePage/> },
            { path: "/discovery", element: <DiscoveryPage/> },
            { path: "/my-works", element: <MyWorkPage/> },
            { path: "/templates", element: <TemplatePage/> },
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
    // { 
    //     Later: Admin Panel
    // },
    {
        path: '*',
        element: <NotFoundPage />,
    },
]);