// shared/ui/SearchBar/SearchBar.tsx
import { useState, useEffect } from 'react';
import { Input } from '@/shared/ui/Input/Input';
import { Select } from '@/shared/ui/Select/Select';
import { Button } from '@/shared/ui/Button/Button';
import type { SearchTemplateParams } from '@/shared/api/templates/templateModels';
import cl from './SearchBar.module.css';

interface SearchBarProps {
    onSearch: (params: SearchTemplateParams) => void;
    onClear?: () => void;
    initialParams?: SearchTemplateParams;
    templateTypes?: Array<{ id: string; name: string }>;
    isLoading?: boolean;
}

export function SearchBar({ 
    onSearch, 
    onClear,
    initialParams = {}, 
    templateTypes = [],
    isLoading = false 
}: SearchBarProps) {
    const [params, setParams] = useState<SearchTemplateParams>(initialParams);
    const [showAdvanced, setShowAdvanced] = useState(false);

    useEffect(() => {
        setParams(initialParams);
    }, [initialParams]);

    const handleInputChange = (key: keyof SearchTemplateParams, value: string) => {
        setParams(prev => ({
            ...prev,
            [key]: value || undefined
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(params);
    };

    const handleClear = () => {
        const clearedParams: SearchTemplateParams = {};
        setParams(clearedParams);
        
        if (onClear) {
            onClear(); 
        } else {
            onSearch(clearedParams);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e);
        }
    };
    return (
        <form className={cl.SearchBar} onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            <div className={cl.MainRow}>
                <div className={cl.SearchInput}>
                    <Input
                        label="Пошук за назвою"
                        placeholder="Введіть назву шаблону..."
                        value={params.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                </div>

                <div className={cl.SearchInput}>
                    <Input
                        label="Автор"
                        placeholder="Ім'я автора..."
                        value={params.author || ''}
                        onChange={(e) => handleInputChange('author', e.target.value)}
                    />
                </div>

                <div className={cl.SearchInput}>
                    <Select
                        label="Тип шаблону"
                        value={params.templateType || ''}
                        options={[
                            { value: '', label: 'Всі типи' },
                            ...templateTypes.map(type => ({
                                value: type.name,
                                label: type.name
                            }))
                        ]}
                        onChange={(e) => handleInputChange('templateType', e.target.value)}
                    />
                </div>
            </div>

            {showAdvanced && (
                <div className={cl.AdvancedFilters}>
                    <div className={cl.FilterGrid}>
                        <div className={cl.FilterGroup}>
                            <Input
                                type="date"
                                label="Створено з"
                                value={params.createdFrom || ''}
                                onChange={(e) => handleInputChange('createdFrom', e.target.value)}
                            />
                        </div>

                        <div className={cl.FilterGroup}>
                            <Input
                                type="date"
                                label="Створено до"
                                value={params.createdTo || ''}
                                onChange={(e) => handleInputChange('createdTo', e.target.value)}
                            />
                        </div>

                        <div className={cl.FilterGroup}>
                            <Input
                                type="date"
                                label="Оновлено з"
                                value={params.updatedFrom || ''}
                                onChange={(e) => handleInputChange('updatedFrom', e.target.value)}
                            />
                        </div>

                        <div className={cl.FilterGroup}>
                            <Input
                                type="date"
                                label="Оновлено до"
                                value={params.updatedTo || ''}
                                onChange={(e) => handleInputChange('updatedTo', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className={cl.ActionButtons}>
                <Button
                        type="submit"
                        text={isLoading ? "Пошук..." : "Пошук"}
                        disabled={isLoading}
                    />
                    
                    <Button
                        type="button"
                        text="Очистити"
                        onClick={handleClear}
                    />
                    
                    <Button
                        type="button"
                        text={showAdvanced ? "Сховати" : "Розширений пошук"}
                        onClick={() => setShowAdvanced(!showAdvanced)}
                    />
                </div>    
        </form>
    );
}