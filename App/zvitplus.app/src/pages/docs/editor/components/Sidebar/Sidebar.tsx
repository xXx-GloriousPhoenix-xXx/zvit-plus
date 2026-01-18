// editor/components/Sidebar/Sidebar.tsx
import { BarChart3, Image, Table, Type } from 'lucide-react';
import cl from './Sidebar.module.css';
import { useRepEditorContext } from '@/app/context/RepEditorContext';
import type { EditorType } from '@/shared/api/doc/slice';

interface SidebarProps {
    mode: EditorType;
    readonly?: boolean;
}

export function Sidebar({ mode, readonly = false }: SidebarProps) {
  const { elements, selectedElement, rep } = useRepEditorContext();

  // В режиме report показываем только кнопки для заполнения данных
  if (mode === 'report') {
    return (
      <div className={cl.Sidebar}>
        <h2 className={cl.SidebarTitle}>Дані звіту</h2>
        
        {!readonly && (
          <div className={cl.ButtonList}>
            <button 
              onClick={() => {/* Логика добавления данных */}}
              className={`${cl.AddButton} ${cl.DataButton}`}
            >
              <span>Додати дані</span>
            </button>
          </div>
        )}

        <h3 className={cl.ElementsListTitle}>Елементи:</h3>
        <div className={cl.ElementsList}>
          {elements.map(el => (
            <div
              key={el.id}
              onClick={() => rep.setSelectedElement(el)}
              className={`${cl.ElementItem} ${
                selectedElement?.id === el.id ? cl.ElementItemActive : ''
              }`}
            >
              <span className={cl.ElementItemText}>
                {el.type} ({el.mode === 'dynamic' ? 'динамічний' : 'статичний'})
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Режим template
  return (
    <div className={cl.Sidebar}>
      <h2 className={cl.SidebarTitle}>Елементи</h2>
      
      {!readonly && (
        <div className={cl.ButtonList}>
          <button 
            onClick={() => rep.addElement('text', 'static')} 
            className={`${cl.AddButton} ${cl.TextButton}`}
          >
            <Type size={18} />
            <span>Статичний текст</span>
          </button>
          
          <button 
            onClick={() => rep.addElement('text', 'dynamic')} 
            className={`${cl.AddButton} ${cl.TextButton}`}
          >
            <Type size={18} />
            <span>Динамічний текст</span>
          </button>
          
          <button 
            onClick={() => rep.addElement('image', 'dynamic')} 
            className={`${cl.AddButton} ${cl.ImageButton}`}
          >
            <Image size={18} />
            <span>Зображення</span>
          </button>
          
          <button 
            onClick={() => rep.addElement('chart', 'dynamic')} 
            className={`${cl.AddButton} ${cl.ChartButton}`}
          >
            <BarChart3 size={18} />
            <span>Діаграма</span>
          </button>
          
          <button 
            onClick={() => rep.addElement('table', 'dynamic')} 
            className={`${cl.AddButton} ${cl.TableButton}`}
          >
            <Table size={18} />
            <span>Таблиця</span>
          </button>
        </div>
      )}

      {elements.length > 0 && (
        <>
          <h3 className={cl.ElementsListTitle}>Додані елементи:</h3>
          <div className={cl.ElementsList}>
            {elements.map(el => (
              <div
                key={el.id}
                onClick={() => rep.setSelectedElement(el)}
                className={`${cl.ElementItem} ${
                  selectedElement?.id === el.id ? cl.ElementItemActive : ''
                }`}
              >
                <span className={cl.ElementItemText}>
                  {el.type} ({el.mode})
                </span>
                {!readonly && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      rep.deleteElement(el.id);
                    }}
                    className={cl.DeleteButton}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}