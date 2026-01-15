export const byDate = (items: { createdAt: string }[]) =>
    items.reduce<Record<string, number>>((acc, item) => {
        const date = item.createdAt.slice(0, 10);
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});
