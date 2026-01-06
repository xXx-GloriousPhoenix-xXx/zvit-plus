import { Outlet } from "react-router-dom";
import cl from "./AuthOutlet.module.css";

export function AuthOutlet() {
    return (
        <main className={cl.Main}>
            <Outlet/>
        </main>
    );
}