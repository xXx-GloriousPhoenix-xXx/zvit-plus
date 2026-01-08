import cl from './TemplatePage.module.css';

import { NavLink } from 'react-router-dom';
import { TemplateList } from '@/shared/ui/TemplateList/TemplateList.tsx';

export function TemplatePage() {
    const templates = [
        { data: "Шаблон 1" },
        { data: "Шаблон 2" },
        { data: "Шаблон 3" },
        { data: "Шаблон 4" },
        { data: "Шаблон 5" }
    ];

    return (
        <section className={cl.Section}>
            <div className={cl.Control}>
                <div className={cl.Option}>
                    <NavLink to={"create"}>
                        <i className="fa-solid fa-plus"></i>
                    </NavLink>
                    <h4 className={cl.Header}>Створюйте шаблони</h4>
                    <p className={cl.Description}>Створюйте власні шаблони за допомогою зручного онлайн-редактору</p>
                </div>
                <div className={cl.Option}>
                    <NavLink to={"upload"}>
                        <i className="fa-solid fa-arrow-up-from-bracket"></i>
                    </NavLink>
                    <h4 className={cl.Header}>Завантажуйте шаблони</h4>
                    <p className={cl.Description}>Завантажуйте власні шаблони з локального сховища</p>
                </div>
            </div>
            <div className={cl.Templates}>
                <TemplateList templates={templates}/>
            </div>
        </section>
    );
}