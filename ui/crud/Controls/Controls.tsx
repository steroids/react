import * as React from 'react';
import {components} from '../../../hoc';

interface IControlsProps {
    items?: {
        id?: string,
        label?: string | any,
        url?: string,
        onClick?: (...args: any[]) => any,
        className?: string,
        view?: any,
        visible?: boolean,
        content?: React.ReactNode | JSX.Element,
        contentProps?: any,
        position?: 'left' | 'right'
    }[];
    map?: any;
    getView?: any;
    ui?: any;
    view?: any;
}

@components('ui')
export default class Controls extends React.PureComponent<IControlsProps, {}> {
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
        const ControlsView =
            this.props.view || this.props.ui.getView('crud.ControlsView');
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
