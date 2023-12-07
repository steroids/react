import React from 'react';
import {ITreeItem, getTreeItemUniqueId} from './useTree';

const TOP_TREE_LEVEL_VALUE = 0;

export const prepareItemsToTree = (
    sourceItems: ITreeItem[],
    openedTreeItems: Record<string, boolean>,
    currentPage: number | null,
    itemsOnPage: number | null,
    onTreeItemClick: (uniqueId: string, item: Record<string, any>) => void,
    parentId = '',
    currentLevel = TOP_TREE_LEVEL_VALUE,
) => {
    let treeItems = [];

    if (currentPage && itemsOnPage && currentLevel === TOP_TREE_LEVEL_VALUE) {
        const startIndex = (currentPage - 1) * itemsOnPage;
        sourceItems = sourceItems.slice(startIndex, startIndex + itemsOnPage);
    }

    (sourceItems || []).forEach((item, index) => {
        const uniqueId = getTreeItemUniqueId(item, index, parentId);
        const isOpened = !!openedTreeItems[uniqueId];
        const hasItems = !!(item.items && item.items.length > 0);

        treeItems.push({
            ...item,
            uniqueId,
            level: currentLevel,
            isOpened,
            hasItems,
            onTreeItemClick,
        });

        if (isOpened) {
            treeItems = treeItems.concat(
                prepareItemsToTree(
                    item.items,
                    openedTreeItems,
                    currentPage,
                    itemsOnPage,
                    onTreeItemClick,
                    uniqueId,
                    currentLevel + 1,
                ),
            ).filter(Boolean);
        }
    });

    return treeItems;
};

export default function useTreeItems(list: any) {
    const [openedTreeItems, setOpenedTreeItems] = React.useState<Record<string, boolean>>({});

    const onTreeItemClick = React.useCallback((uniqueId: string, item: Record<string, any>) => {
        if (item.items?.length > 0) {
            setOpenedTreeItems((prevItems) => (
                {...prevItems, [uniqueId]: !prevItems[uniqueId]}
            ));
        }
    }, []);

    const getTreeItems = React.useCallback(
        (sourceItems: ITreeItem[]) => prepareItemsToTree(
            sourceItems,
            openedTreeItems,
            list?.page,
            list?.pageSize,
            onTreeItemClick,
        ),
        [onTreeItemClick, openedTreeItems, list],
    );

    return {
        openedTreeItems,
        getTreeItems,
    };
}
