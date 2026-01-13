// properties/CellProperties.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ
import { useState, useEffect } from "react";
import type { AlignType, FontWeight, RepElement, TableElement, TableCell } from "@/shared/types/repEditorTypes";
import cl from "../PropertyPanel.module.css";
import { useRepEditorContext } from "@/app/context/RepEditorContext";

type CellPropertiesProps = {
    selectedElement: TableElement;
    updatePayload: (id: string, payloadUpdates: Partial<RepElement['payload']>) => void;
}

export function CellProperties({
    selectedElement,
    updatePayload
}: CellPropertiesProps) {
    const { selectedCell } = useRepEditorContext();
    
    // Проверяем, относится ли выбранная ячейка к текущему элементу
    const isCellFromThisElement = selectedCell && selectedCell.elementId === selectedElement.id;
    
    if (!isCellFromThisElement) {
        return (
            <div className={cl.PropertyGroup}>
                <p className={cl.PropertyHint}>
                    Натисніть на ячейку таблиці для редагування її властивостей
                </p>
            </div>
        );
    }

    // ВАЖНО: Получаем актуальные данные ячейки из selectedElement, а не из selectedCell.cell
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
    
    console.log('CellProperties - currentCell:', currentCell);
    console.log('CellProperties - selectedElement.payload:', selectedElement.payload);

    // Функция для обновления свойств ячейки
    const updateCellProperty = (updates: Partial<TableCell>) => {
        if (!selectedCell) return;
        
        console.log('CellProperties - updateCellProperty called:', updates);
        
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
            console.log('CellProperties - updated column:', newColumns[selectedCell.col]);
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
            console.log('CellProperties - updated cell:', newRows[selectedCell.row][selectedCell.col]);
        }

        // Обновляем элемент
        console.log('CellProperties - calling updatePayload with new data');
        console.log('New columns:', newColumns);
        console.log('New rows:', newRows);
        
        updatePayload(selectedElement.id, {
            columns: newColumns,
            rows: newRows
        });
    };

    return (
        <div className={cl.PropertySection}>
            <h3 className={cl.PropertySubtitle}>
                {selectedCell.row === null 
                    ? `Властивості заголовка [${selectedCell.col + 1}]` 
                    : `Властивості ячейки [${selectedCell.row + 1},${selectedCell.col + 1}]`}
            </h3>

            <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>Текст</label>
                <input
                    type="text"
                    value={currentCell.text || ''}
                    onChange={(e) => {
                        console.log('Text changing to:', e.target.value);
                        updateCellProperty({ text: e.target.value });
                    }}
                    className={cl.PropertyInput}
                    placeholder="Введіть текст..."
                />
            </div>

            <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>Розмір шрифту</label>
                <input
                    type="number"
                    value={currentCell.fontSize || 14}
                    onChange={(e) => {
                        console.log('Font size changing to:', e.target.value);
                        updateCellProperty({ 
                            fontSize: parseInt(e.target.value) || 14 
                        });
                    }}
                    className={cl.PropertyInput}
                    min="8"
                    max="72"
                />
            </div>

            <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>Колір</label>
                <input
                    type="color"
                    value={currentCell.color || '#000000'}
                    onChange={(e) => {
                        console.log('Color changing to:', e.target.value);
                        updateCellProperty({ 
                            color: e.target.value 
                        });
                    }}
                    className={cl.PropertyColorInput}
                />
            </div>

            <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>Вирівнювання</label>
                <select
                    value={currentCell.align || 'left'}
                    onChange={(e) => {
                        console.log('Align changing to:', e.target.value);
                        updateCellProperty({ 
                            align: e.target.value as AlignType 
                        });
                    }}
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
                    value={currentCell.fontWeight || 'normal'}
                    onChange={(e) => {
                        console.log('Font weight changing to:', e.target.value);
                        updateCellProperty({ 
                            fontWeight: e.target.value as FontWeight 
                        });
                    }}
                    className={cl.PropertySelect}
                >
                    <option value="normal">Звичайний</option>
                    <option value="bold">Жирний</option>
                </select>
            </div>
            
            {/* Отладочная информация */}
            <div className={cl.PropertyGroup} style={{ fontSize: '0.75rem', color: '#666', marginTop: '1rem' }}>
                <label className={cl.PropertyLabel}>Debug info:</label>
                <div className={cl.PropertyValue}>
                    <div>Element ID: {selectedElement.id}</div>
                    <div>Cell position: {selectedCell.row === null ? 'header' : `row ${selectedCell.row}`}, col {selectedCell.col}</div>
                    <div>Current text: "{currentCell.text || 'empty'}"</div>
                    <div>Font size: {currentCell.fontSize || 'default (14)'}</div>
                    <div>Color: {currentCell.color || 'default (#000000)'}</div>
                </div>
            </div>
        </div>
    );
}

export function SimpleCellProperties() {
    const { selectedCell, rep, selectedElement } = useRepEditorContext();
    
    if (!selectedCell || !selectedElement || selectedElement.type !== 'table') {
        return (
            <div className={cl.PropertyGroup}>
                <p className={cl.PropertyHint}>Выберите ячейку таблицы</p>
            </div>
        );
    }
    
    const tableElement = selectedElement;
    
    // Простая функция для обновления текста
    const updateText = (newText: string) => {
        const { columns = [], rows = [] } = tableElement.payload;
        const newColumns = [...columns];
        const newRows = rows.map(row => [...row]);
        
        if (selectedCell.row === null) {
            // Заголовок
            newColumns[selectedCell.col] = { 
                ...newColumns[selectedCell.col], 
                text: newText 
            };
        } else {
            // Ячейка тела
            newRows[selectedCell.row][selectedCell.col] = { 
                ...newRows[selectedCell.row][selectedCell.col], 
                text: newText 
            };
        }
        
        rep.updatePayload(tableElement.id, {
            columns: newColumns,
            rows: newRows
        });
    };
    
    // Получаем текущий текст
    const getCurrentText = () => {
        const { columns = [], rows = [] } = tableElement.payload;
        
        if (selectedCell.row === null) {
            return columns[selectedCell.col]?.text || '';
        } else {
            return rows[selectedCell.row]?.[selectedCell.col]?.text || '';
        }
    };
    
    const currentText = getCurrentText();
    
    return (
        <div className={cl.PropertySection}>
            <h3 className={cl.PropertySubtitle}>Простое редактирование</h3>
            
            <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>Текст ячейки</label>
                <input
                    type="text"
                    value={currentText}
                    onChange={(e) => {
                        console.log('Setting text to:', e.target.value);
                        updateText(e.target.value);
                    }}
                    className={cl.PropertyInput}
                />
                <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                    Нажмите Enter или кликните вне поля для сохранения
                </div>
            </div>
            
            <div className={cl.PropertyGroup}>
                <label className={cl.PropertyLabel}>Отладка</label>
                <div className={cl.PropertyValue}>
                    <div>Row: {selectedCell.row === null ? 'header' : selectedCell.row}</div>
                    <div>Col: {selectedCell.col}</div>
                    <div>Current: "{currentText}"</div>
                </div>
            </div>
        </div>
    );
}