import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { DocItemDTO, RepDocData, RepDocFiles, SearchParams } from "./models";
import { createTemplate, deleteReport, deleteTemplate, fetchReportById, fetchReportsPage, fetchTemplateById, fetchTemplatesPage, updateReport, updateTemplate } from "./thunks";
import type { MetaValue, RepTemplate } from "@/shared/types/repEditorTypes";
import { TEMPLATE_DRAFT_KEY, REPORT_DRAFT_KEY } from "@/shared/constants/localStorage";

// type DocType = 'templates' | 'reports';
export type EditorMode = 'create' | 'edit' | 'view';
export type EditorType = 'template' | 'report';

type DocCommonState = {
    list: {
        items: DocItemDTO[] | null;
        totalPages: number;
        currentPage: number;
        searchParams: SearchParams;
        loading: boolean;
        error: string | null;
    };
    current: {
        data: RepDocData | null;
        files: RepDocFiles | null;
        loading: boolean;
        error: string | null;
        isDirty: boolean; // Флаг изменения
    };
    save: {
        loading: boolean;
        error: string | null;
        success: boolean;
    };
};

type EditorState = {
    mode: EditorMode; // 'create' | 'edit' | 'view'
    workMode: EditorType; // 'template' | 'report'
    meta: MetaValue;
    template: RepTemplate;
    step: number;
    loading: boolean;
    error: string | null;
    lastSaved: string | null;
    originalId?: string; // Для режима edit
};
  
type DocsState = {
    reports: DocCommonState;
    templates: DocCommonState;
    editor: EditorState;
};

const getDraftKey = (workMode: EditorType) => workMode === 'template' ? TEMPLATE_DRAFT_KEY : REPORT_DRAFT_KEY;

const loadDraft = (workMode: EditorType): EditorState => {
    const key = getDraftKey(workMode);
    const saved = localStorage.getItem(key);
    
    if (saved) {
        try {
        const parsed = JSON.parse(saved);
        return {
            mode: 'create',
            workMode,
            ...parsed,
            loading: false,
            error: null,
            lastSaved: parsed.lastSaved || null
        };
        } catch (e) {
            console.error('Failed to parse saved draft:', e);
            localStorage.removeItem(key);
        }
    }

  return {
        mode: 'create',
        workMode,
        meta: {
            id: null,
            templateId: null,
            templateName: "",
            templateTypeId: "",
            templateTypeName: "",
            isPrivate: false,
            pageSize: "A4",
            orientation: "portrait"
        },
        template: {
          meta: {
              id: null,
              templateId: null,
              templateName: "",
              templateTypeId: "",
              templateTypeName: "",
              isPrivate: false,
              pageSize: "A4",
              orientation: "portrait"
          },
          elements: []
        },
        step: 1,
        loading: false,
        error: null,
        lastSaved: null
      };
    };

const saveDraft = (state: EditorState) => {
    const key = getDraftKey(state.workMode);
    const toSave = {
        meta: state.meta,
        template: state.template,
        step: state.step,
        lastSaved: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(toSave));
};

const clearDraft = (workMode: EditorType) => {
    localStorage.removeItem(getDraftKey(workMode));
};

const initialState: DocsState = {
    reports: {
        list: {
            items: null,
            totalPages: 0,
            currentPage: 1,
            searchParams: {},
            loading: false,
            error: null
        },
        current: {
            data: null,
            files: {
              previewUrl: undefined,
              mediaFiles: {},
              dataFiles: {},
            },
            loading: false,
            error: null,
            isDirty: false
        },
        save: {
            loading: false,
            error: null,
            success: false
        }
    },
    templates: {
        list: {
            items: null,
            totalPages: 0,
            currentPage: 1,
            searchParams: {},
            loading: false,
            error: null
        },
        current: {
            data: null,
            files: {
              previewUrl: undefined,
              mediaFiles: {},
              dataFiles: {},
            },
            loading: false,
            error: null,
            isDirty: false
        },
        save: {
            loading: false,
            error: null,
            success: false
        }
    },
    editor: loadDraft('template')
};

const docsSlice = createSlice({
    name: "docs",
    initialState,
    reducers: {
        clearList(state, action: PayloadAction<EditorType>) {
          state[`${action.payload}s`].list = {
            items: null,
            totalPages: 0,
            currentPage: 1,
            loading: false,
            error: null,
            searchParams: {}
          };
        },
        
        clearCurrent(state, action: PayloadAction<EditorType>) {
          state[`${action.payload}s`].current = {
            data: null,
            files: {
                previewUrl: undefined,
                mediaFiles: {},
                dataFiles: {}
            },
            loading: false,
            error: null,
            isDirty: false
        };
        },
    
        initEditor(state, action: PayloadAction<{ mode: EditorMode; workMode: EditorType; initialData?: RepDocData; id?: string; }>) {
          const { mode, workMode, initialData, id } = action.payload;
          
          if (mode === 'create') {
            // Загрузка черновика или создание нового
            state.editor = loadDraft(workMode);
          } else if (initialData) {
            // Режим edit/view с загруженными данными
            state.editor = {
              mode,
              workMode,
              meta: initialData.meta,
              template: {
                meta: initialData.meta,
                elements: initialData.elements || []
              },
              step: mode === 'view' ? 3 : 1, // Для просмотра сразу 3 шаг
              loading: false,
              error: null,
              lastSaved: null,
              originalId: id
            };
          }
        },
    
        setEditorMeta(state, action: PayloadAction<MetaValue>) {
          state.editor.meta = action.payload;
          state.editor.template.meta = action.payload;
          if (state.editor.mode === 'create') {
            saveDraft(state.editor);
          }
        },
    
        setEditorTemplate(state, action: PayloadAction<RepTemplate>) {
          state.editor.template = action.payload;
          if (action.payload.meta) {
            state.editor.meta = action.payload.meta;
          }
          if (state.editor.mode === 'create') {
            saveDraft(state.editor);
          }
        },
    
        setEditorStep(state, action: PayloadAction<number>) {
          state.editor.step = action.payload;
          if (state.editor.mode === 'create') {
            saveDraft(state.editor);
          }
        },
    
        updateEditorElement(state, action: PayloadAction<{ id: string; updates: any }>) {
          const { id, updates } = action.payload;
          const elementIndex = state.editor.template.elements.findIndex(el => el.id === id);
          if (elementIndex !== -1) {
            state.editor.template.elements[elementIndex] = {
              ...state.editor.template.elements[elementIndex],
              ...updates
            };
            if (state.editor.mode === 'create') {
              saveDraft(state.editor);
            }
          }
        },
    
        addEditorElement(state, action: PayloadAction<any>) {
          state.editor.template.elements.push(action.payload);
          if (state.editor.mode === 'create') {
            saveDraft(state.editor);
          }
        },
    
        removeEditorElement(state, action: PayloadAction<string>) {
          state.editor.template.elements = state.editor.template.elements.filter(
            el => el.id !== action.payload
          );
          if (state.editor.mode === 'create') {
            saveDraft(state.editor);
          }
        },
    
        clearEditorDraft(state) {
          clearDraft(state.editor.workMode);
          state.editor = {
            mode: 'create',
            workMode: state.editor.workMode,
            meta: {
              id: null,
              templateId: null,
              templateName: "",
              templateTypeId: "",
              templateTypeName: "",
              isPrivate: false,
              pageSize: "A4",
              orientation: "portrait"
            },
            template: {
              meta: {
                id: null,
                templateId: null,
                templateName: "",
                templateTypeId: "",
                templateTypeName: "",
                isPrivate: false,
                pageSize: "A4",
                orientation: "portrait"
              },
              elements: []
            },
            step: 1,
            loading: false,
            error: null,
            lastSaved: null
          };
        },
    
        resetEditorError(state) {
          state.editor.error = null;
        },
    
        // // Для отчетов - можно добавить специфичные действия
        // setReportData(state, action: PayloadAction<{ elementId: string; data: any }>) {
        //   if (state.editor.workMode === 'report') {
        //     // Логика заполнения данных отчета
        //   }
        // },

        resetSaveState(state, action: PayloadAction<EditorType>) {
          state[`${action.payload}s`].save = {
            loading: false,
            error: null,
            success: false
          };
        },
        
        // Для отслеживания изменений в редакторе
        markAsDirty(state) {
          if (state.editor.mode === 'edit') {
            const docType = state.editor.workMode;
            state[`${docType}s`].current.isDirty = true;
          }
        },

        setPage(state, action: PayloadAction<{ type: EditorType, page: number }>) {
            const totalPages = state[`${action.payload.type}s`].list.totalPages;
            const newPage = action.payload.page;
            if (newPage < 1 || newPage > totalPages) {
                return;
            }
            else {
                state[`${action.payload.type}s`].list.currentPage = newPage;
            }
        },

        setSearchParams(state, action: PayloadAction<{ type: EditorType, searchParams: Partial<SearchParams> }>) {
            state[`${action.payload.type}s`].list.searchParams = {
                ...action.payload.searchParams
            }
        },

        clearSearchParams(state, action: PayloadAction<EditorType>) {
            state[`${action.payload}s`].list.searchParams = {};
            state[`${action.payload}s`].list.currentPage = 1;
        },

        cloneTemplateToReport(state) {
          const currentTemplate = state.templates.current;
    
          if (!currentTemplate.data) {
              return;
          }
          
          const newMeta = {
              ...currentTemplate.data.meta,
              id: null,
              templateId: currentTemplate.data.meta.id,
              templateName: ""
          };
          
          state.reports.current = {
              data: {
                  ...currentTemplate.data,
                  meta: newMeta
              },
              files: currentTemplate.files ? {
                  previewUrl: currentTemplate.files.previewUrl,
                  mediaFiles: { ...currentTemplate.files.mediaFiles },
                  dataFiles: { ...currentTemplate.files.dataFiles }
              } : {
                  previewUrl: undefined,
                  mediaFiles: {},
                  dataFiles: {}
              },
              loading: false,
              error: null,
              isDirty: false
          };
      
          state.editor = {
              mode: 'create',
              workMode: 'report',
              meta: newMeta,
              template: {
                  meta: newMeta,
                  elements: [...currentTemplate.data.elements || []]
              },
              step: 1,
              loading: false,
              error: null,
              lastSaved: null
          };
          
          saveDraft(state.editor);
        },

        setImage(state, action: PayloadAction<{id: string, file: File}>) {
          const { id, file } = action.payload;
          // Проверяем, что files существует
          if (!state.reports.current.files) {
              state.reports.current.files = {
                  previewUrl: undefined,
                  mediaFiles: {},
                  dataFiles: {}
              };
          }
          state.reports.current.files.mediaFiles[id] = file;
          console.log('media files: ', state.reports.current.files.mediaFiles);
      },
      
      setData(state, action: PayloadAction<{id: string, file: File}>) {
          const { id, file } = action.payload;
          // Проверяем, что files существует
          if (!state.reports.current.files) {
              state.reports.current.files = {
                  previewUrl: undefined,
                  mediaFiles: {},
                  dataFiles: {}
              };
          }
          state.reports.current.files.dataFiles[id] = file;
          console.log(`Data is set for element id: ${id}`);
      },
    },
    extraReducers: (builder) => {
      builder
        // TEMPLATES
        .addCase(fetchTemplatesPage.pending, (state) => {
          state.templates.list.loading = true;
          state.templates.list.error = null;
        })
        .addCase(fetchTemplatesPage.fulfilled, (state, action) => {
          state.templates.list.loading = false;
          state.templates.list.items = action.payload.items;
          state.templates.list.totalPages = action.payload.totalPages;
        })
        .addCase(fetchTemplatesPage.rejected, (state, action) => {
          state.templates.list.loading = false;
          state.templates.list.error = action.payload ?? "Помилка завантаження списку шаблонів";
        })
        .addCase(fetchTemplateById.pending, (state) => {
          state.templates.current.loading = true;
          state.templates.current.error = null;
        })
        .addCase(fetchTemplateById.fulfilled, (state, action) => {
          state.templates.current.loading = false;
          
          state.templates.current.data = action.payload.data;
          state.templates.current.files = action.payload.files;

          state.templates.current.data.meta.id = action.payload.data.meta.id;
        })
        .addCase(fetchTemplateById.rejected, (state, action) => {
          state.templates.current.loading = false;
          state.templates.current.error = action.payload ?? "Помилка завантаження шаблону";
        })
  
        // REPORTS
        .addCase(fetchReportsPage.pending, (state) => {
          state.reports.list.loading = true;
          state.reports.list.error = null;
        })
        .addCase(fetchReportsPage.fulfilled, (state, action) => {
          state.reports.list.loading = false;
          state.reports.list.items = action.payload.items;
          state.reports.list.totalPages = action.payload.totalPages;
        })
        .addCase(fetchReportsPage.rejected, (state, action) => {
          state.reports.list.loading = false;
          state.reports.list.error = action.payload ?? "Помилка завантаження списку звітів";
        })
        .addCase(fetchReportById.pending, (state) => {
          state.reports.current.loading = true;
          state.reports.current.error = null;
        })
        .addCase(fetchReportById.fulfilled, (state, action) => {
          state.reports.current.loading = false;
          state.reports.current.data = action.payload.data;
          state.reports.current.files = action.payload.files;
        })
        .addCase(fetchReportById.rejected, (state, action) => {
          state.reports.current.loading = false;
          state.reports.current.error = action.payload ?? "Помилка завантаження звіту";
        })
  
        .addCase(createTemplate.pending, (state) => {
          state.templates.save.loading = true;
          state.templates.save.error = null;
          state.templates.save.success = false;
        })
        .addCase(createTemplate.fulfilled, state => {
          state.templates.save.loading = false;
          state.templates.save.success = true;
          
          // Очищаем черновик после успешного создания
          clearDraft('template');
          state.editor = loadDraft('template');
        })
        .addCase(createTemplate.rejected, (state, action) => {
          state.templates.save.loading = false;
          state.templates.save.error = action.payload ?? "Помилка збереження шаблону";
        })
        
        // Template Update
        .addCase(updateTemplate.pending, (state) => {
          state.templates.save.loading = true;
          state.templates.save.error = null;
          state.templates.save.success = false;
        })
        .addCase(updateTemplate.fulfilled, (state, action) => {
          state.templates.save.loading = false;
          state.templates.save.success = true;
          
          // Сбрасываем флаг изменений
          state.templates.current.isDirty = false;
          
          // Обновляем данные в current
          if (state.templates.current.data && state.editor.originalId === action.payload.id) {
            state.templates.current.data.meta.templateName = action.payload.name;
          }
        })
        .addCase(updateTemplate.rejected, (state, action) => {
          state.templates.save.loading = false;
          state.templates.save.error = action.payload ?? "Помилка оновлення шаблону";
        })
        
        // Template Delete
        .addCase(deleteTemplate.pending, (state) => {
          state.templates.save.loading = true;
          state.templates.save.error = null;
          state.templates.save.success = false;
        })
        .addCase(deleteTemplate.fulfilled, (state, action) => {
          state.templates.save.loading = false;
          state.templates.save.success = true;
          
          // Очищаем current если удалили текущий шаблон
          if (state.templates.current.data?.meta.templateName === action.payload) {
            state.templates.current = {
              data: null,
              files: null,
              loading: false,
              error: null,
              isDirty: false
            };
          }
          
          // Удаляем из списка если он загружен
          if (state.templates.list.items) {
            state.templates.list.items = state.templates.list.items.filter(
              item => item.id !== action.payload
            );
          }
        })
        .addCase(deleteTemplate.rejected, (state, action) => {
          state.templates.save.loading = false;
          state.templates.save.error = action.payload ?? "Помилка видалення шаблону";
        })

        // Report Delete
        .addCase(deleteReport.pending, (state) => {
          state.reports.save.loading = true;
          state.reports.save.error = null;
          state.reports.save.success = false;
        })
        .addCase(deleteReport.fulfilled, (state, action) => {
          state.reports.save.loading = false;
          state.reports.save.success = true;
          
          if (state.reports.current.data?.meta.id === action.payload) {
            state.reports.current = {
              data: null,
              files: null,
              loading: false,
              error: null,
              isDirty: false
            };
          }
          
          if (state.reports.list.items) {
            state.reports.list.items = state.reports.list.items.filter(
              item => item.id !== action.payload
            );
          }
        })
        .addCase(deleteReport.rejected, (state, action) => {
          state.reports.save.loading = false;
          state.reports.save.error = action.payload ?? "Помилка видалення звіту";
        })

        // Report Update
        .addCase(updateReport.pending, (state) => {
          state.reports.save.loading = true;
          state.reports.save.error = null;
          state.reports.save.success = false;
        })
        .addCase(updateReport.fulfilled, (state, action) => {
          state.reports.save.loading = false;
          state.reports.save.success = true;
          
          state.reports.current.isDirty = false;
          
          if (state.reports.current.data && state.editor.originalId === action.payload.id) {
            state.reports.current.data.meta.templateName = action.payload.name;
          }
        })
        .addCase(updateReport.rejected, (state, action) => {
          state.reports.save.loading = false;
          state.reports.save.error = action.payload ?? "Помилка оновлення звіту";
        })
    }
});
  
export const {
    clearList,
    clearCurrent,
    initEditor,
    setEditorMeta,
    setEditorTemplate,
    setEditorStep,
    updateEditorElement,
    addEditorElement,
    removeEditorElement,
    clearEditorDraft,
    resetEditorError,
    // setReportData,
    resetSaveState,
    markAsDirty,
    setPage,
    setSearchParams,
    clearSearchParams,
    cloneTemplateToReport,
    setImage,
    setData,
} = docsSlice.actions;
  
export const docsReducer = docsSlice.reducer;