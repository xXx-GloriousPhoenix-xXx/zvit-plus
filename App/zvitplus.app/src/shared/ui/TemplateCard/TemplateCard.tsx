// shared/ui/TemplateCard/TemplateCard.tsx
import type { TemplateItemDTO } from '@/shared/api/templates/templateModels';
import cl from './TemplateCard.module.css';
import { NavLink } from 'react-router-dom';
import { formatFileSize, formatDate } from '@/shared/lib/utils/formatters';

interface TemplateCardProps {
    template: TemplateItemDTO;
}

export function TemplateCard({ template }: TemplateCardProps) {
    return (
        <div className={cl.Wrapper}>
            <div className={cl.CardHeader}>
                <h4 className={cl.Title}>{template.name}</h4>
                {template.isPrivate && (
                    <span className={cl.PrivateBadge}>
                        <i className="fa-solid fa-lock"></i>
                    </span>
                )}
            </div>
            
            <div className={cl.CardBody}>
                <div className={cl.Data}>
                    <div className={cl.InfoRow}>
                        <i className="fa-solid fa-user"></i>
                        <span>{template.author}</span>
                    </div>
                    <div className={cl.InfoRow}>
                        <i className="fa-solid fa-tag"></i>
                        <span>{template.templateType}</span>
                    </div>
                    <div className={cl.InfoRow}>
                        <i className="fa-solid fa-file"></i>
                        <span>{formatFileSize(template.fileSize)}</span>
                    </div>
                    <div className={cl.InfoRow}>
                        <i className="fa-solid fa-calendar"></i>
                        <span>{formatDate(template.createdAt)}</span>
                    </div>
                    <div className={cl.InfoRow}>
                        <i className="fa-solid fa-arrows-rotate"></i>
                        <span>{formatDate(template.updatedAt)}</span>
                    </div>
                </div>
                <div className={cl.IconPanel}>
                    <NavLink 
                        to={`/templates/${template.id}`}
                        className={cl.ControlButton}
                    >
                        <i className="fa-solid fa-eye"></i> Переглянути
                    </NavLink>
                </div>
            </div>
        </div>
    );
}