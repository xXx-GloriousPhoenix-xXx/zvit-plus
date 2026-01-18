// editor/components/CanvasArea/CanvasArea.tsx
import cl from '../Canvas.module.css';

interface CanvasAreaProps {
  handleDragMove: (e: React.MouseEvent) => void;
  handleResizeMove: (e: React.MouseEvent) => void;
  handleDragEnd: () => void;
  handleResizeEnd: () => void;
  children: React.ReactNode;
  readonly?: boolean;
}

export function CanvasArea({
  handleDragMove,
  handleResizeMove,
  handleDragEnd,
  handleResizeEnd,
  children,
  readonly = false
}: CanvasAreaProps) {
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!readonly) {
      handleDragMove(e);
      handleResizeMove(e);
    }
  };
  
  const handleMouseUp = () => {
    if (!readonly) {
      handleDragEnd();
      handleResizeEnd();
    }
  };

  return (
    <div 
      className={cl.CanvasArea}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: readonly ? 'default' : 'default' }}
    >
      <div className={cl.Canvas}>
        {children}
      </div>
    </div>
  );
}