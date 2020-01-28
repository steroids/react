import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash-es/get';
import _has from 'lodash-es/has';
import _isFunction from 'lodash-es/isFunction';
import _upperFirst from 'lodash-es/upperFirst';

import {components} from '../../../hoc';

@components('ui')
export default class ActionColumn extends React.PureComponent {

    static propTypes = {
        primaryKey: PropTypes.string,
        actions: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.object),
            PropTypes.func,
        ]),
        item: PropTypes.object,
    };

    render() {
        const id = _get(this.props.item, this.props.primaryKey);
        const actions = _isFunction(this.props.actions)
            ? this.props.actions(this.props.item, this.props.primaryKey)
            : this.props.actions;
        const defaultActions = {
            view: {
                rule: 'view',
                icon: 'visibility',
                label: __('Просмотреть'),
                //url: location.pathname + `/view/${id}`,
            },
            update: {
                rule: 'update',
                icon: 'mode_edit',
                label: __('Редактировать'),
                //url: location.pathname + `/update/${id}`,
            },
            delete: {
                rule: 'delete',
                icon: 'delete',
                label: __('Удалить'),
                confirm: __('Удалить запись?'),
                //url: location.pathname + `/delete/${id}`,
            },
        };

        const ActionColumnView = this.props.view || this.props.ui.getView('list.ActionColumnView');

        return (
            <ActionColumnView
                {...this.props}
                items={actions.map(action => {
                    const canKey = 'can' + _upperFirst(action.id);
                    return {
                        ...defaultActions[action.id],
                        ...action,
                        visible: action.visible !== false && (!_has(this.props.item, canKey) || !!this.props.item[canKey]),
                    };
                })}
            />
        );
    }

}
