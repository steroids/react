import React from 'react';
import PropTypes from 'prop-types';

import {components} from '../../../hoc';

@components('ui')
export default class Controls extends React.PureComponent {

    static propTypes = {
        items: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string,
            label: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.any,
            ]),
            url: PropTypes.string,
            onClick: PropTypes.func,
            className: PropTypes.string,
            view: PropTypes.elementType,
            visible: PropTypes.bool,
            content: PropTypes.oneOfType([
                PropTypes.node,
                PropTypes.elementType,
            ]),
            contentProps: PropTypes.object,
            position: PropTypes.oneOf(['left', 'right']),
        })),
    };

    render() {
        const defaultItems = {
            index: {
                actionType: 'list',
                label: __('К списку'),
                icon: 'keyboard_arrow_left',
                color: 'secondary',
                outline: true,
                //to: '/',
                //visible: actionId !== 'index',
            },
            create: {
                actionType: 'list',
                label: __('Добавить'),
                icon: 'add_circle',
                color: 'success',
                outline: true,
                //to: '/create',
                //visible: actionId === 'index' && available.indexOf('create') !== -1 && actionType === 'list',
            },
            view: {
                label: __('Просмотр'),
                color: 'secondary',
                outline: true,
                //to: `/${itemId}`,
                //visible: available.indexOf('view') !== -1,
            },
            update: {
                label: __('Редактировать'),
                color: 'secondary',
                outline: true,
                //to: `/${itemId}/update`,
                //visible: available.indexOf('update') !== -1,
            },
            delete: {
                icon: 'delete',
                label: __('Удалить'),
                confirm: __('Удалить запись?'),
                color: 'danger',
                outline: true,
                position: 'right',
                //visible: available.indexOf('delete') !== -1,
                //onClick: () => this._onDelete(itemId),
            },
        };

        const ControlsView = this.props.view || this.props.ui.getView('crud.ControlsView');
        return (
            <ControlsView
                {...this.props}
                items={this.props.items.map(item => ({
                    ...defaultItems[item.id],
                    ...item,
                }))}
            />
        );
    }

}
