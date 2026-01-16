import cl from "./LoginPage.module.css";

import { Input } from "@/shared/ui/Input/Input";
import { Form } from "@/shared/ui/Form/Form";
import { Button } from "@/shared/ui/Button/Button";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { loginUser } from "@/shared/api/auth/authSlice";
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
    const dispatch = useAppDispatch();
    const { loading, error, accessToken } = useAppSelector(state => state.auth);
    const navigate = useNavigate();

    // Test
    type TestUser = { identifier: string; password: string; }
    const identifierRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const dataDictionary: Record<number, TestUser> = {
        0: { identifier: "admin", password: "#adminA1" },
        1: { identifier: "mod1", password: "#modB1" },
        2: { identifier: "user1", password: "#userC1" }
    }
    function fillTestData(mode: number) {
        if (identifierRef.current && passwordRef.current) {
            const data = dataDictionary[mode];
            identifierRef.current.value = data.identifier;
            passwordRef.current.value = data.password;
        }
    }
    useEffect(() => {
        if (accessToken) {
            navigate("/home");
        }
    }, [accessToken, navigate]);
    // ----

    return (
        <section className={cl.Section}>
            <Form
                extraClassName={cl.Form}
                method="login"
                onSubmit={(data) => {
                    dispatch(loginUser({
                        loginOrEmail: data.identifier,
                        password: data.password
                    }));
                }}
            >
                <Input
                    ref={identifierRef}
                    label="Логін або пошта"
                    name="identifier"
                    disabled={loading}
                />

                <Input
                    ref={passwordRef}
                    label="Пароль"
                    name="password"
                    type="password"
                    disabled={loading}
                />

                {error && <p className={cl.Error}>{error}</p>}
            </Form>
            <div className={cl.Test}>
                <Button text="admin" onClick={() => fillTestData(0)} />
                <Button text="mod" onClick={() => fillTestData(1)} />
                <Button text="user" onClick={() => fillTestData(2)} />
            </div>
        </section>
    );
}
