import cl from './ReportCard.module.css';
import { formatFileSize, formatDate } from '@/shared/utils/formatters';
import type { ReportItemDTO } from '@/shared/api/reports/reportModels';
import { A } from '../A/A';
import { useCardActions } from '@/shared/hooks/useCardActions';
import { useNavigate } from 'react-router-dom';

interface ReportCardProps {
    report: ReportItemDTO;
    interactive?: boolean;
}

export function ReportCard({ report, interactive = false }: ReportCardProps) {
    const {
        handleView,
        handleEdit,
        handleDelete
    } = useCardActions({ type: 'report', id: report.id });

    const navigate = useNavigate();
    
    return (
        <div className={cl.Wrapper}>
            <div className={cl.CardHeader}>
                <h4 className={cl.Title}>{report.name}</h4>
                {report.isPrivate && (
                    <span className={cl.PrivateBadge}>
                        <i className="fa-solid fa-lock"></i>
                    </span>
                )}
            </div>
            
            <div className={cl.CardBody}>
                <div className={cl.Data}>
                    <div className={`${cl.InfoRow} ${cl.Author}`} onClick={() => navigate(`/profiles/${report.author}`)}>
                        <i className="fa-solid fa-user"></i>
                        <span>{report.author}</span>
                    </div>
                    <div className={cl.InfoRow}>
                        <i className="fa-solid fa-tag"></i>
                        <span>{report.templateType}</span>
                    </div>
                    <div className={cl.InfoRow}>
                        <i className="fa-solid fa-file"></i>
                        <span>{formatFileSize(report.fileSize)}</span>
                    </div>
                    <div className={cl.InfoRow}>
                        <i className="fa-solid fa-calendar"></i>
                        <span>{formatDate(report.createdAt)}</span>
                    </div>
                    <div className={cl.InfoRow}>
                        <i className="fa-solid fa-arrows-rotate"></i>
                        <span>{formatDate(report.updatedAt)}</span>
                    </div>
                </div>
                <div className={cl.IconPanel}>
                    <A onClick={handleView}>
                        <i className="fa-solid fa-eye"></i> Переглянути
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