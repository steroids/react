import {useMemo} from 'react';
import {useComponents} from '../../../hooks';
import {IButtonProps} from '../../form/Button/Button';
import {INavProps} from '../Nav/Nav';

export interface IControlItem extends IButtonProps {
    /**
     * Идентификатор элемента управления
     * @example 'create'
     */
    id?: string,

    /**
     * Скрыть или показать элемент
     * @example true
     */
    visible?: boolean,

    /**
     * Расположение элемента
     * @example 'left'
     */
    position?: 'left' | 'right',
}

export interface IControlsProps {
    items?: IControlItem[],
    navProps?: INavProps,
    view?: any,
    className?: string,
    [key: string]: any,
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
    })[],
}

export default function Controls(props: IControlsProps) {
    const defaultItems = {
        index: {
            icon: 'back',
            label: __('К списку'),
            color: 'secondary',
            outline: true,
        },
        create: {
            icon: 'create',
            label: __('Добавить'),
            color: 'success',
            outline: true,
        },
        view: {
            icon: 'view',
            label: __('Просмотр'),
            color: 'secondary',
            outline: true,
        },
        update: {
            icon: 'update',
            label: __('Редактировать'),
            color: 'secondary',
            outline: true,
        },
        delete: {
            icon: 'delete',
            label: __('Удалить'),
            confirm: __('Удалить запись?'),
            color: 'danger',
            outline: true,
            position: 'right',
        },
    };

    const components = useComponents();
    const items = useMemo(() => props.items.map(item => ({
        ...defaultItems[item.id],
        ...item,
    })), [defaultItems, props.items]);

    return components.ui.renderView(props.view || 'nav.ControlsView', {
        ...props,
        items,
    });
}
