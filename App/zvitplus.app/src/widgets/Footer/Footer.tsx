import cl from "./Footer.module.css";

export function Footer() {
    return (
        <footer className={cl.Footer}>
            <div className={cl.Container}>
                <div className={cl.Content}>
                    <div className={cl.SubContent}>
                        {/* About */}
                        <div className={cl.Section}>
                            <h4 className={cl.Title}>Звіт+</h4>
                            <p className={cl.Text}>
                                Онлайн-сервіс для створення, збереження та управління звітами.
                            </p>

                            <div className={cl.Socials}>
                                <a href="#"><i className="fab fa-facebook-f"></i></a>
                                <a href="#"><i className="fab fa-instagram"></i></a>
                                <a href="#"><i className="fab fa-twitter"></i></a>
                                <a href="#"><i className="fab fa-telegram"></i></a>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className={cl.Section}>
                            <h4 className={cl.Title}>Навігація</h4>
                            <ul className={cl.Links}>
                                <li><a href="/"><i className="fas fa-home"></i>Головна</a></li>
                                <li><a href="/discovery"><i className="fas fa-search"></i>Пошук</a></li>
                                <li><a href="/my-works"><i className="fas fa-folder-open"></i>Мої роботи</a></li>
                                <li><a href="/about"><i className="fas fa-info-circle"></i>Про сервіс</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className={cl.SubContent}>
                        {/* Contacts */}
                        <div className={cl.Section}>
                            <h4 className={cl.Title}>Контакти</h4>
                            <ul className={cl.Contacts}>
                                <li><i className="fas fa-map-marker-alt"></i>м. Краматорськ</li>
                                <li><i className="fas fa-phone"></i>+38 (066) 123-45-67</li>
                                <li><i className="fas fa-envelope"></i>support@zvitplus.com</li>
                                <li><i className="fas fa-clock"></i>Пн-Нд: 9:00 – 21:00</li>
                            </ul>
                        </div>

                        {/* Useful links */}
                        <div className={cl.Section}>
                            <h4 className={cl.Title}>Корисні посилання</h4>
                            <ul className={cl.Links}>
                                <li><a href="/faq"><i className="fas fa-question-circle"></i>Часті питання (FAQ)</a></li>
                                <li><a href="/tutorials"><i className="fas fa-book"></i>Інструкції та гайди</a></li>
                                <li><a href="/blog"><i className="fas fa-newspaper"></i>Блог про звітність</a></li>
                                <li><a href="/tools"><i className="fas fa-tools"></i>Корисні інструменти</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className={cl.BottomSplit}/>
                <div className={cl.Bottom}>
                    <span>© 2026 Звіт+. Всі права захищені.</span>
                    <div className={cl.BottomLinks}>
                        <a href="#">Політика конфіденційності</a> |
                        <a href="#">Умови використання</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
