import * as React from 'react';
import _get from 'lodash-es/get';
import _has from 'lodash-es/has';
import _isFunction from 'lodash-es/isFunction';
import _upperFirst from 'lodash-es/upperFirst';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';

interface IActionColumnProps {
    primaryKey?: string;
    actions?: any;
    item?: any;
    getView?: any;
    ui?: any;
    view?: any;
}

interface IActionColumnPrivateProps extends IComponentsHocOutput {

}

@components('ui')
export default class ActionColumn extends React.PureComponent<IActionColumnProps & IActionColumnPrivateProps> {

    render() {
        const id = _get(this.props.item, this.props.primaryKey);
        const actions = _isFunction(this.props.actions)
            ? this.props.actions(this.props.item, this.props.primaryKey)
            : this.props.actions;
        const defaultActions = {
            view: {
                rule: 'view',
                icon: 'visibility',
                label: __('Просмотреть')
            },
            update: {
                rule: 'update',
                icon: 'mode_edit',
                label: __('Редактировать')
            },
            delete: {
                rule: 'delete',
                icon: 'delete',
                label: __('Удалить'),
                confirm: __('Удалить запись?')
            }
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
                        visible:
                            action.visible !== false &&
                            (!_has(this.props.item, canKey) || !!this.props.item[canKey])
                    };
                })}
            />
        );
    }

}
