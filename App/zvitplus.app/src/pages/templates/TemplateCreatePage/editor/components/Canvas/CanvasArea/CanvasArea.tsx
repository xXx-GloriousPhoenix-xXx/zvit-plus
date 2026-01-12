import type { CanvasProps } from '../Canvas';
import cl from '../Canvas.module.css';

interface CanvasAreaProps extends Pick<CanvasProps, 
  'handleDragMove' | 
  'handleResizeMove' | 
  'handleDragEnd' | 
  'handleResizeEnd' |
  'canvasRef'
> {
  children: React.ReactNode;
}

export function CanvasArea({
  handleDragMove,
  handleResizeMove,
  handleDragEnd,
  handleResizeEnd,
  canvasRef,
  children
}: CanvasAreaProps) {
  
  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e);
    handleResizeMove(e);
  };
  
  const handleMouseUp = () => {
    handleDragEnd();
    handleResizeEnd();
  };

  return (
    <div 
      className={cl.CanvasArea}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className={cl.Canvas} ref={canvasRef}>
        {children}
      </div>
    </div>
  );
}