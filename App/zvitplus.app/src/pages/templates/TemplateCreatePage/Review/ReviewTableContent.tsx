// components/ReviewTableContent.tsx
import type { TableElement } from "@/shared/types/repEditorTypes";
import cl from './ReviewCanvas.module.css';

interface ReviewTableContentProps {
    element: TableElement;
}

export function ReviewTableContent({ element }: ReviewTableContentProps) {
    const { columns = [], rows = [] } = element.payload;

    if (!columns.length) return null;

    const getCellStyles = (cell: any) => {
        const styles: React.CSSProperties = {};
        
        if (cell.fontSize) {
            styles.fontSize = `${cell.fontSize}px`;
        }
        
        if (cell.color) {
            styles.color = cell.color;
        }
        
        if (cell.align) {
            styles.justifyContent = (() => {
                switch(cell.align) {
                    case 'left': return 'flex-start';
                    case 'center': return 'center';
                    case 'right': return 'flex-end';
                    default: return 'flex-start';
                }
            })();
        }
        
        if (cell.fontWeight) {
            styles.fontWeight = cell.fontWeight;
        }

        if (cell.verticalAlign) {
            switch(cell.verticalAlign) {
                case 'top':
                    styles.display = 'flex';
                    styles.alignItems = 'flex-start';
                    break;
                case 'middle':
                    styles.display = 'flex';
                    styles.alignItems = 'center';
                    break;
                case 'bottom':
                    styles.display = 'flex';
                    styles.alignItems = 'flex-end';
                    break;
            }
        } else {
            styles.display = 'flex';
            styles.alignItems = 'center';
        }
        
        return styles;
    };

    return (
        <div
            className={cl.TablePreview}
            style={{ 
                display: "grid", 
                gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
                width: '100%',
                height: '100%'
            }}
        >
            {/* Header */}
            {columns.map((col, i) => {
                const cellStyles = getCellStyles(col);
                return (
                    <div 
                        key={`h-${i}`}
                        className={cl.TableHeaderCell}
                        style={cellStyles}
                    >
                        {col.text || `Заголовок ${i + 1}`}
                    </div>
                );
            })}

            {/* Body */}
            {rows.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    const cellStyles = getCellStyles(cell);
                    return (
                        <div
                            key={`c-${rowIndex}-${colIndex}`}
                            className={cl.TableCell}
                            style={cellStyles}
                        >
                            {cell?.text || `Клітинка ${rowIndex + 1}×${colIndex + 1}`}
                        </div>
                    );
                })
            )}
        </div>
    );
}