import type { CanvasProps } from '../../types';
import cl from './Canvas.module.css';
import { CanvasArea } from './CanvasArea/CanvasArea';
import { CanvasHeader } from './CanvasHeader/CanvasHeader';
import { ElementRenderer } from './ElementRenderer/ElementRenderer';

export function Canvas({
  handleDragStart, handleDragMove, handleDragEnd,
  handleResizeStart, handleResizeMove, handleResizeEnd,
  setSelectedElement,
  selectedElement,
  draggedElement,
  elements,
  canvasRef
}: CanvasProps) {

  return (
    <div className={cl.CanvasContainer}>
      <CanvasHeader />
      
      <CanvasArea
        handleDragMove={handleDragMove}
        handleResizeMove={handleResizeMove}
        handleDragEnd={handleDragEnd}
        handleResizeEnd={handleResizeEnd}
        canvasRef={canvasRef}
      >
        {elements.map(el => (
          <ElementRenderer
            key={el.id}
            element={el}
            isSelected={selectedElement?.id === el.id}
            isDragged={draggedElement === el.id}
            onDragStart={(e) => handleDragStart(e, el, cl.ResizeHandle)}
            onResizeStart={(e) => handleResizeStart(e, el)}
            onSelect={setSelectedElement}
            resizeHandleClass={cl.ResizeHandle}
          />
        ))}
      </CanvasArea>
    </div>
  );
}