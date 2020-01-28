import React from 'react';
import PropTypes from 'prop-types';

import {components} from '../../../hoc';

@components('ui', 'clientStorage')
export default class Tree extends React.PureComponent {

    static propTypes = {
        id: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            label: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.any,
            ]),
            items: PropTypes.array,
            visible: PropTypes.bool,
        })),
        itemsKey: PropTypes.string,
        className: PropTypes.string,
        view: PropTypes.elementType,
        itemView: PropTypes.elementType,
        autoOpenLevels: PropTypes.number,
        onItemClick: PropTypes.func,
        autoSave: PropTypes.bool,
    };

    static STORAGE_KEY_PREFIX = 'tree_';

    static defaultProps = {
        itemsKey: 'items',
        autoOpenLevels: 1,
        autoSave: false,
    };

    constructor() {
        super(...arguments);

        this._onItemClick = this._onItemClick.bind(this);

        // Initial opened items
        const key = Tree.STORAGE_KEY_PREFIX + this.props.id;
        const opened = this.props.clientStorage.get(key)
            ? JSON.parse(this.props.clientStorage.get(key))
            : this._autoOpen(this.props.items);

        this.state = {
            opened,
            selectedUniqId: null,
        };
    }

    componentDidUpdate(prevProps) {
        const key = Tree.STORAGE_KEY_PREFIX + this.props.id;
        if (!prevProps.items && this.props.items && !this.props.clientStorage.get(key)) {
            this.setState({
                opened: this._autoOpen(this.props.items),
            });
        }
    }

    render() {
        const TreeView = this.props.view || this.props.ui.getView('nav.TreeView');
        return (
            <TreeView
                {...this.props}
                items={this._getItems(this.props.items)}
            />
        );
    }

    _getItems(items, parentId = '', level = 0) {
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
                hasItems: item[this.props.itemsKey] && item[this.props.itemsKey].length > 0,
                onClick: e => this._onItemClick(e, uniqId, item),
            });
            if (isOpened) {
                result = result.concat(this._getItems(item[this.props.itemsKey], uniqId, level + 1));
            }
        });
        return result;
    }

    _autoOpen(items, parentId = '', level = 1) {
        let opened = {};
        (items || []).forEach((item, index) => {
            if (this.props.autoOpenLevels >= level) {
                const uniqId = this._resolveId(item, index, parentId);
                opened[uniqId] = true;
                opened = {
                    ...opened,
                    ...this._autoOpen(item[this.props.itemsKey], uniqId, level + 1),
                };
            }
        });
        return opened;
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
            selectedUniqId: this.state.selectedUniqId === uniqId ? null : uniqId,
        };
        if (item.items) {
            this.setState({
                ...newState,
                opened: {
                    ...this.state.opened,
                    [uniqId]: !this.state.opened[uniqId],
                },
            }, () => {
                const key = Tree.STORAGE_KEY_PREFIX + this.props.id;
                this.props.clientStorage.set(key, JSON.stringify(this.state.opened));
            });
        } else {
            this.setState(newState);
        }
    }

}
