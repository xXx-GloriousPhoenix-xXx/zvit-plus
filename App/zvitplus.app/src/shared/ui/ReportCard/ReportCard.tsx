import cl from './ReportCard.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { formatFileSize, formatDate } from '@/shared/utils/formatters';
import type { ReportItemDTO } from '@/shared/api/reports/reportModels';
import { A } from '../A/A';
import { deleteReport } from '@/shared/api/doc/thunks';
import { useAppDispatch } from '@/app/store/hooks';

interface ReportCardProps {
    report: ReportItemDTO;
    interactive?: boolean;
}

export function ReportCard({ report, interactive = false }: ReportCardProps) {
    const dispatch = useAppDispatch();
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
                        to={`/reports/${report.id}`}
                        className={cl.ControlButton}
                    >
                        <i className="fa-solid fa-eye"></i> Переглянути
                    </NavLink>
                    {
                        interactive && (
                            <>
                                <A onClick={() => navigate(`/reports/${report.id}/edit`)}>
                                    <i className="fa-solid fa-screwdriver-wrench"></i> Редагувати
                                </A>
                                <A onClick={() => dispatch(deleteReport(report.id))}>
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