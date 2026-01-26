import type { RootState } from "@/app/store/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { PagedResponse } from "../models";
import type { DocItemDTO, DocType, GetDocDTO, RepDocData, RepDocFiles } from "./models";
import { baseApi } from "../baseApi";
import { packRepFile, unpackRepFile } from "@/shared/utils/repFileManager";
import type { RepTemplate } from "@/shared/types/repEditorTypes";

const fetchDocsPage = createAsyncThunk<PagedResponse<DocItemDTO>, { type: DocType, dto: GetDocDTO }, { state: RootState; rejectValue: string; }>(
    "docs/getAll",
    async({ type, dto = { page: 1, pageSize: 6, searchParams: {}} }, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.accessToken;
            const params = new URLSearchParams();
            const { searchParams, page, pageSize } = dto;

            if (searchParams.name && searchParams.name.trim() !== '') {
                params.append('name', searchParams.name.trim());
            }
            if (searchParams.author && searchParams.author.trim() !== '') {
                params.append('author', searchParams.author.trim());
            }
            if (searchParams.templateType && searchParams.templateType.trim() !== '') {
                params.append('templateType', searchParams.templateType.trim());
            }
            if (searchParams.createdFrom && searchParams.createdFrom.trim() !== '') {
                params.append('createdFrom', searchParams.createdFrom.trim());
            }
            if (searchParams.createdTo && searchParams.createdTo.trim() !== '') {
                params.append('createdTo', searchParams.createdTo.trim());
            }
            if (searchParams.updatedFrom && searchParams.updatedFrom.trim() !== '') {
                params.append('updatedFrom', searchParams.updatedFrom.trim());
            }
            if (searchParams.updatedTo && searchParams.updatedTo.trim() !== '') {
                params.append('updatedTo', searchParams.updatedTo.trim());
            }
            
            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const url = `${type}s/${page}/${pageSize}${params.toString() ? '?' + params.toString() : ''}`;
            const response = await baseApi.get<PagedResponse<DocItemDTO>>(url, { headers });
            return response.data;
        }
        catch (error: any) {            
            let errorMessage = `Не вдалося отримати список ${type === 'template' ? 'шаблонів' : 'звітів'}`;
            if (error.response) {
                errorMessage = `Помилка ${error.response.status}: ${error.response.data || error.response.statusText}`;
            } else if (error.request) {
                errorMessage = "Не вдалося отримати відповідь від сервера";
            } else {
                errorMessage = error.message || errorMessage;
            }
            
            return rejectWithValue(errorMessage);
        }
    }
)

export const fetchTemplatesPage = createAsyncThunk<PagedResponse<DocItemDTO>, GetDocDTO, { state: RootState; rejectValue: string; }>(
    "templates/getAll",
    async(dto, { dispatch }) => {
        return await dispatch(fetchDocsPage({ dto, type: 'template' })).unwrap();
    }
);

export const fetchReportsPage = createAsyncThunk<PagedResponse<DocItemDTO>, GetDocDTO, { state: RootState; rejectValue: string; }>(
    "reports/getAll",
    async(dto, { dispatch }) => {
        return await dispatch(fetchDocsPage({ dto, type: 'report' })).unwrap();
    }
);

const fetchDocById = createAsyncThunk<{ data: RepDocData, files: RepDocFiles }, { id: string, type: DocType }, { state: RootState; rejectValue: string; }>(
    "docs/getById",
    async({ id, type }, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.accessToken;
            
            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const url = `${type}s/${id}/download`;
            const response = await baseApi.get<Blob>(url, { 
                headers,
                responseType: 'blob' 
            });

            var result = await unpackRepFile(response.data);
            result.data.meta.id = id;

            console.log(result);
            return result;
        }
        catch (error: any) {            
            let errorMessage = `Не вдалося завантажити ${type === 'template' ? 'шаблон' : 'звіт'}`;
            if (error.response) {
                errorMessage = `Помилка ${error.response.status}: ${error.response.data || error.response.statusText}`;
            } else if (error.request) {
                errorMessage = "Не вдалося отримати відповідь від сервера";
            } else {
                errorMessage = error.message || errorMessage;
            }
            
            return rejectWithValue(errorMessage);
        }
    }
);

export const fetchTemplateById = createAsyncThunk<{ data: RepDocData, files: RepDocFiles }, string, { state: RootState; rejectValue: string; }>(
    "templates/getById",
    async(id, { dispatch }) => {
        return await dispatch(fetchDocById({ id, type: 'template' })).unwrap();
    }
);

export const fetchReportById = createAsyncThunk<{ data: RepDocData, files: RepDocFiles }, string, { state: RootState; rejectValue: string; }>(
    "reports/getById",
    async(id, { dispatch }) => {
        return await dispatch(fetchDocById({ id, type: 'report' })).unwrap();
    }
);

interface CreateTemplateData {
    name: string;
    templateTypeId: string;
    isPrivate: boolean;
    template: RepTemplate;
    canvasRef?: React.RefObject<HTMLDivElement | null>;
}

interface UpdateTemplateData {
    id: string;
    name?: string;
    templateTypeId?: string;
    isPrivate?: boolean;
    template?: RepTemplate;
    canvasRef?: React.RefObject<HTMLDivElement | null>;
}

type CreateReportData = Omit<CreateTemplateData, 'templateTypeId'> & {
    templateId: string;
    files: RepDocFiles;
}

export const createTemplate = createAsyncThunk<
  { id: string; name: string }, 
  CreateTemplateData,
  { state: RootState; rejectValue: string }
>(
  "templates/create",
  async ({ name, templateTypeId, isPrivate, template, canvasRef }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log("Data to create:", {
        name,
        templateTypeId,
        isPrivate,
        elementsCount: template.elements?.length || 0
      });

      const formData = new FormData();
      
      formData.append("name", name);
      formData.append("templateTypeId", templateTypeId);
      formData.append("isPrivate", isPrivate.toString());

      const repFile = await packRepFile(template);
      formData.append("file", repFile, `${name}.rep`);

      if (canvasRef?.current) {
        try {
          const canvasElement = canvasRef.current;
          const html2canvas = (await import('html2canvas')).default;
          const canvas = await html2canvas(canvasElement, {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true,
            logging: false
          });
          
          canvas.toBlob((blob) => {
            if (blob) {
              formData.append("preview", blob, "preview.png");
            }
          }, 'image/png');
        } catch (error) {
        }
      }

      const response = await baseApi.post<{ id: string; name: string }>(
        "templates",
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      console.log(response.data);

      return response.data;

    } catch (error: any) {      
      let errorMessage = "Не вдалося створити шаблон";
      if (error.response) {
        errorMessage = `Помилка ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
      } else if (error.request) {
        errorMessage = "Не вдалося отримати відповідь від сервера";
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateTemplate = createAsyncThunk<
  { id: string; name: string },
  UpdateTemplateData,
  { state: RootState; rejectValue: string }
>(
  "templates/update",
  async ({ id, name, templateTypeId, isPrivate, template, canvasRef }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const formData = new FormData();
      
      if (name) formData.append("name", name);
      if (templateTypeId) formData.append("templateTypeId", templateTypeId);
      if (isPrivate !== undefined) formData.append("isPrivate", isPrivate.toString());

      if (template) {
        const repFile = await packRepFile(template);
        formData.append("file", repFile, `${name || 'template'}.rep`);
      }

      if (canvasRef?.current) {
        try {
          const canvasElement = canvasRef.current;
          const html2canvas = (await import('html2canvas')).default;
          const canvas = await html2canvas(canvasElement, {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true,
            logging: false
          });
          
          canvas.toBlob((blob) => {
            if (blob) {
              formData.append("preview", blob, "preview.png");
            }
          }, 'image/png');
        } catch (error) {
          console.warn("⚠️ Не удалось создать превью:", error);
        }
      }

      const response = await baseApi.patch<{ id: string; name: string }>(
        `templates/${id}`,
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      return response.data;

    } catch (error: any) {
      
      let errorMessage = "Не вдалося оновити шаблон";
      if (error.response) {
        errorMessage = `Помилка ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
      } else if (error.request) {
        errorMessage = "Не вдалося отримати відповідь від сервера";
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteTemplate = createAsyncThunk<
  string,
  string, 
  { state: RootState; rejectValue: string }
>(
  "templates/delete",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      await baseApi.delete(`templates/${id}`, { headers });

      return id;

    } catch (error: any) {      
      let errorMessage = "Не вдалося видалити шаблон";
      if (error.response) {
        errorMessage = `Помилка ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
      } else if (error.request) {
        errorMessage = "Не вдалося отримати відповідь від сервера";
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const createReport = createAsyncThunk<
  { id: string; name: string },
  CreateReportData,
  { state: RootState; rejectValue: string }
>(
  'reports/create',
  async({ name, templateId, isPrivate, template, files, canvasRef }, { rejectWithValue, getState }) => {
      try {
         const token = getState().auth.accessToken;

          const headers: Record<string, string> = {};
          if (token) {
              headers['Authorization'] = `Bearer ${token}`;
          }

          console.log(name, templateId, isPrivate, template);

          const formData = new FormData();
          formData.append("name", name);
          formData.append("templateId", templateId);
          formData.append("isPrivate", isPrivate.toString());
          const repFile = await packRepFile(template, files);
          formData.append("file", repFile, `${name}.rep`);
          if (canvasRef?.current) {
              try {
                  const canvasElement = canvasRef.current;
                  const html2canvas = (await import('html2canvas')).default;
                  const canvas = await html2canvas(canvasElement, {
                      scale: 2,
                      backgroundColor: '#ffffff',
                      useCORS: true,
                      logging: false
                  });

                  canvas.toBlob((blob) => {
                      if (blob) {
                          formData.append("preview", blob, "preview.png");
                      }
                  }, 'image/png');
              } catch (error) {
              }
          }

          const response = await baseApi.post<{ id: string; name: string }>(
              "reports",
              formData,
              {
                  headers: {
                      ...headers,
                      "Content-Type": "multipart/form-data"
                  }
              }
          );

          return response.data;
      }
      catch (error: any) {
          let errorMessage = "Не вдалося створити звіт";
          if (error.response) {
              errorMessage = `Помилка ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
          } else if (error.request) {
              errorMessage = "Не вдалося отримати відповідь від сервера";
          } else {
              errorMessage = error.message || errorMessage;
          }

          return rejectWithValue(errorMessage);
      }
  }
)

export const deleteReport = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>(
  "reports/delete",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      await baseApi.delete(`reports/${id}`, { headers });

      return id;

    } catch (error: any) {      
      let errorMessage = "Не вдалося видалити звіт";
      if (error.response) {
        errorMessage = `Помилка ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
      } else if (error.request) {
        errorMessage = "Не вдалося отримати відповідь від сервера";
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateReport = createAsyncThunk<
  { id: string; name: string },
  { 
    id: string;
    name?: string;
    isPrivate?: boolean;
    template?: RepTemplate;
    files?: RepDocFiles;
    canvasRef?: React.RefObject<HTMLDivElement | null>;
  },
  { state: RootState; rejectValue: string }
>(
  "reports/update",
  async ({ id, name, isPrivate, template, files, canvasRef }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const formData = new FormData();
      
      if (name) formData.append("name", name);
      if (isPrivate !== undefined) formData.append("isPrivate", isPrivate.toString());

      if (template) {
        const repFile = await packRepFile(template, files);
        formData.append("file", repFile, `${name || 'report'}.rep`);
      }

      if (canvasRef?.current) {
        try {
          const canvasElement = canvasRef.current;
          const html2canvas = (await import('html2canvas')).default;
          const canvas = await html2canvas(canvasElement, {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true,
            logging: false
          });
          
          canvas.toBlob((blob) => {
            if (blob) {
              formData.append("preview", blob, "preview.png");
            }
          }, 'image/png');
        } catch (error) {
          console.warn("⚠️ Не удалось создать превью:", error);
        }
      }

      const response = await baseApi.patch<{ id: string; name: string }>(
        `reports/${id}`,
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      return response.data;

    } catch (error: any) {      
      let errorMessage = "Не вдалося оновити звіт";
      if (error.response) {
        errorMessage = `Помилка ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
      } else if (error.request) {
        errorMessage = "Не вдалося отримати відповідь від сервера";
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);