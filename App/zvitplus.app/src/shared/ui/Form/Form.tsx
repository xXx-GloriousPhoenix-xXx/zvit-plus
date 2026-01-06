import type { ComponentPropsWithoutRef, FormEvent, ReactNode } from "react";

import { Button } from "../Button/Button";

import cl from "./Form.module.css";
import { Link } from "react-router-dom";

export type LoginFormData = {
    identifier: string;
    password: string;
};

export type RegisterFormData = {
    email: string;
    login: string;
    password: string;
};

type CommonProps = {
    children: ReactNode;
    extraClassName?: string;
} & Omit<ComponentPropsWithoutRef<"form">, "onSubmit">;

type FormProps = ({
        method: "login";
        onSubmit: (data: LoginFormData) => void;
    }
    | {
        method: "register";
        onSubmit: (data: RegisterFormData) => void;
    }) & CommonProps;

export function Form(props: FormProps) {
    const { method, onSubmit, children, extraClassName, ...rest } = props;
    const classes = [cl.Form, extraClassName]
        .filter(Boolean)
        .join(" ");

    const methodDictionary = {
        "login": {
            header: "Авторизація",
            hint: <p className={cl.Hint}>Немає облікового запису?&nbsp;<Link to="/register">Зареєструватись</Link></p>
        },
        "register": {
            header: "Реєстрація",
            hint: <p className={cl.Hint}>Вже маєте обліковий запис?&nbsp;<Link to="/login">Авторизуйтесь</Link></p>
        }
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        if (method === "login") {
            onSubmit({
                identifier: String(formData.get("identifier")),
                password: String(formData.get("password")),
            });
        }

        if (method === "register") {
            onSubmit({
                email: String(formData.get("email")),
                login: String(formData.get("login")),
                password: String(formData.get("password")),
            });
        }
    }

    return (
        <form
            className={classes}
            onSubmit={handleSubmit}
            {...rest}
        >
            <h2 className={cl.Header}>{methodDictionary[method].header}</h2>

            {children}

            <div>
                <Button 
                    extraClassName={cl.Button}
                    text="Увійти"
                />
                {methodDictionary[method].hint}
            </div>
        </form>
    );
}
