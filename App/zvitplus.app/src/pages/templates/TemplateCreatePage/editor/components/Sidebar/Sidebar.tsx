import { BarChart3, Image, Table, Type, X } from 'lucide-react';
import cl from './Sidebar.module.css';
import { useRepEditorContext } from '@/app/context/RepEditorContext';

export function Sidebar() {
    const {elements, selectedElement, rep } = useRepEditorContext();
    return (
        <div className={cl.Sidebar}>
        <h2 className={cl.SidebarTitle}>Елементи</h2>
        
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      rep.deleteElement(el.id);
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
    );
}