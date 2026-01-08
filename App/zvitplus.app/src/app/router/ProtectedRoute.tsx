import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks.ts";

export function ProtectedRoute() {
    const isAuth = useAppSelector(s => s.auth.isAuth);

    return isAuth
        ? <Outlet />
        : <Navigate to="/login" replace />;
}