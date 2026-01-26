import cl from "./RegisterPage.module.css";

import { Input } from "@/shared/ui/Input/Input";
import { Form } from "@/shared/ui/Form/Form";
import { useAppDispatch } from "@/app/store/hooks";
import { registerUser } from "@/shared/api/auth/authSlice";
import { useNavigate } from "react-router-dom";

export function RegisterPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    return (
        <section className={cl.Section}>
            <Form    
                extraClassName={cl.Form}
                method="register"
                onSubmit={(data) => {
                    console.log(data.email);
                    console.log(data.login);
                    console.log(data.password);
                    dispatch(registerUser(data));
                    navigate('/login');
                }}
            >
                <Input
                    label="Логін"
                    name="login"
                />

                <Input
                    label="Пошта"
                    name="email"
                    type="email"
                />

                <Input
                    label="Пароль"
                    name="password"
                    type="password"
                />
            </Form>
        </section>
    );
}
