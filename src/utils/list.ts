export const generateUniqIdForTreeItem = (item, index, parentId) => (parentId || '0') + '.' + String(item.id || index);
