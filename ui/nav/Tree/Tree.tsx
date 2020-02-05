import * as React from 'react';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';

interface ITreeProps {
    id?: string;
    items?: {
        id?: string | number,
        label?: string | any,
        items?: any[],
        visible?: boolean
    }[];
    itemsKey?: string;
    selectedItemId?: string;
    className?: string;
    view?: any;
    autoOpenLevels?: number;
    onItemClick?: (...args: any[]) => any;
    autoSave?: boolean;
}

interface ITreePrivateProps extends IComponentsHocOutput {

}

interface TreeState {
    opened?: any,
    selectedUniqId?: any,
}

@components('ui', 'clientStorage')
export default class Tree extends React.PureComponent<ITreeProps & ITreePrivateProps, TreeState> {
    static STORAGE_KEY_PREFIX = 'tree_';
    static defaultProps = {
        itemsKey: 'items',
        autoOpenLevels: 1,
        autoSave: false
    };

    constructor(props) {
        super(props);
        this._onItemClick = this._onItemClick.bind(this);
        this.state = this._initState();
    }

    componentDidUpdate(prevProps) {
        if (
            (!prevProps.items && this.props.items) ||
            prevProps.selectedItemId !== this.props.selectedItemId
        ) {
            this.setState(this._initState());
        }
    }

    render() {
        const TreeView = this.props.view || this.props.ui.getView('nav.TreeView');
        return (
            <TreeView {...this.props} items={this._getItems(this.props.items)}/>
        );
    }

    _initState() {
        // Initial opened items
        const key = Tree.STORAGE_KEY_PREFIX + this.props.id;
        const opened =
            !this.state && this.props.clientStorage.get(key)
                ? JSON.parse(this.props.clientStorage.get(key))
                : this._autoOpen(this.props.items);
        const selectedItem = this._findChildById(
            this.props.items,
            this.props.selectedItemId
        );
        return {
            opened,
            selectedUniqId: selectedItem ? selectedItem.uniqId : null
        };
    }

    _getItems(items, parentId = "", level = 0) {
        let result = [];
        (items || []).forEach((item, index) => {
            const uniqId = this._resolveId(item, index, parentId);
            const isOpened = !!this.state.opened[uniqId];
            result.push({
                ...item,
                uniqId,
                index,
                level,
                isOpened,
                isSelected: this.state.selectedUniqId === uniqId,
                hasItems:
                    item[this.props.itemsKey] && item[this.props.itemsKey].length > 0,
                onClick: e => this._onItemClick(e, uniqId, item)
            });
            if (isOpened) {
                result = result.concat(
                    this._getItems(item[this.props.itemsKey], uniqId, level + 1)
                );
            }
        });
        return result;
    }

    _autoOpen(items, parentId = "", level = 1) {
        let opened = {};
        (items || []).forEach((item, index) => {
            const uniqId = this._resolveId(item, index, parentId);
            if (this.props.autoOpenLevels >= level) {
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

    _findChildById(items, itemId, parentId = "", level = 1) {
        let finedItem = null;
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
        return (parentId ? parentId + '.' : "") + String(item.id || index);
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
