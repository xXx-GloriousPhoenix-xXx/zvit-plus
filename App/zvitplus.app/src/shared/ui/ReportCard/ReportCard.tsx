import cl from './ReportCard.module.css';
import { NavLink } from 'react-router-dom';
import { formatFileSize, formatDate } from '@/shared/lib/utils/formatters';
import type { ReportItemDTO } from '@/shared/api/reports/reportModels';

interface ReportCardProps {
    report: ReportItemDTO;
}

export function ReportCard({ report }: ReportCardProps) {
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
                    <div className={cl.InfoRow}>
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
                    <NavLink 
                        to={`/templates/${report.id}`}
                        className={cl.ControlButton}
                    >
                        <i className="fa-solid fa-eye"></i> Переглянути
                    </NavLink>
                </div>
            </div>
        </div>
    );
}