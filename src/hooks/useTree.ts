import React, {useCallback, useEffect, useMemo, useState} from 'react';
import _isString from 'lodash-es/isString';
import _omit from 'lodash-es/omit';
import _join from 'lodash-es/join';
import _isEqual from 'lodash-es/isEqual';
import _isEmpty from 'lodash-es/isEmpty';
import _isNil from 'lodash-es/isNil';
import _keys from 'lodash-es/keys';
import {IRouteItem} from '@steroidsjs/core/ui/nav/Router/Router';
import {IButtonProps} from '@steroidsjs/core/ui/form/Button/Button';
import {useBeforeUnload, useMount, useUnmount} from 'react-use';
import useComponents from './useComponents';
import useSelector from './useSelector';
import {getActiveRouteIds, getNavItems, getRouteId, getRouterParams} from '../reducers/router';

export interface ITreeItem extends IButtonProps {
    /**
     * Идентификатор узла
     */
    id: string | number | boolean,

    /**
     * Вложенные элементы
     * @example
     * [
     *  {
     *   id: 2,
     *   label: 'Nested element',
     *   items: [...]
     *  }
     * ]
     */
    items?: ITreeItem[],

    /**
     * Скрыть или показать узел
     * @example true
     */
    visible?: boolean,
}

export interface IPreparedTreeItem extends ITreeItem {
    uniqueId: string,
    index: number,
    level: number,
    isOpened: boolean,
    isSelected: boolean,
    hasItems: boolean,
    onClick: (e: Event | React.MouseEvent | any) => void,
    className?: CssClassName,
}

export interface ITreeOutput {
    treeItems: IPreparedTreeItem[],
}

export interface ITreeConfig {
    /**
     * Коллекция с узлами. Также можно передать идентификатор роута, тогда компонент найдет все
     * вложенные роуты и отобразит их в виде дерева.
     * @example
     * [
     *  {
     *   id: 1,
     *   label: 'Root',
     *   items: [...]
     *  }
     * ] | 'root'
     */
    items?: ITreeItem[] | string,

    /**
     * Ограничивает максимальный уровень вложенности дерева
     * @example 2
     */
    level?: number,

    /**
     * Ключ для доступа к вложенным элементам узла
     * @example 'items'
     */
    itemsKey?: string,

    /**
     * Идентификатор узла, которой нужно отобразить в раскрытом виде
     * @example 2
     */
    selectedItemId?: string | number,

    /**
     * Максимальный уровень вложенности, до которого все узлы будут отображаться в развёрнутом виде
     * @example 1
     */
    autoOpenLevels?: number,

    /**
     * Обработчик на клик по узлу
     * @param args
     */
    onExpand?: (...args: any[]) => any,

    /**
     *  Используется для управления раскрытием всех элементов в дереве
     * @example: true
     */
    alwaysOpened?: boolean,

    /**
     *  Текущая страница, используется для корректного отображения пагинации
     * @example: 1
     */
    currentPage?: number,

    /**
     *  Количество элементов на странице, используется для корректного отображения пагинации
     * @example: 4
     */
    itemsOnPage?: number,

    /**
     *  Параметры роутинга
     * @example: true
     */
    routerParams?: any,

    /**
     * При повторном нажатии на выбранный элемент из дерева, он продолжит отображаться как активный.
     * @example true
    */
    useSameSelectedItemId?: boolean,

    /**
     * Сохранение в localStorage уровней вложенности.
     * @example true
    */
    saveInClientStorage?: boolean,

    /**
     * Идентификатор (ключ) для сохранения в LocalStorage коллекции.
     * @example 'exampleTree'
     */
    clientStorageId?: string,
}

const INITIAL_CURRENT_LEVEL = 0;
const DOT_SEPARATOR = '.';
const EMPTY_PARENT_ID = '';
const FIRST_LEVEL_PARENT_ID = '0';
const CLIENT_STORAGE_KEY = '_tree';

const defaultProps = {
    itemsKey: 'items',
    autoOpenLevels: 0,
};

const getTreeItemUniqueId = (item, index, parentId) => _join([parentId || FIRST_LEVEL_PARENT_ID, String(item.id || index)], DOT_SEPARATOR);

const routeToItem = (route: IRouteItem, routerParams) => {
    const routeItems = (
        Array.isArray(route.items)
            ? route.items.map(r => routeToItem(r, routerParams))
            : Object.keys(route.items || {}).map(id => routeToItem(route.items[id], routerParams))
    ).filter(r => r.visible);

    return {
        id: route.id.toLowerCase(),
        label: route.label || route.title,
        visible: route.isNavVisible !== false,
        toRoute: routeItems.length === 0 ? route.id : null,
        toRouteParams: routeItems.length === 0 ? routerParams : null,
        items: routeItems,
        icon: route.icon,
    };
};

const findChildById = (
    sourceItems: ITreeItem[],
    itemId: string | number,
    primaryKey: string,
    parentId = EMPTY_PARENT_ID,
    level = 1,
) => {
    if (_isString(sourceItems)) {
        return null;
    }

    let foundedItem = null;

    (sourceItems || []).forEach((item, index) => {
        const uniqueId = getTreeItemUniqueId(item, index, parentId);

        if (!foundedItem && (item.id === itemId || uniqueId === itemId)) {
            foundedItem = {
                ...item,
                uniqueId,
                level,
            };
        }

        if (!foundedItem) {
            foundedItem = findChildById(
                item[primaryKey],
                itemId,
                primaryKey,
                uniqueId,
                level + 1,
            );
        }
    });

    return foundedItem;
};

const getAutoExpandedItems = (
    sourceItems: ITreeItem[],
    selectedItemId: string | number,
    primaryKey: string,
    autoOpenLevels = 1,
    parentId = EMPTY_PARENT_ID,
    level = 1,
) => {
    let opened = {};

    (sourceItems || []).forEach((item, index) => {
        const uniqueId = getTreeItemUniqueId(item, index, parentId);
        if (autoOpenLevels >= level) {
            opened[uniqueId] = true;
        }

        if (selectedItemId === item.id) {
            opened[uniqueId] = true;
        }

        if (selectedItemId) {
            const finedItem = findChildById(
                item[primaryKey],
                selectedItemId,
                primaryKey,
            );
            if (finedItem) {
                opened[uniqueId] = true;
            }
        }

        opened = {
            ...opened,
            ...getAutoExpandedItems(item[primaryKey], selectedItemId, primaryKey, autoOpenLevels, uniqueId, level + 1),
        };
    });

    return opened;
};

const isSelectedItem = (selectedUniqueId, uniqueId, activeRouteIds, item, routerParams) => (
    selectedUniqueId === uniqueId
    || (
        (activeRouteIds || []).includes(item.toRoute)
        && _isEqual(item.toRouteParams || {}, _omit(routerParams, _keys(item.toRouteParams)))
    )
);

export default function useTree(config: ITreeConfig): ITreeOutput {
    // Get primary key
    const primaryKey = config.itemsKey || defaultProps.itemsKey;

    const [selectedUniqueId, setSelectedUniqueId] = useState<string>(null);

    const [expandedItems, setExpandedItems] = useState<{[key: string]: boolean,}>({});

    const {clientStorage} = useComponents();

    //Redux connection
    const {
        routes,
        selectedItemId,
        activeRouteIds,
        routerParams,
    } = useSelector(state => ({
        routes: _isString(config.items) ? getNavItems(state, config.items) : null,
        selectedItemId: _isString(config.items) ? getRouteId(state) : config.selectedItemId,
        activeRouteIds: getActiveRouteIds(state),
        routerParams: getRouterParams(state),
    }));

    const items = useMemo(() => {
        if (!_isNil(routes)) {
            return (routes as IRouteItem[])
                .map(route => routeToItem(route, config.routerParams))
                .filter(route => route.visible);
        }

        if (Array.isArray(config.items)) {
            return config.items;
        }

        return [];
    }, [config.items, config.routerParams, routes]);

    // Initial expanded items
    useEffect(() => {
        setExpandedItems(
            getAutoExpandedItems(items, selectedItemId, primaryKey, config.autoOpenLevels),
        );

        const selectedItem = findChildById(items as ITreeItem[], selectedItemId, primaryKey);
        setSelectedUniqueId(selectedItem ? selectedItem.uniqueId : null);
    }, [items]);

    const localTree = useMemo(() => {
        const rawLocalTree = clientStorage.get(CLIENT_STORAGE_KEY);

        return rawLocalTree ? JSON.parse(rawLocalTree) : {};
    }, [])

    const saveInClientStorage = () => {
        if (config.saveInClientStorage) {
            localTree[config.clientStorageId] = expandedItems;
            clientStorage.set(CLIENT_STORAGE_KEY, JSON.stringify(localTree));
        }
    };

    useMount(() => {
        if (config.saveInClientStorage) {
            const treeData = localTree[config.clientStorageId];

            if (treeData) {
                setExpandedItems(treeData);
            }
        }
    });

    useUnmount(() => {
        saveInClientStorage();
    });

    useBeforeUnload(() => {
        saveInClientStorage();
        return true;
    });

    const onExpand = useCallback((e: Event | React.MouseEvent, uniqueId: string, item: ITreeItem) => {
        e.preventDefault();
        if (config.onExpand) {
            config.onExpand.call(null, e, item);
        }

        const sameUniqueIdAccordingToSettings = config.useSameSelectedItemId ? uniqueId : null;
        setSelectedUniqueId(selectedUniqueId === uniqueId ? sameUniqueIdAccordingToSettings : uniqueId);

        if (!_isEmpty(item[primaryKey])) {
            setExpandedItems({
                ...expandedItems,
                [uniqueId]: !expandedItems[uniqueId],
            });
        }
    }, [config.onExpand, config.useSameSelectedItemId, expandedItems, primaryKey, selectedUniqueId]);

    const resultTreeItems = useMemo(() => {
        const getItems = (
            sourceItems: ITreeItem[],
            parentId = EMPTY_PARENT_ID,
            currentLevel = INITIAL_CURRENT_LEVEL,
        ) => {
            if (config.level && currentLevel === config.level) {
                return [];
            }

            if (config.currentPage && config.itemsOnPage && currentLevel === INITIAL_CURRENT_LEVEL) {
                const startIndex = (config.currentPage - 1) * config.itemsOnPage;
                sourceItems = sourceItems.slice(startIndex, startIndex + config.itemsOnPage);
            }

            return (sourceItems || []).reduce((treeItems, item, index) => {
                const uniqueId = getTreeItemUniqueId(item, index, parentId);

                const treeItem = {
                    ...item,
                    index,
                    level: currentLevel,
                    uniqueId,
                    isOpened: config.alwaysOpened || !!expandedItems[uniqueId],
                    hasItems: !_isEmpty(item[primaryKey]),
                    isSelected: isSelectedItem(selectedUniqueId, uniqueId, activeRouteIds, item, routerParams),
                    onClick: (e) => onExpand(e, uniqueId, item),
                };

                // Ограничивает максимальный уровень вложенности дерева
                if (config.level && (currentLevel === config.level - 1)) {
                    treeItem.hasItems = false;
                }

                treeItems.push(treeItem);

                if (treeItem.isOpened) {
                    const nestedItem = getItems(item[primaryKey], uniqueId, currentLevel + 1);

                    treeItems = treeItems.concat(nestedItem).filter(Boolean);
                }

                return treeItems;
            }, [] as IPreparedTreeItem[]);
        };

        return getItems(items);
        // eslint-disable-next-line max-len
    }, [activeRouteIds, config.alwaysOpened, config.currentPage, config.itemsOnPage, config.level, expandedItems, items, onExpand, primaryKey, routerParams, selectedUniqueId]);

    return {
        treeItems: resultTreeItems,
    };
}
