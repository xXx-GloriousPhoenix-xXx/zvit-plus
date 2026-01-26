export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Б';
    
    const k = 1024;
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

export function formatQuantity(quantity: number): string {
    if (quantity === 0) return '0';

    const k = 1000;
    const sizes = ['', ' K', ' M', ' B', ' T'];
    const i = Math.floor(Math.log(quantity) / Math.log(k));

    return parseFloat((quantity / Math.pow(k, i)).toFixed(1)) + sizes[i];
}