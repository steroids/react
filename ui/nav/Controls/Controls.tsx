import * as React from 'react';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';
import {IButtonProps} from '../../form/Button/Button';
import {INavProps} from '../Nav/Nav';

export interface IControlItem extends IButtonProps {
    id?: string,
    visible?: boolean,
    content?: React.ReactNode | JSX.Element,
    contentProps?: any,
    position?: 'left' | 'right'
}

export interface IControlsProps {
    items?: IControlItem[],
    navProps?: INavProps,
    view?: any,
}

export interface IControlsViewProps extends IControlsProps {
    className?: string,
    items: (IControlItem & {
        icon?: string,
        label?: string | any,
        confirm?: string,
        color?: ColorName,
        outline?: boolean,
        position?: 'right' | 'left'
    })[]
}

interface IControlsPrivateProps extends IComponentsHocOutput {

}

@components('ui')
export default class Controls extends React.PureComponent<IControlsProps & IControlsPrivateProps> {

    render() {
        const defaultItems = {
            index: {
                actionType: 'list',
                label: __('К списку'),
                icon: 'keyboard_arrow_left',
                color: 'secondary',
                outline: true
            },
            create: {
                actionType: 'list',
                label: __('Добавить'),
                icon: 'add_circle',
                color: 'success',
                outline: true
            },
            view: {
                label: __('Просмотр'),
                color: 'secondary',
                outline: true
            },
            update: {
                label: __('Редактировать'),
                color: 'secondary',
                outline: true
            },
            delete: {
                icon: 'delete',
                label: __('Удалить'),
                confirm: __('Удалить запись?'),
                color: 'danger',
                outline: true,
                position: 'right'
            }
        };
        const ControlsView = this.props.view || this.props.ui.getView('nav.ControlsView');
        return (
            <ControlsView
                {...this.props}
                items={this.props.items.map(item => ({
                    ...defaultItems[item.id],
                    ...item
                }))}
            />
        );
    }

}
