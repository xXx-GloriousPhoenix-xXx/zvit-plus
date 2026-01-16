import { useAppSelector } from "@/app/store/hooks.ts";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedOutlet() {
    const { isAuth, initialized } = useAppSelector(s => s.auth);

    if (!initialized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return isAuth
        ? <Outlet />
        : <Navigate to="/login" replace />;
}