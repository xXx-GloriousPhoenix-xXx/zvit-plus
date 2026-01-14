import { useRepEditorContext } from '@/app/context/RepEditorContext';
import cl from './Canvas.module.css';
import { CanvasArea } from './CanvasArea/CanvasArea';
import { CanvasHeader } from './CanvasHeader/CanvasHeader';
import { ElementRenderer } from './ElementRenderer/ElementRenderer';
import type { RepElement } from '@/shared/types/repEditorTypes';
import { useAppSelector } from '@/app/store/hooks';

export type CanvasProps = {
  handleDragStart: (e: React.MouseEvent<Element, MouseEvent>, element: RepElement, resizeHandleClass: string) => void;
  handleDragMove: (e: React.MouseEvent<Element, MouseEvent>) => void;
  handleDragEnd: () => void;

  handleResizeStart: (e: React.MouseEvent<Element, MouseEvent>, element: RepElement) => void;
  handleResizeMove: (e: React.MouseEvent<Element, MouseEvent>) => void;
  handleResizeEnd: () => void;

  setSelectedElement: (value: React.SetStateAction<RepElement | null>) => void;

  elements: RepElement[];
  selectedElement: RepElement | null;
  draggedElement: string | null;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export function Canvas() {
    const { rep, drag, resize, selectedElement, elements, draggedElement, canvasRef } = useRepEditorContext();
    const { orientation } = useAppSelector(tc => tc.templateCreate.meta)

  return (
    <div className={cl.CanvasContainer}>
      <CanvasHeader />
      
      <CanvasArea
        handleDragMove={drag.handleMouseMove}
        handleResizeMove={resize.handleResizeMove}
        handleDragEnd={drag.handleMouseUp}
        handleResizeEnd={resize.handleResizeEnd}
        canvasRef={canvasRef}
      >  
        <div className={cl.CanvasWrapper}
          style={{
            width: orientation === 'landscape' ? '1123px' : '794px',
            height: orientation === 'portrait' ? '1123px' : '794px',
            minWidth: orientation === 'landscape' ? '1123px' : '794px',
            minHeight: orientation === 'portrait' ? '1123px' : '794px'
          }}
        >
          {elements.map(el => (
            <ElementRenderer
              key={el.id}
              element={el}
              isSelected={selectedElement?.id === el.id}
              isDragged={draggedElement === el.id}
              onDragStart={(e) => drag.handleMouseDown(e, el, cl.ResizeHandle)}
              onResizeStart={(e) => resize.handleResizeStart(e, el)}
              onSelect={rep.setSelectedElement}
              resizeHandleClass={cl.ResizeHandle}
            />
          ))}
        </div>
      </CanvasArea>
    </div>
  );
}