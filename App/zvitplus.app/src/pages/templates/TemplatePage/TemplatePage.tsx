import cl from './TemplatePage.module.css';

import { NavLink } from 'react-router-dom';

export function TemplatePage() {
    return (
        <section className={cl.Section}>
            <div>
                <div>
                    <NavLink to={"/create"}/>
                    a
                </div>
                <div>
                    <NavLink to={"/upload"}/>
                    b
                </div>
            </div>
        </section>
    );
}