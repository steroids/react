import * as React from 'react';
import _isString from 'lodash-es/isString';
import _omit from 'lodash-es/omit';
import _isEqual from 'lodash-es/isEqual';
import _keys from 'lodash-es/keys';
import {components, connect, normalize} from '../../../hoc';
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
    routerParams?: object,
    routes?: IRouteItem[],
    _items?: ITreeItem[] | string;
}

interface TreeState {
    opened?: any,
    selectedUniqId?: any,
    activeTab?: any
}

@connect(
    (state, props) => ({
        routes: _isString(props.items) ? getNavItems(state, props.items) : null,
        selectedItemId: _isString(props.items) ? getRouteId(state) : props.selectedItemId,
        activeRouteIds: getActiveRouteIds(state),
        routerParams: getRouterParams(state),
    })
)
@normalize(
    {
        fromKey: 'items',
        toKey: '_items',
        normalizer: (items, props) => {
            if (props.routes) {
                const routeToItem = (route: IRouteItem) => ({
                    id: route.id,
                    label: route.label || route.title,
                    visible: route.isNavVisible !== false,
                    toRoute: !route.items ? route.id : null,
                    toRouteParams: !route.items ? props.routerParams : null,
                    items: Array.isArray(route.items)
                        ? route.items.map(r => routeToItem(r))
                        : Object.keys(route.items || {}).map(id => routeToItem(route.items[id])),
                });
                return props.routes.map(route => routeToItem(route));
            }
            return items || [];
        },
    },
)
@components('ui', 'clientStorage')
export default class Tree extends React.PureComponent<ITreeProps & ITreePrivateProps, TreeState> {
    static STORAGE_KEY_PREFIX = 'tree_';
    static defaultProps = {
        itemsKey: 'items',
        autoOpenLevels: 1,
        autoSave: false,
        level: 0,
    };

    constructor(props) {
        super(props);
        this._onItemClick = this._onItemClick.bind(this);
        this.state = this._initState();
    }

    componentDidUpdate(prevProps) {
        if (
            !_isEqual(prevProps._items, this.props._items) ||
            prevProps.selectedItemId !== this.props.selectedItemId
        ) {
            this.setState(this._initState());
        }
    }

    render() {
        const TreeView = this.props.view || this.props.ui.getView('nav.TreeView');
        return (
            <TreeView
                {...this.props}
                items={this._getItems(this.props._items)}
            />
        );
    }

    _initState() {
        // Initial opened items
        const key = Tree.STORAGE_KEY_PREFIX + this.props.id;
        const opened =
            !this.state && this.props.clientStorage.get(key) && this.props.autoSave
                ? JSON.parse(this.props.clientStorage.get(key))
                : this._autoOpen(this.props._items);
        const selectedItem = this._findChildById(
            this.props._items,
            this.props.selectedItemId
        );
        return {
            opened,
            selectedUniqId: selectedItem ? selectedItem.uniqId : null
        };
    }

    _getItems(items, parentId = '', level = 0) {
        let result = [];
        if (this.props.level && level == this.props.level) {
            return [];
        }

        (items || []).forEach((item, index) => {
            const uniqId = this._resolveId(item, index, parentId);
            const isOpened = !!this.state.opened[uniqId];
            let hasItems = item[this.props.itemsKey] && item[this.props.itemsKey].length > 0;

            if (this.props.level && (level == this.props.level - 1)) {
                hasItems = false;
            }

            result.push({
                ...item,
                uniqId,
                index,
                level,
                isOpened,
                isSelected: this.state.selectedUniqId === uniqId
                    || (
                        this.props.activeRouteIds.includes(item.toRoute)
                        && _isEqual(item.toRouteParams || {}, _omit(this.props.routerParams, _keys(item.toRouteParams)))
                    ),
                hasItems,
                onClick: e => this._onItemClick(e, uniqId, item)
            });
            if (isOpened) {
                result = result.concat(
                    this._getItems(item[this.props.itemsKey], uniqId, level + 1)
                ).filter(Boolean);
            }
        });
        return result;
    }

    _autoOpen(items, parentId = '', level = 1) {
        let opened = {};

        (items || []).forEach((item, index) => {
            const uniqId = this._resolveId(item, index, parentId);
            if (this.props.autoOpenLevels >= level) {
                opened[uniqId] = true;
            }

            if (this.props.selectedItemId === item.id) {
                opened[uniqId] = true;
            }

            if (this.props.selectedItemId) {
                const finedItem = this._findChildById(
                    item[this.props.itemsKey],
                    this.props.selectedItemId
                );
                if (finedItem) {
                    opened[uniqId] = true;
                }
            }
            opened = {
                ...opened,
                ...this._autoOpen(item[this.props.itemsKey], uniqId, level + 1)
            };
        });
        return opened;
    }

    _findChildById(items, itemId, parentId = '', level = 1) {
        let finedItem = null;
        if (_isString(items)) {
            return null;
        }

        (items || []).forEach((item, index) => {
            const uniqId = this._resolveId(item, index, parentId);
            if (!finedItem && (item.id === itemId || uniqId === itemId)) {
                finedItem = {
                    ...item,
                    uniqId,
                    level
                };
            }
            if (!finedItem) {
                finedItem = this._findChildById(
                    item[this.props.itemsKey],
                    itemId,
                    uniqId,
                    level + 1
                );
            }
        });
        return finedItem;
    }

    _resolveId(item, index, parentId) {
        return (parentId ? parentId + '.' : '') + String(item.id || index);
    }

    _onItemClick(e, uniqId, item) {
        e.preventDefault();
        if (this.props.onItemClick) {
            this.props.onItemClick(e, item);
        }
        const newState = {
            selectedUniqId: this.state.selectedUniqId === uniqId ? null : uniqId
        };
        if (item.items) {
            this.setState(
                {
                    ...newState,
                    opened: {
                        ...this.state.opened,
                        [uniqId]: !this.state.opened[uniqId]
                    }
                },
                () => {
                    const key = Tree.STORAGE_KEY_PREFIX + this.props.id;
                    this.props.clientStorage.set(key, JSON.stringify(this.state.opened));
                }
            );
        } else {
            this.setState(newState);
        }
    }
}
