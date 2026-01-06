import { NavLink, useNavigate } from "react-router-dom";
import { authNav, mainNav } from "@/shared/config/navigation";

import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { clearAuth, logoutUser } from "@/shared/api/auth/authSlice";
import { Button } from "@/shared/ui/Button/Button";

import cl from './Header.module.css';

export function Header() {
    const { accessToken, refreshToken } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    function handleLogout() {
        if (refreshToken && accessToken) {
            dispatch(logoutUser({ refreshToken, accessToken }))
                .finally(() => {
                    dispatch(clearAuth());
                    navigate("/login");
                });
        }
    }

    return (
        <header className={cl.Header}>
            <nav className={cl.Navbar}>
                <div className={cl.Logo}>
                    <h1>Звіт+</h1>
                </div>
                <div className={cl.Tabs}>
                    {mainNav.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                isActive ? cl.active : undefined
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
                <div className={cl.Auth}>
                    {
                        accessToken
                        ? <Button
                            text="Вийти"
                            onClick={handleLogout}
                        />
                        : authNav.map(item => (
                            <NavLink key={item.path} to={item.path}>
                                {item.label}
                            </NavLink>
                        ))
                    }
                </div>
            </nav>
        </header>
    );
}