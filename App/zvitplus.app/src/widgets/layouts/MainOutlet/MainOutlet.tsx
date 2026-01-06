import { Header } from "@/widgets/Header/Header";
import { Footer } from "@/widgets/Footer/Footer";
import { Outlet } from "react-router-dom";
import cl from "./MainOutlet.module.css";

export function MainOutlet() {
    return (
        <>
            <Header/>
            <main className={cl.Main}>
                <Outlet/>
            </main>
            <Footer/>
        </>
    );
}