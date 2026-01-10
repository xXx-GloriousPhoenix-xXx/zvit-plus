// editor/RepEditor.tsx
import { useRef } from "react";
import { X, Type, Image, BarChart3, Table, Plus } from 'lucide-react';

import { ELEMENT_COLORS } from "@/shared/constants/editor";
import type { RepTemplate, AlignType, FontWeight, ChartType } from "./types";

import { useRepEditor } from "./hooks/useRepEditor";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import { useResize } from "./hooks/useResize";

import cl from "./RepEditor.module.css";

interface Props {
  template: RepTemplate;
  onChange: (t: RepTemplate) => void;
}

export function RepEditor({ template, onChange }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Основна логіка редактора з інтеграцією template та onChange
  const {
    elements,
    selectedElement,
    setSelectedElement,
    addElement,
    deleteElement,
    updateElement,
    updatePayload,
  } = useRepEditor({ template, onChange });

  // Логіка перетягування
  const {
    draggedElement,
    handleMouseDown: handleDragStart,
    handleMouseMove: handleDragMove,
    handleMouseUp: handleDragEnd,
  } = useDragAndDrop(canvasRef, updateElement);

  // Логіка зміни розміру
  const {
    resizingElement,
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd,
  } = useResize(canvasRef, updateElement);

  // Об'єднана обробка руху миші
  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e);
    handleResizeMove(e);
  };

  // Об'єднана обробка відпускання кнопки миші
  const handleMouseUp = () => {
    handleDragEnd();
    handleResizeEnd();
  };

  return (
    <div className={cl.Wrapper}>
      {/* Toolbar */}
      <div className={cl.Sidebar}>
        <h2 className={cl.SidebarTitle}>Елементи</h2>
        
        <div className={cl.ButtonList}>
          <button 
            onClick={() => addElement('text', 'static')} 
            className={`${cl.AddButton} ${cl.TextButton}`}
          >
            <Type size={18} />
            <span>Статичний текст</span>
          </button>
          
          <button 
            onClick={() => addElement('text', 'dynamic')} 
            className={`${cl.AddButton} ${cl.TextButton}`}
          >
            <Type size={18} />
            <span>Динамічний текст</span>
          </button>
          
          <button 
            onClick={() => addElement('image')} 
            className={`${cl.AddButton} ${cl.ImageButton}`}
          >
            <Image size={18} />
            <span>Зображення</span>
          </button>
          
          <button 
            onClick={() => addElement('chart')} 
            className={`${cl.AddButton} ${cl.ChartButton}`}
          >
            <BarChart3 size={18} />
            <span>Діаграма</span>
          </button>
          
          <button 
            onClick={() => addElement('table')} 
            className={`${cl.AddButton} ${cl.TableButton}`}
          >
            <Table size={18} />
            <span>Таблиця</span>
          </button>
        </div>

        {elements.length > 0 && (
          <>
            <h3 className={cl.ElementsListTitle}>Додані елементи:</h3>
            <div className={cl.ElementsList}>
              {elements.map(el => (
                <div
                  key={el.id}
                  onClick={() => setSelectedElement(el)}
                  className={`${cl.ElementItem} ${
                    selectedElement?.id === el.id ? cl.ElementItemActive : ''
                  }`}
                >
                  <span className={cl.ElementItemText}>
                    {el.type} ({el.mode})
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteElement(el.id);
                    }}
                    className={cl.DeleteButton}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Canvas */}
      <div className={cl.CanvasContainer}>
        <div className={cl.Header}>
          <h1 className={cl.HeaderTitle}>Редактор шаблонів</h1>
        </div>
        
        <div 
          className={cl.CanvasArea}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className={cl.Canvas}
            ref={canvasRef}
          >
            {elements.map(el => (
              <div
                key={el.id}
                onMouseDown={(e) => {
                  handleDragStart(e, el, cl.ResizeHandle);
                  setSelectedElement(el);
                }}
                style={{
                  position: 'absolute',
                  left: el.position.x,
                  top: el.position.y,
                  width: el.size.width,
                  height: el.size.height,
                  backgroundColor: ELEMENT_COLORS[el.type],
                  border: selectedElement?.id === el.id 
                    ? '2px solid #3b82f6' 
                    : '2px dashed #d1d5db',
                  cursor: draggedElement === el.id ? 'grabbing' : 'grab',
                  borderRadius: '4px',
                }}
                className={cl.Element}
              >
                <div className={cl.ElementLabel}>
                  {el.type} {el.mode === 'static' && '(статичний)'}
                </div>
                
                <div className={cl.ElementContent}>
                  {el.type === 'text' && (
                    <div 
                      style={{
                        fontSize: el.payload.fontSize,
                        fontWeight: el.payload.fontWeight,
                        color: el.payload.color,
                        textAlign: el.payload.align
                      }}
                      className={cl.TextContent}
                    >
                      {el.payload.text || 'Порожній текст'}
                    </div>
                  )}
                  
                  {el.type === 'image' && (
                    <div className={cl.PlaceholderIcon}>
                      <Image size={32} />
                    </div>
                  )}
                  
                  {el.type === 'chart' && (
                    <div className={cl.PlaceholderIcon}>
                      <BarChart3 size={32} />
                    </div>
                  )}
                  
                  {el.type === 'table' && (
  <div className={cl.TablePreview}>
    {/* Заголовок */}
    <div className={cl.TableHeader}>
      {el.payload.columns?.map((col, i) => (
        <div key={i} className={cl.TableHeaderCell}>
          {col}
        </div>
      ))}
    </div>

    {/* Строки */}
    <div className={cl.TableBody}>
      {el.payload.rows?.map((row, rowIndex) => (
        <div key={rowIndex} className={cl.TableRow}>
          {row.map((cell, cellIndex) => (
            <div key={cellIndex} className={cl.TableCell}>
              {cell || ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
)}
                </div>

                {selectedElement?.id === el.id && (
                  <div
                    className={cl.ResizeHandle}
                    onMouseDown={(e) => handleResizeStart(e, el)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      {selectedElement && (
        <div className={cl.PropertiesPanel}>
          <div className={cl.PropertiesHeader}>
            <h2 className={cl.PropertiesTitle}>Властивості</h2>
            <button 
              onClick={() => deleteElement(selectedElement.id)} 
              className={cl.DeleteButton}
            >
              <X size={20} />
            </button>
          </div>

          <div className={cl.PropertiesContent}>
            <div className={cl.PropertyGroup}>
              <label className={cl.PropertyLabel}>Тип</label>
              <div className={cl.PropertyValue}>
                {selectedElement.type} ({selectedElement.mode})
              </div>
            </div>

            <div className={cl.PropertyRow}>
              <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>X</label>
                <input
                  type="number"
                  value={Math.round(selectedElement.position.x)}
                  onChange={(e) => updateElement(selectedElement.id, {
                    position: { 
                      ...selectedElement.position, 
                      x: parseInt(e.target.value) || 0 
                    }
                  })}
                  className={cl.PropertyInput}
                />
              </div>
              <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>Y</label>
                <input
                  type="number"
                  value={Math.round(selectedElement.position.y)}
                  onChange={(e) => updateElement(selectedElement.id, {
                    position: { 
                      ...selectedElement.position, 
                      y: parseInt(e.target.value) || 0 
                    }
                  })}
                  className={cl.PropertyInput}
                />
              </div>
            </div>

            <div className={cl.PropertyRow}>
              <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>Ширина</label>
                <input
                  type="number"
                  value={Math.round(selectedElement.size.width)}
                  onChange={(e) => updateElement(selectedElement.id, {
                    size: { 
                      ...selectedElement.size, 
                      width: parseInt(e.target.value) || 80 
                    }
                  })}
                  className={cl.PropertyInput}
                />
              </div>
              <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>Висота</label>
                <input
                  type="number"
                  value={Math.round(selectedElement.size.height)}
                  onChange={(e) => updateElement(selectedElement.id, {
                    size: { 
                      ...selectedElement.size, 
                      height: parseInt(e.target.value) || 40 
                    }
                  })}
                  className={cl.PropertyInput}
                />
              </div>
            </div>

            {/* Властивості для тексту */}
            {selectedElement.type === 'text' && (
              <>
                <div className={cl.PropertyGroup}>
                  <label className={cl.PropertyLabel}>Текст</label>
                  <textarea
                    value={selectedElement.payload.text || ''}
                    onChange={(e) => updatePayload(selectedElement.id, { 
                      text: e.target.value 
                    })}
                    rows={3}
                    className={cl.PropertyTextarea}
                    placeholder={
                      selectedElement.mode === 'dynamic' 
                        ? '{variable_name}' 
                        : 'Введіть текст...'
                    }
                  />
                </div>

                <div className={cl.PropertyGroup}>
                  <label className={cl.PropertyLabel}>Розмір шрифту</label>
                  <input
                    type="number"
                    value={selectedElement.payload.fontSize || 16}
                    onChange={(e) => updatePayload(selectedElement.id, { 
                      fontSize: parseInt(e.target.value) || 16 
                    })}
                    className={cl.PropertyInput}
                  />
                </div>

                <div className={cl.PropertyGroup}>
                  <label className={cl.PropertyLabel}>Колір</label>
                  <input
                    type="color"
                    value={selectedElement.payload.color || '#000000'}
                    onChange={(e) => updatePayload(selectedElement.id, { 
                      color: e.target.value 
                    })}
                    className={cl.PropertyColorInput}
                  />
                </div>

                <div className={cl.PropertyGroup}>
                  <label className={cl.PropertyLabel}>Вирівнювання</label>
                  <select
                    value={selectedElement.payload.align || 'left'}
                    onChange={(e) => updatePayload(selectedElement.id, { 
                      align: e.target.value as AlignType 
                    })}
                    className={cl.PropertySelect}
                  >
                    <option value="left">Ліворуч</option>
                    <option value="center">По центру</option>
                    <option value="right">Праворуч</option>
                  </select>
                </div>

                <div className={cl.PropertyGroup}>
                  <label className={cl.PropertyLabel}>Насиченість</label>
                  <select
                    value={selectedElement.payload.fontWeight || 'normal'}
                    onChange={(e) => updatePayload(selectedElement.id, { 
                      fontWeight: e.target.value as FontWeight 
                    })}
                    className={cl.PropertySelect}
                  >
                    <option value="normal">Звичайний</option>
                    <option value="bold">Жирний</option>
                  </select>
                </div>
              </>
            )}

            {/* Властивості для таблиці */}
{selectedElement.type === 'table' && (
  <div className={cl.PropertyGroup}>
    {/* Колонки */}
    <label className={cl.PropertyLabel}>Колонки</label>
    {selectedElement.payload.columns?.map((col, i) => (
      <div key={i} className={cl.ColumnRow}>
        <input
          type="text"
          value={col}
          onChange={(e) => {
            const newColumns = [...(selectedElement.payload.columns || [])];
            newColumns[i] = e.target.value;
            updatePayload(selectedElement.id, { columns: newColumns });
          }}
          className={cl.PropertyInput}
        />
        <button
          onClick={() => {
            const newColumns = selectedElement.payload.columns?.filter(
              (_, idx) => idx !== i
            );
            updatePayload(selectedElement.id, { columns: newColumns });
          }}
          className={cl.DeleteButton}
        >
          <X size={16} />
        </button>
      </div>
    ))}
    <button
      onClick={() => {
        const newColumns = [
          ...(selectedElement.payload.columns || []), 
          `Колонка ${(selectedElement.payload.columns?.length || 0) + 1}`
        ];
        updatePayload(selectedElement.id, { columns: newColumns });
      }}
      className={cl.AddColumnButton}
    >
      <Plus size={14} />
      Додати колонку
    </button>

    {/* Строки */}
    <label className={cl.PropertyLabel}>Рядки</label>
    {selectedElement.payload.rows?.map((row, rowIndex) => (
      <div key={rowIndex} className={cl.ColumnRow}>
        {row.map((cell: any, cellIndex: number) => (
          <input
            key={cellIndex}
            type="text"
            value={cell}
            onChange={(e) => {
              const newRows = [...(selectedElement.payload.rows || [])];
              newRows[rowIndex][cellIndex] = e.target.value;
              updatePayload(selectedElement.id, { rows: newRows });
            }}
            className={cl.PropertyInput}
          />
        ))}
        <button
          onClick={() => {
            const newRows = selectedElement.payload.rows?.filter(
              (_, idx) => idx !== rowIndex
            );
            updatePayload(selectedElement.id, { rows: newRows });
          }}
          className={cl.DeleteButton}
        >
          <X size={16} />
        </button>
      </div>
    ))}
    <button
      onClick={() => {
        const columnsCount = selectedElement.payload.columns?.length || 1;
        const newRow = Array(columnsCount).fill("");
        const newRows = [...(selectedElement.payload.rows || []), newRow];
        updatePayload(selectedElement.id, { rows: newRows });
      }}
      className={cl.AddColumnButton}
    >
      <Plus size={14} />
      Додати рядок
    </button>
  </div>
)}

            {/* Властивості для діаграми */}
            {selectedElement.type === 'chart' && (
              <>
                <div className={cl.PropertyGroup}>
                  <label className={cl.PropertyLabel}>Тип діаграми</label>
                  <select
                    value={selectedElement.payload.chartType || 'bar'}
                    onChange={(e) => updatePayload(selectedElement.id, { 
                      chartType: e.target.value as ChartType 
                    })}
                    className={cl.PropertySelect}
                  >
                    <option value="bar">Стовпчаста</option>
                    <option value="line">Лінійна</option>
                    <option value="pie">Кругова</option>
                  </select>
                </div>
                <div className={cl.PropertyGroup}>
                  <label className={cl.PropertyLabel}>Джерело даних</label>
                  <input
                    type="text"
                    value={selectedElement.payload.dataSource || ''}
                    onChange={(e) => updatePayload(selectedElement.id, { 
                      dataSource: e.target.value 
                    })}
                    placeholder="data/sales.json"
                    className={cl.PropertyInput}
                  />
                </div>
              </>
            )}

            {/* Властивості для зображення */}
            {selectedElement.type === 'image' && (
              <>
                <div className={cl.PropertyGroup}>
                  <label className={cl.PropertyLabel}>Шлях до зображення</label>
                  <input
                    type="text"
                    value={selectedElement.payload.src || ''}
                    onChange={(e) => updatePayload(selectedElement.id, { 
                      src: e.target.value 
                    })}
                    placeholder="media/logo.png"
                    className={cl.PropertyInput}
                  />
                </div>
                <div className={cl.PropertyGroup}>
                  <label className={cl.PropertyLabel}>Alt текст</label>
                  <input
                    type="text"
                    value={selectedElement.payload.alt || ''}
                    onChange={(e) => updatePayload(selectedElement.id, { 
                      alt: e.target.value 
                    })}
                    placeholder="Опис зображення"
                    className={cl.PropertyInput}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}