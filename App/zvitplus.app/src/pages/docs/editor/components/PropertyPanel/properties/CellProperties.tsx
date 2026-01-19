import type { 
    HorizontalAlignType, 
    FontWeight, 
    RepElement, 
    TableElement, 
    TableCell, 
    VerticalAlignType 
  } from "@/shared/types/repEditorTypes";
  import cl from "../PropertyPanel.module.css";
  import { useRepEditorContext } from "@/app/context/RepEditorContext";
import { useEffect } from "react";
  
  type CellPropertiesProps = {
      selectedElement: TableElement;
      updatePayload: (id: string, payloadUpdates: Partial<RepElement['payload']>) => void;
      readonly?: boolean;
      isReportMode?: boolean;
  }
  
  export function CellProperties({
      selectedElement,
      updatePayload,
      readonly = false,
      isReportMode = false
  }: CellPropertiesProps) {
      const { selectedCell } = useRepEditorContext();

      useEffect(() => {
        console.log(selectedCell?.row, selectedCell?.col);
      }, [selectedCell])
      
      // Проверяем, относится ли выбранная ячейка к текущему элементу
      const isCellFromThisElement = selectedCell && selectedCell.elementId === selectedElement.id;
      
      if (!isCellFromThisElement) {
          return (
              <div className={cl.PropertyGroup}>
                  <p className={cl.PropertyHint}>
                      {readonly 
                          ? 'Вибрана ячейка таблиці (тільки перегляд)'
                          : 'Натисніть на ячейку таблиці для редагування її властивостей'}
                  </p>
              </div>
          );
      }
  
      const getCurrentCell = (): TableCell => {
          const { columns = [], rows = [] } = selectedElement.payload;
          
          if (selectedCell.row === null) {
              // Ячейка заголовка
              return columns[selectedCell.col] || { text: '' };
          } else {
              // Ячейка тела таблицы
              return rows[selectedCell.row]?.[selectedCell.col] || { text: '' };
          }
      };
  
      const currentCell = getCurrentCell();
      
      // Функция для обновления свойств ячейки
      const updateCellProperty = (updates: Partial<TableCell>) => {
          if (!selectedCell || readonly) return;
          
          const { columns = [], rows = [] } = selectedElement.payload;
          
          // Создаем глубокие копии для иммутабельного обновления
          const newColumns = columns ? [...columns] : [];
          const newRows = rows ? rows.map(row => [...row]) : [];
  
          if (selectedCell.row === null) {
              // Обновляем заголовок колонки
              // Создаем массив нужной длины, если нужно
              while (newColumns.length <= selectedCell.col) {
                  newColumns.push({ text: '' });
              }
              
              newColumns[selectedCell.col] = { 
                  ...newColumns[selectedCell.col], 
                  ...updates 
              };
          } else {
              // Обновляем ячейку в теле таблицы
              // Создаем строки и колонки, если нужно
              while (newRows.length <= selectedCell.row) {
                  newRows.push([]);
              }
              while (newRows[selectedCell.row].length <= selectedCell.col) {
                  newRows[selectedCell.row].push({ text: '' });
              }
              
              newRows[selectedCell.row][selectedCell.col] = { 
                  ...newRows[selectedCell.row][selectedCell.col], 
                  ...updates 
              };
          }
  
          updatePayload(selectedElement.id, {
              columns: newColumns,
              rows: newRows
          });
      };
  
      // Для отчетов показываем упрощенную версию
      if (isReportMode) {
          return (
              <>
                {/* <div className={cl.PropertiesHeader}>
                  <h3 className={cl.PropertySubtitle}>
                      {selectedCell.row === null 
                          ? `Властивості заголовка [${selectedCell.col + 1}]` 
                          : `Властивості ячейки [${selectedCell.row + 1},${selectedCell.col + 1}]`}
                  </h3>
              </div> */}
  
              <div className={cl.PropertyGroup}>
                  <label className={cl.PropertyLabel}>Текст</label>
                  {readonly ? (
                      <div className={cl.PropertyValue}>
                          {currentCell.text || '(порожньо)'}
                      </div>
                  ) : (
                      <input
                          type="text"
                          value={currentCell.text || ''}
                          onChange={(e) => updateCellProperty({ text: e.target.value })}
                          className={cl.PropertyInput}
                          placeholder="Введіть текст..."
                          disabled={readonly}
                      />
                  )}
              </div>
              </>
          );
      }
  
      return (
          <>
              <div className={cl.PropertiesHeader}>
                  <h3 className={cl.PropertySubtitle}>
                      {selectedCell.row === null 
                          ? `Властивості заголовка [${selectedCell.col + 1}]` 
                          : `Властивості ячейки [${selectedCell.row + 1},${selectedCell.col + 1}]`}
                  </h3>
              </div>
  
              <div className={cl.PropertyGroup}>
                  <label className={cl.PropertyLabel}>Текст</label>
                  {readonly ? (
                      <div className={cl.PropertyValue}>
                          {currentCell.text || '(порожньо)'}
                      </div>
                  ) : (
                      <input
                          type="text"
                          value={currentCell.text || ''}
                          onChange={(e) => updateCellProperty({ text: e.target.value })}
                          className={cl.PropertyInput}
                          placeholder="Введіть текст..."
                          disabled={readonly}
                      />
                  )}
              </div>
  
              {!readonly && (
                  <>
                      <div className={cl.PropertyGroup}>
                          <label className={cl.PropertyLabel}>Розмір шрифту</label>
                          <input
                              type="number"
                              value={currentCell.fontSize || 14}
                              onChange={(e) => updateCellProperty({ 
                                  fontSize: parseInt(e.target.value) || 14 
                              })}
                              className={cl.PropertyInput}
                              min="8"
                              max="72"
                              disabled={readonly}
                          />
                      </div>
  
                      <div className={cl.PropertyGroup}>
                          <label className={cl.PropertyLabel}>Колір</label>
                          <input
                              type="color"
                              value={currentCell.color || '#000000'}
                              onChange={(e) => updateCellProperty({ 
                                  color: e.target.value 
                              })}
                              className={cl.PropertyColorInput}
                              disabled={readonly}
                          />
                      </div>
  
                      <div className={cl.PropertyGroup}>
                          <label className={cl.PropertyLabel}>Вирівнювання</label>
                          <select
                              value={currentCell.align || 'left'}
                              onChange={(e) => updateCellProperty({ 
                                  align: e.target.value as HorizontalAlignType 
                              })}
                              className={cl.PropertySelect}
                              disabled={readonly}
                          >
                              <option value="left">Ліворуч</option>
                              <option value="center">По центру</option>
                              <option value="right">Праворуч</option>
                          </select>
                      </div>
  
                      <div className={cl.PropertyGroup}>
                          <label className={cl.PropertyLabel}>Вертикальне вирівнювання</label>
                          <select
                              value={currentCell.verticalAlign || 'middle'}
                              onChange={(e) => updateCellProperty({ 
                                  verticalAlign: e.target.value as VerticalAlignType 
                              })}
                              className={cl.PropertySelect}
                              disabled={readonly}
                          >
                              <option value="top">Верх</option>
                              <option value="middle">Середина</option>
                              <option value="bottom">Низ</option>
                          </select>
                      </div>
  
                      <div className={cl.PropertyGroup}>
                          <label className={cl.PropertyLabel}>Насиченість</label>
                          <select
                              value={currentCell.fontWeight || 'normal'}
                              onChange={(e) => updateCellProperty({ 
                                  fontWeight: e.target.value as FontWeight 
                              })}
                              className={cl.PropertySelect}
                              disabled={readonly}
                          >
                              <option value="normal">Звичайний</option>
                              <option value="bold">Жирний</option>
                          </select>
                      </div>
                  </>
              )}
          </>
      );
  }