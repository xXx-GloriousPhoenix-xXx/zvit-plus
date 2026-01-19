// shared/ui/FileDropZone/FileDropZone.tsx
import { useState, useCallback, useRef } from 'react';
import { Upload, FileText, Image as ImageIcon, X } from 'lucide-react';
import cl from './FileDropZone.module.css';

export type FileDropMode = 'image' | 'data';
export type FileType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/svg+xml' | 'text/csv' | 'application/json' | 'application/vnd.ms-excel' | 'image/webp';

interface FileDropZoneProps {
  mode: FileDropMode;
  onFileUpload: (fileUrl: string) => void; // Упрощенный колбэк - только URL
  maxSize?: number;
  acceptedFormats?: FileType[];
  className?: string;
  value?: string; // Для контролируемого компонента (опционально)
}

export function FileDropZone({
  mode,
  onFileUpload,
  maxSize = 10 * 1024 * 1024,
  acceptedFormats,
  className = '',
  value
}: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cleanupRef = useRef<string | null>(null);

  const getAcceptedFormats = useCallback(() => {
    if (acceptedFormats) return acceptedFormats;
    
    return mode === 'image' 
      ? ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'] as FileType[]
      : ['text/csv', 'application/json', 'application/vnd.ms-excel'] as FileType[];
  }, [mode, acceptedFormats]);

  const getAcceptString = useCallback(() => {
    return getAcceptedFormats().join(',');
  }, [getAcceptedFormats]);

  const validateFile = useCallback((file: File): boolean => {
    setError(null);

    if (file.size > maxSize) {
      const sizeInMB = (maxSize / (1024 * 1024)).toFixed(1);
      setError(`Файл занадто великий. Максимальний розмір: ${sizeInMB}MB`);
      return false;
    }

    console.log(file.type);

    const accepted = getAcceptedFormats();
    if (!accepted.includes(file.type as FileType)) {
      const extensions = accepted.map(f => {
        if (f.startsWith('image/')) return f.split('/')[1];
        if (f === 'text/csv') return 'csv';
        if (f === 'application/json') return 'json';
        return f;
      }).join(', ');
      
      setError(`Непідтримуваний формат. Дозволені: ${extensions}`);
      return false;
    }

    return true;
  }, [maxSize, getAcceptedFormats]);

  const handleFile = useCallback((file: File) => {
    if (!validateFile(file)) return;

    try {
      if (cleanupRef.current) {
        URL.revokeObjectURL(cleanupRef.current);
      }

      const fileUrl = URL.createObjectURL(file);
      cleanupRef.current = fileUrl;
      
      setUploadedFile(file);
      setError(null);
      onFileUpload(fileUrl);

    } catch (err) {
      setError('Помилка обробки файлу');
    }
  }, [validateFile, onFileUpload]);

  const handleRemoveFile = useCallback(() => {
    if (cleanupRef.current) {
      URL.revokeObjectURL(cleanupRef.current);
      cleanupRef.current = null;
    }
    
    setUploadedFile(null);
    setError(null);
    onFileUpload('');
  }, [onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
    e.target.value = '';
  }, [handleFile]);

  const getModeInfo = useCallback(() => {
    const formats = getAcceptedFormats();
    const formatNames = formats.map(f => {
      if (f === 'image/jpeg') return 'JPEG';
      if (f === 'image/png') return 'PNG';
      if (f === 'image/gif') return 'GIF';
      if (f === 'image/svg+xml') return 'SVG';
      if (f === 'text/csv') return 'CSV';
      if (f === 'application/json') return 'JSON';
      return f;
    }).join(', ');

    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);

    return {
      title: mode === 'image' ? 'Зображення' : 'Дані',
      icon: mode === 'image' ? <ImageIcon size={24} /> : <FileText size={24} />,
      description: `Перетягніть файл або натисніть для вибору`,
      formats: `Формати: ${formatNames}`,
      maxSize: `Макс. розмір: ${maxSizeMB}MB`
    };
  }, [mode, getAcceptedFormats, maxSize]);

  const modeInfo = getModeInfo();

  return (
    <div className={`${cl.FileDropZone} ${className}`}>
      <div
        className={`${cl.DropArea} ${isDragging ? cl.Dragging : ''} ${uploadedFile ? cl.HasFile : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptString()}
          onChange={handleFileInput}
          className={cl.FileInput}
        />
        
        {!uploadedFile ? (
          <div className={cl.DropContent}>
            <div className={cl.IconWrapper}>
              {modeInfo.icon}
              <Upload size={20} className={cl.UploadIcon} />
            </div>
            <div className={cl.TextContent}>
              <h4 className={cl.Title}>{modeInfo.title}</h4>
              <p className={cl.Description}>{modeInfo.description}</p>
              <div className={cl.Info}>
                <span className={cl.FormatInfo}>{modeInfo.formats}</span>
                <span className={cl.SizeInfo}>{modeInfo.maxSize}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={cl.FileInfo}>
            <div className={mode === 'image' ? cl.ImagePreview : cl.DataFileInfo}>
              {mode === 'image' ? (
                <img 
                  src={value || cleanupRef.current!} 
                  alt="Превью" 
                  className={cl.PreviewImage} 
                />
              ) : (
                <FileText size={32} className={cl.DataIcon} />
              )}
              <div className={mode === 'image' ? cl.ImageOverlay : cl.DataDetails}>
                <span className={cl.FileName}>{uploadedFile.name}</span>
                <span className={cl.FileSize}>
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                  {mode !== 'image' && ` • ${uploadedFile.type}`}
                </span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className={cl.RemoveButton}
              title="Видалити файл"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className={cl.ErrorMessage}>
          {error}
        </div>
      )}
    </div>
  );
}