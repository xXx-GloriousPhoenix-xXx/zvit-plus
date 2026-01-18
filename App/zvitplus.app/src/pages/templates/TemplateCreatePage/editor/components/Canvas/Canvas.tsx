// editor/components/Canvas/Canvas.tsx
import { useRepEditorContext } from '@/app/context/RepEditorContext';
import cl from './Canvas.module.css';
import { CanvasArea } from './CanvasArea/CanvasArea';
import { CanvasHeader } from './CanvasHeader/CanvasHeader';
import { ElementRenderer } from './ElementRenderer/ElementRenderer';
import { useAppSelector } from '@/app/store/hooks';

interface CanvasProps {
  mode?: 'template' | 'report';
  readonly?: boolean;
}

export function Canvas({ mode = 'template', readonly = false }: CanvasProps) {
  console.log('🎨 Canvas - рендеринг', { mode, readonly });
  
  const { rep, drag, resize, selectedElement, elements, draggedElement, canvasRef } = useRepEditorContext();
  const { editor } = useAppSelector(state => state.docs);
  const orientation = editor.meta.orientation;

  console.log('📊 Canvas - состояние контекста', {
    elementsCount: elements.length,
    selectedElementId: selectedElement?.id || 'нет',
    draggedElementId: draggedElement || 'нет',
    orientation,
    canvasRefExists: !!canvasRef.current
  });

  const handleElementSelect = (element: any) => {
    console.log('🎯 Canvas - выбор элемента', { elementId: element.id });
    rep.setSelectedElement(element);
  };

  const handleDragStart = (e: React.MouseEvent, element: any) => {
    console.log('🚀 Canvas - начало перетаскивания', { 
      elementId: element.id,
    });
    drag.handleMouseDown(e, element);
  };

  const handleResizeStart = (e: React.MouseEvent, element: any) => {
    console.log('📏 Canvas - начало ресайза', { elementId: element.id });
    resize.handleResizeStart(e, element);
  };

  return (
    <div className={cl.CanvasContainer}>
      <CanvasHeader />
      
      <CanvasArea
        handleDragMove={drag.handleMouseMove}
        handleResizeMove={resize.handleResizeMove}
        handleDragEnd={drag.handleMouseUp}
        handleResizeEnd={resize.handleResizeEnd}
        readonly={readonly}
      >  
        <div 
          className={cl.CanvasWrapper}
          style={{
            width: orientation === 'landscape' ? '1123px' : '794px',
            height: orientation === 'portrait' ? '1123px' : '794px',
            minWidth: orientation === 'landscape' ? '1123px' : '794px',
            minHeight: orientation === 'portrait' ? '1123px' : '794px'
          }}
          ref={canvasRef}
          data-canvas-ready="true"
        >
          {elements.length === 0 ? (
            <div className={cl.NoElementsMessage}>
              Немає елементів. Додайте елементи з бічної панелі.
            </div>
          ) : (
            elements.map(el => {
              console.log('🎨 Canvas - рендеринг элемента', {
                id: el.id,
                type: el.type,
                position: el.position
              });
              
              return (
                <ElementRenderer
                  key={el.id}
                  element={el}
                  isSelected={selectedElement?.id === el.id}
                  isDragged={draggedElement === el.id}
                  onDragStart={!readonly ? handleDragStart : undefined}
                  onResizeStart={!readonly ? handleResizeStart : undefined}
                  onSelect={!readonly ? handleElementSelect : undefined}
                  resizeHandleClass={cl.ResizeHandle}
                  readonly={readonly}
                  mode={mode}
                />
              );
            })
          )}
        </div>
      </CanvasArea>
    </div>
  );
}