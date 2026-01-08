import cl from './Template.module.css';

export type TemplateProps = {
    data: string;
}

export function Template({ data }: TemplateProps) {
    return (
        <div className={cl.Wrapper}>
            {data}
        </div>
    );
}