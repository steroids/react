import * as React from 'react';
import _isString from 'lodash-es/isString';
import _omit from 'lodash-es/omit';
import _isEqual from 'lodash-es/isEqual';
import _keys from 'lodash-es/keys';
import {useComponents, useSelector} from '@steroidsjs/core/hooks';
import {useEffectOnce} from 'react-use';
import {useState} from 'react';
import {IComponentsHocOutput} from '../../../hoc/components';
import {getActiveRouteIds, getNavItems, getRouteId, getRouterParams, IRoute} from '../../../reducers/router';
import {IRouteItem} from '../Router/Router';
import {IButtonProps} from '../../form/Button/Button';

export interface ITreeItem extends IButtonProps {
    id?: string | number,
    items?: any[],
    visible?: boolean
}

export interface ITreeProps {
    id?: string;
    items?: ITreeItem[] | string;
    level?: number;
    itemsKey?: string;
    selectedItemId?: string;
    className?: CssClassName;
    view?: any;
    autoOpenLevels?: number;
    onItemClick?: (...args: any[]) => any;
    autoSave?: boolean;
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

interface ITreePrivateProps extends IComponentsHocOutput {
    activeRouteIds?: string[],
    routerParams?: any,
    routes?: IRouteItem[],
    _items?: ITreeItem[] | string;
}

const resolveId = (item, index, parentId) => (parentId ? parentId + '.' : '') + String(item.id || index);

function Tree(props: ITreeProps & ITreePrivateProps) {
    const components = useComponents();
    const STORAGE_KEY_PREFIX = 'tree_';

    //State
    const [selectedUniqId, setSelectedUniqId] = useState<string>(null);
    const [openedItems, setOpenedItems] = useState<{ [key: string] : boolean }>({});

    //Redux connection
    const {routes, selectedItemId, activeRouteIds, routerParams} = useSelector(state => ({
        routes: _isString(props.items) ? getNavItems(state, props.items) : null,
        selectedItemId: _isString(props.items) ? getRouteId(state) : props.selectedItemId,
        activeRouteIds: getActiveRouteIds(state),
        routerParams: getRouterParams(state),
    }));

    //TODO - items normalization

    // const itemsArray = () => {
    //     if (props.routes) {
    //         const routeToItem = (route: IRouteItem) => {
    //             const items = (
    //                 Array.isArray(route.items)
    //                     ? route.items.map(r => routeToItem(r))
    //                     : Object.keys(route.items || {}).map(id => routeToItem(route.items[id]))
    //             ).filter(r => r.visible);
    //
    //             return {
    //                 id: route.id,
    //                 label: route.label || route.title,
    //                 visible: route.isNavVisible !== false,
    //                 toRoute: items.length === 0 ? route.id : null,
    //                 toRouteParams: items.length === 0 ? props.routerParams : null,
    //                 items,
    //             };
    //         };
    //         return props.routes.map(route => routeToItem(route)).filter(r => r.visible);
    //     }
    //     return items || [];
    // };

    const findChildById = (items: ITreeItem[], itemId: string, parentId = '', level = 1) => {
        let finedItem = null;
        if (_isString(items)) {
            return null;
        }

        (items || []).forEach((item, index) => {
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

    const autoOpen = (items: ITreeItem[], parentId = '', level = 1) => {
        let opened = {};

        (items || []).forEach((item, index) => {
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

        const opened = autoOpen(props.items as ITreeItem[]);
        const selectedItem = findChildById(props.items as ITreeItem[], props.selectedItemId);
        setOpenedItems(opened);
        setSelectedUniqId(selectedItem ? selectedItemId.uniqId : null);
    });

    const onItemClick = (e, uniqId, item) => {
        e.preventDefault();
        if (props.onItemClick) {
            props.onItemClick(e, item);
        }

        setSelectedUniqId(selectedUniqId === uniqId ? null : uniqId);

        if (item.items?.length > 0) {
            const newItems = {...openedItems, [uniqId]: !openedItems[uniqId]};
            setOpenedItems(newItems);
            // TODO add  clientStorage
            // const key = STORAGE_KEY_PREFIX + this.props.id;
            // this.props.clientStorage.set(key, JSON.stringify(this.state.opened));
        }
    };

    const getItems = (items: ITreeItem, parentId = '', level = 0) => {
        let result = [];
        if (props.level && level === props.level) {
            return [];
        }

        (items || []).forEach((item, index) => {
            const uniqId = resolveId(item, index, parentId);
            const isOpened = !!openedItems[uniqId];
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

    const items = getItems(props.items as ITreeItem[]);

    return components.ui.renderView(props.view || 'nav.TreeView', {
        ...props,
        items,
    });
}

Tree.defaultProps = {
    itemsKey: 'items',
    autoOpenLevels: 1,
    autoSave: false,
    level: 0,
};

export default Tree;