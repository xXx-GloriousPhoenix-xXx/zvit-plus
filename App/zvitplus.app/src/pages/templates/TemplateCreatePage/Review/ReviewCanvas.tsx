// components/ReviewCanvas.tsx
import type { RepElement, RepTemplate } from "@/shared/types/repEditorTypes";
import { ELEMENT_COLORS } from "@/shared/constants/editor";
import { BarChart3, Image } from "lucide-react";
import cl from './ReviewCanvas.module.css';
import { ReviewTableContent } from "./ReviewTableContent";
import type React from "react";

interface ReviewCanvasProps {
    template: RepTemplate;
    canvasRef: React.RefObject<HTMLDivElement | null>;
}

export function ReviewCanvas({ template, canvasRef }: ReviewCanvasProps) {
    const { elements, meta } = template;
    
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
}

function ReviewElement({ element }: ReviewElementProps) {
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
                            padding: '8px'
                        }}
                        className={cl.TextContent}
                    >
                        {element.payload.text || 'Порожній текст'}
                    </div>
                );
            case 'image':
                return (
                    <div className={cl.PlaceholderIcon}>
                        <Image size={32} />
                        <div className={cl.ImageLabel}>
                            {element.payload.alt || 'Зображення'}
                        </div>
                    </div>
                );
            case 'chart':
                return (
                    <div className={cl.PlaceholderIcon}>
                        <BarChart3 size={32} />
                        <div className={cl.ChartLabel}>
                            {element.payload.chartType || 'Графік'}
                        </div>
                    </div>
                );
            case 'table':
                return <ReviewTableContent element={element} />;
            default:
                return null;
        }
    };

    const elementStyle: React.CSSProperties = {
        position: 'absolute',
        left: `${element.position.x}px`,
        top: `${element.position.y}px`,
        width: `${element.size.width}px`,
        height: `${element.size.height}px`,
        backgroundColor: ELEMENT_COLORS[element.type] || '#f3f4f6',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        overflow: 'hidden'
    };

    return (
        <div style={elementStyle} className={cl.Element}>
            <div className={cl.ElementLabel}>
                {element.type} ({element.mode})
            </div>
            <div className={cl.ElementContent}>
                {renderContent()}
            </div>
        </div>
    );
}