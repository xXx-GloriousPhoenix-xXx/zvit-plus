// shared/ui/TemplateCard/TemplateCard.tsx
import type { TemplateItemDTO } from '@/shared/api/templates/templateModels';
import cl from './TemplateCard.module.css';
import { formatFileSize, formatDate } from '@/shared/utils/formatters';
import { A } from '../A/A';
import { useCardActions } from '@/shared/hooks/useCardActions';
import { useProfileActions } from '@/shared/hooks/useProfileActions';
import { useNavigate } from 'react-router-dom';

interface TemplateCardProps {
    template: TemplateItemDTO;
    interactive?: boolean;
}

export function TemplateCard({ template, interactive = false }: TemplateCardProps) {
    const {
        handleCreate,
        handleView,
        handleEdit,
        handleDelete
    } = useCardActions({ type: 'template', id: template.id });

    const navigate = useNavigate();

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
                    <div className={`${cl.InfoRow} ${cl.Author}`} onClick={() => navigate(`/profiles/${template.author}`)}>
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
                    <A onClick={handleView}>
                        <i className="fa-solid fa-eye"></i> Переглянути
                    </A>
                    <A onClick={handleCreate!}>
                        <i className="fas fa-edit"></i> Заповнити
                    </A>
                    {
                        interactive && (
                            <>
                                <A onClick={handleEdit}>
                                    <i className="fa-solid fa-screwdriver-wrench"></i> Редагувати
                                </A>
                                <A onClick={handleDelete}>
                                    <i className="fa-solid fa-trash-can"></i> Видалити
                                </A>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    );
}