// shared/hooks/useCardActions.ts
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/app/store/hooks';
import { deleteTemplate, deleteReport, fetchTemplateById } from '@/shared/api/doc/thunks';
import { cloneTemplateToReport, type EditorType } from '@/shared/api/doc/slice';
import { getMyReports, getMyTemplates } from '../api/myWorks/myWorksThunks';

export interface UseCardActionsProps {
  type: EditorType;
  id: string;
}

export function useCardActions({ type, id }: UseCardActionsProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/${type}s/${id}`);
  };

  const handleEdit = () => {
    navigate(`/${type}s/${id}/edit`);
  };

  const handleDelete = async () => {
    if (type === 'template') {
      await dispatch(deleteTemplate(id)).unwrap();
      await dispatch(getMyTemplates({ page: 1, itemsPerPage: 9 })).unwrap();
    } else {
      await dispatch(deleteReport(id)).unwrap();
      await dispatch(getMyReports({ page: 1, itemsPerPage: 9 })).unwrap();
    }
  };

  const handleCreate = async () => {
      await dispatch(fetchTemplateById(id)).unwrap();
      dispatch(cloneTemplateToReport());
      navigate(`/reports/create`);
  }

  if (type === 'template') {
    return {
      handleCreate,
      handleView,
      handleEdit,
      handleDelete
    };  
  }
  else {
    return {
      handleView,
      handleEdit,
      handleDelete
    };
  }
}