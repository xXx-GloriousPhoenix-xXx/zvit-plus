import { useState } from 'react';
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
    const [menuOpen, setMenuOpen] = useState(false);

    function handleLogout() {
        if (refreshToken && accessToken) {
            dispatch(logoutUser({ refreshToken, accessToken }))
                .finally(() => {
                    dispatch(clearAuth());
                    navigate("/login");
                });
        }
    }

    function closeMenu() {
        setMenuOpen(false);
    }

    return (
        <header className={cl.Header}>
            <nav className={cl.Navbar}>
                <div className={cl.Logo}>
                    <NavLink to="/" onClick={closeMenu}>
                        Звіт+
                    </NavLink>
                </div>

                {/* Burger */}
                <button
                    className={cl.Burger}
                    onClick={() => setMenuOpen(prev => !prev)}
                    aria-label="Toggle menu"
                >
                    <span />
                    <span />
                    <span />
                </button>

                {/* Navigation + Auth */}
                <div className={`${cl.Menu} ${menuOpen ? cl.Open : ''}`}>
                    <div className={cl.Tabs}>
                        {mainNav.map(item => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    isActive ? cl.active : undefined
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>

                    <div className={cl.Auth}>
                        {accessToken ? (
                            <Button
                                text="Вийти"
                                onClick={() => {
                                    handleLogout();
                                    closeMenu();
                                }}
                            />
                        ) : (
                            authNav.map(item => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={closeMenu}
                                >
                                    {item.label}
                                </NavLink>
                            ))
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}
