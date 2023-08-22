import * as React from 'react';
import _isString from 'lodash-es/isString';
import _omit from 'lodash-es/omit';
import _isEqual from 'lodash-es/isEqual';
import _keys from 'lodash-es/keys';
import {useEffectOnce} from 'react-use';
import {useCallback, useMemo, useState} from 'react';
import {useComponents, useSelector} from '../../../hooks';
import {getActiveRouteIds, getNavItems, getRouteId, getRouterParams} from '../../../reducers/router';
import {IRouteItem} from '../Router/Router';
import {IButtonProps} from '../../form/Button/Button';

export interface ITreeItem extends IButtonProps {
    /**
     * Идентификатор узла
     */
    id?: string | number,

    /**
     * Вложенные элементы
     * [{id: 2, label: 'Nested element', items: [...]}]
     */
    items?: any[],

    /**
     * Скрыть или показать узел
     * @example true
     */
    visible?: boolean
}

/**
 * Tree
 * Компонент, который представляет в виде дерева список с иерархической структурой данных
 */
export interface ITreeProps {
    /**
     * Идентификатор (ключ) для сохранения в LocalStorage коллекции с раскрытыми узлами
     * @example 'exampleTree'
     */
    id?: string;

    /**
     * Коллекция с узлами. Также можно передать идентификатор роута, тогда компонент найдет все
     * вложенные роуты и отобразит их в виде дерева.
     * @example [{id: 1, label: 'Root', items: [...]}] | 'root'
     */
    items?: ITreeItem[] | string;

    /**
     * Ограничивает максимальный уровень вложенности дерева
     * @example 2
     */
    level?: number;

    /**
     * Ключ для доступа к вложенным элементам узла
     * @example 'items'
     */
    itemsKey?: string;

    /**
     * Идентификатор узла, которой нужно отобразить в раскрытом виде
     * @example 2
     */
    selectedItemId?: string | number;

    /**
     * CSS-класс для элемента отображения
     */
    className?: CssClassName;

    /**
     * Переопределение view React компонента для кастомизации отображения элемента
     * @example MyCustomView
     */
    view?: CustomView;

    /**
     * Максимальный уровень вложенности, до которого все узлы будут отображаться в развёрнутом виде
     * @example 1
     */
    autoOpenLevels?: number;

    /**
     * Обработчик на клик по узлу
     * @param args
     */
    onItemClick?: (...args: any[]) => any;

    /**
     * Отображать раскрытыми узлы из LocalStorage
     * @example true
     */
    autoSave?: boolean;

    /**
    *  Используется для управления раскрытием всех элементов в дереве
    * @example: true
    */
    alwaysOpened?: boolean;

    [key: string]: any;
}

export interface ITreeViewProps extends ITreeProps {
    items: (ITreeItem & {
        uniqId: string,
        className: CssClassName,
        index: number,
        level: number,
        isOpened: boolean,
        isSelected: boolean,
        hasItems: boolean,
        onClick: (e: Event | React.MouseEvent | any) => void,
    })[],
    levelPadding?: number
}

const resolveId = (item, index, parentId) => (parentId ? parentId + '.' : '') + String(item.id || index);

function Tree(props: ITreeProps) {
    const components = useComponents();
    const STORAGE_KEY_PREFIX = 'tree_';

    //State
    const [selectedUniqId, setSelectedUniqId] = useState<string>(null);
    const [openedItems, setOpenedItems] = useState<{[key: string]: boolean}>({});

    //Redux connection
    const {routes, selectedItemId, activeRouteIds, routerParams} = useSelector(state => ({
        routes: _isString(props.items) ? getNavItems(state, props.items) : null,
        selectedItemId: _isString(props.items) ? getRouteId(state) : props.selectedItemId,
        activeRouteIds: getActiveRouteIds(state),
        routerParams: getRouterParams(state),
    }));

    const items = useMemo(() => {
        if (routes) {
            const routeToItem = (route: IRouteItem) => {
                const routeItems = (
                    Array.isArray(route.items)
                        ? route.items.map(r => routeToItem(r))
                        : Object.keys(route.items || {}).map(id => routeToItem(route.items[id]))
                ).filter(r => r.visible);

                return {
                    id: route.id,
                    label: route.label || route.title,
                    visible: route.isNavVisible !== false,
                    toRoute: routeItems.length === 0 ? route.id : null,
                    toRouteParams: routeItems.length === 0 ? props.routerParams : null,
                    items: routeItems,
                    icon: route.icon,
                };
            };
            return (routes as IRouteItem[]).map(route => routeToItem(route)).filter(r => r.visible);
        }

        if (Array.isArray(props.items)) {
            return props.items;
        }
        return [];
    }, [props.items, props.routerParams, routes]);

    const findChildById = (sourceItems: ITreeItem[], itemId: string, parentId = '', level = 1) => {
        let finedItem = null;
        if (_isString(sourceItems)) {
            return null;
        }

        (sourceItems || []).forEach((item, index) => {
            const uniqId = resolveId(item, index, parentId);
            if (!finedItem && (item.id === itemId || uniqId === itemId)) {
                finedItem = {
                    ...item,
                    uniqId,
                    level,
                };
            }
            if (!finedItem) {
                finedItem = findChildById(
                    item[props.itemsKey],
                    itemId,
                    uniqId,
                    level + 1,
                );
            }
        });
        return finedItem;
    };

    const autoOpen = (sourceItems: ITreeItem[], parentId = '', level = 1) => {
        let opened = {};

        (sourceItems || []).forEach((item, index) => {
            const uniqId = resolveId(item, index, parentId);
            if (props.autoOpenLevels >= level) {
                opened[uniqId] = true;
            }

            if (selectedItemId === item.id) {
                opened[uniqId] = true;
            }

            if (selectedItemId) {
                const finedItem = findChildById(
                    item[props.itemsKey],
                    selectedItemId,
                );
                if (finedItem) {
                    opened[uniqId] = true;
                }
            }
            opened = {
                ...opened,
                ...autoOpen(item[props.itemsKey], uniqId, level + 1),
            };
        });
        return opened;
    };

    // Initial opened items
    useEffectOnce(() => {
        // TODO add  clientStorage
        // const key = STORAGE_KEY_PREFIX + props.id;
        // const opened = !this.state && this.props.clientStorage.get(key) && this.props.autoSave
        //     ? JSON.parse(this.props.clientStorage.get(key))
        //     : this._autoOpen(this.props._items);

        const opened = autoOpen(items);
        const selectedItem = findChildById(items as ITreeItem[], selectedItemId);
        setOpenedItems(opened);
        setSelectedUniqId(selectedItem ? selectedItemId.uniqId : null);
    });

    const onItemClick = useCallback((e, uniqId, item) => {
        e.preventDefault();
        if (props.onItemClick) {
            props.onItemClick.call(null, e, item);
        }

        setSelectedUniqId(selectedUniqId === uniqId ? null : uniqId);

        if (item.items?.length > 0) {
            const newItems = {...openedItems, [uniqId]: !openedItems[uniqId]};
            setOpenedItems(newItems);
            // TODO add  clientStorage
            // const key = STORAGE_KEY_PREFIX + this.props.id;
            // this.props.clientStorage.set(key, JSON.stringify(this.state.opened));
        }
    }, [openedItems, props.onItemClick, selectedUniqId]);

    const resultItems = useMemo(() => {
        const getItems = (sourceItems: ITreeItem, parentId = '', level = 0) => {
            let result = [];
            if (props.level && level === props.level) {
                return [];
            }

            (sourceItems || []).forEach((item, index) => {
                const uniqId = resolveId(item, index, parentId);
                const isOpened = props.alwaysOpened || !!openedItems[uniqId];
                let hasItems = item[props.itemsKey] && item[props.itemsKey].length > 0;

                if (props.level && (level === props.level - 1)) {
                    hasItems = false;
                }

                result.push({
                    ...item,
                    uniqId,
                    index,
                    level,
                    isOpened,
                    isSelected: selectedUniqId === uniqId
                        || (
                            activeRouteIds.includes(item.toRoute)
                            && _isEqual(item.toRouteParams || {}, _omit(routerParams, _keys(item.toRouteParams)))
                        ),
                    hasItems,
                    onClick: e => onItemClick(e, uniqId, item),
                });
                if (isOpened) {
                    result = result.concat(
                        getItems(item[props.itemsKey], uniqId, level + 1),
                    ).filter(Boolean);
                }
            });
            return result;
        };

        return getItems(items as ITreeItem[]);
    }, [activeRouteIds, items, onItemClick, openedItems, props.isParentAlwaysOpened, props.itemsKey, props.level, routerParams, selectedUniqId]);

    return components.ui.renderView(props.view || 'nav.TreeView', {
        ...props,
        items: resultItems,
    });
}

Tree.defaultProps = {
    itemsKey: 'items',
    autoOpenLevels: 1,
    autoSave: false,
    level: 0,
};

export default Tree;
