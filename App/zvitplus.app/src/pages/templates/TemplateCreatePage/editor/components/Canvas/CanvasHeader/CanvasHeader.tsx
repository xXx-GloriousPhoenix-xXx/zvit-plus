import cl from './CanvasHeader.module.css';

export function CanvasHeader() {
    return (
        <div className={cl.Header}>
            <h1 className={cl.HeaderTitle}>Редактор шаблонів</h1>
        </div>
    );
}