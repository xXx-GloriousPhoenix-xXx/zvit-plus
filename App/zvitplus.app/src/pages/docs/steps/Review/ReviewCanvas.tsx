// components/ReviewCanvas.tsx
import type { RepElement, RepTemplate } from "@/shared/types/repEditorTypes";
import { ELEMENT_COLORS } from "@/shared/constants/editor";
import { BarChart3, Image } from "lucide-react";
import cl from './ReviewCanvas.module.css';
import { ReviewTableContent } from "./ReviewTableContent";
import type React from "react";
import { ChartContent } from "../../editor/components/Canvas/ElementRenderer/ChartContent";
import { useAppSelector } from "@/app/store/hooks";

interface ReviewCanvasProps {
    template: RepTemplate;
    canvasRef: React.RefObject<HTMLDivElement | null>;
}

export function ReviewCanvas({ template, canvasRef }: ReviewCanvasProps) {
    const { elements, meta } = template;
    
    const files = useAppSelector(state => state.docs.reports.current.files);
    
    const mediaFiles = files?.mediaFiles || {};
    const dataFiles = files?.dataFiles || {};

    const canvasStyle: React.CSSProperties = {
        width: meta.orientation === 'landscape' ? '1123px' : '794px',
        height: meta.orientation === 'portrait' ? '1123px' : '794px',
        backgroundColor: 'white',
        position: 'relative',
        margin: '0 auto',
        overflow: 'hidden'
    };

    return (
        <div className={cl.ReviewCanvasWrapper}>
            <div className={cl.ReviewCanvas} style={canvasStyle} ref={canvasRef}>
                {elements.map(element => (
                    <ReviewElement
                        key={element.id}
                        element={element}
                        mediaFiles={mediaFiles}
                        dataFiles={dataFiles}
                    />
                ))}
            </div>
            
            <div className={cl.TemplateInfo}>
                <h3>Інформація про шаблон</h3>
                <div className={cl.InfoGrid}>
                    <div className={cl.InfoItem}>
                        <span className={cl.InfoLabel}>Назва:</span>
                        <span className={cl.InfoValue}>{meta.templateName}</span>
                    </div>
                    <div className={cl.InfoItem}>
                        <span className={cl.InfoLabel}>Тип:</span>
                        <span className={cl.InfoValue}>{meta.templateTypeName}</span>
                    </div>
                    <div className={cl.InfoItem}>
                        <span className={cl.InfoLabel}>Розмір:</span>
                        <span className={cl.InfoValue}>{meta.pageSize}</span>
                    </div>
                    <div className={cl.InfoItem}>
                        <span className={cl.InfoLabel}>Орієнтація:</span>
                        <span className={cl.InfoValue}>
                            {meta.orientation === 'portrait' ? 'Портретна' : 'Альбомна'}
                        </span>
                    </div>
                    <div className={cl.InfoItem}>
                        <span className={cl.InfoLabel}>Приватний:</span>
                        <span className={cl.InfoValue}>
                            {meta.isPrivate ? 'Так' : 'Ні'}
                        </span>
                    </div>
                    <div className={cl.InfoItem}>
                        <span className={cl.InfoLabel}>Елементів:</span>
                        <span className={cl.InfoValue}>{elements.length}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ReviewElementProps {
    element: RepElement;
    mediaFiles: Record<string, File>;
    dataFiles: Record<string, File>;
}

function ReviewElement({ element, mediaFiles, dataFiles }: ReviewElementProps) {
    const renderContent = () => {
        switch (element.type) {
            case 'text':
                return (
                    <div 
                        style={{
                            fontSize: element.payload.fontSize,
                            fontWeight: element.payload.fontWeight,
                            color: element.payload.color,
                            textAlign: element.payload.align,
                        }}
                        className={cl.TextContent}
                    >
                        {element.payload.text || 'Порожній текст'}
                    </div>
                );
            case 'image':
                const imageFile = mediaFiles[element.id];
                if (imageFile) {
                    const imageUrl = URL.createObjectURL(mediaFiles[element.id]);
                    return (
                        <div className={cl.ImageContainer}>
                            <img 
                                src={imageUrl} 
                                alt={element.payload.alt || "Зображення"} 
                                className={cl.ImageContent}
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>
                    );
                } else {
                    return (
                        <div className={cl.PlaceholderIcon}>
                            <Image size={32} />
                            <div className={cl.ImageLabel}>
                                {element.mode === 'dynamic' ? '[Завантажте зображення]' : 'Зображення'}
                            </div>
                        </div>
                    );
                }
            case 'chart':
                const file = dataFiles[element.id]; //|| element.payload.dataSource;
                const chartType = element.payload.chartType || 'bar';
                const chartTitle = element.payload.title || 'Діаграма';
                if (file) {
                    return (
                        <ChartContent
                                isReport={true}
                                file={file}
                                chartType={chartType}
                            />
                    );
                } else {
                    return (
                        <div className={cl.PlaceholderIcon}>
                            <BarChart3 size={32} />
                            <div className={cl.ChartLabel}>
                                {element.mode === 'dynamic' ? '[Завантажте дані]' : chartTitle}
                            </div>
                            {element.payload.chartType && (
                                <div className={cl.ChartTypeHint}>
                                    {element.payload.chartType === 'bar' ? 'Стовпчаста' : 
                                     element.payload.chartType === 'line' ? 'Лінійна' : 
                                     element.payload.chartType === 'pie' ? 'Кругова' : 'Діаграма'}
                                </div>
                            )}
                        </div>
                    );
                }
            case 'table':
                return <ReviewTableContent element={element} />;
            default:
                return null;
        }
    };

    const { workMode } = useAppSelector(state => state.docs.editor);
    const isReportViewing = workMode === 'report';

    const elementStyle: React.CSSProperties = {
        position: 'absolute',
        left: `${element.position.x}px`,
        top: `${element.position.y}px`,
        width: `${element.size.width}px`,
        height: `${element.size.height}px`,
        backgroundColor: isReportViewing ? 'transparent' : ELEMENT_COLORS[element.type],
        border: isReportViewing ? 'none' : '0.05rem solid #ddd',
        borderRadius: 'var(--border-radius)',
        boxShadow: isReportViewing ? 'none' : 'var(--shadow)',
        overflow: 'hidden'
    };

    return (
        <div style={elementStyle} className={cl.Element}>
            <div className={cl.ElementContent}>
                {renderContent()}
            </div>
        </div>
    );
}