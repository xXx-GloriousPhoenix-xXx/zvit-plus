import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import cl from './HomePage.module.css';
import { getStats } from '@/shared/api/stats/thunks';
import { useEffect } from 'react';
import { formatQuantity } from '@/shared/lib/utils/formatters';
import { HeaderLine } from '@/shared/ui/HeaderLine/HeaderLine';
import { NavLink } from 'react-router-dom';

export function HomePage() {
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        dispatch(getStats());
    }, [dispatch])

    const { 
        totalTemplates,
        totalReports,
        totalUsers
    } = useAppSelector(state => state.stats)

    return (
        <section className={cl.Wrapper}>
            <div className={cl.Intro}>
                <h2>Ласкаво просимо до застосунку Звіт+</h2>
                <p>
                    Беріть участь у розришенні нашого коммьюніті і створенні шаблонів для будь-яких потреб - як власних, так й інших користувачів, кому може знадоибитись ваш шаблон.
                    Створюйте шаблони за домогою нашого зручного редактору, або завантажуйте власні шаблони з вже існуючих у вашому локальному сховищі.
                    Створюйте звіти за допомогою створених шаблонів - вами, або іншими користувачами.
                </p>
            </div>
            <div className={cl.StatsRow}>
                <div className={cl.StatsItem}>
                    <div className={cl.Icon}>
                        {formatQuantity(totalTemplates)} <i className="fa-solid fa-file-circle-plus"></i>
                    </div>
                    <div className={cl.StatsDescription}>
                        <h2>Усього шаблонів</h2>
                        <p>Кількість шаблонів у нашому сховищі, які були створені за допомогою нашого редактору, а також завантажено з локального сховища користувачів</p>
                    </div>
                </div>
                <div className={cl.StatsItem}>
                    <div className={cl.Icon}>
                        {formatQuantity(totalReports)} <i className="fa-solid fa-file-circle-check"></i>
                    </div>
                    <div className={cl.StatsDescription}>
                        <h2>Усього звітів</h2>
                        <p>Кількість звітів, що були заповнені на основі створених користувачами шаблонів, а також завантажені з локального сховища</p>
                    </div>
                </div>
                <div className={cl.StatsItem}>
                    <div className={cl.Icon}>
                        {formatQuantity(totalUsers)} <i className="fa-solid fa-user"></i>
                    </div>
                    <div className={cl.StatsDescription}>
                        <h2>Усього користувачів</h2>
                        <p>Кількість зареєстрованих користувачів, які користуються нашим застосунком і розширують перелік шаблонів</p>
                    </div>
                </div>
            </div>

            <HeaderLine>Шаблони</HeaderLine>
            <div className={cl.Control}>
                <div className={cl.Option}>
                    <NavLink to="/templates/create">
                        <i className="fa-solid fa-plus"></i>
                    </NavLink>
                    <h4 className={cl.Header}>Створюйте шаблони</h4>
                    <p className={cl.Description}>
                        Створюйте власні шаблони за допомогою зручного онлайн-редактору
                    </p>
                </div>
                <div className={cl.Option}>
                    <NavLink to="/templates/upload">
                        <i className="fa-solid fa-arrow-up-from-bracket"></i>
                    </NavLink>
                    <h4 className={cl.Header}>Завантажуйте шаблони</h4>
                    <p className={cl.Description}>
                        Завантажуйте власні шаблони з локального сховища
                    </p>
                </div>
            </div>

            <HeaderLine>Звіти</HeaderLine>
            <div className={cl.Control}>
                <div className={cl.Option}>
                    <NavLink to="/templates">
                        <i className="fa-solid fa-pen-to-square"></i>
                    </NavLink>
                    <h4 className={cl.Header}>Створюйте звіти</h4>
                    <p className={cl.Description}>Оберіть шаблон з переліку існуючих і створіть з його допогомогою звіт</p>
                </div>
                <div className={cl.Option}>
                    <NavLink to="/reports/upload">
                        <i className="fa-solid fa-arrow-up-from-bracket"></i>
                    </NavLink>
                    <h4 className={cl.Header}>Завантажуйте звіти</h4>
                    <p className={cl.Description}>Завантажуйте власні звіти з локального сховища</p>
                </div>
            </div>
        </section>
    );
}